import React from 'react';
import { useInterviewStore } from '../store/interviewStore';
import { MessageCircle, Mic, MicOff } from 'lucide-react';

export const QuestionDisplay: React.FC = () => {
  const { 
    questions, 
    currentQuestionIndex, 
    isActive,
    isRecording,
    transcripts,
    startRecording,
    stopRecording
  } = useInterviewStore();
  
  const currentQuestion = questions[currentQuestionIndex];

  if (!isActive) return null;

  const currentTranscript = transcripts[currentQuestion.id] || '';

  return (
    <div className="bg-white rounded-2xl p-8 shadow-xl">
      <div className="flex items-start gap-6">
        <div className="p-3 bg-blue-100 rounded-xl">
          <MessageCircle className="w-8 h-8 text-blue-600" />
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Question {currentQuestionIndex + 1}
          </h3>
          <p className="text-lg text-gray-700 mb-6">{currentQuestion.question}</p>
          
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <button
                onClick={isRecording ? stopRecording : startRecording}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  isRecording 
                    ? 'bg-red-100 text-red-700 hover:bg-red-200'
                    : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                }`}
              >
                {isRecording ? (
                  <>
                    <MicOff className="w-5 h-5" />
                    Stop Recording
                  </>
                ) : (
                  <>
                    <Mic className="w-5 h-5" />
                    Start Recording
                  </>
                )}
              </button>
              {isRecording && (
                <span className="text-sm text-gray-500">
                  Recording in progress...
                </span>
              )}
            </div>
            
            {currentTranscript && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Your Response:</h4>
                <p className="text-gray-600">{currentTranscript}</p>
              </div>
            )}
            
            {currentQuestion.feedback && (
              <div className="bg-green-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-green-700 mb-2">Feedback:</h4>
                <p className="text-green-600">{currentQuestion.feedback}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};