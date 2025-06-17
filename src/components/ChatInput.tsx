import React, { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Mic } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading?: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading }) => {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  return (
    <div className="border-t border-gray-200 bg-white p-4">
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
        <div className="relative flex items-end gap-3 bg-gray-50 rounded-2xl p-3 border border-gray-200 focus-within:border-blue-300 focus-within:ring-2 focus-within:ring-blue-100 transition-all duration-200">
          <button
            type="button"
            className="flex-shrink-0 p-2 rounded-lg hover:bg-gray-200 transition-colors duration-200"
            title="Attach file"
          >
            <Paperclip size={20} className="text-gray-500" />
          </button>
          
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me anything..."
            className="flex-1 bg-transparent border-none outline-none resize-none max-h-32 min-h-[24px] text-gray-800 placeholder-gray-500"
            rows={1}
            disabled={isLoading}
          />
          
          <button
            type="button"
            className="flex-shrink-0 p-2 rounded-lg hover:bg-gray-200 transition-colors duration-200"
            title="Voice input"
          >
            <Mic size={20} className="text-gray-500" />
          </button>
          
          <button
            type="submit"
            disabled={!message.trim() || isLoading}
            className={`flex-shrink-0 p-2 rounded-lg transition-all duration-200 ${
              message.trim() && !isLoading
                ? 'bg-blue-500 hover:bg-blue-600 text-white shadow-lg hover:shadow-xl'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
            title="Send message"
          >
            <Send size={20} />
          </button>
        </div>
        
        <div className="flex items-center justify-between mt-2 px-3">
          <p className="text-sm text-gray-500">
            Press Enter to send, Shift+Enter for new line
          </p>
          <p className="text-sm text-gray-400">
            {message.length}/2000
          </p>
        </div>
      </form>
    </div>
  );
};