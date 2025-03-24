
import React, { useEffect, useRef } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageCircle, Bot } from 'lucide-react';
import { toast } from 'sonner';

const Chatbot = () => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  
  useEffect(() => {
    // Show a toast when the chatbot is loaded
    const timer = setTimeout(() => {
      toast.success("Chatbot interface loaded successfully");
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);

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
              Virtual Assistant (powered by Gradio)
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 p-0 h-full">
            <iframe
              ref={iframeRef}
              src="https://gradio-simple-chatbot-demo.hf.space"
              width="100%"
              height="100%"
              className="border-0"
              allow="microphone"
              title="Gradio Chatbot"
            />
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Chatbot;
