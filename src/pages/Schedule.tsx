
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { format, addMonths, subMonths, getHours } from 'date-fns';
import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { useFlightData } from '@/data/flightData';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { StatusBadge } from '@/components/schedule/StatusBadge';
import { AirlineLogo } from '@/components/schedule/AirlineLogo';
import { FlightFilters } from '@/components/schedule/FlightFilters';
import { cn } from '@/lib/utils';

const getTimeOfDay = (dateStr: string) => {
  const hour = getHours(new Date(dateStr));
  if (hour >= 5 && hour < 12) return "morning";
  if (hour >= 12 && hour < 17) return "afternoon";
  if (hour >= 17 && hour < 21) return "evening";
  return "night";
};

const Schedule = () => {
  const navigate = useNavigate();
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const { flights } = useFlightData();

  // NEW: Filters state
  const [filter, setFilter] = useState({ city: '', airline: '', timeOfDay: '' });

  // For calendar date ripple
  const [ripplePosition, setRipplePosition] = useState<{x: number, y: number} | null>(null);
  const [animatingDate, setAnimatingDate] = useState<Date | null>(null);

  // Compute available departure cities/airlines for filter dropdowns
  const departureCities = useMemo(
    () => Array.from(new Set(flights.map(f => f.origin))).sort(),
    [flights]
  );
  const airlines = useMemo(
    () => Array.from(new Set(flights.map(f => f.airline))).sort(),
    [flights]
  );

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  // Handle calendar day selection with bounce/ripple
  const handleSelect = (date: Date | undefined, e?: React.MouseEvent) => {
    setSelectedDate(date);
    setAnimatingDate(date ?? null);
    if (e) {
      const rect = (e.target as HTMLElement).getBoundingClientRect();
      setRipplePosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
      setTimeout(() => setRipplePosition(null), 400);
    }
    setTimeout(() => setAnimatingDate(null), 380);
  };

  // Filter flights for the selected date and current filters
  const flightsForSelectedDate = useMemo(() => {
    if (!selectedDate) return [];
    const selectedDateStr = format(selectedDate, 'yyyy-MM-dd');
    return flights.filter(flight => {
      const flightDate = format(new Date(flight.departureTime), 'yyyy-MM-dd');
      const matchesDate = flightDate === selectedDateStr;
      const matchesCity = !filter.city || flight.origin === filter.city;
      const matchesAirline = !filter.airline || flight.airline === filter.airline;
      const matchesTime = !filter.timeOfDay || getTimeOfDay(flight.departureTime) === filter.timeOfDay;
      return matchesDate && matchesCity && matchesAirline && matchesTime;
    });
  }, [selectedDate, flights, filter]);

  const handleBookFlight = (flightId: string) => {
    navigate(`/booking?flightId=${flightId}`);
  };

  // Flight card animation on scroll (fade/slide-in)
  const flightListRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    // Animate cards when they come into view
    const node = flightListRef.current;
    if (!node) return;
    const children = Array.from(node.children) as HTMLElement[];
    const observer = new window.IntersectionObserver(
      entries => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fade-in");
            entry.target.classList.add("animate-slide-in");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14 }
    );
    children.forEach(child => observer.observe(child));
    return () => observer.disconnect();
  }, [flightsForSelectedDate, filter, selectedDate]);

  return (
    <Layout>
      <div className="flex flex-col gap-6 max-w-screen-xl mx-auto font-sans">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 pb-1">
          <h1 className="text-3xl font-bold tracking-tight font-sans">Flight Schedule</h1>
          <div className="flex items-center gap-2 ">
            <CalendarDays className="h-5 w-5 text-muted-foreground" />
            <span className="text-muted-foreground font-medium">{format(new Date(), 'EEEE, MMMM d, yyyy')}</span>
          </div>
        </div>
        {/* FILTERS */}
        <FlightFilters
          departureCities={departureCities}
          airlines={airlines}
          filter={filter}
          onFilterChange={(key, value) =>
            setFilter((cur) => ({ ...cur, [key]: value }))
          }
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-7">
          <Card className="lg:col-span-1 bg-white/90 dark:bg-background rounded-2xl shadow-lg border-0">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="font-semibold text-lg">Calendar</CardTitle>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={prevMonth}
                  aria-label="Previous month"
                  className="bg-white/90 dark:bg-background rounded-full shadow transition-transform hover:scale-105"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="min-w-[120px] text-center font-semibold tracking-tight">
                  {format(currentMonth, 'MMMM yyyy')}
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={nextMonth}
                  aria-label="Next month"
                  className="bg-white/90 dark:bg-background rounded-full shadow transition-transform hover:scale-105"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-xl overflow-hidden shadow-xl bg-white/90 dark:bg-background border relative px-2 py-2">
                {/* Custom calendar render for shadows & hover*/}
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date, e) => handleSelect(date, e as any)}
                  month={currentMonth}
                  showOutsideDays
                  className="rounded-xl border-none pointer-events-auto bg-transparent"
                  classNames={{
                    day: cn(
                      "relative rounded-full bg-transparent font-medium text-base h-10 w-10 mx-auto flex items-center justify-center transition",
                      "hover:bg-blue-100/70 dark:hover:bg-blue-700/30",
                      "cursor-pointer focus:outline-none",
                    ),
                    day_selected: cn(
                      "relative bg-airport-primary text-white hover:bg-airport-secondary scale-110 shadow-lg z-10",
                      "after:absolute after:inset-0 after:rounded-full after:animate-pulse after:bg-primary/30"
                    ),
                    day_today: "ring-2 ring-primary ring-offset-2",
                  }}
                  components={{
                    Day: ({ date, ...props }) => {
                      const isSelected =
                        selectedDate &&
                        format(date, "yyyy-MM-dd") ===
                          format(selectedDate, "yyyy-MM-dd");
                      return (
                        <button
                          {...props}
                          className={cn(
                            "relative rounded-full h-10 w-10 flex items-center justify-center font-medium transition",
                            props.selected
                              ? "bg-airport-primary text-white scale-110 shadow-xl"
                              : "hover:bg-blue-100/80 dark:hover:bg-blue-700/40",
                            "focus:outline-none"
                          )}
                          style={{
                            boxShadow: isSelected
                              ? "0 2px 12px 0 #0A246329"
                              : undefined,
                          }}
                          tabIndex={0}
                          aria-label={date.toDateString()}
                          onClick={(e) => handleSelect(date, e)}
                        >
                          {isSelected && animatingDate && format(date, "yyyy-MM-dd") === format(animatingDate, "yyyy-MM-dd") && (
                            <span
                              className="absolute left-0 top-0 h-full w-full rounded-full z-20 pointer-events-none"
                              style={{
                                background:
                                  "radial-gradient(circle, rgba(14,165,233,0.16) 48%, transparent 80%)",
                                animation: "scale-in 0.38s cubic-bezier(0.78,-0.33,0.18,1.5)",
                              }}
                            />
                          )}
                          <span className={isSelected ? "relative z-30" : ""}>
                            {format(date, "d")}
                          </span>
                        </button>
                      );
                    },
                  }}
                />
              </div>
            </CardContent>
          </Card>

          <div className="lg:col-span-2 flex flex-col gap-6">
            <Card className="bg-white/90 dark:bg-background rounded-2xl shadow-lg border-0">
              <CardHeader>
                <CardTitle className="font-semibold text-lg">
                  Flights for {selectedDate ? format(selectedDate, 'MMMM d, yyyy') : 'Today'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-5" ref={flightListRef}>
                  {flightsForSelectedDate.length > 0 ? (
                    flightsForSelectedDate.map(flight => (
                      <div
                        key={flight.id}
                        className={cn(
                          "flex flex-col sm:flex-row justify-between items-start sm:items-center px-4 py-4 bg-white dark:bg-black/40 rounded-2xl shadow-md border border-gray-100 dark:border-gray-800 hover:shadow-xl transition-all duration-300 hover:scale-[1.025] group",
                          "relative overflow-hidden will-change-transform"
                        )}
                        style={{ minHeight: 96 }}
                      >
                        <div className="flex items-center gap-4 flex-1 min-w-0">
                          <AirlineLogo airline={flight.airline} />
                          <div className="ml-2 min-w-0">
                            <div className="font-semibold text-base sm:text-lg truncate">{flight.flightNumber} <span className="text-gray-400 font-normal">({flight.airline})</span></div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {flight.origin} <span>&rarr;</span> {flight.destination}
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3 mt-3 sm:mt-0 items-center">
                          <div className="text-xs flex flex-col items-start">
                            <span className="text-gray-500 dark:text-gray-400">Departure</span>
                            <span className="font-medium">{format(new Date(flight.departureTime), 'h:mm a')}</span>
                          </div>
                          <div className="text-xs flex flex-col items-start">
                            <span className="text-gray-500 dark:text-gray-400">Arrival</span>
                            <span className="font-medium">{format(new Date(flight.arrivalTime), 'h:mm a')}</span>
                          </div>
                          <div>
                            <StatusBadge status={flight.status} />
                          </div>
                          <Button
                            size="sm"
                            className={cn(
                              "font-bold px-4 py-2 text-white rounded-md shadow-lg transition-all border-0 bg-airport-primary",
                              "hover:scale-105 hover:shadow-xl hover:bg-airport-secondary hover:ring-2 hover:ring-blue-200 focus-visible:ring focus-visible:ring-offset-2"
                            )}
                            style={{
                              boxShadow: "0 2px 12px 0 #3E92CC33",
                            }}
                            onClick={() => handleBookFlight(flight.id)}
                          >
                            Book Flight
                          </Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12 text-gray-500 dark:text-gray-400 text-lg">
                      {selectedDate
                        ? 'No flights available for the selected date'
                        : 'Select a date to view flights'}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Schedule;
