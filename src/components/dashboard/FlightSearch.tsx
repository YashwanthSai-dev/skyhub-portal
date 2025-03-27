
import React, { useState, useEffect } from 'react';
import { Search, Plane } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Form, FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { Flight } from '@/data/flightData';
import { toast } from 'sonner';

interface FlightSearchProps {
  flights?: Flight[];
}

const FlightSearch: React.FC<FlightSearchProps> = ({ flights = [] }) => {
  const [searchResults, setSearchResults] = useState<Flight[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const form = useForm({
    defaultValues: {
      searchQuery: '',
    },
  });

  useEffect(() => {
    // Log the incoming flights data for debugging
    console.log(`FlightSearch component received ${flights?.length || 0} flights`);
  }, [flights]);

  const onSubmit = (data: { searchQuery: string }) => {
    setIsSearching(true);
    const query = data.searchQuery.toLowerCase().trim();
    
    if (!query) {
      toast.warning("Please enter a search term");
      setIsSearching(false);
      return;
    }

    if (!flights || flights.length === 0) {
      toast.error("No flight data available. Please ensure dataset.py has been run.");
      setIsSearching(false);
      return;
    }

    // Log the search query and available flights for debugging
    console.log(`Searching for: "${query}" among ${flights.length} flights`);
    
    setTimeout(() => {
      const results = flights.filter(
        flight => 
          (flight.flightNumber && flight.flightNumber.toLowerCase().includes(query)) ||
          (flight.origin && flight.origin.toLowerCase().includes(query)) ||
          (flight.destination && flight.destination.toLowerCase().includes(query)) ||
          (flight.passengerName && flight.passengerName.toLowerCase().includes(query)) ||
          (flight.bookingReference && flight.bookingReference.toLowerCase().includes(query))
      );
      
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
      
      {flights.length === 0 && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-md mb-4">
          <p className="text-amber-800">
            No flight data available. Please make sure you've run the dataset.py script to generate the flight database.
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
                    />
                  </FormControl>
                  <Button type="submit" disabled={isSearching}>
                    {isSearching ? "Searching..." : "Search"}
                    <Search className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </FormItem>
            )}
          />
        </form>
      </Form>

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
                          "bg-green-100 text-green-800"
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
