
import React, { useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble';

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface MessageListProps {
  messages: Message[];
}

const MessageList: React.FC<MessageListProps> = ({ messages }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom of messages when new ones are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto mb-4 space-y-4 pr-2">
      {messages.map((message, index) => (
        <MessageBubble
          key={index}
          role={message.role}
          content={message.content}
        />
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
