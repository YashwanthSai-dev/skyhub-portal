
import React, { useState, useEffect } from 'react';
import { Search, Plane, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Form, FormField, FormItem, FormControl } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { cn } from '@/lib/utils';
import { Flight } from '@/data/flightData';
import { toast } from 'sonner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface FlightSearchProps {
  flights?: Flight[];
  loading?: boolean;
  error?: string | null;
}

interface StoredPassenger {
  flightId: string;
  flightNumber: string;
  passengerName: string;
  checkInTime: string;
}

const FlightSearch: React.FC<FlightSearchProps> = ({ 
  flights = [], 
  loading = false,
  error = null
}) => {
  const [searchResults, setSearchResults] = useState<Flight[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [storedPassengers, setStoredPassengers] = useState<StoredPassenger[]>([]);

  const form = useForm({
    defaultValues: {
      searchQuery: '',
    },
  });

  useEffect(() => {
    // Log the incoming flights data for debugging
    console.log(`FlightSearch component received ${flights?.length || 0} flights`);
    if (flights && flights.length > 0) {
      console.log("Sample flight data:", flights[0]);
    }
    
    // Load any stored passengers from local storage
    try {
      const savedPassengers = localStorage.getItem('checkedInPassengers');
      if (savedPassengers) {
        setStoredPassengers(JSON.parse(savedPassengers));
        console.log("Loaded stored passengers:", JSON.parse(savedPassengers).length);
      }
    } catch (err) {
      console.error("Error loading stored passengers:", err);
    }
  }, [flights]);

  // Combine flight data with stored passenger data
  const getEnhancedFlights = () => {
    return flights.map(flight => {
      // Find any stored passengers for this flight
      const flightPassengers = storedPassengers.filter(p => p.flightId === flight.id);
      
      if (flightPassengers.length > 0) {
        const updatedFlight = { ...flight };
        
        if (!updatedFlight.checkedInPassengers) {
          updatedFlight.checkedInPassengers = [];
        }
        
        // Add any stored passengers that aren't already in the checkedInPassengers array
        flightPassengers.forEach(passenger => {
          const existingPassenger = updatedFlight.checkedInPassengers?.find(p => 
            p.name.toLowerCase() === passenger.passengerName.toLowerCase()
          );
          
          if (!existingPassenger) {
            updatedFlight.checkedInPassengers.push({
              id: `stored-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              name: passenger.passengerName,
              email: `${passenger.passengerName.replace(/\s+/g, '.').toLowerCase()}@example.com`,
              checkInTime: passenger.checkInTime
            });
          }
        });
        
        return updatedFlight;
      }
      
      return flight;
    });
  };

  const onSubmit = (data: { searchQuery: string }) => {
    setIsSearching(true);
    const query = data.searchQuery.toLowerCase().trim();
    
    if (!query) {
      toast.warning("Please enter a search term");
      setIsSearching(false);
      return;
    }

    if (!flights || flights.length === 0) {
      toast.error("No flight data available");
      setIsSearching(false);
      return;
    }

    // Log the search query and available flights for debugging
    console.log(`Searching for: "${query}" among ${flights.length} flights`);
    
    setTimeout(() => {
      const enhancedFlights = getEnhancedFlights();
      
      // Debug logging for search
      console.log("Flight data for search:", enhancedFlights.map(f => ({
        id: f.id,
        flightNumber: f.flightNumber,
        origin: f.origin,
        destination: f.destination,
        passengers: f.checkedInPassengers?.length || 0
      })));
      
      // More flexible search that handles case insensitivity and partial matches
      const results = enhancedFlights.filter(flight => {
        const flightNumber = flight.flightNumber?.toLowerCase().trim() || '';
        const origin = flight.origin?.toLowerCase().trim() || '';
        const destination = flight.destination?.toLowerCase().trim() || '';
        const passengerName = flight.passengerName?.toLowerCase().trim() || '';
        const bookingReference = flight.bookingReference?.toLowerCase().trim() || '';
        
        // Also search through checked-in passengers
        const hasMatchingPassenger = flight.checkedInPassengers?.some(passenger => 
          passenger.name.toLowerCase().includes(query)
        );
        
        return flightNumber.includes(query) ||
               origin.includes(query) ||
               destination.includes(query) || 
               passengerName.includes(query) || 
               bookingReference.includes(query) ||
               hasMatchingPassenger;
      });
      
      console.log(`Search results: ${results.length} flights found`);
      setSearchResults(results);
      
      if (results.length === 0) {
        toast.info("No flights found matching your search criteria");
      }
      
      setIsSearching(false);
    }, 500);
  };

  return (
    <div className="bg-white rounded-lg border p-4 space-y-4">
      <h2 className="text-lg font-semibold">Search Flights</h2>
      
      {loading && (
        <div className="flex items-center justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-airport-primary" />
          <span className="ml-2">Loading flight data...</span>
        </div>
      )}
      
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {!loading && !error && flights.length === 0 && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-md mb-4">
          <p className="text-amber-800">
            No flight data available
          </p>
        </div>
      )}
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="searchQuery"
            render={({ field }) => (
              <FormItem>
                <div className="flex space-x-2">
                  <FormControl>
                    <Input 
                      placeholder="Search by flight number, origin, destination, or passenger..." 
                      {...field} 
                      disabled={loading || flights.length === 0}
                    />
                  </FormControl>
                  <Button 
                    type="submit" 
                    disabled={isSearching || loading || flights.length === 0}
                  >
                    {isSearching ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Searching...
                      </>
                    ) : (
                      <>
                        Search
                        <Search className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
              </FormItem>
            )}
          />
        </form>
      </Form>

      {!loading && flights.length > 0 && searchResults.length === 0 && !isSearching && form.getValues().searchQuery === '' && (
        <div className="p-4 bg-blue-50 border border-blue-100 rounded-md">
          <div className="flex items-center">
            <Plane className="h-5 w-5 text-blue-500 mr-2" />
            <p className="text-blue-700">
              Enter a search term above to find flights by flight number, origin, destination, or passenger name.
            </p>
          </div>
          <div className="mt-2 text-blue-600 text-sm">
            <p>Try searching for:</p>
            <ul className="list-disc pl-5 mt-1">
              <li>Flight number (e.g. "SH101")</li>
              <li>Origin city (e.g. "New York")</li>
              <li>Destination (e.g. "London")</li>
              <li>Passenger name (e.g. "John")</li>
            </ul>
          </div>
        </div>
      )}

      {searchResults.length > 0 && (
        <div className="mt-4">
          <h3 className="text-md font-medium mb-2">Search Results</h3>
          <div className="rounded-md border">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium">Flight</th>
                    <th className="px-4 py-3 text-left font-medium">Route</th>
                    <th className="px-4 py-3 text-left font-medium">Departure</th>
                    <th className="px-4 py-3 text-left font-medium">Passenger</th>
                    <th className="px-4 py-3 text-left font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {searchResults.map((flight) => (
                    <tr key={flight.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div>
                          <div className="font-medium">{flight.flightNumber}</div>
                          <div className="text-gray-500 text-xs">{flight.bookingReference}</div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <span>{flight.origin}</span>
                          <Plane className="h-3 w-3 rotate-90" />
                          <span>{flight.destination}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">{new Date(flight.departureTime).toLocaleString()}</td>
                      <td className="px-4 py-3">{flight.passengerName}</td>
                      <td className="px-4 py-3">
                        <span className={cn(
                          "px-2 py-1 rounded-full text-xs",
                          flight.status === 'CANCELLED' ? "bg-red-100 text-red-800" : 
                          flight.status === 'BOARDING' ? "bg-amber-100 text-amber-800" : 
                          flight.status === 'DEPARTED' ? "bg-blue-100 text-blue-800" :
                          flight.status === 'ARRIVED' ? "bg-green-100 text-green-800" :
                          "bg-purple-100 text-purple-800"
                        )}>
                          {flight.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="mt-4">
            <Accordion type="single" collapsible className="w-full">
              {searchResults.map(flight => (
                <AccordionItem value={`passengers-${flight.id}`} key={`acc-${flight.id}`}>
                  <AccordionTrigger className="px-4 py-2 hover:bg-gray-50">
                    <div className="flex items-center gap-2">
                      <span>Flight {flight.flightNumber} Passengers</span>
                      {flight.checkedInPassengers && flight.checkedInPassengers.length > 0 && (
                        <Badge variant="outline" className="bg-green-50">
                          {flight.checkedInPassengers.length} checked in
                        </Badge>
                      )}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4">
                    {flight.checkedInPassengers && flight.checkedInPassengers.length > 0 ? (
                      <div className="space-y-2">
                        <h4 className="font-medium">Checked-in Passengers:</h4>
                        <div className="border rounded-md overflow-hidden">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Passenger Name</TableHead>
                                <TableHead>Seat</TableHead>
                                <TableHead>Check-in Time</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {flight.checkedInPassengers.map(passenger => (
                                <TableRow key={passenger.id}>
                                  <TableCell>{passenger.name}</TableCell>
                                  <TableCell>{passenger.seatNumber || 'Not assigned'}</TableCell>
                                  <TableCell>{format(new Date(passenger.checkInTime), 'MMM d, h:mm a')}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-500">No passengers have checked in for this flight yet.</p>
                    )}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      )}

      {searchResults.length === 0 && form.getValues().searchQuery && !isSearching && (
        <div className="text-center py-6 text-gray-500">
          No flights found. Try a different search term.
        </div>
      )}
    </div>
  );
};

export default FlightSearch;
