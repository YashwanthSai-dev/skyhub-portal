import React, { useState, useEffect, useRef } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader, Search, Maximize2, Minimize2, ArrowLeftRight } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { AircraftMarker } from '@/components/flight-tracker/AircraftMarker';
import { AirportMarker } from '@/components/flight-tracker/AirportMarker';
import { FilterPanel, FilterCriteria } from '@/components/flight-tracker/FilterPanel';
import { FlightDetailsCard } from '@/components/flight-tracker/FlightDetailsCard';
import {
  Flight,
  fetchFlights,
  filterFlights,
  FlightAnimation
} from '@/utils/flightTrackerUtils';

// Temporarily use a demo key - in production this should come from environment variables
const MAPBOX_TOKEN = 'pk.eyJ1IjoiZGVtby1hY2NvdW50IiwiYSI6ImNsM3E3NG9xcjBrenczY3A3Y3pvZ2F6YXAifQ.YeCB5jIteRgxRuGMrLCfNw';

// Example airport data
const airports = [
  { code: 'JFK', name: 'John F. Kennedy International Airport', lat: 40.6413, lng: -73.7781, traffic: 'high' },
  { code: 'LAX', name: 'Los Angeles International Airport', lat: 33.9416, lng: -118.4085, traffic: 'high' },
  { code: 'ORD', name: 'O\'Hare International Airport', lat: 41.9742, lng: -87.9073, traffic: 'medium' },
  { code: 'LHR', name: 'London Heathrow Airport', lat: 51.4700, lng: -0.4543, traffic: 'high' },
  { code: 'CDG', name: 'Charles de Gaulle Airport', lat: 49.0097, lng: 2.5479, traffic: 'medium' },
  { code: 'DXB', name: 'Dubai International Airport', lat: 25.2532, lng: 55.3657, traffic: 'high' },
  { code: 'HND', name: 'Tokyo Haneda Airport', lat: 35.5494, lng: 139.7798, traffic: 'medium' },
  { code: 'SIN', name: 'Singapore Changi Airport', lat: 1.3644, lng: 103.9915, traffic: 'medium' },
];

