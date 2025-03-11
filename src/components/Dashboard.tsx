import React from 'react';
import { motion } from 'framer-motion';
import { useInterviewStore } from '../store/interviewStore';
import { Brain, Clock, Star, TrendingUp } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { questions, transcripts } = useInterviewStore();
  
  const metrics = {
    totalQuestions: questions.length,
    averageResponseLength: Object.values(transcripts)
      .reduce((acc, curr) => acc + curr.length, 0) / Object.values(transcripts).length || 0,
    completedQuestions: Object.keys(transcripts).length,
    averageScore: questions
      .filter(q => q.feedback)
      .reduce((acc, curr) => {
        const score = curr.feedback?.match(/(\d+)\/10/)?.[1];
        return acc + (Number(score) || 0);
      }, 0) / questions.filter(q => q.feedback).length || 0
  };

  const cards = [
    { icon: Brain, title: 'Questions', value: metrics.totalQuestions },
    { icon: Clock, title: 'Avg Response Length', value: `${Math.round(metrics.averageResponseLength / 10)} words` },
    { icon: TrendingUp, title: 'Completed', value: metrics.completedQuestions },
    { icon: Star, title: 'Avg Score', value: `${metrics.averageScore.toFixed(1)}/10` }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
    >
      {cards.map((card, index) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-gray-800 rounded-2xl p-6 neon-border"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gray-700 rounded-xl">
              <card.icon className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
              <h3 className="text-gray-400 text-sm">{card.title}</h3>
              <p className="text-2xl font-bold neon-text">{card.value}</p>
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};