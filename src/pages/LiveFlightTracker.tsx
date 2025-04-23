
import React, { useState, useEffect, useRef } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader, Search, Plane, Info } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { StatusBadge } from '@/components/schedule/StatusBadge';
import { FlightDetailsTooltip } from '@/components/schedule/FlightDetailsTooltip';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// Temporarily use a demo key - in production this should come from environment variables
// or user input if not using a backend service like Supabase
const MAPBOX_TOKEN = 'pk.eyJ1IjoiZGVtby1hY2NvdW50IiwiYSI6ImNsM3E3NG9xcjBrenczY3A3Y3pvZ2F6YXAifQ.YeCB5jIteRgxRuGMrLCfNw';

// Temporary interface for flight data
interface Flight {
  id: string;
  callsign: string;
  origin: string;
  destination: string;
  altitude: number;
  speed: number;
  heading: number;
  latitude: number;
  longitude: number;
  status: string;
  airline: string;
  estArrivalTime: string;
  flightNumber: string;
}

// Demo flight data generator
const generateDemoFlights = (count: number = 15): Flight[] => {
  const airlines = ['American Airlines', 'Delta', 'United', 'Emirates', 'Lufthansa', 'British Airways'];
  const airports = ['JFK', 'LAX', 'ORD', 'LHR', 'CDG', 'DXB', 'HND', 'SIN'];
  const statuses = ['EN_ROUTE', 'DELAYED', 'LANDED', 'BOARDING', 'SCHEDULED'];
  
  return Array.from({ length: count }).map((_, i) => {
    const airline = airlines[Math.floor(Math.random() * airlines.length)];
    const origin = airports[Math.floor(Math.random() * airports.length)];
    let destination;
    do {
      destination = airports[Math.floor(Math.random() * airports.length)];
    } while (destination === origin);
    
    const flightNumber = `${airline.substring(0, 2).toUpperCase()}${100 + Math.floor(Math.random() * 900)}`;
    
    return {
      id: `flight-${i}`,
      callsign: `${airline.substring(0, 3).toUpperCase()}${100 + Math.floor(Math.random() * 900)}`,
      origin,
      destination,
      altitude: Math.floor(10000 + Math.random() * 30000),
      speed: Math.floor(400 + Math.random() * 200),
      heading: Math.floor(Math.random() * 360),
      latitude: Math.random() * 70 * (Math.random() > 0.5 ? 1 : -1) + 10,
      longitude: Math.random() * 170 * (Math.random() > 0.5 ? 1 : -1),
      status: statuses[Math.floor(Math.random() * statuses.length)],
      airline,
      estArrivalTime: new Date(Date.now() + Math.random() * 10800000).toISOString(),
      flightNumber
    };
  });
};

// In a real app, this would be an API call to a flight tracking service
const fetchFlights = async (): Promise<Flight[]> => {
  // Simulate network request
  await new Promise(resolve => setTimeout(resolve, 800));
  return generateDemoFlights(25);
};

// Filter flights based on search query
const filterFlights = (flights: Flight[], query: string): Flight[] => {
  if (!query.trim()) return flights;
  
  const lowercaseQuery = query.toLowerCase();
  return flights.filter(flight => 
    flight.flightNumber.toLowerCase().includes(lowercaseQuery) || 
    flight.origin.toLowerCase().includes(lowercaseQuery) || 
    flight.destination.toLowerCase().includes(lowercaseQuery) ||
    flight.airline.toLowerCase().includes(lowercaseQuery)
  );
};

// Format altitude to include commas and ft
const formatAltitude = (alt: number): string => {
  return `${alt.toLocaleString()} ft`;
};

// Format speed to include mph
const formatSpeed = (speed: number): string => {
  return `${speed} mph`;
};

