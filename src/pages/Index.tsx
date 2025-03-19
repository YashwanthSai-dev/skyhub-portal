
import React from 'react';
import { Plane, Users, Clock, BarChart3 } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import StatsCard from '@/components/dashboard/StatsCard';
import FlightTable from '@/components/dashboard/FlightTable';
import WeatherWidget from '@/components/dashboard/WeatherWidget';
import FlightSearch from '@/components/dashboard/FlightSearch';

const Index = () => {
  // Mock data for the dashboard
  const statsData = [
    { title: "Today's Flights", value: "285", icon: <Plane className="h-5 w-5" />, trend: { value: 12, positive: true } },
    { title: "Passengers", value: "42,890", icon: <Users className="h-5 w-5" />, trend: { value: 8, positive: true } },
    { title: "Average Delay", value: "18 min", icon: <Clock className="h-5 w-5" />, trend: { value: 5, positive: false } },
    { title: "On-Time Rate", value: "89%", icon: <BarChart3 className="h-5 w-5" />, trend: { value: 3, positive: true } }
  ];

  const departureFlights = [
    { 
      id: "1", 
      flightNumber: "SQ802", 
      airline: "Singapore Airlines", 
      destination: "Tokyo", 
      origin: "Singapore",
      scheduledTime: "10:30 AM", 
      actualTime: "10:45 AM", 
      gate: "B12", 
      terminal: "T2", 
      status: "Boarding" as const, 
      type: "departure" as const
    },
    { 
      id: "2", 
      flightNumber: "EK432", 
      airline: "Emirates", 
      destination: "Dubai", 
      origin: "Singapore",
      scheduledTime: "11:15 AM", 
      actualTime: "11:15 AM", 
      gate: "C5", 
      terminal: "T3", 
      status: "On Time" as const, 
      type: "departure" as const
    },
    { 
      id: "3", 
      flightNumber: "QF8", 
      airline: "Qantas", 
      destination: "Sydney", 
      origin: "Singapore",
      scheduledTime: "12:00 PM", 
      actualTime: "12:45 PM", 
      gate: "A7", 
      terminal: "T1", 
      status: "Delayed" as const,
      type: "departure" as const
    }
  ];

  const arrivalFlights = [
    { 
      id: "4", 
      flightNumber: "CX759", 
      airline: "Cathay Pacific", 
      destination: "Singapore", 
      origin: "Hong Kong",
      scheduledTime: "09:45 AM", 
      actualTime: "09:40 AM", 
      gate: "D3", 
      terminal: "T4", 
      status: "Arrived" as const, 
      type: "arrival" as const
    },
    { 
      id: "5", 
      flightNumber: "BA11", 
      airline: "British Airways", 
      destination: "Singapore", 
      origin: "London",
      scheduledTime: "10:20 AM", 
      actualTime: "10:35 AM", 
      gate: "C8", 
      terminal: "T3", 
      status: "Delayed" as const, 
      type: "arrival" as const
    },
    { 
      id: "6", 
      flightNumber: "LH778", 
      airline: "Lufthansa", 
      destination: "Singapore", 
      origin: "Frankfurt",
      scheduledTime: "11:30 AM", 
      actualTime: "--", 
      gate: "B2", 
      terminal: "T2", 
      status: "On Time" as const, 
      type: "arrival" as const
    }
  ];

  const weatherData = {
    temperature: 29,
    condition: "cloudy" as const,
    windSpeed: 12,
    windDirection: "NE",
    humidity: 78,
    visibility: "10 km"
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-airport-text">Airport Dashboard</h1>
          <p className="text-gray-500">Welcome to the airport management system</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {statsData.map((stat, index) => (
            <StatsCard
              key={index}
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              trend={stat.trend}
            />
          ))}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <FlightSearch />
            
            <div>
              <h2 className="text-lg font-semibold mb-3">Upcoming Departures</h2>
              <FlightTable flights={departureFlights} type="departure" />
            </div>
            
            <div>
              <h2 className="text-lg font-semibold mb-3">Recent Arrivals</h2>
              <FlightTable flights={arrivalFlights} type="arrival" />
            </div>
          </div>
          
          <div>
            <h2 className="text-lg font-semibold mb-3">Weather Conditions</h2>
            <WeatherWidget data={weatherData} />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
