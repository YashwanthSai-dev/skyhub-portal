
import React from 'react';
import Layout from '@/components/layout/Layout';
import FlightBookingForm from '@/components/booking/FlightBookingForm';
import { useFlightData } from '@/data/flightData';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import FlightSearchTab from '@/components/check-in/FlightSearchTab';

const Booking = () => {
  const { flights, addBooking, loading } = useFlightData();
  
  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Book a Flight</h1>
        
        <Tabs defaultValue="booking" className="max-w-4xl">
          <TabsList className="mb-6">
            <TabsTrigger value="booking">New Booking</TabsTrigger>
            <TabsTrigger value="search">Search Flights</TabsTrigger>
          </TabsList>
            
          <TabsContent value="booking">
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-airport-primary"></div>
              </div>
            ) : (
              <FlightBookingForm flights={flights} addBooking={addBooking} />
            )}
          </TabsContent>
            
          <TabsContent value="search">
            <FlightSearchTab flights={flights} />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Booking;
