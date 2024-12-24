interface ChatMessageProps {
  content: string;
  isUser: boolean;
  isStreaming?: boolean;
}

export default function ChatMessage({ content, isUser, isStreaming }: ChatMessageProps) {
  if (!content && !isStreaming) {
    console.warn('Empty message content received');
    return null;
  }

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div
        className={`max-w-[70%] rounded-lg px-4 py-2 whitespace-pre-wrap ${
          isUser
            ? 'bg-blue-500 text-white rounded-br-none'
            : 'bg-white text-gray-800 rounded-bl-none shadow-sm'
        }`}
      >
        {content}
        {isStreaming && (
          <span className="inline-block w-2 h-4 ml-1 bg-gray-400 animate-pulse" />
        )}
      </div>
    </div>
  );
}
