
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Flight } from '@/data/flightData';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format, addHours, parseISO } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface FlightFormProps {
  flight?: Flight;
  onSubmit: (flightData: Partial<Flight>) => void;
  onCancel: () => void;
}

const FlightForm: React.FC<FlightFormProps> = ({ flight, onSubmit, onCancel }) => {
  const [flightData, setFlightData] = useState<Partial<Flight>>({
    flightNumber: '',
    origin: '',
    destination: '',
    departureTime: new Date().toISOString(),
    arrivalTime: addHours(new Date(), 2).toISOString(),
    status: 'SCHEDULED',
  });
  
  const [departureDate, setDepartureDate] = useState<Date | undefined>(new Date());
  const [departureTime, setDepartureTime] = useState("10:00");
  const [arrivalTime, setArrivalTime] = useState("12:00");
  
  useEffect(() => {
    if (flight) {
      setFlightData({
        flightNumber: flight.flightNumber,
        origin: flight.origin,
        destination: flight.destination,
        departureTime: flight.departureTime,
        arrivalTime: flight.arrivalTime,
        status: flight.status,
      });
      
      // Parse times for the form
      const depDate = new Date(flight.departureTime);
      setDepartureDate(depDate);
      setDepartureTime(format(depDate, "HH:mm"));
      setArrivalTime(format(new Date(flight.arrivalTime), "HH:mm"));
    }
  }, [flight]);
  
  const handleInputChange = (field: keyof Flight, value: string) => {
    setFlightData(prev => ({ ...prev, [field]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!departureDate) {
      alert("Please select a departure date");
      return;
    }
    
    // Combine date and time for departure
    const depDate = new Date(departureDate);
    const [depHours, depMinutes] = departureTime.split(':').map(Number);
    depDate.setHours(depHours, depMinutes);
    
    // Calculate arrival date based on departure and arrival time
    const arrDate = new Date(depDate);
    const [arrHours, arrMinutes] = arrivalTime.split(':').map(Number);
    arrDate.setHours(arrHours, arrMinutes);
    
    // If arrival time is earlier than departure, assume it's the next day
    if (arrDate < depDate) {
      arrDate.setDate(arrDate.getDate() + 1);
    }
    
    const updatedFlightData = {
      ...flightData,
      departureTime: depDate.toISOString(),
      arrivalTime: arrDate.toISOString(),
    };
    
    onSubmit(updatedFlightData);
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="flightNumber">Flight Number</Label>
        <Input
          id="flightNumber"
          value={flightData.flightNumber}
          onChange={(e) => handleInputChange('flightNumber', e.target.value)}
          placeholder="e.g., SH123"
          required
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="origin">Origin</Label>
          <Input
            id="origin"
            value={flightData.origin}
            onChange={(e) => handleInputChange('origin', e.target.value)}
            placeholder="e.g., New York"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="destination">Destination</Label>
          <Input
            id="destination"
            value={flightData.destination}
            onChange={(e) => handleInputChange('destination', e.target.value)}
            placeholder="e.g., London"
            required
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label>Departure Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-full justify-start text-left font-normal",
                !departureDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {departureDate ? format(departureDate, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={departureDate}
              onSelect={setDepartureDate}
              initialFocus
              className="pointer-events-auto"
            />
          </PopoverContent>
        </Popover>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="departureTime">Departure Time</Label>
          <Input
            id="departureTime"
            type="time"
            value={departureTime}
            onChange={(e) => setDepartureTime(e.target.value)}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="arrivalTime">Arrival Time</Label>
          <Input
            id="arrivalTime"
            type="time"
            value={arrivalTime}
            onChange={(e) => setArrivalTime(e.target.value)}
            required
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="status">Status</Label>
        <Select 
          value={flightData.status} 
          onValueChange={(value: 'SCHEDULED' | 'BOARDING' | 'DEPARTED' | 'ARRIVED' | 'CANCELLED') => 
            handleInputChange('status', value)
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="SCHEDULED">SCHEDULED</SelectItem>
            <SelectItem value="BOARDING">BOARDING</SelectItem>
            <SelectItem value="DEPARTED">DEPARTED</SelectItem>
            <SelectItem value="ARRIVED">ARRIVED</SelectItem>
            <SelectItem value="CANCELLED">CANCELLED</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {flight ? 'Update Flight' : 'Add Flight'}
        </Button>
      </div>
    </form>
  );
};

export default FlightForm;
