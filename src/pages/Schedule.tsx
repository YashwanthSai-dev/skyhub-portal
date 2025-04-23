
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { format, addMonths, subMonths, getHours } from 'date-fns';
import { CalendarDays, ChevronLeft, ChevronRight, Filter, ArrowRight, X, RefreshCcw } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { useFlightData } from '@/data/flightData';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { StatusBadge } from '@/components/schedule/StatusBadge';
import { AirlineLogo } from '@/components/schedule/AirlineLogo';
import { cn } from '@/lib/utils';
import { FlightDetailsTooltip } from '@/components/schedule/FlightDetailsTooltip';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';

const getTimeOfDay = (dateStr: string) => {
  const hour = getHours(new Date(dateStr));
  if (hour >= 5 && hour < 12) return "morning";
  if (hour >= 12 && hour < 17) return "afternoon";
  if (hour >= 17 && hour < 21) return "evening";
  return "night";
};

// For demonstration: flights with id in this list are shown as "booked".
// In real app, would come from backend/user data.
const bookedFlightIds = ["SH100", "SH103", "SH107"];

const timeOfDayOptions = [
  { value: "", label: "All Times" },
  { value: "morning", label: "Morning (5AM-12PM)" },
  { value: "afternoon", label: "Afternoon (12PM-5PM)" },
  { value: "evening", label: "Evening (5PM-9PM)" },
  { value: "night", label: "Night (9PM-5AM)" },
];

const stopsOptions = [
  { value: "", label: "All Stops" },
  { value: "0", label: "Nonstop" },
  { value: "1", label: "1 Stop" },
  { value: "2+", label: "2+ Stops" }
];

