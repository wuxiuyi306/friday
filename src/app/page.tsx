'use client';

import { useState, useRef, useEffect } from 'react';
import ChatMessage from '@/components/ChatMessage';
import { sendMessage, ResponseController } from '@/services/dify';
import { assistants } from '@/config/assistants';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  isStreaming?: boolean;
}

export default function Home() {
  const [activeTab, setActiveTab] = useState('vocabulary');
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const responseController = useRef<ResponseController | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 显示开场白
  useEffect(() => {
    const assistant = assistants[activeTab];
    if (assistant) {
      setMessages([
        {
          id: 'greeting',
          content: assistant.greeting,
          isUser: false,
        },
      ]);
    }
  }, [activeTab]);

  const tabs = [
    { id: 'vocabulary', name: '单词' },
    { id: 'phrase', name: '词组' },
    { id: 'grammar', name: '语法' },
    { id: 'writing', name: '写作纠正' },
    { id: 'words', name: '经典桥段' },
    { id: 'chat', name: '随便聊天' },
  ];

  const handleStopResponse = () => {
    if (responseController.current) {
      responseController.current.abort();
      responseController.current = null;
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    // 如果有正在进行的响应，先停止它
    handleStopResponse();

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      isUser: true,
    };

    // 创建一个空的助手消息用于流式显示
    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      content: '',
      isUser: false,
      isStreaming: true,
    };

    setMessages(prev => [...prev, userMessage, assistantMessage]);
    setInputMessage('');
    setIsLoading(true);

    // 创建新的响应控制器
    responseController.current = new ResponseController();

    try {
      await sendMessage(
        inputMessage,
        activeTab,
        (text) => {
          // 更新助手消息的内容
          setMessages(prev => 
            prev.map(msg => 
              msg.id === assistantMessage.id
                ? { ...msg, content: text }
                : msg
            )
          );
        },
        responseController.current
      );

      // 标记消息流式传输完成
      setMessages(prev =>
        prev.map(msg =>
          msg.id === assistantMessage.id
            ? { ...msg, isStreaming: false }
            : msg
        )
      );
    } catch (error) {
      console.error('Error:', error);
      // 更新助手消息为错误消息
      setMessages(prev =>
        prev.map(msg =>
          msg.id === assistantMessage.id
            ? {
                ...msg,
                content: error instanceof Error ? error.message : '抱歉，发生了错误。请稍后重试。',
                isStreaming: false,
              }
            : msg
        )
      );
    } finally {
      setIsLoading(false);
      responseController.current = null;
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Tab Bar */}
      <div className="flex justify-center p-4 bg-white border-b shadow-sm">
        <div className="flex space-x-2 overflow-x-auto max-w-4xl">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setMessages([]); // 清空消息历史
              }}
              className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {tab.name}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-4xl mx-auto">
          {messages.map((message) => (
            <ChatMessage
              key={message.id}
              content={message.content}
              isUser={message.isUser}
              isStreaming={message.isStreaming}
            />
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="border-t bg-white p-4">
        <div className="flex space-x-2 max-w-4xl mx-auto">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="输入消息..."
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
            disabled={isLoading}
          />
          {isLoading ? (
            <button
              onClick={handleStopResponse}
              className="px-6 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors"
            >
              停止
            </button>
          ) : (
            <button
              onClick={handleSendMessage}
              disabled={isLoading}
              className="px-6 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors"
            >
              发送
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
