
import React from 'react';
import Layout from '@/components/layout/Layout';
import FlightSearch from '@/components/dashboard/FlightSearch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plane, MessageCircle, CalendarDays, TrendingUp, CheckSquare, BarChart3, Coffee } from 'lucide-react';
import { useFlightData } from '@/data/flightData';
import { motion } from "framer-motion";

const Index = () => {
  const { flights, loading, error } = useFlightData();

  return (
    <Layout>
      <div className="space-y-8">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold text-airport-text">Airport Management System</h1>
          <p className="text-gray-500 mt-1">Welcome to SkyHub - Your complete aviation management solution</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="border-none shadow-md overflow-hidden rounded-xl bg-white">
            <CardHeader className="pb-2 bg-gradient-to-r from-airport-primary/5 to-airport-secondary/5">
              <CardTitle className="text-xl text-airport-text">Welcome to SkyHub</CardTitle>
              <CardDescription>
                Your comprehensive airport management solution
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
              <p className="text-gray-600">
                SkyHub is a modern airport management system designed to streamline all aspects of airport operations. 
                Our platform provides a suite of tools that help passengers, airline staff, and airport management 
                handle various tasks efficiently and effectively.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-6">
                <FeatureCard 
                  icon={<Plane />}
                  title="Flight Search" 
                  description="Search for flights by number, origin, destination, or passenger information."
                />
                <FeatureCard 
                  icon={<TrendingUp />}
                  title="Price Prediction" 
                  description="Get accurate predictions for flight prices based on historical data."
                />
                <FeatureCard 
                  icon={<MessageCircle />}
                  title="AI Chatbot" 
                  description="Get instant assistance with our intelligent chatbot for common queries."
                />
                <FeatureCard 
                  icon={<CalendarDays />}
                  title="Flight Scheduling" 
                  description="View and manage flight schedules with our interactive calendar."
                />
                <FeatureCard 
                  icon={<CheckSquare />}
                  title="Web Check-In" 
                  description="Hassle-free online check-in for passengers to save time at the airport."
                />
                <FeatureCard 
                  icon={<Coffee />}
                  title="Lounges & Restaurants" 
                  description="Explore airport lounges and restaurants for a comfortable journey."
                />
                <FeatureCard 
                  icon={<BarChart3 />}
                  title="Reporting" 
                  description="Report inconveniences or issues to help us improve our services."
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-8"
        >
          <h2 className="text-xl font-semibold mb-4 text-airport-text">Available Flights</h2>
          <Card className="border-none shadow-md rounded-xl bg-white">
            <CardContent className="p-0">
              <FlightSearch flights={flights} loading={loading} error={error} />
            </CardContent>
          </Card>
        </motion.div>
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
    <Card className="bg-white hover:shadow-md transition-all duration-300 hover:-translate-y-1 border border-gray-100 overflow-hidden">
      <CardContent className="p-5">
        <div className="flex items-start space-x-4">
          <div className="mt-1 size-10 rounded-lg bg-gradient-to-br from-airport-primary/10 to-airport-secondary/10 flex items-center justify-center text-airport-primary">
            {icon}
          </div>
          <div>
            <h3 className="font-medium text-airport-text">{title}</h3>
            <p className="text-sm text-gray-500 mt-1">{description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Index;