const LiveFlightTracker = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);
  const [selectedAirport, setSelectedAirport] = useState<string | null>(null);
  const [mapExpanded, setMapExpanded] = useState(false);
  const [showFlightList, setShowFlightList] = useState(true);
  const [filters, setFilters] = useState<FilterCriteria>({
    airline: '',
    status: [],
    altitudeRange: [0, 40000],
    speedRange: [0, 700]
  });
  
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<{ [id: string]: mapboxgl.Marker }>({});
  const airportMarkers = useRef<{ [code: string]: mapboxgl.Marker }>({});
  const flightAnimation = useRef<FlightAnimation | null>(null);
  
  // Fetch flights
  const { data: initialFlights = [], isLoading, error } = useQuery({
    queryKey: ['flights'],
    queryFn: fetchFlights,
    refetchInterval: 60000, // Refetch every minute
  });
  
  const [flights, setFlights] = useState<Flight[]>([]);
  
  // Initialize flight animation system
  useEffect(() => {
    if (initialFlights.length && !flightAnimation.current) {
      flightAnimation.current = new FlightAnimation(initialFlights);
      
      const unsubscribe = flightAnimation.current.subscribe((updatedFlights) => {
        setFlights(updatedFlights);
      });
      
      flightAnimation.current.startSimulation(1000);
      
      return () => {
        unsubscribe();
        flightAnimation.current?.stopSimulation();
      };
    }
  }, [initialFlights]);
  
  // Filter flights based on search query and filters
  const filteredFlights = React.useMemo(() => {
    let filtered = filterFlights(flights, searchQuery);
    
    // Apply additional filters
    if (filters.airline) {
      filtered = filtered.filter(flight => 
        flight.airline.toLowerCase().includes(filters.airline.toLowerCase())
      );
    }
    
    if (filters.status.length > 0) {
      filtered = filtered.filter(flight => {
        const status = flight.status.toLowerCase();
        return filters.status.some(s => status.includes(s));
      });
    }
    
    filtered = filtered.filter(flight => 
      flight.altitude >= filters.altitudeRange[0] && 
      flight.altitude <= filters.altitudeRange[1] &&
      flight.speed >= filters.speedRange[0] && 
      flight.speed <= filters.speedRange[1]
    );
    
    return filtered;
  }, [flights, searchQuery, filters]);
  
  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;
    
    mapboxgl.accessToken = MAPBOX_TOKEN;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11', // Use dark style for radar look
      center: [0, 20],
      zoom: 1.8,
      pitchWithRotate: false,
    });
    
    // Add navigation controls
    map.current.addControl(
      new mapboxgl.NavigationControl(),
      'top-right'
    );
    
    map.current.on('load', () => {
      // Add visual glow effect similar to radar
      map.current?.addSource('radar-pulse', {
        'type': 'geojson',
        'data': {
          'type': 'Feature',
          'properties': {},
          'geometry': {
            'type': 'Point',
            'coordinates': [0, 0]
          }
        }
      });
      
      map.current?.addLayer({
        'id': 'radar-glow',
        'type': 'circle',
        'source': 'radar-pulse',
        'paint': {
          'circle-radius': ['interpolate', ['linear'], ['zoom'], 0, 0, 22, 1000000],
          'circle-color': '#057855',
          'circle-opacity': 0.1,
          'circle-stroke-width': 2,
          'circle-stroke-color': '#0f9868',
          'circle-stroke-opacity': 0.3
        }
      });
      
      // Add grid lines for latitude/longitude
      for (let i = -180; i < 180; i += 30) {
        map.current?.addLayer({
          'id': `grid-line-lng-${i}`,
          'type': 'line',
          'source': {
            'type': 'geojson',
            'data': {
              'type': 'Feature',
              'properties': {},
              'geometry': {
                'type': 'LineString',
                'coordinates': [[i, -85], [i, 85]]
              }
            }
          },
          'layout': {
            'line-join': 'round',
            'line-cap': 'round'
          },
          'paint': {
            'line-color': '#3a3a3a',
            'line-width': 1,
            'line-opacity': 0.5
          }
        });
      }
      
      for (let i = -90; i <= 90; i += 30) {
        map.current?.addLayer({
          'id': `grid-line-lat-${i}`,
          'type': 'line',
          'source': {
            'type': 'geojson',
            'data': {
              'type': 'Feature',
              'properties': {},
              'geometry': {
                'type': 'LineString',
                'coordinates': [[-180, i], [180, i]]
              }
            }
          },
          'layout': {
            'line-join': 'round',
            'line-cap': 'round'
          },
          'paint': {
            'line-color': '#3a3a3a',
            'line-width': 1,
            'line-opacity': 0.5
          }
        });
      }
      
      toast.success('Flight radar initialized');
    });
    
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);
  
  // Add airport markers
  useEffect(() => {
    if (!map.current) return;
    
    // Clear existing airport markers
    Object.values(airportMarkers.current).forEach(marker => marker.remove());
    airportMarkers.current = {};
    
    // Add new airport markers
    airports.forEach(airport => {
      const el = document.createElement('div');
      const trafficLevel = airport.traffic as 'low' | 'medium' | 'high';
      
      // Render the AirportMarker component to HTML
      const root = document.createElement('div');
      root.setAttribute('class', 'airport-marker-container');
      el.appendChild(root);
      
      // Create React element inside the container
      const reactEl = React.createElement(AirportMarker, { 
        code: airport.code,
        trafficLevel,
        isSelected: selectedAirport === airport.code,
        onClick: () => handleAirportClick(airport.code)
      });
      
      // Render React component into the DOM element
      const tempRoot = document.createElement('div');
      ReactDOM.render(reactEl, tempRoot);
      el.innerHTML = tempRoot.innerHTML;
      
      // Add click handler to the element
      el.addEventListener('click', () => {
        handleAirportClick(airport.code);
      });
      
      // Create and store the marker
      const marker = new mapboxgl.Marker(el)
        .setLngLat([airport.lng, airport.lat])
        .addTo(map.current!);
      
      airportMarkers.current[airport.code] = marker;
    });
  }, [map.current, selectedAirport]);
  
  // Update flight markers when flights change
  useEffect(() => {
    if (!map.current || !filteredFlights.length) return;
    
    // Remove old markers that are not in the filtered list
    Object.keys(markers.current).forEach(id => {
      if (!filteredFlights.some(f => f.id === id)) {
        markers.current[id].remove();
        delete markers.current[id];
      }
    });
    
    // Update or add markers for each flight
    filteredFlights.forEach(flight => {
      // Check if marker already exists
      if (markers.current[flight.id]) {
        // Update position
        markers.current[flight.id].setLngLat([flight.longitude, flight.latitude]);
        
        // Update HTML to reflect new heading/status
        const el = markers.current[flight.id].getElement();
        const isSelected = selectedFlight?.id === flight.id;
        
        // Create React element
        const reactEl = React.createElement(AircraftMarker, { 
          heading: flight.heading,
          status: flight.status,
          isSelected,
          onClick: () => selectFlight(flight)
        });
        
        // Render React component into a temporary container
        const tempRoot = document.createElement('div');
        ReactDOM.render(reactEl, tempRoot);
        
        // Update the marker's HTML
        el.innerHTML = tempRoot.innerHTML;
      } else {
        // Create a new marker
        const el = document.createElement('div');
        const isSelected = selectedFlight?.id === flight.id;
        
        // Create React element
        const reactEl = React.createElement(AircraftMarker, { 
          heading: flight.heading,
          status: flight.status,
          isSelected,
          onClick: () => selectFlight(flight)
        });
        
        // Render React component into the DOM element
        const tempRoot = document.createElement('div');
        ReactDOM.render(reactEl, tempRoot);
        el.innerHTML = tempRoot.innerHTML;
        
        // Add click event to select flight
        el.addEventListener('click', () => {
          selectFlight(flight);
        });
        
        // Create and store the marker
        const marker = new mapboxgl.Marker(el)
          .setLngLat([flight.longitude, flight.latitude])
          .addTo(map.current!);
        
        markers.current[flight.id] = marker;
      }
    });
  }, [filteredFlights, selectedFlight]);
  
  // Add ReactDOM import
  const ReactDOM = {
    render: (element: React.ReactElement, container: HTMLElement) => {
      // A simple implementation that renders the React element to HTML
      if (element.type === AircraftMarker) {
        const { heading, status, isSelected } = element.props;
        const rotationClass = `rotate-${Math.round(heading / 45) * 45 === 360 ? 0 : Math.round(heading / 45) * 45}`;
        
        let statusColor = 'text-gray-500';
        switch(status.toUpperCase()) {
          case 'EN_ROUTE': statusColor = 'text-blue-500'; break;
          case 'DELAYED': statusColor = 'text-orange-500'; break;
          case 'LANDED': case 'ARRIVED': statusColor = 'text-green-500'; break;
          case 'CANCELLED': statusColor = 'text-red-500'; break;
        }
        
        container.innerHTML = `
          <div class="flight-marker ${isSelected ? 'scale-150 z-50' : 'hover:scale-125'} cursor-pointer transition-all duration-300">
            <div class="transform ${rotationClass}">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="stroke-1 ${statusColor} ${isSelected ? 'drop-shadow-glow' : ''}">
                <path d="M21 15L15 8.25L15.6 3.5C15.6 3.225 15.45 3 15.15 3H12.825C12.6 3 12.45 3.15 12.375 3.3L10.5 8.25L4.5 10.5L1.5 13.5C1.275 13.65 1.2 13.95 1.35 14.175C1.575 14.4 1.95 14.4 2.25 14.175L6.75 11.025L12.375 9.15L10.05 13.5L6.375 16.125L3.375 15.45C3.15 15.375 2.85 15.45 2.7 15.675C2.475 15.9 2.4 16.275 2.625 16.5L4.5 18.75C4.575 18.9 4.8 18.975 4.95 18.975H5.1L8.025 18.15L10.725 15.375L14.625 18.975H15C15.15 18.975 15.3 18.9 15.375 18.75L16.875 15.15L21 16.5V15Z" fill="currentColor"></path>
              </svg>
            </div>
            ${isSelected ? '<div class="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-white rounded-full animate-ping"></div>' : ''}
          </div>
        `;
      } else if (element.type === AirportMarker) {
        const { code, trafficLevel, isSelected } = element.props;
        
        let trafficColor = 'bg-green-500';
        switch(trafficLevel) {
          case 'high': trafficColor = 'bg-red-500'; break;
          case 'medium': trafficColor = 'bg-amber-500'; break;
        }
        
        container.innerHTML = `
          <div class="airport-marker cursor-pointer transition-all duration-300 ${isSelected ? 'z-40' : ''}">
            <div class="relative">
              <div class="absolute w-12 h-12 rounded-full opacity-10 ${trafficColor}"></div>
              <div class="absolute w-8 h-8 rounded-full opacity-20 ${trafficColor}"></div>
              <div class="relative w-4 h-4 rounded-full border-2 border-white ${trafficColor} ${isSelected ? 'ring-4 ring-white/30' : ''}"></div>
              <div class="absolute top-5 left-1/2 transform -translate-x-1/2 bg-black/70 text-white text-xs font-bold px-1.5 py-0.5 rounded">
                ${code}
              </div>
            </div>
          </div>
        `;
      }
    }
  };
  
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
        zoom: 1.8,
        speed: 1.2
      });
    }
  };
  
  // Select flight and fly to it
  const selectFlight = (flight: Flight) => {
    setSelectedFlight(flight);
    
    if (map.current) {
      map.current.flyTo({
        center: [flight.longitude, flight.latitude],
        zoom: 5,
        speed: 1.5
      });
    }
  };
  
  // Handle airport click
  const handleAirportClick = (code: string) => {
    const airport = airports.find(a => a.code === code);
    if (!airport) return;
    
    setSelectedAirport(prevSelected => prevSelected === code ? null : code);
    
    if (map.current) {
      map.current.flyTo({
        center: [airport.lng, airport.lat],
        zoom: 6,
        speed: 1.5
      });
    }
  };
  
  // Toggle map expanded state
  const toggleMapExpanded = () => {
    setMapExpanded(!mapExpanded);
  };
  
  // Toggle flight list visibility
  const toggleFlightList = () => {
    setShowFlightList(!showFlightList);
  };
  
  // Handle filter changes
  const handleFilterChange = (newFilters: FilterCriteria) => {
    setFilters(newFilters);
  };
  
  return (
    <Layout>
      <div className={`flex flex-col h-[calc(100vh-64px)] ${mapExpanded ? 'absolute inset-0 z-50 bg-background' : ''}`}>
        {/* Top Controls */}
        <div className="flex justify-between items-center px-4 py-2 bg-background/80 backdrop-blur-md border-b">
          <h1 className="text-xl font-bold tracking-tight flex items-center gap-2">
            <div className="size-6 rounded-full bg-primary/20 flex items-center justify-center">
              <div className="w-4 h-4 rounded-full bg-primary animate-pulse"></div>
            </div>
            Live Flight Radar
          </h1>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={toggleMapExpanded}
            >
              {mapExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </Button>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Flight List (Collapsible) */}
          {showFlightList && (
            <div className="w-full md:w-96 border-r bg-background overflow-hidden flex flex-col transition-all duration-300">
              {/* Search and Filters */}
              <div className="p-3 border-b">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search flights, airports..."
                      className="pl-9 h-9"
                      value={searchQuery}
                      onChange={handleSearchChange}
                    />
                  </div>
                  <Button 
                    variant="outline"
                    size="sm"
                    onClick={handleClearSearch}
                    className="h-9 px-3"
                  >
                    Clear
                  </Button>
                </div>
              </div>
              
              {/* Flight List */}
              <div className="flex-1 overflow-y-auto p-2 space-y-2">
                {isLoading ? (
                  <div className="flex items-center justify-center h-32">
                    <Loader className="h-5 w-5 text-primary animate-spin" />
                  </div>
                ) : error ? (
                  <div className="text-center p-4 text-red-500">
                    Failed to load flights
                  </div>
                ) : filteredFlights.length === 0 ? (
                  <div className="text-center p-4 text-muted-foreground">
                    No flights match your search
                  </div>
                ) : (
                  filteredFlights.map(flight => (
                    <Card 
                      key={flight.id}
                      className={`cursor-pointer transition-all bg-background hover:bg-accent ${
                        selectedFlight?.id === flight.id 
                          ? 'border-primary shadow-md' 
                          : 'border-border'
                      }`}
                      onClick={() => selectFlight(flight)}
                    >
                      <CardContent className="p-3">
                        <div className="flex items-center justify-between mb-2">
                          <div className="font-medium text-sm flex items-center gap-1.5">
                            <div 
                              className={`w-2 h-2 rounded-full ${
                                flight.status === 'EN_ROUTE' 
                                  ? 'bg-blue-500 animate-pulse' 
                                  : flight.status === 'DELAYED' 
                                    ? 'bg-orange-500' 
                                    : 'bg-green-500'
                              }`}
                            />
                            {flight.flightNumber}
                          </div>
                          <div className="text-xs font-medium text-muted-foreground">
                            {flight.airline.split(' ')[0]}
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-1">
                            <span>{flight.origin}</span>
                            <ArrowLeftRight className="h-3 w-3 text-muted-foreground" />
                            <span>{flight.destination}</span>
                          </div>
                          <div className="flex items-center">
                            <span className="text-2xs text-muted-foreground">
                              {Math.round(flight.altitude / 1000)}k ft
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </div>
          )}
          
          {/* Map Container */}
          <div className="relative flex-1 overflow-hidden">
            {/* Map */}
            <div className="absolute inset-0 bg-black">
              <div ref={mapContainer} className="w-full h-full" />
            </div>
            
            {/* Floating Controls */}
            <div className="absolute top-3 right-3 flex flex-col gap-2 z-10">
              <FilterPanel onFilterChange={handleFilterChange} />
              
              <Button
                variant="outline"
                size="sm"
                onClick={toggleFlightList}
                className="bg-white/80 backdrop-blur-sm border-gray-200 shadow-lg hover:bg-white"
              >
                {showFlightList ? 'Hide List' : 'Show List'}
              </Button>
            </div>
            
            {/* Radar Pulse Effect */}
            <div className="absolute right-6 bottom-6 pointer-events-none z-0">
              <div className="relative">
                <div className="absolute w-40 h-40 rounded-full border-2 border-green-500/30 animate-ping"></div>
                <div className="absolute w-32 h-32 rounded-full border border-green-500/20 animate-pulse" style={{animationDelay: '0.5s'}}></div>
                <div className="absolute w-24 h-24 rounded-full border border-green-500/10 animate-pulse" style={{animationDelay: '1s'}}></div>
              </div>
            </div>
            
            {/* Selected Flight Details */}
            {selectedFlight && (
              <div className="absolute bottom-4 left-4 z-30">
                <FlightDetailsCard 
                  flight={selectedFlight} 
                  onClose={() => setSelectedFlight(null)} 
                />
              </div>
            )}
            
            {/* Flight Count */}
            <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full z-10">
              {filteredFlights.length} active flights
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default LiveFlightTracker;
