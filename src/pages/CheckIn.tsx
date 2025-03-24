
import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useFlightData, Flight } from '@/data/flightData';
import CSVUploader from '@/components/CSVUploader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const CheckIn = () => {
  const [bookingReference, setBookingReference] = useState('');
  const [emailOrName, setEmailOrName] = useState('');
  const [checkedInFlight, setCheckedInFlight] = useState<Flight | null>(null);
  const { toast } = useToast();
  const { flights, loading, error, validateCheckIn, parseCSVData } = useFlightData();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!bookingReference || !emailOrName) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    const flight = validateCheckIn(bookingReference, emailOrName);
    
    if (flight) {
      setCheckedInFlight(flight);
      toast({
        title: "Check-in Successful",
        description: `Your boarding pass for flight ${flight.flightNumber} has been sent to your email`,
      });
    } else {
      toast({
        title: "Check-in Failed",
        description: "No matching flight found. Please check your booking reference and email/name.",
        variant: "destructive",
      });
    }
  };

  const handleCSVUploaded = (data: Flight[]) => {
    console.log("Uploaded flight data:", data);
    // The data is already set in the useFlightData hook
  };

  return (
    <Layout>
      <div className="flex flex-col gap-6">
        <div className="flex items-center text-sm text-muted-foreground">
          <a href="/" className="text-airport-primary hover:underline">Home</a>
          <ChevronRight className="h-4 w-4 mx-1" />
          <span>Web Check-In</span>
        </div>

        <div>
          <h1 className="text-4xl font-bold text-gray-800 mb-8">Web check-in</h1>

          <Tabs defaultValue="check-in" className="max-w-4xl">
            <TabsList className="mb-6">
              <TabsTrigger value="check-in">Passenger Check-in</TabsTrigger>
              <TabsTrigger value="admin">Admin: Upload Flight Data</TabsTrigger>
            </TabsList>
            
            <TabsContent value="check-in">
              <div className="space-y-6">
                <p className="text-lg">
                  Web Checkin for passengers is available 48 hrs to 60 mins before domestic flight departure, and 24 hrs to 75 mins before international flight departure.
                </p>

                <p className="text-lg">
                  Airport Check-in at counter is available 60 mins before domestic flight departure, and 75 mins before international flight departure.
                </p>

                <div className="flex items-start mt-4">
                  <strong className="text-lg font-medium mr-2">Please note:</strong>
                  <p className="text-lg">Only personalized check-in assistance at the airport applicable for codeshare bookings.</p>
                </div>

                <Card className="mt-10 bg-transparent shadow-none border-none">
                  <CardContent className="p-0">
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <Input
                            placeholder="PNR/Booking Reference"
                            value={bookingReference}
                            onChange={(e) => setBookingReference(e.target.value)}
                            className="h-14 text-lg bg-white"
                          />
                        </div>
                        <div>
                          <Input
                            placeholder="Email/Last Name"
                            value={emailOrName}
                            onChange={(e) => setEmailOrName(e.target.value)}
                            className="h-14 text-lg bg-white"
                          />
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <Button 
                          type="submit" 
                          className="h-14 px-10 text-lg bg-blue-900 hover:bg-blue-800"
                        >
                          Check-in
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
                
                {checkedInFlight && (
                  <div className="mt-8 p-6 bg-green-50 border border-green-200 rounded-lg">
                    <h3 className="text-xl font-bold text-green-800 mb-4">Check-in Successful!</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Flight</p>
                        <p className="text-lg font-medium">{checkedInFlight.flightNumber}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Route</p>
                        <p className="text-lg font-medium">{checkedInFlight.origin} to {checkedInFlight.destination}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Departure</p>
                        <p className="text-lg font-medium">{new Date(checkedInFlight.departureTime).toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Passenger</p>
                        <p className="text-lg font-medium">{checkedInFlight.passengerName}</p>
                      </div>
                    </div>
                    <p className="mt-4 text-green-700">Your boarding pass has been sent to {checkedInFlight.passengerEmail}</p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="admin">
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold mb-4">Upload Flight Data</h2>
                <p className="text-lg mb-6">
                  Upload a CSV file containing flight and passenger information. The CSV should include columns for 
                  flightNumber, origin, destination, departureTime, arrivalTime, bookingReference, passengerName, 
                  passengerEmail, and status.
                </p>
                
                <CSVUploader 
                  onCSVParsed={handleCSVUploaded} 
                  parseCSVData={parseCSVData} 
                />
                
                {loading && <p className="text-center my-4">Loading flight data...</p>}
                {error && <p className="text-red-500 my-4">{error}</p>}
                
                <div className="mt-6">
                  <h3 className="text-xl font-semibold mb-4">Current Flight Data ({flights.length} records)</h3>
                  {flights.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="bg-gray-100">
                            <th className="border p-2 text-left">Flight</th>
                            <th className="border p-2 text-left">Route</th>
                            <th className="border p-2 text-left">Departure</th>
                            <th className="border p-2 text-left">Booking Ref</th>
                            <th className="border p-2 text-left">Passenger</th>
                          </tr>
                        </thead>
                        <tbody>
                          {flights.slice(0, 5).map((flight) => (
                            <tr key={flight.id} className="hover:bg-gray-50">
                              <td className="border p-2">{flight.flightNumber}</td>
                              <td className="border p-2">{flight.origin} → {flight.destination}</td>
                              <td className="border p-2">{new Date(flight.departureTime).toLocaleString()}</td>
                              <td className="border p-2">{flight.bookingReference}</td>
                              <td className="border p-2">{flight.passengerName}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {flights.length > 5 && (
                        <p className="text-sm text-gray-500 mt-2">Showing 5 of {flights.length} records</p>
                      )}
                    </div>
                  ) : (
                    <p className="text-gray-500">No flight data available. Please upload a CSV file.</p>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default CheckIn;
