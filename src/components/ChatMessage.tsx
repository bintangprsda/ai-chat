import React from 'react';
import { User, Bot, Copy, ThumbsUp, ThumbsDown } from 'lucide-react';

interface ChatMessageProps {
  message: {
    id: string;
    content: string;
    role: 'user' | 'assistant';
    timestamp: Date;
  };
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === 'user';
  
  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(message.content);
  };

  return (
    <div className={`flex gap-4 p-6 ${isUser ? 'bg-gray-50' : 'bg-white'} hover:bg-opacity-80 transition-colors duration-200`}>
      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
        isUser 
          ? 'bg-blue-500 text-white' 
          : 'bg-gradient-to-br from-purple-500 to-pink-500 text-white'
      }`}>
        {isUser ? <User size={16} /> : <Bot size={16} />}
      </div>
      
      <div className="flex-1 space-y-2">
        <div className="flex items-center gap-2">
          <span className="font-medium text-gray-900">
            {isUser ? 'You' : 'AI Assistant'}
          </span>
          <span className="text-sm text-gray-500">
            {message.timestamp.toLocaleTimeString()}
          </span>
        </div>
        
        <div className="prose prose-gray max-w-none">
          <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
            {message.content}
          </p>
        </div>
        
        {!isUser && (
          <div className="flex items-center gap-2 pt-2">
            <button
              onClick={copyToClipboard}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 group"
              title="Copy message"
            >
              <Copy size={16} className="text-gray-500 group-hover:text-gray-700" />
            </button>
            <button
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 group"
              title="Like message"
            >
              <ThumbsUp size={16} className="text-gray-500 group-hover:text-green-600" />
            </button>
            <button
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 group"
              title="Dislike message"
            >
              <ThumbsDown size={16} className="text-gray-500 group-hover:text-red-600" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};