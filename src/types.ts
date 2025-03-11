export interface InterviewQuestion {
  id: number;
  type: string;
  question: string;
  feedback?: string;
}

export interface InterviewState {
  isActive: boolean;
  currentQuestionIndex: number;
  videoStream: MediaStream | null;
  audioStream: MediaStream | null;
  questions: InterviewQuestion[];
  isRecording: boolean;
  transcripts: Record<number, string>;
  results: string | null;
  recognition: any | null;
  startInterview: () => Promise<void>;
  endInterview: () => Promise<void>;
  startRecording: () => Promise<void>;
  stopRecording: () => Promise<void>;
  nextQuestion: () => Promise<void>;
  setTranscript: (questionId: number, transcript: string) => void;
  setResults: (results: string | null) => void;
}

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}