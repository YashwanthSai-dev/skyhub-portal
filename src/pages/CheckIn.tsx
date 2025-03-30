
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

const CheckIn = () => {
  const { flights, setFlights, loading, error, validateCheckIn, performCheckIn, parseCSVData } = useFlightData();
  const { isEmployee } = useUserAuth();
  const [checkedInCount, setCheckedInCount] = useState(0);

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
  }, []);

  const handleCSVUploaded = (data: any[]) => {
    console.log("Uploaded flight data:", data);
    setFlights(data);
  };

  return (
    <Layout>
      <div className="flex flex-col gap-6">
        <BreadcrumbNav />

        <div>
          <h1 className="text-4xl font-bold text-gray-800 mb-8">Web check-in</h1>
          
          {checkedInCount > 0 && (
            <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-blue-800">
                You have {checkedInCount} checked-in {checkedInCount === 1 ? 'passenger' : 'passengers'} in the system.
              </p>
            </div>
          )}

          <Tabs defaultValue="check-in" className="max-w-4xl">
            <TabsList className="mb-6">
              <TabsTrigger value="check-in">Passenger Check-in</TabsTrigger>
              <TabsTrigger value="search">Flight Search</TabsTrigger>
              {isEmployee && (
                <TabsTrigger value="admin">Admin: Upload Flight Data</TabsTrigger>
              )}
            </TabsList>
            
            <TabsContent value="check-in">
              <CheckInForm validateCheckIn={validateCheckIn} performCheckIn={performCheckIn} />
            </TabsContent>

            <TabsContent value="search">
              <FlightSearchTab flights={flights} />
            </TabsContent>

            {isEmployee && (
              <TabsContent value="admin">
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
        </div>
      </div>
    </Layout>
  );
};

export default CheckIn;