const Schedule = () => {
  const navigate = useNavigate();
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const { flights } = useFlightData();

  // Filters state: add stops filter.
  const [filter, setFilter] = useState({ airline: '', timeOfDay: '', stops: '' });
  // For badge animation: track which flight's status just changed.
  const [animatedBadgeFlight, setAnimatedBadgeFlight] = useState<string | null>(null);

  // For calendar date ripple
  const [ripplePosition, setRipplePosition] = useState<{x: number, y: number} | null>(null);
  const [animatingDate, setAnimatingDate] = useState<Date | null>(null);

  // For mobile swipe
  const flightListContainerRef = useRef<HTMLDivElement>(null);

  // Compute available airlines
  const airlines = useMemo(
    () => Array.from(new Set(flights.map(f => f.airline ?? "Unknown"))).filter(a => a !== "Unknown").sort(),
    [flights]
  );

  // Compute stops (for demo, assume stops = random 0,1,2+; real app would use stops property)
  const getStops = (flightId: string) => {
    if (flightId.endsWith("0") || flightId.endsWith("5")) return 0;
    if (flightId.endsWith("1") || flightId.endsWith("4")) return 1;
    return 2;
  };

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  // Handle calendar day selection
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
      const matchesAirline = !filter.airline || (flight.airline ?? "Unknown") === filter.airline;
      const matchesTime = !filter.timeOfDay || getTimeOfDay(flight.departureTime) === filter.timeOfDay;
      const stopsCount = getStops(flight.id);
      const matchesStops =
        !filter.stops ||
        (filter.stops === "2+" ? stopsCount >= 2 : stopsCount.toString() === filter.stops);
      return matchesDate && matchesAirline && matchesTime && matchesStops;
    });
  }, [selectedDate, flights, filter]);

  const handleBookFlight = (flightId: string) => {
    toast("Flight booking page launching...", { description: "Book your flight securely." });
    navigate(`/booking?flightId=${flightId}`);
  };

  // Animate badges: when flight list changes, bounce badge for updated status
  useEffect(() => {
    if (flightsForSelectedDate.length > 0) {
      const timer = setTimeout(() => setAnimatedBadgeFlight(null), 800);
      setAnimatedBadgeFlight(flightsForSelectedDate[0].id);
      return () => clearTimeout(timer);
    }
  }, [JSON.stringify(flightsForSelectedDate.map(f => f.status))]); // Detect change by status list

  // Animate cards on scroll (fade/slide-in)
  const flightListRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
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
      { threshold: 0.12 }
    );
    children.forEach(child => observer.observe(child));
    return () => observer.disconnect();
  }, [flightsForSelectedDate, filter, selectedDate]);

  // Responsive: swipe cards container horizontally on mobile
  useEffect(() => {
    const el = flightListContainerRef.current;
    if (!el) return;
    let isDown = false;
    let startX = 0;
    let scrollLeft = 0;

    const mouseDown = (e: TouchEvent | MouseEvent) => {
      isDown = true;
      startX = 'touches' in e ? e.touches[0].pageX : (e as MouseEvent).pageX;
      scrollLeft = el.scrollLeft;
    };
    const mouseMove = (e: TouchEvent | MouseEvent) => {
      if (!isDown) return;
      const x = 'touches' in e
        ? e.touches[0].pageX
        : (e as MouseEvent).pageX;
      const walk = (startX - x) * 1.1; // swipe sensitivity
      el.scrollLeft = scrollLeft + walk;
    };
    const mouseUp = () => { isDown = false; };

    el.addEventListener('mousedown', mouseDown as any);
    el.addEventListener('touchstart', mouseDown as any);
    el.addEventListener('mousemove', mouseMove as any);
    el.addEventListener('touchmove', mouseMove as any);
    el.addEventListener('mouseup', mouseUp as any);
    el.addEventListener('touchend', mouseUp as any);

    return () => {
      el.removeEventListener('mousedown', mouseDown as any);
      el.removeEventListener('touchstart', mouseDown as any);
      el.removeEventListener('mousemove', mouseMove as any);
      el.removeEventListener('touchmove', mouseMove as any);
      el.removeEventListener('mouseup', mouseUp as any);
      el.removeEventListener('touchend', mouseUp as any);
    };
  }, []);

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
        {/* FILTER BAR */}
        <Card className="mb-1 bg-white/90 dark:bg-background rounded-xl shadow-md border-0 p-3 flex flex-col md:flex-row gap-3 items-center">
          <div className="flex items-center gap-2 w-full md:w-auto">
            <Filter className="w-4 h-4 text-blue-400" />
            <div className="hidden md:block font-semibold text-airport-primary mr-2">Filter Flights:</div>
          </div>
          <Select
            value={filter.airline}
            onValueChange={val => setFilter(cur => ({ ...cur, airline: val }))}
          >
            <SelectTrigger className="w-[160px] bg-white dark:bg-background rounded-md border shadow">
              <SelectValue placeholder="Airline" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Airlines</SelectItem>
              {airlines.map(air => (
                <SelectItem key={air} value={air}>{air}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={filter.timeOfDay}
            onValueChange={val => setFilter(cur => ({ ...cur, timeOfDay: val }))}
          >
            <SelectTrigger className="w-[140px] bg-white dark:bg-background rounded-md border shadow">
              <SelectValue placeholder="Time of Day" />
            </SelectTrigger>
            <SelectContent>
              {timeOfDayOptions.map(({ value, label }) => (
                <SelectItem key={value} value={value}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={filter.stops}
            onValueChange={val => setFilter(cur => ({ ...cur, stops: val }))}
          >
            <SelectTrigger className="w-[130px] bg-white dark:bg-background rounded-md border shadow">
              <SelectValue placeholder="# Stops"/>
            </SelectTrigger>
            <SelectContent>
              {stopsOptions.map(({ value, label }) => (
                <SelectItem key={value} value={value}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {/* Clear filters */}
          <Button
            variant="ghost"
            size="sm"
            className="ml-2 text-xs text-gray-500 hover:bg-gray-100"
            onClick={() => setFilter({ airline: '', timeOfDay: '', stops: '' })}
          ><RefreshCcw className="w-4 h-4 mr-1" />Reset</Button>
        </Card>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-7">
          {/* Date Picker */}
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
                      "relative bg-airport-primary text-white hover:bg-airport-secondary scale-110 shadow-lg z-10 font-bold",
                      "after:absolute after:inset-0 after:rounded-full after:animate-pulse after:bg-primary/30"
                    ),
                    day_today: "ring-2 ring-primary ring-offset-2",
                  }}
                  components={{
                    Day: ({ date, ...props }: any) => {
                      const isSelected =
                        selectedDate &&
                        format(date, "yyyy-MM-dd") ===
                          format(selectedDate, "yyyy-MM-dd");
                      return (
                        <button
                          {...props}
                          className={cn(
                            "relative rounded-full h-10 w-10 flex items-center justify-center font-medium transition",
                            props.className?.includes("selected")
                              ? "bg-airport-primary text-white scale-110 shadow-xl font-bold"
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
          {/* Flight List */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <Card className="bg-white/90 dark:bg-background rounded-2xl shadow-lg border-0">
              <CardHeader>
                <CardTitle className="font-semibold text-lg">
                  Flights for {selectedDate ? format(selectedDate, 'MMMM d, yyyy') : 'Today'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  className="space-y-5 md:space-y-6 overflow-x-auto"
                  ref={flightListRef}
                >
                  {flightsForSelectedDate.length > 0 ? (
                    <div
                      className="flex flex-col gap-5 md:gap-6 lg:gap-7"
                      ref={flightListContainerRef}
                      style={{ scrollSnapType: 'x mandatory' }}
                    >
                      {flightsForSelectedDate.map(flight => {
                        const isBooked = bookedFlightIds.includes(flight.id);
                        return (
                          <div
                            key={flight.id}
                            className={cn(
                              "flex flex-col sm:flex-row justify-between items-start sm:items-center px-4 py-4 bg-white dark:bg-black/40 rounded-2xl shadow-md border border-gray-100 dark:border-gray-800 hover:shadow-xl transition-all duration-300 hover:scale-[1.025] group will-change-transform",
                              "relative",
                              // Add swipeable effect and enlarged tap on mobile
                              "md:scroll-snap-align-none scroll-snap-align-center"
                            )}
                            style={{
                              minHeight: 96,
                              touchAction: "pan-x",
                            }}
                          >
                            <div className="flex items-center gap-4 flex-1 min-w-0 w-full">
                              <AirlineLogo airline={flight.airline ?? "Unknown"} />
                              <div className="ml-2 min-w-0">
                                <div className="font-semibold text-base sm:text-lg truncate">
                                  {flight.flightNumber}
                                  <span className="ml-2 text-gray-400 font-normal">({flight.airline ?? "Unknown"})</span>
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap overflow-x-auto max-w-[200px] px-1">
                                  {flight.origin} <ArrowRight className="inline w-4 h-4 mx-0.5 -mt-1 text-blue-500" /> {flight.destination}
                                  <FlightDetailsTooltip flight={flight} />
                                </div>
                              </div>
                            </div>
                            {/* Mobile stacked controls */}
                            <div className="flex flex-row flex-wrap sm:flex-row gap-2 mt-3 sm:mt-0 items-center w-full sm:w-auto sm:justify-end justify-between">
                              <div className="text-xs flex flex-col items-start min-w-[75px]">
                                <span className="text-gray-500 dark:text-gray-400">Departure</span>
                                <span className="font-medium">{format(new Date(flight.departureTime), 'h:mm a')}</span>
                              </div>
                              <div className="text-xs flex flex-col items-start min-w-[75px]">
                                <span className="text-gray-500 dark:text-gray-400">Arrival</span>
                                <span className="font-medium">{format(new Date(flight.arrivalTime), 'h:mm a')}</span>
                              </div>
                              <div>
                                <StatusBadge
                                  status={flight.status}
                                  animated={animatedBadgeFlight === flight.id}
                                />
                              </div>
                              <Button
                                size="sm"
                                className={cn(
                                  "font-bold px-4 py-2 text-white rounded-md shadow-lg transition-all border-0 bg-airport-primary",
                                  "hover:scale-105 hover:shadow-xl hover:bg-airport-secondary hover:ring-2 hover:ring-blue-200 focus-visible:ring focus-visible:ring-offset-2",
                                  "min-w-[110px] md:min-w-[120px]",
                                  "md:text-base text-sm"
                                )}
                                style={{
                                  boxShadow: "0 2px 12px 0 #3E92CC33",
                                }}
                                onClick={() => handleBookFlight(flight.id)}
                                tabIndex={0}
                              >
                                Book Flight
                              </Button>
                              {isBooked && (
                                <div className="flex gap-2 ml-3">
                                  <button
                                    className="p-2 rounded-full bg-blue-100 text-blue-700 hover:bg-blue-200 transition"
                                    title="Quick Reschedule"
                                    aria-label="Quick Reschedule"
                                    tabIndex={0}
                                    onClick={() => toast("Reschedule feature coming soon!")}
                                  >
                                    <RefreshCcw className="w-4 h-4" />
                                  </button>
                                  <button
                                    className="p-2 rounded-full bg-red-100 text-red-700 hover:bg-red-200 transition"
                                    title="Cancel Booking"
                                    aria-label="Cancel Booking"
                                    tabIndex={0}
                                    onClick={() => toast("Cancel booking feature coming soon!")}
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
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
