
import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageCircle, Bot } from 'lucide-react';
import { toast } from 'sonner';

import MessageList, { Message } from '@/components/chatbot/MessageList';
import MessageInput from '@/components/chatbot/MessageInput';
import { generateResponse } from '@/services/chatbotService';

const Chatbot = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Hello! I am SkyHub Assistant. How can I help you today?' }
  ]);
  
  useEffect(() => {
    // Show a toast when the chatbot is loaded
    const timer = setTimeout(() => {
      toast.success("Chatbot interface loaded successfully");
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);

  const handleSendMessage = (message: string) => {
    // Add user message
    const userMessage: Message = {
      role: 'user',
      content: message
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    // Simulate assistant response
    setTimeout(() => {
      const assistantMessage: Message = {
        role: 'assistant',
        content: generateResponse(message)
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    }, 1000);
  };

  return (
    <Layout>
      <div className="flex flex-col space-y-4">
        <div className="flex items-center space-x-2">
          <MessageCircle className="h-6 w-6" />
          <h1 className="text-2xl font-bold">SkyHub Assistant</h1>
        </div>
        
        <Card className="flex flex-col h-[75vh]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              Virtual Assistant
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 p-4 overflow-hidden flex flex-col">
            <MessageList messages={messages} />
            <MessageInput onSendMessage={handleSendMessage} />
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Chatbot;
