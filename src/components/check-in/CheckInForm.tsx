
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Flight } from '@/data/flightData';
import { format } from 'date-fns';
import { toast } from 'sonner';

interface CheckInFormProps {
  validateCheckIn: (bookingReference: string, emailOrName: string) => Flight | null;
  performCheckIn?: (bookingReference: string, emailOrName: string) => { success: boolean, flight: Flight | null };
}

const CheckInForm: React.FC<CheckInFormProps> = ({ validateCheckIn, performCheckIn }) => {
  const [bookingReference, setBookingReference] = useState('');
  const [emailOrName, setEmailOrName] = useState('');
  const [checkedInFlight, setCheckedInFlight] = useState<Flight | null>(null);
  const { toast: uiToast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!bookingReference || !emailOrName) {
      uiToast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    // If performCheckIn is available, use it for actual check-in
    if (performCheckIn) {
      const result = performCheckIn(bookingReference, emailOrName);
      if (result.success && result.flight) {
        setCheckedInFlight(result.flight);
        toast.success("Check-in successful! Your boarding pass has been sent to your email.");
      } else {
        toast.error("Check-in failed. Please check your booking reference and email/name.");
      }
    } else {
      // Fall back to just validation if performCheckIn isn't available
      const flight = validateCheckIn(bookingReference, emailOrName);
      
      if (flight) {
        setCheckedInFlight(flight);
        uiToast({
          title: "Check-in Successful",
          description: `Your boarding pass for flight ${flight.flightNumber} has been sent to your email`,
        });
      } else {
        uiToast({
          title: "Check-in Failed",
          description: "No matching flight found. Please check your booking reference and email/name.",
          variant: "destructive",
        });
      }
    }
  };

  return (
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

      <div className="mt-10 bg-transparent shadow-none border-none">
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
      </div>
      
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
              <p className="text-lg font-medium">{format(new Date(checkedInFlight.departureTime), "MMM d, h:mm a")}</p>
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
  );
};

export default CheckInForm;
