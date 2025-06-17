import React, { useState } from 'react';
import { Settings, Eye, EyeOff, Check, X, Zap } from 'lucide-react';

interface ApiSettingsProps {
  isOpen: boolean;
  onClose: () => void;
  apiConfig: {
    provider: string;
    apiKey: string;
    model: string;
    baseUrl?: string;
  };
  onSaveConfig: (config: any) => void;
}

export const ApiSettings: React.FC<ApiSettingsProps> = ({
  isOpen,
  onClose,
  apiConfig,
  onSaveConfig
}) => {
  const [config, setConfig] = useState(apiConfig);
  const [showApiKey, setShowApiKey] = useState(false);
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const providers = [
    { 
      id: 'openai', 
      name: 'OpenAI', 
      models: ['gpt-4o', 'gpt-4o-mini', 'gpt-4-turbo', 'gpt-4', 'gpt-3.5-turbo'],
      baseUrl: 'https://api.openai.com/v1'
    },
    { 
      id: 'anthropic', 
      name: 'Anthropic', 
      models: ['claude-3-5-sonnet-20241022', 'claude-3-opus-20240229', 'claude-3-sonnet-20240229', 'claude-3-haiku-20240307'],
      baseUrl: 'https://api.anthropic.com/v1'
    },
    { 
      id: 'google', 
      name: 'Google AI', 
      models: ['gemini-1.5-pro', 'gemini-1.5-flash', 'gemini-pro', 'gemini-pro-vision'],
      baseUrl: 'https://generativelanguage.googleapis.com/v1beta'
    },
    { 
      id: 'deepseek', 
      name: 'DeepSeek', 
      models: ['deepseek-chat', 'deepseek-coder'],
      baseUrl: 'https://api.deepseek.com/v1'
    },
    { 
      id: 'groq', 
      name: 'Groq', 
      models: ['llama-3.1-70b-versatile', 'llama-3.1-8b-instant', 'mixtral-8x7b-32768', 'gemma-7b-it'],
      baseUrl: 'https://api.groq.com/openai/v1'
    },
    { 
      id: 'together', 
      name: 'Together AI', 
      models: ['meta-llama/Llama-3-70b-chat-hf', 'meta-llama/Llama-3-8b-chat-hf', 'mistralai/Mixtral-8x7B-Instruct-v0.1', 'NousResearch/Nous-Hermes-2-Mixtral-8x7B-DPO'],
      baseUrl: 'https://api.together.xyz/v1'
    },
    { 
      id: 'perplexity', 
      name: 'Perplexity', 
      models: ['llama-3.1-sonar-large-128k-online', 'llama-3.1-sonar-small-128k-online', 'llama-3.1-sonar-large-128k-chat', 'llama-3.1-sonar-small-128k-chat'],
      baseUrl: 'https://api.perplexity.ai'
    },
    { 
      id: 'mistral', 
      name: 'Mistral AI', 
      models: ['mistral-large-latest', 'mistral-medium-latest', 'mistral-small-latest', 'open-mixtral-8x7b', 'open-mistral-7b'],
      baseUrl: 'https://api.mistral.ai/v1'
    },
    { 
      id: 'cohere', 
      name: 'Cohere', 
      models: ['command-r-plus', 'command-r', 'command', 'command-nightly', 'command-light'],
      baseUrl: 'https://api.cohere.ai/v1'
    },
    { 
      id: 'huggingface', 
      name: 'Hugging Face', 
      models: ['microsoft/DialoGPT-large', 'facebook/blenderbot-400M-distill', 'microsoft/DialoGPT-medium', 'facebook/blenderbot-1B-distill'],
      baseUrl: 'https://api-inference.huggingface.co/models'
    },
    { 
      id: 'replicate', 
      name: 'Replicate', 
      models: ['meta/llama-2-70b-chat', 'meta/llama-2-13b-chat', 'meta/llama-2-7b-chat', 'mistralai/mixtral-8x7b-instruct-v0.1'],
      baseUrl: 'https://api.replicate.com/v1'
    },
    { 
      id: 'fireworks', 
      name: 'Fireworks AI', 
      models: ['accounts/fireworks/models/llama-v3p1-70b-instruct', 'accounts/fireworks/models/llama-v3p1-8b-instruct', 'accounts/fireworks/models/mixtral-8x7b-instruct'],
      baseUrl: 'https://api.fireworks.ai/inference/v1'
    },
    { 
      id: 'custom', 
      name: 'Custom API', 
      models: ['custom-model'],
      baseUrl: ''
    }
  ];

  const selectedProvider = providers.find(p => p.id === config.provider);

  const handleSave = () => {
    onSaveConfig(config);
    onClose();
  };

  const testConnection = async () => {
    setIsTestingConnection(true);
    setConnectionStatus('idle');
    
    try {
      // Simulate API test - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      if (config.apiKey && config.provider && config.model) {
        setConnectionStatus('success');
      } else {
        setConnectionStatus('error');
      }
    } catch (error) {
      setConnectionStatus('error');
    } finally {
      setIsTestingConnection(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Settings size={20} className="text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">API Configuration</h2>
                <p className="text-sm text-gray-500">Configure your AI model API settings</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X size={20} className="text-gray-500" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Provider Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              AI Provider
            </label>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 max-h-80 overflow-y-auto">
              {providers.map((provider) => (
                <button
                  key={provider.id}
                  onClick={() => setConfig({ 
                    ...config, 
                    provider: provider.id, 
                    model: provider.models[0],
                    baseUrl: provider.id === 'custom' ? config.baseUrl : provider.baseUrl
                  })}
                  className={`p-4 border-2 rounded-xl text-left transition-all ${
                    config.provider === provider.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-medium text-gray-900 text-sm">{provider.name}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {provider.models.length} models
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Model Selection */}
          {selectedProvider && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Model
              </label>
              <select
                value={config.model}
                onChange={(e) => setConfig({ ...config, model: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {selectedProvider.models.map((model) => (
                  <option key={model} value={model}>
                    {model}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* API Key */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              API Key
            </label>
            <div className="relative">
              <input
                type={showApiKey ? 'text' : 'password'}
                value={config.apiKey}
                onChange={(e) => setConfig({ ...config, apiKey: e.target.value })}
                placeholder="Enter your API key"
                className="w-full p-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                type="button"
                onClick={() => setShowApiKey(!showApiKey)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded hover:bg-gray-100"
              >
                {showApiKey ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Your API key is stored locally and never sent to our servers
            </p>
          </div>

          {/* Custom Base URL (for custom provider) */}
          {config.provider === 'custom' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Base URL
              </label>
              <input
                type="url"
                value={config.baseUrl || ''}
                onChange={(e) => setConfig({ ...config, baseUrl: e.target.value })}
                placeholder="https://api.example.com/v1"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          )}

          {/* Provider Information */}
          {selectedProvider && selectedProvider.id !== 'custom' && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Provider Information</h4>
              <div className="space-y-1 text-sm text-gray-600">
                <p><strong>Base URL:</strong> {selectedProvider.baseUrl}</p>
                <p><strong>Available Models:</strong> {selectedProvider.models.length}</p>
                <p><strong>Selected Model:</strong> {config.model}</p>
              </div>
            </div>
          )}

          {/* Test Connection */}
          <div className="flex items-center gap-3">
            <button
              onClick={testConnection}
              disabled={isTestingConnection || !config.apiKey}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
            >
              <Zap size={16} />
              {isTestingConnection ? 'Testing...' : 'Test Connection'}
            </button>
            
            {connectionStatus === 'success' && (
              <div className="flex items-center gap-2 text-green-600">
                <Check size={16} />
                <span className="text-sm">Connection successful</span>
              </div>
            )}
            
            {connectionStatus === 'error' && (
              <div className="flex items-center gap-2 text-red-600">
                <X size={16} />
                <span className="text-sm">Connection failed</span>
              </div>
            )}
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
          >
            Save Configuration
          </button>
        </div>
      </div>
    </div>
  );
};