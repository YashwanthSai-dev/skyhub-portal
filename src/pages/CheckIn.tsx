
import React from 'react';
import Layout from '@/components/layout/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useFlightData } from '@/data/flightData';
import BreadcrumbNav from '@/components/check-in/BreadcrumbNav';
import CheckInForm from '@/components/check-in/CheckInForm';
import FlightSearchTab from '@/components/check-in/FlightSearchTab';
import AdminTab from '@/components/check-in/AdminTab';

const CheckIn = () => {
  const { flights, loading, error, validateCheckIn, parseCSVData } = useFlightData();

  const handleCSVUploaded = (data: any[]) => {
    console.log("Uploaded flight data:", data);
    // The data is already set in the useFlightData hook
  };

  return (
    <Layout>
      <div className="flex flex-col gap-6">
        <BreadcrumbNav />

        <div>
          <h1 className="text-4xl font-bold text-gray-800 mb-8">Web check-in</h1>

          <Tabs defaultValue="check-in" className="max-w-4xl">
            <TabsList className="mb-6">
              <TabsTrigger value="check-in">Passenger Check-in</TabsTrigger>
              <TabsTrigger value="search">Flight Search</TabsTrigger>
              <TabsTrigger value="admin">Admin: Upload Flight Data</TabsTrigger>
            </TabsList>
            
            <TabsContent value="check-in">
              <CheckInForm validateCheckIn={validateCheckIn} />
            </TabsContent>

            <TabsContent value="search">
              <FlightSearchTab flights={flights} />
            </TabsContent>

            <TabsContent value="admin">
              <AdminTab 
                flights={flights} 
                loading={loading} 
                error={error} 
                parseCSVData={parseCSVData} 
                onCSVUploaded={handleCSVUploaded} 
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default CheckIn;
