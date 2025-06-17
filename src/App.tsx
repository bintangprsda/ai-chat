import { useState, useRef, useEffect } from 'react';
import { ChatMessage } from './components/ChatMessage';
import { ChatInput } from './components/ChatInput';
import { ChatHistory } from './components/ChatHistory';
import { LoadingMessage } from './components/LoadingMessage';
import { WelcomeScreen } from './components/WelcomeScreen';
import { ApiSettings } from './components/ApiSettings';
import { ApiStatus } from './components/ApiStatus';
import { Menu, X, Settings, HelpCircle } from 'lucide-react';
import { aiService } from './services/aiService';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

interface Conversation {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
  messages: Message[];
}

function App() {
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: '1',
      title: 'Welcome Chat',
      lastMessage: 'Welcome to AI Chat! Configure your API to get started.',
      timestamp: new Date(),
      messages: []
    }
  ]);
  
  const [activeConversationId, setActiveConversationId] = useState('1');
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [apiSettingsOpen, setApiSettingsOpen] = useState(false);
  const [apiConfig, setApiConfig] = useState({
    provider: 'openai',
    apiKey: '',
    model: 'gpt-3.5-turbo',
    baseUrl: ''
  });
  const [isApiConnected, setIsApiConnected] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeConversation = conversations.find(c => c.id === activeConversationId);
  const messages = activeConversation?.messages || [];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Load API config on mount
  useEffect(() => {
    const config = aiService.getConfig();
    if (config) {
      setApiConfig({
        provider: config.provider,
        apiKey: config.apiKey,
        model: config.model,
        baseUrl: config.baseUrl || ''
      });
      // Test connection on load
      aiService.testConnection().then(setIsApiConnected);
    }
  }, []);

  const handleSaveApiConfig = async (config: any) => {
    setApiConfig(config);
    aiService.setConfig(config);
    
    // Test the connection
    try {
      const connected = await aiService.testConnection();
      setIsApiConnected(connected);
    } catch (error) {
      setIsApiConnected(false);
    }
  };

  const simulateAIResponse = async (userMessage: string): Promise<string> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
    
    // Simple response generation based on keywords
    const responses = {
      'hello': "Hello! I'm your AI assistant. I'm here to help you build beautiful web interfaces and solve any coding challenges you might have.",
      'react': "I'd be happy to help you with React! React is a powerful JavaScript library for building user interfaces. What specific aspect of React would you like to explore?",
      'component': "Great! Let me help you create a React component. Components are the building blocks of React applications. What kind of component would you like to build?",
      'landing': "I'll help you create a stunning landing page! A good landing page should have a compelling hero section, clear value proposition, and strong call-to-action. Let me design something beautiful for you.",
      'dashboard': "Dashboards are excellent for data visualization! I can help you create a modern dashboard with charts, metrics, and interactive elements. What kind of data will you be displaying?",
      'form': "Forms are crucial for user interaction! I can help you build a form with proper validation, accessibility features, and smooth user experience. What information do you need to collect?",
      'default': "That's an interesting question! I'm here to help you with web development, UI/UX design, and creating beautiful interfaces. Could you provide more details about what you'd like to build?"
    };

    const lowerMessage = userMessage.toLowerCase();
    for (const [keyword, response] of Object.entries(responses)) {
      if (keyword !== 'default' && lowerMessage.includes(keyword)) {
        return response;
      }
    }
    
    return responses.default;
  };

  const handleSendMessage = async (content: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      content,
      role: 'user',
      timestamp: new Date()
    };

    // Add user message
    setConversations(prev => prev.map(conv => 
      conv.id === activeConversationId 
        ? { 
            ...conv, 
            messages: [...conv.messages, newMessage],
            lastMessage: content,
            timestamp: new Date()
          }
        : conv
    ));

    setIsLoading(true);

    try {
      let response: string;
      
      if (aiService.isConfigured() && isApiConnected) {
        // Use real AI API
        const conversationMessages = [
          { role: 'system' as const, content: 'You are a helpful AI assistant specialized in web development, UI/UX design, and creating beautiful interfaces. Provide helpful, detailed responses.' },
          ...messages.map(msg => ({ role: msg.role as 'user' | 'assistant', content: msg.content })),
          { role: 'user' as const, content }
        ];
        
        response = await aiService.sendMessage(conversationMessages);
      } else {
        // Fallback to simulated response
        response = await simulateAIResponse(content);
      }
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        role: 'assistant',
        timestamp: new Date()
      };

      setConversations(prev => prev.map(conv => 
        conv.id === activeConversationId 
          ? { 
              ...conv, 
              messages: [...conv.messages, aiMessage],
              lastMessage: response,
              timestamp: new Date()
            }
          : conv
      ));
    } catch (error) {
      console.error('Error generating response:', error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: `Sorry, I encountered an error: ${error instanceof Error ? error.message : 'Unknown error'}. Please check your API configuration and try again.`,
        role: 'assistant',
        timestamp: new Date()
      };

      setConversations(prev => prev.map(conv => 
        conv.id === activeConversationId 
          ? { 
              ...conv, 
              messages: [...conv.messages, errorMessage],
              lastMessage: errorMessage.content,
              timestamp: new Date()
            }
          : conv
      ));
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewConversation = () => {
    const newConversation: Conversation = {
      id: Date.now().toString(),
      title: 'New Conversation',
      lastMessage: '',
      timestamp: new Date(),
      messages: []
    };
    
    setConversations(prev => [newConversation, ...prev]);
    setActiveConversationId(newConversation.id);
    setSidebarOpen(false);
  };

  const handleExampleClick = (example: string) => {
    handleSendMessage(example);
  };

  return (
    <div className="h-screen flex bg-gray-100">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
                      lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-50 transition-transform duration-300 ease-in-out`}>
        <ChatHistory
          conversations={conversations}
          activeConversationId={activeConversationId}
          onSelectConversation={(id) => {
            setActiveConversationId(id);
            setSidebarOpen(false);
          }}
          onNewConversation={handleNewConversation}
        />
      </div>

      {/* Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <h1 className="text-xl font-semibold text-gray-800">
              {activeConversation?.title || 'AI Chat'}
            </h1>
          </div>
          
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <HelpCircle size={20} className="text-gray-600" />
            </button>
            <button 
              onClick={() => setApiSettingsOpen(true)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Settings size={20} className="text-gray-600" />
            </button>
          </div>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto">
          {messages.length === 0 ? (
            <WelcomeScreen onExampleClick={handleExampleClick} />
          ) : (
            <div className="max-w-4xl mx-auto">
              {messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}
              {isLoading && <LoadingMessage />}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input */}
        <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
        
        {/* API Status */}
        <ApiStatus
          isConfigured={aiService.isConfigured()}
          isConnected={isApiConnected}
          provider={apiConfig.provider}
          model={apiConfig.model}
          onOpenSettings={() => setApiSettingsOpen(true)}
        />
      </div>

      {/* API Settings Modal */}
      <ApiSettings
        isOpen={apiSettingsOpen}
        onClose={() => setApiSettingsOpen(false)}
        apiConfig={apiConfig}
        onSaveConfig={handleSaveApiConfig}
      />
    </div>
  );
}

export default App;