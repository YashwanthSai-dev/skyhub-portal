
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CalendarIcon, TrendingUp, Check } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const airlines = [
  "Emirates", "Qatar Airways", "Singapore Airlines", "Air France", 
  "Lufthansa", "British Airways", "Delta", "United Airlines"
];

const destinations = [
  "New York", "London", "Tokyo", "Paris", "Dubai", 
  "Sydney", "Singapore", "Hong Kong", "Bangkok"
];

const FlightPricePrediction = () => {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [airline, setAirline] = useState('');
  const [departureDate, setDepartureDate] = useState<Date | undefined>(undefined);
  const [returnDate, setReturnDate] = useState<Date | undefined>(undefined);
  const [passengers, setPassengers] = useState('1');
  const [predictedPrice, setPredictedPrice] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const navigate = useNavigate();
  
  const handlePredict = () => {
    // Validate inputs
    if (!origin || !destination || !airline || !departureDate) {
      toast.error('Please fill all required fields');
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API call with setTimeout
    setTimeout(() => {
      // Simple algorithm to generate a "prediction" based on inputs
      const basePrice = Math.floor(Math.random() * 300) + 200;
      const distanceFactor = Math.abs(destination.length - origin.length) * 50;
      const airlineFactor = airline.length * 10;
      const dateFactor = departureDate.getDay() === 0 || departureDate.getDay() === 6 ? 100 : 0;
      const passengerCount = parseInt(passengers, 10);
      
      const totalPrice = (basePrice + distanceFactor + airlineFactor + dateFactor) * passengerCount;
      
      setPredictedPrice(totalPrice);
      setIsLoading(false);
      toast.success('Price prediction complete!');
    }, 1500);
  };
  
  const handleBooking = () => {
    if (!predictedPrice || !origin || !destination || !departureDate) {
      toast.error('Cannot book without complete flight information');
      return;
    }

    setIsBooking(true);

    // Generate a unique flight ID for this prediction
    const flightId = `FL-${Math.floor(Math.random() * 10000)}`;
    
    // Simulate booking process
    setTimeout(() => {
      // Create a flight object with basic information
      const flightData = {
        id: flightId,
        flightNumber: `${airline.substring(0, 2).toUpperCase()}${Math.floor(Math.random() * 1000)}`,
        origin,
        destination,
        departureTime: departureDate.toISOString(),
        arrivalTime: returnDate ? returnDate.toISOString() : new Date(departureDate.getTime() + 3600000 * 3).toISOString(),
        price: predictedPrice,
        airline,
        status: 'CONFIRMED'
      };
      
      // Save to localStorage for persistence
      const bookedFlights = JSON.parse(localStorage.getItem('bookedFlights') || '[]');
      bookedFlights.push(flightData);
      localStorage.setItem('bookedFlights', JSON.stringify(bookedFlights));
      
      setIsBooking(false);
      toast.success('Flight booked successfully!');
      
      // Navigate to booking page with the flight ID
      navigate(`/booking?flightId=${flightId}`);
    }, 2000);
  };
  
  const resetForm = () => {
    setOrigin('');
    setDestination('');
    setAirline('');
    setDepartureDate(undefined);
    setReturnDate(undefined);
    setPassengers('1');
    setPredictedPrice(null);
  };

  return (
    <Layout>
      <div className="flex flex-col gap-6 max-w-4xl mx-auto">
        <div>
          <h1 className="text-3xl font-bold text-airport-text">Flight Price Prediction</h1>
          <p className="text-gray-500">Get an estimate of flight prices based on your travel details</p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-airport-primary" />
              Price Estimator
            </CardTitle>
            <CardDescription>
              Enter your flight details below to get a price prediction
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="origin">Origin City</Label>
                <Input
                  id="origin"
                  placeholder="Where are you flying from?"
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="destination">Destination</Label>
                <Select value={destination} onValueChange={setDestination}>
                  <SelectTrigger id="destination">
                    <SelectValue placeholder="Select destination" />
                  </SelectTrigger>
                  <SelectContent>
                    {destinations.map((city) => (
                      <SelectItem key={city} value={city}>
                        {city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="airline">Airline</Label>
                <Select value={airline} onValueChange={setAirline}>
                  <SelectTrigger id="airline">
                    <SelectValue placeholder="Select airline" />
                  </SelectTrigger>
                  <SelectContent>
                    {airlines.map((airlineName) => (
                      <SelectItem key={airlineName} value={airlineName}>
                        {airlineName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="passengers">Passengers</Label>
                <Input
                  id="passengers"
                  type="number"
                  min="1"
                  max="10"
                  value={passengers}
                  onChange={(e) => setPassengers(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Departure Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {departureDate ? format(departureDate, 'PPP') : <span>Select date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={departureDate}
                      onSelect={setDepartureDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="space-y-2">
                <Label>Return Date (Optional)</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {returnDate ? format(returnDate, 'PPP') : <span>Select date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={returnDate}
                      onSelect={setReturnDate}
                      initialFocus
                      disabled={(date) => 
                        (departureDate ? date < departureDate : false) || 
                        date < new Date()
                      }
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              <Button 
                onClick={handlePredict} 
                className="flex-1"
                disabled={isLoading}
              >
                {isLoading ? "Calculating..." : "Predict Price"}
              </Button>
              <Button variant="outline" onClick={resetForm}>
                Reset
              </Button>
            </div>
          </CardContent>
          
          {predictedPrice !== null && (
            <CardFooter className="flex flex-col items-start border-t">
              <h3 className="text-lg font-semibold mb-1">Estimated Price:</h3>
              <div className="text-3xl font-bold text-airport-primary">
                ${predictedPrice.toFixed(2)}
              </div>
              <p className="text-sm text-muted-foreground mt-2 mb-4">
                This is an estimate based on historical data and current market trends.
                Actual prices may vary.
              </p>
              
              <Button 
                onClick={handleBooking} 
                className="w-full mt-2 bg-airport-primary hover:bg-airport-primary/90"
                disabled={isBooking}
              >
                {isBooking ? (
                  <>Processing booking...</>
                ) : (
                  <>
                    <Check className="mr-1 h-4 w-4" /> Book this flight now (${predictedPrice.toFixed(2)})
                  </>
                )}
              </Button>
            </CardFooter>
          )}
        </Card>
      </div>
    </Layout>
  );
};

export default FlightPricePrediction;
