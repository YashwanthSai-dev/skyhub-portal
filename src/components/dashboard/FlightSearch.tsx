
import React, { useState } from 'react';
import { Search, Plane } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Form, FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

interface FlightSearchResult {
  id: string;
  flightNumber: string;
  airline: string;
  origin: string;
  destination: string;
  departureTime: string;
  price: string;
  emptySeats: number;
}

const FlightSearch = () => {
  const [searchResults, setSearchResults] = useState<FlightSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Mock flight data
  const mockFlights: FlightSearchResult[] = [
    {
      id: "fs1",
      flightNumber: "SQ802",
      airline: "Singapore Airlines",
      origin: "Singapore",
      destination: "Tokyo",
      departureTime: "10:30 AM",
      price: "$450",
      emptySeats: 42
    },
    {
      id: "fs2",
      flightNumber: "EK432",
      airline: "Emirates",
      destination: "Dubai",
      origin: "Singapore",
      departureTime: "11:15 AM",
      price: "$680",
      emptySeats: 23
    },
    {
      id: "fs3",
      flightNumber: "QF8",
      airline: "Qantas",
      destination: "Sydney",
      origin: "Singapore",
      departureTime: "12:00 PM",
      price: "$520",
      emptySeats: 15
    },
    {
      id: "fs4",
      flightNumber: "CX759",
      airline: "Cathay Pacific",
      origin: "Hong Kong",
      destination: "Singapore",
      departureTime: "09:45 AM",
      price: "$380",
      emptySeats: 8
    }
  ];

  const form = useForm({
    defaultValues: {
      searchQuery: '',
    },
  });

  const onSubmit = (data: { searchQuery: string }) => {
    setIsSearching(true);
    
    // Simulate API call with setTimeout
    setTimeout(() => {
      const query = data.searchQuery.toLowerCase();
      const results = mockFlights.filter(
        flight => 
          flight.flightNumber.toLowerCase().includes(query) ||
          flight.airline.toLowerCase().includes(query) ||
          flight.origin.toLowerCase().includes(query) ||
          flight.destination.toLowerCase().includes(query)
      );
      
      setSearchResults(results);
      setIsSearching(false);
    }, 500);
  };

  return (
    <div className="bg-white rounded-lg border p-4 space-y-4">
      <h2 className="text-lg font-semibold">Search Flights</h2>
      
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
                      placeholder="Search by flight number, airline, origin or destination..." 
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
                    <th className="px-4 py-3 text-left font-medium">Price</th>
                    <th className="px-4 py-3 text-left font-medium">Empty Seats</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {searchResults.map((flight) => (
                    <tr key={flight.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div>
                          <div className="font-medium">{flight.flightNumber}</div>
                          <div className="text-gray-500 text-xs">{flight.airline}</div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <span>{flight.origin}</span>
                          <Plane className="h-3 w-3 rotate-90" />
                          <span>{flight.destination}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">{flight.departureTime}</td>
                      <td className="px-4 py-3 font-medium">{flight.price}</td>
                      <td className="px-4 py-3">
                        <span className={cn(
                          "px-2 py-1 rounded-full text-xs",
                          flight.emptySeats < 10 ? "bg-red-100 text-red-800" : 
                          flight.emptySeats < 30 ? "bg-amber-100 text-amber-800" : 
                          "bg-green-100 text-green-800"
                        )}>
                          {flight.emptySeats} seats
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
