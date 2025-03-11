import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInterviewStore } from '../store/interviewStore';
import { Award, X } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export const Results: React.FC = () => {
  const results = useInterviewStore(state => state.results);
  const setResults = useInterviewStore(state => state.setResults);

  if (!results) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6 z-50"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-gray-800 rounded-2xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto relative neon-border"
        >
          <button
            onClick={() => setResults(null)}
            className="absolute top-4 right-4 p-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-gray-700 rounded-xl">
              <Award className="w-8 h-8 text-cyan-400" />
            </div>
            <h2 className="text-2xl font-bold neon-text">Interview Results</h2>
          </div>
          
          <div className="prose prose-invert prose-lg max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {results}
            </ReactMarkdown>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};