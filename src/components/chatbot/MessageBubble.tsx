
import React from 'react';

interface MessageBubbleProps {
  role: 'user' | 'assistant';
  content: string;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ role, content }) => {
  return (
    <div 
      className={`flex ${role === 'user' ? 'justify-end' : 'justify-start'}`}
    >
      <div 
        className={`max-w-[80%] p-3 rounded-lg ${
          role === 'user' 
            ? 'bg-airport-primary text-white rounded-tr-none' 
            : 'bg-gray-100 text-gray-800 rounded-tl-none'
        }`}
      >
        {content}
      </div>
    </div>
  );
};

export default MessageBubble;
