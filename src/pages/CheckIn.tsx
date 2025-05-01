
import React, { useEffect, useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useFlightData } from '@/data/flightData';
import BreadcrumbNav from '@/components/check-in/BreadcrumbNav';
import CheckInForm from '@/components/check-in/CheckInForm';
import FlightSearchTab from '@/components/check-in/FlightSearchTab';
import AdminTab from '@/components/check-in/AdminTab';
import { toast } from 'sonner';
import { useUserAuth } from '@/hooks/useUserAuth';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

// Interface for booked flights
interface BookedFlight {
  id: string;
  flightNumber: string;
  origin: string;
  destination: string;
  departureTime: string;
  status: string;
}

const CheckIn = () => {
  const { flights, setFlights, loading, error, validateCheckIn, performCheckIn, parseCSVData } = useFlightData();
  const { isAdmin, user } = useUserAuth(); // Using isAdmin directly
  const [checkedInCount, setCheckedInCount] = useState(0);
  const [bookedFlights, setBookedFlights] = useState<BookedFlight[]>([]);

  useEffect(() => {
    if (flights.length > 0 && !loading && !error) {
      console.log(`Loaded ${flights.length} flights from CSV file`);
      toast.success(`Loaded ${flights.length} flights from database`);
    }
  }, [flights, loading, error]);

  useEffect(() => {
    // Check if we have any stored passengers and log them
    try {
      const storedPassengers = localStorage.getItem('checkedInPassengers');
      if (storedPassengers) {
        const passengers = JSON.parse(storedPassengers);
        setCheckedInCount(passengers.length);
        console.log(`Loaded ${passengers.length} checked-in passengers from database`);
      }
    } catch (err) {
      console.error("Error reading stored passengers:", err);
    }
    
    // Load booked flights from localStorage
    try {
      const storedBookedFlights = localStorage.getItem('bookedFlights');
      if (storedBookedFlights) {
        const parsedFlights = JSON.parse(storedBookedFlights);
        setBookedFlights(parsedFlights);
        console.log(`Loaded ${parsedFlights.length} booked flights from database`);
      }
    } catch (err) {
      console.error("Error reading booked flights:", err);
    }
  }, []);

  const handleCSVUploaded = (data: any[]) => {
    console.log("Uploaded flight data:", data);
    setFlights(data);
  };

  return (
    <Layout>
      <div className="flex flex-col gap-6">
        <BreadcrumbNav />

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Web Check-In</h1>
          
          {checkedInCount > 0 && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="mb-6 p-4 bg-blue-50 border border-blue-100 rounded-lg shadow-sm flex items-center gap-3"
            >
              <CheckCircle className="text-blue-500 h-5 w-5" />
              <p className="text-blue-800">
                You have {checkedInCount} checked-in {checkedInCount === 1 ? 'passenger' : 'passengers'} in the system.
              </p>
            </motion.div>
          )}
          
          {bookedFlights.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="mb-8"
            >
              <h2 className="text-lg font-semibold mb-3">Your Booked Flights</h2>
              <div className="grid gap-4 md:grid-cols-2">
                {bookedFlights.map(flight => (
                  <Card key={flight.id} className="border-gray-100">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-medium">{flight.flightNumber}</h3>
                          <p className="text-sm text-gray-600">
                            {flight.origin} to {flight.destination}
                          </p>
                        </div>
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                          {flight.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mb-3">
                        Departure: {new Date(flight.departureTime).toLocaleString()}
                      </p>
                      <button
                        onClick={() => {
                          const result = performCheckIn(user?.name || "");
                          if (result.success) {
                            toast.success(`Checked in for flight ${flight.flightNumber}`);
                          }
                        }}
                        className="text-sm text-airport-primary hover:underline"
                      >
                        Check in now
                      </button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </motion.div>
          )}

          <Tabs defaultValue="check-in" className="max-w-4xl">
            <TabsList className="mb-6 bg-white border border-gray-200 shadow-sm p-1 rounded-lg">
              <TabsTrigger value="check-in" className="data-[state=active]:bg-airport-primary data-[state=active]:text-white rounded-md transition-all">Passenger Check-in</TabsTrigger>
              <TabsTrigger value="search" className="data-[state=active]:bg-airport-primary data-[state=active]:text-white rounded-md transition-all">Flight Search</TabsTrigger>
              {isAdmin && (
                <TabsTrigger value="admin" className="data-[state=active]:bg-airport-primary data-[state=active]:text-white rounded-md transition-all">Admin: Upload Flight Data</TabsTrigger>
              )}
            </TabsList>
            
            <TabsContent value="check-in" className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm">
              <CheckInForm validateCheckIn={validateCheckIn} performCheckIn={performCheckIn} />
            </TabsContent>

            <TabsContent value="search" className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm">
              <FlightSearchTab flights={flights} />
            </TabsContent>

            {isAdmin && (
              <TabsContent value="admin" className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm">
                <AdminTab 
                  flights={flights} 
                  loading={loading} 
                  error={error} 
                  parseCSVData={parseCSVData} 
                  onCSVUploaded={handleCSVUploaded} 
                />
              </TabsContent>
            )}
          </Tabs>
        </motion.div>
      </div>
    </Layout>
  );
};

export default CheckIn;
