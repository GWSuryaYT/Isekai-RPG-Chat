import React from 'react';
import { User, Bot } from 'lucide-react';
import { ChatMessage as ChatMessageType } from '../types';

interface ChatMessageProps {
  message: ChatMessageType;
  isLastMessage: boolean;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, isLastMessage }) => {
  const isUser = message.role === 'user';
  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className={`flex items-start space-x-3 ${isUser ? 'flex-row-reverse space-x-reverse' : ''} animate-fade-in`}>
      {/* Avatar */}
      <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
        isUser 
          ? 'bg-blue-600 shadow-lg shadow-blue-500/25' 
          : 'bg-indigo-600 shadow-lg shadow-indigo-500/25'
      }`}>
        {isUser ? (
          <User className="w-5 h-5 text-white" />
        ) : (
          <Bot className="w-5 h-5 text-white" />
        )}
      </div>

      {/* Message Content */}
      <div className={`flex flex-col max-w-3xl ${isUser ? 'items-end' : 'items-start'}`}>
        <div className={`px-4 py-3 rounded-2xl ${
          isUser 
            ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' 
            : 'bg-white bg-opacity-10 backdrop-blur-sm text-white border border-white border-opacity-20 shadow-lg'
        } ${isLastMessage ? 'animate-slide-up' : ''}`}>
          <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
            {message.content}
          </p>
        </div>
        
        {message.timestamp && (
          <span className="text-xs text-blue-200 mt-1 opacity-60">
            {formatTime(message.timestamp)}
          </span>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;