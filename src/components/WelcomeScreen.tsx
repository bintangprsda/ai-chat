import React from 'react';
import { Sparkles, Code, MessageSquare, Zap } from 'lucide-react';

interface WelcomeScreenProps {
  onExampleClick: (example: string) => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onExampleClick }) => {
  const examples = [
    {
      icon: <Code size={20} />,
      title: "Create a React component",
      description: "Build a modern todo list with TypeScript and Tailwind CSS",
      prompt: "Create a modern todo list component with add, delete, and toggle functionality using React and TypeScript"
    },
    {
      icon: <MessageSquare size={20} />,
      title: "Design a landing page",
      description: "Build a beautiful landing page for a SaaS product",
      prompt: "Create a modern landing page for a SaaS product with hero section, features, and pricing"
    },
    {
      icon: <Zap size={20} />,
      title: "Build a dashboard",
      description: "Create an analytics dashboard with charts and metrics",
      prompt: "Build a modern analytics dashboard with charts, metrics cards, and data visualization"
    },
    {
      icon: <Sparkles size={20} />,
      title: "Interactive form",
      description: "Design a multi-step form with validation",
      prompt: "Create a multi-step form with validation, progress indicator, and smooth animations"
    }
  ];

  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="max-w-4xl w-full text-center">
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl mb-4">
            <Sparkles size={32} className="text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Welcome to AI Chat
          </h1>
          <p className="text-xl text-gray-600">
            Your intelligent assistant for building beautiful web interfaces
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {examples.map((example, index) => (
            <button
              key={index}
              onClick={() => onExampleClick(example.prompt)}
              className="p-6 bg-white border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-lg transition-all duration-200 text-left group"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="flex items-center justify-center w-10 h-10 bg-blue-50 rounded-lg text-blue-600 group-hover:bg-blue-100 transition-colors">
                  {example.icon}
                </div>
                <h3 className="font-semibold text-gray-900">{example.title}</h3>
              </div>
              <p className="text-gray-600 leading-relaxed">{example.description}</p>
            </button>
          ))}
        </div>
        
        <div className="text-center">
          <p className="text-gray-500 mb-4">
            Or start by typing your own message below
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
            <span>Powered by</span>
            <span className="font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Advanced AI
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};