
import React, { useState } from 'react';
import { Flight } from '@/data/flightData';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FlightSearchTabProps {
  flights: Flight[];
}

const FlightSearchTab: React.FC<FlightSearchTabProps> = ({ flights }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Flight[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchTerm.trim()) {
      setSearchResults([]);
      setHasSearched(true);
      return;
    }
    
    const term = searchTerm.toLowerCase().trim();
    
    // Search by flight number, route, destination, origin, passenger name
    const results = flights.filter(flight => 
      flight.flightNumber.toLowerCase().includes(term) ||
      flight.origin.toLowerCase().includes(term) ||
      flight.destination.toLowerCase().includes(term) ||
      flight.passengerName.toLowerCase().includes(term) ||
      flight.bookingReference.toLowerCase().includes(term)
    );
    
    console.log(`Search results for "${term}":`, results);
    setSearchResults(results);
    setHasSearched(true);
  };

  const getStatusBadge = (status: Flight['status']) => {
    let color = '';
    switch (status) {
      case 'SCHEDULED':
        color = 'bg-blue-100 text-blue-800 hover:bg-blue-100';
        break;
      case 'BOARDING':
        color = 'bg-amber-100 text-amber-800 hover:bg-amber-100';
        break;
      case 'DEPARTED':
        color = 'bg-purple-100 text-purple-800 hover:bg-purple-100';
        break;
      case 'ARRIVED':
        color = 'bg-green-100 text-green-800 hover:bg-green-100';
        break;
      case 'CANCELLED':
        color = 'bg-red-100 text-red-800 hover:bg-red-100';
        break;
      default:
        color = 'bg-gray-100 text-gray-800 hover:bg-gray-100';
    }
    
    return <Badge className={color}>{status}</Badge>;
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold mb-4">Flight Search</h2>
      <p className="text-lg mb-6">
        Search for flight information by flight number, route, passenger name, or booking reference.
      </p>
      
      <form onSubmit={handleSearch} className="flex gap-2 mb-6">
        <Input
          placeholder="Search flights by number, origin, destination, passenger name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1"
        />
        <Button type="submit">
          <Search className="mr-2 h-4 w-4" />
          Search
        </Button>
      </form>
      
      {hasSearched && (
        <div>
          {searchResults.length > 0 ? (
            <div className="bg-white rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Flight Number</TableHead>
                    <TableHead>Route</TableHead>
                    <TableHead>Departure</TableHead>
                    <TableHead>Arrival</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {searchResults.map(flight => (
                    <TableRow key={flight.id}>
                      <TableCell className="font-medium">{flight.flightNumber}</TableCell>
                      <TableCell>{flight.origin} → {flight.destination}</TableCell>
                      <TableCell>{format(new Date(flight.departureTime), "MMM d, h:mm a")}</TableCell>
                      <TableCell>{format(new Date(flight.arrivalTime), "MMM d, h:mm a")}</TableCell>
                      <TableCell>{getStatusBadge(flight.status)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Accordion for checked-in passengers */}
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
          ) : (
            <div className="text-center py-8 bg-gray-50 rounded-lg border">
              <p className="text-gray-500">No flights found matching "{searchTerm}"</p>
              <p className="text-sm text-gray-400 mt-1">Try a different search term</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FlightSearchTab;