const LiveFlightTracker = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<{ [id: string]: mapboxgl.Marker }>({});
  
  // Fetch flights
  const { data: flights = [], isLoading, error } = useQuery({
    queryKey: ['flights'],
    queryFn: fetchFlights,
    refetchInterval: 60000, // Refetch every minute
  });
  
  // Filter flights based on search query
  const filteredFlights = filterFlights(flights, searchQuery);
  
  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;
    
    mapboxgl.accessToken = MAPBOX_TOKEN;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [0, 20],
      zoom: 1.5,
    });
    
    // Add navigation controls
    map.current.addControl(
      new mapboxgl.NavigationControl(),
      'top-right'
    );
    
    map.current.on('load', () => {
      // Add any map layers here
      toast.success('Flight tracker initialized successfully');
    });
    
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);
  
  // Update markers when flights change
  useEffect(() => {
    if (!map.current || !flights.length) return;
    
    // Remove old markers
    Object.values(markers.current).forEach(marker => marker.remove());
    markers.current = {};
    
    // Add new markers
    flights.forEach(flight => {
      // Create a custom HTML element for the marker
      const el = document.createElement('div');
      el.className = 'flight-marker';
      el.innerHTML = `
        <div class="relative group">
          <div class="absolute p-1 rounded-full bg-airport-primary bg-opacity-30 animate-ping"></div>
          <div class="transform rotate-${flight.heading} p-2 rounded-full bg-airport-primary hover:bg-airport-secondary transition-colors cursor-pointer">
            <svg viewBox="0 0 24 24" fill="white" width="16" height="16">
              <path d="M21 15L15 8.25L15.6 3.5C15.6 3.225 15.45 3 15.15 3H12.825C12.6 3 12.45 3.15 12.375 3.3L10.5 8.25L4.5 10.5L1.5 13.5C1.275 13.65 1.2 13.95 1.35 14.175C1.575 14.4 1.95 14.4 2.25 14.175L6.75 11.025L12.375 9.15L10.05 13.5L6.375 16.125L3.375 15.45C3.15 15.375 2.85 15.45 2.7 15.675C2.475 15.9 2.4 16.275 2.625 16.5L4.5 18.75C4.575 18.9 4.8 18.975 4.95 18.975H5.1L8.025 18.15L10.725 15.375L14.625 18.975H15C15.15 18.975 15.3 18.9 15.375 18.75L16.875 15.15L21 16.5V15Z" />
            </svg>
          </div>
        </div>
      `;
      
      // Add click event to select flight
      el.addEventListener('click', () => {
        setSelectedFlight(flight);
        if (map.current) {
          map.current.flyTo({
            center: [flight.longitude, flight.latitude],
            zoom: 5,
            speed: 1.5
          });
        }
      });
      
      // Create and store the marker
      const marker = new mapboxgl.Marker(el)
        .setLngLat([flight.longitude, flight.latitude])
        .addTo(map.current);
      
      markers.current[flight.id] = marker;
    });
  }, [flights]);
  
  // Handle search input
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  // Clear search and selection
  const handleClearSearch = () => {
    setSearchQuery('');
    setSelectedFlight(null);
    
    // Reset map view
    if (map.current) {
      map.current.flyTo({
        center: [0, 20],
        zoom: 1.5,
        speed: 1.2
      });
    }
  };
  
  // Fly to selected flight
  const flyToFlight = (flight: Flight) => {
    setSelectedFlight(flight);
    
    if (map.current) {
      map.current.flyTo({
        center: [flight.longitude, flight.latitude],
        zoom: 5,
        speed: 1.5
      });
    }
  };
  
  return (
    <Layout>
      <div className="flex flex-col space-y-6 max-w-screen-xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Live Flight Tracker</h1>
          <div className="flex items-center gap-2">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <span className="inline-block w-3 h-3 rounded-full bg-green-500 animate-pulse"></span>
              <span>Live Tracking</span>
            </div>
          </div>
        </div>
        
        {/* Search and Controls */}
        <Card className="bg-white/90 dark:bg-background rounded-xl shadow-md border-0">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-3 items-center">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="search"
                  placeholder="Search by flight number, airport code, or airline..."
                  className="pl-10 bg-white dark:bg-background focus:ring-2 focus:ring-airport-primary transition-all"
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
              </div>
              <Button 
                variant="outline" 
                className="bg-white dark:bg-background hover:bg-gray-100 min-w-[100px]"
                onClick={handleClearSearch}
              >
                Clear
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Flight List */}
          <Card className="lg:col-span-1 bg-white/90 dark:bg-background rounded-xl shadow-md border-0 max-h-[calc(100vh-220px)] flex flex-col">
            <CardHeader className="py-3 px-4">
              <CardTitle className="text-lg font-semibold flex items-center justify-between">
                <span>Active Flights</span>
                <span className="text-sm font-normal text-muted-foreground">
                  {filteredFlights.length} found
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto px-3 py-2">
              {isLoading ? (
                <div className="flex items-center justify-center h-64">
                  <Loader className="w-6 h-6 text-airport-primary animate-spin" />
                </div>
              ) : error ? (
                <div className="text-center py-10 text-red-500">
                  Error loading flight data. Please try again.
                </div>
              ) : filteredFlights.length === 0 ? (
                <div className="text-center py-10 text-gray-500">
                  No flights found matching your search.
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredFlights.map((flight) => (
                    <div
                      key={flight.id}
                      className={cn(
                        "p-3 rounded-lg border cursor-pointer transition-all hover:shadow-md",
                        selectedFlight?.id === flight.id
                          ? "bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800"
                          : "bg-white border-gray-100 dark:bg-black/10 dark:border-gray-800"
                      )}
                      onClick={() => flyToFlight(flight)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-medium text-base">
                          {flight.flightNumber}
                        </div>
                        <StatusBadge status={flight.status} animated={selectedFlight?.id === flight.id} />
                      </div>
                      
                      <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {flight.airline}
                      </div>
                      
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold">{flight.origin}</span>
                          <Plane className="h-3 w-3 text-blue-500" />
                          <span className="font-semibold">{flight.destination}</span>
                        </div>
                        <div className="text-xs text-gray-500">
                          {formatAltitude(flight.altitude)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Map */}
          <Card className="lg:col-span-2 bg-white/90 dark:bg-background rounded-xl shadow-md border-0 overflow-hidden">
            <div className="relative w-full h-[calc(100vh-220px)]">
              <div ref={mapContainer} className="absolute inset-0" />
              
              {/* Selected flight details overlay */}
              {selectedFlight && (
                <div className="absolute bottom-4 left-4 right-4 md:right-auto md:w-96 bg-white dark:bg-gray-900 p-4 rounded-lg shadow-lg border border-gray-200 dark:border-gray-800 z-10">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-bold text-lg">{selectedFlight.flightNumber}</div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-7 w-7 p-0" 
                      onClick={() => setSelectedFlight(null)}
                    >×</Button>
                  </div>
                  
                  <div className="text-sm mb-3">{selectedFlight.airline}</div>
                  
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <div className="text-gray-500 dark:text-gray-400">Origin</div>
                      <div className="font-medium">{selectedFlight.origin}</div>
                    </div>
                    <div>
                      <div className="text-gray-500 dark:text-gray-400">Destination</div>
                      <div className="font-medium">{selectedFlight.destination}</div>
                    </div>
                    <div>
                      <div className="text-gray-500 dark:text-gray-400">Altitude</div>
                      <div className="font-medium">{formatAltitude(selectedFlight.altitude)}</div>
                    </div>
                    <div>
                      <div className="text-gray-500 dark:text-gray-400">Speed</div>
                      <div className="font-medium">{formatSpeed(selectedFlight.speed)}</div>
                    </div>
                    <div>
                      <div className="text-gray-500 dark:text-gray-400">Status</div>
                      <div className="font-medium">
                        <StatusBadge status={selectedFlight.status} />
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-500 dark:text-gray-400">ETA</div>
                      <div className="font-medium">
                        {new Date(selectedFlight.estArrivalTime).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default LiveFlightTracker;
