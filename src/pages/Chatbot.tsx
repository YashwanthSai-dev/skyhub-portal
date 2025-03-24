
import React, { useState, useEffect, useRef } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageCircle, Bot, Send } from 'lucide-react';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

// Define message types for our chat interface
interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const Chatbot = () => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Hello! I am SkyHub Assistant. How can I help you today?' }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Show a toast when the chatbot is loaded
    const timer = setTimeout(() => {
      toast.success("Chatbot interface loaded successfully");
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);

  // Scroll to bottom of messages when new ones are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      role: 'user',
      content: inputMessage
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    
    // Simulate assistant response (in a real implementation, this would connect to Gradio API)
    setTimeout(() => {
      // Example response
      const assistantMessage: Message = {
        role: 'assistant',
        content: getResponseForMessage(inputMessage)
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    }, 1000);
  };

  // Simple function to generate responses (would be replaced by actual Gradio API calls)
  const getResponseForMessage = (message: string): string => {
    const lowercaseMessage = message.toLowerCase();

    if (lowercaseMessage.includes('hi') || lowercaseMessage.includes('hello')) {
      return 'Hello, Iam a chatbot created by Team 4 PSD Students.';
    } else if (lowercaseMessage.includes('flight') && lowercaseMessage.includes('status')) {
      return 'You can check flight status on the Schedule page. Would you like me to navigate you there?';
    } else if (lowercaseMessage.includes('check-in')) {
      return 'Our check-in process is simple! You can use the Check-In page from the main menu. Would you like to know more?';
    } else if (lowercaseMessage.includes('weather')) {
      return 'I can see the current weather in Saint Louis is displayed on our dashboard. For more specific weather information, please provide a location.';
    } else if (lowercaseMessage.includes('baggage') || lowercaseMessage.includes('luggage')) {
      return 'For domestic flights, you are allowed one carry-on and one personal item. Checked baggage fees vary by airline.';
    } else {
      return 'Thank you for your message. I\'m still learning how to respond to various queries. Can you be more specific about your airport or flight-related question?';
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
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
              Virtual Assistant (Inspired from Gradio Chatbot)
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 p-4 overflow-hidden flex flex-col">
            {/* Chat messages container */}
            <div className="flex-1 overflow-y-auto mb-4 space-y-4 pr-2">
              {messages.map((message, index) => (
                <div 
                  key={index} 
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.role === 'user' 
                        ? 'bg-airport-primary text-white rounded-tr-none' 
                        : 'bg-gray-100 text-gray-800 rounded-tl-none'
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            
            {/* Input area */}
            <div className="flex gap-2 mt-auto">
              <Input
                placeholder="Type your message here..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1"
              />
              <Button onClick={handleSendMessage}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {/* Hidden iframe that loads the Gradio app - could be used for more advanced integration */}
        <iframe 
          ref={iframeRef}
          src="https://gradio-simple-chatbot-demo.hf.space"
          style={{ display: 'none' }}
          title="Gradio Backend"
        />
      </div>
    </Layout>
  );
};

export default Chatbot;
