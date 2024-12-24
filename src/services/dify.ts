import { assistants } from '@/config/assistants';

interface ChatResponse {
  message: string;
  error?: string;
}

export class ResponseController {
  private abortController: AbortController;
  private isAborted: boolean = false;

  constructor() {
    this.abortController = new AbortController();
  }

  abort() {
    this.isAborted = true;
    this.abortController.abort();
  }

  get signal() {
    return this.abortController.signal;
  }

  get isAbortRequested() {
    return this.isAborted;
  }
}

export async function sendMessage(
  message: string,
  assistantType: string,
  onProgress: (text: string) => void,
  controller: ResponseController
): Promise<ChatResponse> {
  try {
    const assistant = assistants[assistantType];
    if (!assistant) {
      throw new Error(`Assistant type ${assistantType} not found`);
    }

    console.log('Sending message to', assistant.name);
    
    const response = await fetch('https://api.dify.ai/v1/chat-messages', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${assistant.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user: "web-user",
        inputs: {},
        query: message,
        response_mode: "streaming",
        conversation_id: "",
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to get response');
    }

    if (!response.body) {
      throw new Error('Response body is empty');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let fullMessage = '';

    try {
      while (true) {
        if (controller.isAbortRequested) {
          reader.cancel();
          break;
        }

        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        
        const lines = chunk.split('\n');
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.event === 'message') {
                const newText = data.answer || '';
                fullMessage += newText;
                onProgress(fullMessage);
              } else if (data.event === 'error') {
                throw new Error(data.message || 'Stream error');
              }
            } catch (e) {
              console.warn('Failed to parse streaming data:', line);
            }
          }
        }
      }
    } catch (error) {
      if (error.name === 'AbortError') {
        return { message: fullMessage + '\n[回答已停止]' };
      }
      reader.cancel();
      throw error;
    }

    return {
      message: fullMessage || '抱歉，我没有理解您的问题。',
    };
  } catch (error) {
    if (error.name === 'AbortError') {
      return { message: '[回答已停止]' };
    }
    console.error('Error in sendMessage:', error);
    return {
      message: '',
      error: error instanceof Error ? error.message : '发送消息失败，请重试',
    };
  }
}
