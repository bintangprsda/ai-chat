interface ApiConfig {
  provider: string;
  apiKey: string;
  model: string;
  baseUrl?: string;
}

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

class AIService {
  private config: ApiConfig | null = null;

  setConfig(config: ApiConfig) {
    this.config = config;
    // Store in localStorage for persistence
    localStorage.setItem('aiApiConfig', JSON.stringify(config));
  }

  getConfig(): ApiConfig | null {
    if (this.config) return this.config;
    
    // Try to load from localStorage
    const stored = localStorage.getItem('aiApiConfig');
    if (stored) {
      this.config = JSON.parse(stored);
      return this.config;
    }
    
    return null;
  }

  isConfigured(): boolean {
    const config = this.getConfig();
    return !!(config?.apiKey && config?.provider && config?.model);
  }

  async testConnection(): Promise<boolean> {
    const config = this.getConfig();
    if (!config) return false;

    try {
      const response = await this.makeApiCall([
        { role: 'user', content: 'Hello, this is a test message.' }
      ]);
      return !!response;
    } catch (error) {
      console.error('Connection test failed:', error);
      return false;
    }
  }

  async sendMessage(messages: ChatMessage[]): Promise<string> {
    const config = this.getConfig();
    if (!config) {
      throw new Error('API not configured');
    }

    return await this.makeApiCall(messages);
  }

  private async makeApiCall(messages: ChatMessage[]): Promise<string> {
    const config = this.getConfig();
    if (!config) throw new Error('API not configured');

    const { provider, apiKey, model, baseUrl } = config;

    try {
      let response: Response;
      let requestBody: any;
      let headers: any = {
        'Content-Type': 'application/json',
      };

      switch (provider) {
        case 'openai':
          headers['Authorization'] = `Bearer ${apiKey}`;
          requestBody = {
            model,
            messages,
            temperature: 0.7,
            max_tokens: 2000,
          };
          response = await fetch(`${baseUrl}/chat/completions`, {
            method: 'POST',
            headers,
            body: JSON.stringify(requestBody),
          });
          break;

        case 'anthropic':
          headers['x-api-key'] = apiKey;
          headers['anthropic-version'] = '2023-06-01';
          
          // Convert messages format for Anthropic
          const systemMessage = messages.find(m => m.role === 'system');
          const conversationMessages = messages.filter(m => m.role !== 'system');
          
          requestBody = {
            model,
            messages: conversationMessages,
            max_tokens: 2000,
            temperature: 0.7,
          };
          
          if (systemMessage) {
            requestBody.system = systemMessage.content;
          }
          
          response = await fetch(`${baseUrl}/messages`, {
            method: 'POST',
            headers,
            body: JSON.stringify(requestBody),
          });
          break;

        case 'google':
          headers['Authorization'] = `Bearer ${apiKey}`;
          
          // Convert messages format for Google AI
          const contents = messages.map(msg => ({
            role: msg.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: msg.content }]
          }));
          
          requestBody = {
            contents,
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 2000,
            },
          };
          
          response = await fetch(`${baseUrl}/models/${model}:generateContent`, {
            method: 'POST',
            headers,
            body: JSON.stringify(requestBody),
          });
          break;

        case 'deepseek':
          headers['Authorization'] = `Bearer ${apiKey}`;
          requestBody = {
            model,
            messages,
            temperature: 0.7,
            max_tokens: 2000,
          };
          response = await fetch(`${baseUrl}/chat/completions`, {
            method: 'POST',
            headers,
            body: JSON.stringify(requestBody),
          });
          break;

        case 'groq':
          headers['Authorization'] = `Bearer ${apiKey}`;
          requestBody = {
            model,
            messages,
            temperature: 0.7,
            max_tokens: 2000,
          };
          response = await fetch(`${baseUrl}/chat/completions`, {
            method: 'POST',
            headers,
            body: JSON.stringify(requestBody),
          });
          break;

        case 'together':
          headers['Authorization'] = `Bearer ${apiKey}`;
          requestBody = {
            model,
            messages,
            temperature: 0.7,
            max_tokens: 2000,
          };
          response = await fetch(`${baseUrl}/chat/completions`, {
            method: 'POST',
            headers,
            body: JSON.stringify(requestBody),
          });
          break;

