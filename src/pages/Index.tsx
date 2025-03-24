
import React from 'react';
import Layout from '@/components/layout/Layout';
import FlightSearch from '@/components/dashboard/FlightSearch';
import WeatherWidget from '@/components/dashboard/WeatherWidget';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plane, MessageCircle, CalendarDays, TrendingUp, CheckSquare, BarChart3 } from 'lucide-react';

const Index = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-airport-text">Airport Management System</h1>
          <p className="text-gray-500">Welcome to SkyHub - Your complete aviation management solution</p>
        </div>

        <Card className="border-none shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Welcome to SkyHub</CardTitle>
            <CardDescription>
              Your comprehensive airport management solution
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600">
              SkyHub is a modern airport management system designed to streamline all aspects of airport operations. 
              Our platform provides a suite of tools that help passengers, airline staff, and airport management 
              handle various tasks efficiently and effectively.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
              <FeatureCard 
                icon={<Plane className="h-5 w-5" />}
                title="Flight Search" 
                description="Search for flights by number, origin, destination, or passenger information."
              />
              <FeatureCard 
                icon={<TrendingUp className="h-5 w-5" />}
                title="Price Prediction" 
                description="Get accurate predictions for flight prices based on historical data."
              />
              <FeatureCard 
                icon={<MessageCircle className="h-5 w-5" />}
                title="AI Chatbot" 
                description="Get instant assistance with our intelligent chatbot for common queries."
              />
              <FeatureCard 
                icon={<CalendarDays className="h-5 w-5" />}
                title="Flight Scheduling" 
                description="View and manage flight schedules with our interactive calendar."
              />
              <FeatureCard 
                icon={<CheckSquare className="h-5 w-5" />}
                title="Web Check-In" 
                description="Hassle-free online check-in for passengers to save time at the airport."
              />
              <FeatureCard 
                icon={<BarChart3 className="h-5 w-5" />}
                title="Reporting" 
                description="Report inconveniences or issues to help us improve our services."
              />
            </div>
          </CardContent>
        </Card>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <FlightSearch />
          </div>
          
          <div>
            <h2 className="text-lg font-semibold mb-3">Weather Conditions</h2>
            <WeatherWidget />
          </div>
        </div>
      </div>
    </Layout>
  );
};

// Feature card component for displaying system features
const FeatureCard = ({ icon, title, description }: { 
  icon: React.ReactNode; 
  title: string; 
  description: string 
}) => {
  return (
    <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-all">
      <div className="flex items-start space-x-3">
        <div className="mt-1 size-8 rounded-full bg-airport-primary/10 flex items-center justify-center text-airport-primary">
          {icon}
        </div>
        <div>
          <h3 className="font-medium">{title}</h3>
          <p className="text-sm text-gray-500 mt-1">{description}</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
