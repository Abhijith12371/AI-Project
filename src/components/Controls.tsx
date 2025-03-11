import React from 'react';
import { useInterviewStore } from '../store/interviewStore';
import { Play, Square, ArrowRight, Camera } from 'lucide-react';

export const Controls: React.FC = () => {
  const { 
    isActive, 
    startInterview, 
    endInterview, 
    nextQuestion, 
    currentQuestionIndex,
    questions,
    isRecording
  } = useInterviewStore();

  return (
    <div className="flex items-center justify-between gap-4 w-full">
      {!isActive ? (
        <button
          onClick={startInterview}
          className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl w-full justify-center text-lg font-medium"
        >
          <Camera className="w-6 h-6" />
          Start Interview
        </button>
      ) : (
        <>
          <button
            onClick={endInterview}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 transition-all shadow-lg"
          >
            <Square className="w-5 h-5" />
            End Interview
          </button>
          
          <button
            onClick={nextQuestion}
            disabled={isRecording || currentQuestionIndex === questions.length - 1}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowRight className="w-5 h-5" />
            Next Question
          </button>
        </>
      )}
    </div>
  );
};