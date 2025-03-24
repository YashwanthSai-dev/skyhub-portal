
import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const CheckIn = () => {
  const [bookingReference, setBookingReference] = useState('');
  const [emailOrName, setEmailOrName] = useState('');
  const { toast } = useToast();

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

    // This would normally call an API to check in the passenger
    toast({
      title: "Check-in Successful",
      description: "Your boarding pass has been sent to your email",
    });
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

          <div className="space-y-6 max-w-4xl">
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
        </div>
      </div>
    </Layout>
  );
};

export default CheckIn;