        case 'perplexity':
          headers['Authorization'] = `Bearer ${apiKey}`;
          requestBody = {
            model,
            messages,
            temperature: 0.7,
            max_tokens: 2000,
          };
          response = await fetch(`${baseUrl}/chat/completions`, {
            method: 'POST',
            headers,
            body: JSON.stringify(requestBody),
          });
          break;

        case 'mistral':
          headers['Authorization'] = `Bearer ${apiKey}`;
          requestBody = {
            model,
            messages,
            temperature: 0.7,
            max_tokens: 2000,
          };
          response = await fetch(`${baseUrl}/chat/completions`, {
            method: 'POST',
            headers,
            body: JSON.stringify(requestBody),
          });
          break;

        case 'cohere':
          headers['Authorization'] = `Bearer ${apiKey}`;
          
          // Convert messages for Cohere format
          const lastMessage = messages[messages.length - 1];
          const chatHistory = messages.slice(0, -1).map(msg => ({
            role: msg.role === 'assistant' ? 'CHATBOT' : 'USER',
            message: msg.content
          }));
          
          requestBody = {
            model,
            message: lastMessage.content,
            chat_history: chatHistory,
            temperature: 0.7,
            max_tokens: 2000,
          };
          
          response = await fetch(`${baseUrl}/generate`, {
            method: 'POST',
            headers,
            body: JSON.stringify(requestBody),
          });
          break;

        case 'huggingface':
          headers['Authorization'] = `Bearer ${apiKey}`;
          
          // Use the last user message for Hugging Face
          const userMessage = messages.filter(m => m.role === 'user').pop();
          requestBody = {
            inputs: userMessage?.content || '',
            parameters: {
              temperature: 0.7,
              max_length: 2000,
            },
          };
          
          response = await fetch(`${baseUrl}/${model}`, {
            method: 'POST',
            headers,
            body: JSON.stringify(requestBody),
          });
          break;

        case 'replicate':
          headers['Authorization'] = `Token ${apiKey}`;
          
          // Replicate uses a different format
          const prompt = messages.map(m => `${m.role}: ${m.content}`).join('\n');
          requestBody = {
            version: model,
            input: {
              prompt,
              temperature: 0.7,
              max_length: 2000,
            },
          };
          
          response = await fetch(`${baseUrl}/predictions`, {
            method: 'POST',
            headers,
            body: JSON.stringify(requestBody),
          });
          break;

        case 'fireworks':
          headers['Authorization'] = `Bearer ${apiKey}`;
          requestBody = {
            model,
            messages,
            temperature: 0.7,
            max_tokens: 2000,
          };
          response = await fetch(`${baseUrl}/chat/completions`, {
            method: 'POST',
            headers,
            body: JSON.stringify(requestBody),
          });
          break;

        case 'custom':
          headers['Authorization'] = `Bearer ${apiKey}`;
          requestBody = {
            model,
            messages,
            temperature: 0.7,
            max_tokens: 2000,
          };
          response = await fetch(`${baseUrl}/chat/completions`, {
            method: 'POST',
            headers,
            body: JSON.stringify(requestBody),
          });
          break;

        default:
          throw new Error(`Unsupported provider: ${provider}`);
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`API request failed: ${response.status} ${response.statusText}. ${errorData.error?.message || ''}`);
      }

      const data = await response.json();
      
      // Extract response based on provider
      switch (provider) {
        case 'openai':
        case 'deepseek':
        case 'groq':
        case 'together':
        case 'perplexity':
        case 'mistral':
        case 'fireworks':
        case 'custom':
          return data.choices?.[0]?.message?.content || 'No response received';
          
        case 'anthropic':
          return data.content?.[0]?.text || 'No response received';
          
        case 'google':
          return data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response received';
          
        case 'cohere':
          return data.text || 'No response received';
          
        case 'huggingface':
          return Array.isArray(data) ? data[0]?.generated_text || 'No response received' : data.generated_text || 'No response received';
          
        case 'replicate':
          return data.output || 'No response received';
          
        default:
          return 'No response received';
      }
    } catch (error) {
      console.error('API call failed:', error);
      throw error;
    }
  }
}

export const aiService = new AIService();