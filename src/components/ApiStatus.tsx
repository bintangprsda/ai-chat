import React from 'react';
import { Zap, AlertCircle, CheckCircle, Settings } from 'lucide-react';

interface ApiStatusProps {
  isConfigured: boolean;
  isConnected: boolean;
  provider?: string;
  model?: string;
  onOpenSettings: () => void;
}

export const ApiStatus: React.FC<ApiStatusProps> = ({
  isConfigured,
  isConnected,
  provider,
  model,
  onOpenSettings
}) => {
  const getStatusIcon = () => {
    if (!isConfigured) return <AlertCircle size={16} className="text-orange-500" />;
    if (isConnected) return <CheckCircle size={16} className="text-green-500" />;
    return <AlertCircle size={16} className="text-red-500" />;
  };

  const getStatusText = () => {
    if (!isConfigured) return 'API not configured';
    if (isConnected) return `Connected to ${provider} (${model})`;
    return 'API connection failed';
  };

  const getStatusColor = () => {
    if (!isConfigured) return 'bg-orange-50 border-orange-200';
    if (isConnected) return 'bg-green-50 border-green-200';
    return 'bg-red-50 border-red-200';
  };

  return (
    <div className={`border-t border-gray-200 p-4 ${getStatusColor()}`}>
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            {getStatusIcon()}
            <span className="text-sm font-medium text-gray-700">
              {getStatusText()}
            </span>
          </div>
          
          {!isConfigured && (
            <div className="text-xs text-gray-500">
              Configure your API to start chatting with AI
            </div>
          )}
        </div>
        
        <button
          onClick={onOpenSettings}
          className="flex items-center gap-2 px-3 py-1.5 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <Settings size={14} />
          Configure API
        </button>
      </div>
    </div>
  );
};