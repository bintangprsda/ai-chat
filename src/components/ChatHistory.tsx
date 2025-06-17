import React from 'react';
import { MessageSquare, Plus, MoreHorizontal } from 'lucide-react';

interface Conversation {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
}

interface ChatHistoryProps {
  conversations: Conversation[];
  activeConversationId: string;
  onSelectConversation: (id: string) => void;
  onNewConversation: () => void;
}

export const ChatHistory: React.FC<ChatHistoryProps> = ({
  conversations,
  activeConversationId,
  onSelectConversation,
  onNewConversation
}) => {
  return (
    <div className="w-80 bg-gray-50 border-r border-gray-200 h-full flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <button
          onClick={onNewConversation}
          className="w-full flex items-center gap-3 px-4 py-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200"
        >
          <Plus size={20} className="text-gray-600" />
          <span className="font-medium text-gray-800">New Conversation</span>
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-2">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
            Recent Conversations
          </h3>
          
          {conversations.map((conversation) => (
            <button
              key={conversation.id}
              onClick={() => onSelectConversation(conversation.id)}
              className={`w-full text-left p-3 rounded-lg transition-all duration-200 ${
                activeConversationId === conversation.id
                  ? 'bg-blue-50 border border-blue-200'
                  : 'hover:bg-gray-100'
              }`}
            >
              <div className="flex items-start gap-3">
                <MessageSquare size={16} className="text-gray-500 mt-1 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-800 truncate">
                    {conversation.title}
                  </h4>
                  <p className="text-sm text-gray-500 truncate mt-1">
                    {conversation.lastMessage}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {conversation.timestamp.toLocaleDateString()}
                  </p>
                </div>
                <button className="p-1 rounded hover:bg-gray-200 opacity-0 group-hover:opacity-100 transition-opacity">
                  <MoreHorizontal size={16} className="text-gray-400" />
                </button>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};