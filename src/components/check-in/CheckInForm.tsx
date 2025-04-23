
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Flight } from '@/data/flightData';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { useUserAuth } from '@/hooks/useUserAuth';
import { CheckCircle, PlaneTakeoff, Calendar, MapPin, Users } from 'lucide-react';
import { motion } from 'framer-motion';

interface CheckInFormProps {
  validateCheckIn: (passengerName: string) => Flight | null;
  performCheckIn?: (passengerName: string) => { success: boolean, flight: Flight | null };
}

const CheckInForm: React.FC<CheckInFormProps> = ({ validateCheckIn, performCheckIn }) => {
  const [passengerName, setPassengerName] = useState('');
  const [checkedInFlight, setCheckedInFlight] = useState<Flight | null>(null);
  const { toast: uiToast } = useToast();
  const { user } = useUserAuth();

  // Pre-fill the name field if the user is logged in
  useEffect(() => {
    if (user) {
      setPassengerName(user.name || '');
    }
  }, [user]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!passengerName) {
      uiToast({
        title: "Error",
        description: "Please enter your name",
        variant: "destructive",
      });
      return;
    }

    // If performCheckIn is available, use it for actual check-in
    if (performCheckIn) {
      const result = performCheckIn(passengerName);
      if (result.success && result.flight) {
        setCheckedInFlight(result.flight);
        toast.success(`Check-in successful for flight ${result.flight.flightNumber}! Your boarding pass has been sent to your email.`);
        
        // Save checked-in passenger to local storage for persistence
        try {
          const storedPassengers = JSON.parse(localStorage.getItem('checkedInPassengers') || '[]');
          storedPassengers.push({
            flightId: result.flight.id,
            flightNumber: result.flight.flightNumber,
            passengerName: passengerName,
            checkInTime: new Date().toISOString()
          });
          localStorage.setItem('checkedInPassengers', JSON.stringify(storedPassengers));
          console.log("Saved passenger to database:", passengerName, "for flight:", result.flight.flightNumber);
        } catch (err) {
          console.error("Failed to save passenger to database:", err);
        }
        
        // Log the updated flight with checked-in passengers for debugging
        console.log("Check-in completed for:", passengerName);
        console.log("Updated flight details:", result.flight);
        console.log("Checked-in passengers:", result.flight.checkedInPassengers);
      } else {
        toast.error("Check-in failed. Please check your name.");
      }
    } else {
      // Fall back to just validation if performCheckIn isn't available
      const flight = validateCheckIn(passengerName);
      
      if (flight) {
        setCheckedInFlight(flight);
        uiToast({
          title: "Check-in Successful",
          description: `Your boarding pass for flight ${flight.flightNumber} has been sent to your email`,
        });
        console.log("Check-in validated for:", passengerName, "on flight:", flight.flightNumber);
      } else {
        uiToast({
          title: "Check-in Failed",
          description: "No matching flight found for your name.",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-lg text-gray-700 leading-relaxed">
          Web Check-in for passengers is available 48 hours to 60 minutes before domestic flight departure, and 24 hours to 75 minutes before international flight departure.
        </p>

        <p className="text-lg text-gray-700 leading-relaxed">
          Airport Check-in at counter is available 60 minutes before domestic flight departure, and 75 minutes before international flight departure.
        </p>

        <div className="flex items-start mt-6 bg-amber-50 p-4 rounded-lg border border-amber-100">
          <strong className="text-lg font-medium text-amber-800 mr-2">Please note:</strong>
          <p className="text-lg text-amber-700">Only personalized check-in assistance at the airport is applicable for codeshare bookings.</p>
        </div>
      </div>

      <div className="mt-10 bg-transparent shadow-none border-none">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Input
              placeholder="Enter Your Full Name"
              value={passengerName}
              onChange={(e) => setPassengerName(e.target.value)}
              className="h-14 text-lg bg-white border-gray-300 focus:border-airport-primary focus:ring-2 focus:ring-airport-primary/20 transition-all"
            />
          </div>
          <div className="flex justify-end">
            <Button 
              type="submit" 
              className="h-14 px-10 text-lg bg-airport-primary hover:bg-airport-primary/90 transition-all shadow-sm flex items-center gap-2"
            >
              <PlaneTakeoff className="h-5 w-5" />
              Check-in
            </Button>
          </div>
        </form>
      </div>
      
      {checkedInFlight && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-8 p-6 bg-green-50 border border-green-200 rounded-lg shadow-sm"
        >
          <div className="flex items-center gap-3 mb-4">
            <CheckCircle className="h-6 w-6 text-green-600" />
            <h3 className="text-xl font-bold text-green-800">Check-in Successful for Flight {checkedInFlight.flightNumber}!</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="flex items-center gap-3">
              <PlaneTakeoff className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Flight</p>
                <p className="text-lg font-medium text-gray-800">{checkedInFlight.flightNumber}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Route</p>
                <p className="text-lg font-medium text-gray-800">{checkedInFlight.origin} to {checkedInFlight.destination}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Departure</p>
                <p className="text-lg font-medium text-gray-800">{format(new Date(checkedInFlight.departureTime), "MMM d, h:mm a")}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Users className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Passenger</p>
                <p className="text-lg font-medium text-gray-800">{passengerName}</p>
              </div>
            </div>
          </div>
          <p className="mt-6 text-green-700 flex items-center gap-2 bg-white p-3 rounded-lg border border-green-100 shadow-sm">
            <CheckCircle className="h-5 w-5" />
            Your boarding pass has been sent to {checkedInFlight.passengerEmail}
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default CheckInForm;
