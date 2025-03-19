
import React, { useState } from 'react';
import { format, addMonths, subMonths } from 'date-fns';
import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';

const Schedule = () => {
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const handleSelect = (date: Date | undefined) => {
    setSelectedDate(date);
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

        <Card>
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
            
            {selectedDate && (
              <div className="mt-6 border-t pt-4">
                <h3 className="font-medium mb-3">
                  Events for {format(selectedDate, 'MMMM d, yyyy')}
                </h3>
                <div className="space-y-2">
                  <div className="p-3 border rounded-md bg-muted/30">
                    <p className="font-medium">No events scheduled</p>
                    <p className="text-sm text-muted-foreground">
                      Select a date to view or add events
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Schedule;
