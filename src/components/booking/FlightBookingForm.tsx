
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { CalendarIcon, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Flight, BookingDetails } from '@/data/flightData';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface FlightBookingFormProps {
  flights: Flight[];
  addBooking: (booking: Omit<BookingDetails, 'id'>) => BookingDetails;
}

const FlightBookingForm: React.FC<FlightBookingFormProps> = ({ flights, addBooking }) => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [date, setDate] = useState<Date>(new Date());
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  
  const [filteredFlights, setFilteredFlights] = useState<Flight[]>([]);
  
  // Get unique origins and destinations for dropdowns
  const origins = [...new Set(flights.map(f => f.origin))].sort();
  const destinations = [...new Set(flights.map(f => f.destination))].sort();
  
  // Filter flights based on selected criteria
  useEffect(() => {
    if (!origin || !destination) {
      setFilteredFlights([]);
      return;
    }
    
    const selectedDate = date.toDateString();
    
    const filtered = flights.filter(flight => {
      const flightDate = new Date(flight.departureTime).toDateString();
      return (
        flight.origin === origin &&
        flight.destination === destination &&
        flightDate === selectedDate &&
        flight.status === 'SCHEDULED' // Only show scheduled flights
      );
    });
    
    setFilteredFlights(filtered);
  }, [origin, destination, date, flights]);
  
  const handleSelectFlight = (flight: Flight) => {
    setSelectedFlight(flight);
    setStep(2);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedFlight || !name || !email) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    // Generate a random booking reference
    const bookingRef = `BK${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
    
    // Create the booking
    try {
      addBooking({
        flightId: selectedFlight.id,
        passengerName: name,
        passengerEmail: email,
        bookingReference: bookingRef,
        seatNumber: `${Math.floor(Math.random() * 30) + 1}${String.fromCharCode(65 + Math.floor(Math.random() * 6))}`,
        hasCheckedIn: false
      });
      
      toast.success("Booking confirmed! You can now check in for your flight.");
      setStep(3);
    } catch (error) {
      toast.error("Failed to complete booking. Please try again.");
      console.error("Booking error:", error);
    }
  };
  
  const handleCheckIn = () => {
    navigate('/check-in');
  };
  
  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Book a Flight</CardTitle>
        <CardDescription>
          {step === 1 ? "Search for available flights" : 
           step === 2 ? "Complete passenger details" :
           "Booking confirmed"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {step === 1 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="origin">Origin</Label>
                <Select value={origin} onValueChange={setOrigin}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select origin" />
                  </SelectTrigger>
                  <SelectContent>
                    {origins.map(city => (
                      <SelectItem key={city} value={city}>{city}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="destination">Destination</Label>
                <Select value={destination} onValueChange={setDestination}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select destination" />
                  </SelectTrigger>
                  <SelectContent>
                    {destinations.map(city => (
                      <SelectItem key={city} value={city}>{city}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="date">Departure Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={(date) => date && setDate(date)}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            
            {filteredFlights.length > 0 ? (
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-4">Available Flights</h3>
                <div className="space-y-4">
                  {filteredFlights.map(flight => (
                    <Card key={flight.id} className="overflow-hidden">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between p-4 gap-4">
                        <div>
                          <p className="text-lg font-semibold">{flight.flightNumber}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-sm">{flight.origin}</span>
                            <ArrowRight className="h-3 w-3 text-gray-400" />
                            <span className="text-sm">{flight.destination}</span>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex flex-col md:flex-row md:gap-4">
                            <div className="text-sm">
                              <div className="font-medium">Departure</div>
                              <div>{format(new Date(flight.departureTime), "h:mm a")}</div>
                            </div>
                            
                            <div className="text-sm">
                              <div className="font-medium">Arrival</div>
                              <div>{format(new Date(flight.arrivalTime), "h:mm a")}</div>
                            </div>
                          </div>
                        </div>
                        
                        <Button
                          className="mt-2 md:mt-0"
                          onClick={() => handleSelectFlight(flight)}
                        >
                          Select
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            ) : (
              origin && destination ? (
                <div className="bg-gray-50 p-4 rounded-lg text-center mt-6">
                  <p className="text-gray-500">No flights available for the selected route and date</p>
                  <p className="text-sm text-gray-400 mt-1">Please try different options</p>
                </div>
              ) : null
            )}
          </>
        ) : step === 2 ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-blue-50 p-4 rounded-lg mb-4">
              <h3 className="text-lg font-medium mb-2">Flight Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Flight</p>
                  <p className="font-medium">{selectedFlight?.flightNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Route</p>
                  <p className="font-medium">{selectedFlight?.origin} → {selectedFlight?.destination}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Date</p>
                  <p className="font-medium">{format(new Date(selectedFlight?.departureTime || ''), "PPP")}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Time</p>
                  <p className="font-medium">{format(new Date(selectedFlight?.departureTime || ''), "h:mm a")}</p>
                </div>
              </div>
            </div>
            
            <h3 className="text-lg font-medium">Passenger Information</h3>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input 
                  id="name" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name" 
                  required 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input 
                  id="email" 
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email" 
                  required 
                />
              </div>
            </div>
            
            <div className="mt-6 flex justify-between">
              <Button type="button" variant="outline" onClick={() => setStep(1)}>
                Back to Search
              </Button>
              <Button type="submit">Confirm Booking</Button>
            </div>
          </form>
        ) : (
          <div className="text-center py-8">
            <div className="size-16 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">Booking Confirmed!</h3>
            <p className="text-gray-600 mb-6">Your flight has been booked successfully.</p>
            
            <div className="bg-blue-50 p-4 rounded-lg mx-auto max-w-md mb-6">
              <div className="grid grid-cols-2 gap-4 text-left">
                <div>
                  <p className="text-sm text-gray-500">Flight</p>
                  <p className="font-medium">{selectedFlight?.flightNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Route</p>
                  <p className="font-medium">{selectedFlight?.origin} → {selectedFlight?.destination}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Date</p>
                  <p className="font-medium">{format(new Date(selectedFlight?.departureTime || ''), "PPP")}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Time</p>
                  <p className="font-medium">{format(new Date(selectedFlight?.departureTime || ''), "h:mm a")}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Passenger</p>
                  <p className="font-medium">{name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{email}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
      {step === 3 && (
        <CardFooter className="flex justify-center">
          <Button onClick={handleCheckIn}>Proceed to Check-in</Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default FlightBookingForm;
