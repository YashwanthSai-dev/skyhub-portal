
import React, { useState, useMemo } from 'react';
import { format, addMonths, subMonths } from 'date-fns';
import { CalendarDays, ChevronLeft, ChevronRight, Plane } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { useFlightData } from '@/data/flightData';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const Schedule = () => {
  const navigate = useNavigate();
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const { flights } = useFlightData();

  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const handleSelect = (date: Date | undefined) => {
    setSelectedDate(date);
  };

  // Filter flights for the selected date
  const flightsForSelectedDate = useMemo(() => {
    if (!selectedDate) return [];
    
    const selectedDateStr = format(selectedDate, 'yyyy-MM-dd');
    
    return flights.filter(flight => {
      const flightDate = format(new Date(flight.departureTime), 'yyyy-MM-dd');
      return flightDate === selectedDateStr;
    });
  }, [selectedDate, flights]);

  const handleBookFlight = (flightId: string) => {
    // Navigate to booking page with the selected flight ID
    navigate(`/booking?flightId=${flightId}`);
  };

  return (
    <Layout>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Schedule</h1>
          <div className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-muted-foreground" />
            <span className="text-muted-foreground">
              {format(new Date(), 'EEEE, MMMM d, yyyy')}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-1">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle>Calendar</CardTitle>
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={prevMonth}
                  aria-label="Previous month"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="min-w-[120px] text-center font-medium">
                  {format(currentMonth, 'MMMM yyyy')}
                </div>
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={nextMonth}
                  aria-label="Next month"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="p-3">
                <Calendar 
                  mode="single"
                  selected={selectedDate}
                  onSelect={handleSelect}
                  month={currentMonth}
                  showOutsideDays
                  className="rounded-md border pointer-events-auto"
                />
              </div>
            </CardContent>
          </Card>
          
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>
                Flights for {selectedDate ? format(selectedDate, 'MMMM d, yyyy') : 'Today'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {flightsForSelectedDate.length > 0 ? (
                <div className="space-y-4">
                  {flightsForSelectedDate.map(flight => (
                    <div 
                      key={flight.id}
                      className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border rounded-md hover:bg-gray-50"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-full">
                          <Plane className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <div className="font-medium">{flight.flightNumber}</div>
                          <div className="text-sm text-gray-500">
                            {flight.origin} → {flight.destination}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row gap-4 mt-3 sm:mt-0 w-full sm:w-auto">
                        <div className="text-sm">
                          <div className="text-gray-500">Departure</div>
                          <div>{format(new Date(flight.departureTime), 'h:mm a')}</div>
                        </div>
                        <div className="text-sm">
                          <div className="text-gray-500">Arrival</div>
                          <div>{format(new Date(flight.arrivalTime), 'h:mm a')}</div>
                        </div>
                        <div className="text-sm">
                          <div className="text-gray-500">Status</div>
                          <div className={`${
                            flight.status === 'SCHEDULED' ? 'text-blue-600' : 
                            flight.status === 'BOARDING' ? 'text-orange-600' :
                            flight.status === 'DEPARTED' ? 'text-purple-600' :
                            flight.status === 'ARRIVED' ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {flight.status}
                          </div>
                        </div>
                        
                        <Button 
                          size="sm" 
                          className="mt-2 sm:mt-0"
                          onClick={() => handleBookFlight(flight.id)}
                        >
                          Book Flight
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  {selectedDate ? 'No flights available for the selected date' : 'Select a date to view flights'}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Schedule;
