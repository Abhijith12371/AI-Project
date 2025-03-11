import { create } from 'zustand';
import { InterviewState, InterviewQuestion } from '../types';
import { generateQuestion, evaluateResponse, generateFinalReport } from '../services/gemini';
import { textToSpeech, playAudio } from '../services/elevenlabs';

const initialQuestion = {
  id: 1,
  type: 'general',
  question: 'Tell me about yourself and your background.',
};

export const useInterviewStore = create<InterviewState>((set, get) => ({
  isActive: false,
  currentQuestionIndex: 0,
  videoStream: null,
  audioStream: null,
  questions: [initialQuestion],
  isRecording: false,
  transcripts: {},
  results: null,
  recognition: null,

  setResults: (results: string | null) => set({ results }),

  startInterview: async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const audioData = await textToSpeech(initialQuestion.question);
      await playAudio(audioData);

      set({ 
        isActive: true, 
        videoStream: stream,
        audioStream,
        currentQuestionIndex: 0,
        transcripts: {},
        results: null
      });
    } catch (error) {
      console.error('Error accessing media devices:', error);
    }
  },

  endInterview: async () => {
    const { videoStream, audioStream, questions, transcripts, recognition } = get();
    
    if (videoStream) {
      videoStream.getTracks().forEach(track => track.stop());
    }
    if (audioStream) {
      audioStream.getTracks().forEach(track => track.stop());
    }
    if (recognition) {
      recognition.stop();
    }

    const responses = questions.map(q => ({
      question: q.question,
      response: transcripts[q.id] || '',
      feedback: q.feedback || ''
    }));

    const finalReport = await generateFinalReport(responses);

    set({ 
      isActive: false, 
      videoStream: null,
      audioStream: null,
      currentQuestionIndex: 0,
      recognition: null,
      results: finalReport
    });
  },

  startRecording: async () => {
    try {
      const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
      
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';
      
      let finalTranscript = '';
      let lastActivityTimestamp = Date.now();
      let noSpeechTimeout: NodeJS.Timeout;
      
      recognition.onstart = () => {
        finalTranscript = '';
        lastActivityTimestamp = Date.now();
        
        noSpeechTimeout = setTimeout(() => {
          if (Date.now() - lastActivityTimestamp > 5000) {
            recognition.stop();
            set(state => ({
              transcripts: {
                ...state.transcripts,
                [state.questions[state.currentQuestionIndex].id]: 'No speech detected. Please try again.'
              },
              isRecording: false,
              recognition: null
            }));
          }
        }, 5000);
      };
      
      recognition.onresult = (event) => {
        let interimTranscript = '';
        lastActivityTimestamp = Date.now();
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript + ' ';
          } else {
            interimTranscript += transcript;
          }
        }
        
        const { currentQuestionIndex, questions } = get();
        const currentQuestion = questions[currentQuestionIndex];
        
        set(state => ({
          transcripts: {
            ...state.transcripts,
            [currentQuestion.id]: finalTranscript.trim() || interimTranscript.trim()
          }
        }));
      };

      recognition.onerror = (event) => {
        clearTimeout(noSpeechTimeout);
        console.error('Speech recognition error:', event.error);
        
        if (event.error === 'no-speech') {
          set(state => ({
            transcripts: {
              ...state.transcripts,
              [state.questions[state.currentQuestionIndex].id]: 'No speech detected. Please try again.'
            }
          }));
        }
        
        set({ isRecording: false, recognition: null });
      };

      recognition.onend = () => {
        clearTimeout(noSpeechTimeout);
        const { currentQuestionIndex, questions, transcripts } = get();
        const currentQuestion = questions[currentQuestionIndex];
        
        if (!transcripts[currentQuestion.id]) {
          set(state => ({
            transcripts: {
              ...state.transcripts,
              [currentQuestion.id]: 'Recording ended. Please try again if no response was captured.'
            }
          }));
        }
        
        set({ isRecording: false, recognition: null });
      };
      
      recognition.start();
      set({ isRecording: true, recognition });
      
    } catch (error) {
      console.error('Error initializing speech recognition:', error);
      set({ 
        isRecording: false, 
        recognition: null,
        transcripts: {
          ...get().transcripts,
          [get().questions[get().currentQuestionIndex].id]: 'Failed to start recording. Please try again.'
        }
      });
    }
  },

  stopRecording: async () => {
    const { recognition, currentQuestionIndex, questions, transcripts } = get();
    if (recognition) {
      recognition.stop();
    }

    const currentQuestion = questions[currentQuestionIndex];
    const currentTranscript = transcripts[currentQuestion.id] || '';

    if (currentTranscript.includes('Please try again')) {
      set({ isRecording: false, recognition: null });
      return;
    }

    try {
      const feedback = await evaluateResponse(currentQuestion.question, currentTranscript);
      
      const updatedQuestions = [...questions];
      updatedQuestions[currentQuestionIndex] = {
        ...currentQuestion,
        feedback
      };

      set({ 
        isRecording: false, 
        recognition: null,
        questions: updatedQuestions
      });

      const nextQuestion = await generateQuestion(currentTranscript);
      
      const newQuestion = {
        id: questions.length + 1,
        type: 'general',
        question: nextQuestion
      };

      const audioData = await textToSpeech(nextQuestion);
      await playAudio(audioData);

      set(state => ({ 
        questions: [...state.questions, newQuestion],
        currentQuestionIndex: state.currentQuestionIndex + 1
      }));
    } catch (error) {
      console.error('Error processing response:', error);
      set({ isRecording: false, recognition: null });
    }
  },

  nextQuestion: async () => {
    const { currentQuestionIndex, questions, transcripts } = get();
    const currentQuestion = questions[currentQuestionIndex];
    const currentResponse = transcripts[currentQuestion.id];

    if (!currentResponse || currentResponse.includes('Please try again')) {
      console.warn('No valid response recorded for current question');
      return;
    }

    try {
      const feedback = await evaluateResponse(currentQuestion.question, currentResponse);
      const nextQuestion = await generateQuestion(currentResponse);
      
      const updatedQuestions = [...questions];
      updatedQuestions[currentQuestionIndex] = {
        ...currentQuestion,
        feedback
      };
      
      const newQuestion = {
        id: questions.length + 1,
        type: 'general',
        question: nextQuestion
      };
      
      const audioData = await textToSpeech(nextQuestion);
      await playAudio(audioData);

      set({ 
        currentQuestionIndex: currentQuestionIndex + 1,
        questions: [...updatedQuestions, newQuestion]
      });
    } catch (error) {
      console.error('Error generating next question:', error);
    }
  },

  setTranscript: (questionId: number, transcript: string) => {
    set(state => ({
      transcripts: {
        ...state.transcripts,
        [questionId]: transcript
      }
    }));
  }
}));