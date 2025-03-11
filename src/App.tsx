import React from 'react';
import { motion } from 'framer-motion';
import { VideoFeed } from './components/VideoFeed';
import { QuestionDisplay } from './components/QuestionDisplay';
import { Controls } from './components/Controls';
import { Results } from './components/Results';
import { Dashboard } from './components/Dashboard';

function App() {
  return (
    <div className="min-h-screen bg-gray-900 p-8 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-1/2 h-1/2 neon-gradient" />
        <div className="absolute bottom-0 right-0 w-1/2 h-1/2 neon-gradient" />
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto space-y-8 relative"
      >
        <h1 className="text-4xl font-bold text-center mb-8 neon-text">
          AI Interview Practice
        </h1>
        
        <Dashboard />
        <VideoFeed />
        <QuestionDisplay />
        <Controls />
        <Results />
      </motion.div>
    </div>
  );
}

export default App;