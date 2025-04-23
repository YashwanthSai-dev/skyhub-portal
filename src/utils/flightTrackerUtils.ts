
// Flight interface
export interface Flight {
  id: string;
  callsign: string;
  flightNumber: string;
  airline: string;
  origin: string;
  destination: string;
  altitude: number;
  speed: number;
  heading: number;
  latitude: number;
  longitude: number;
  status: string;
  estArrivalTime: string;
  departed?: boolean;
  arrivalTime?: string;
  departureTime?: string;
  aircraft?: string;
}

// Format altitude to include commas and ft
export const formatAltitude = (alt: number): string => {
  return `${alt.toLocaleString()} ft`;
};

// Format speed to include mph
export const formatSpeed = (speed: number): string => {
  return `${speed} mph`;
};

// Calculate flight ETAs
export const calculateETA = (flight: Flight): string => {
  // In a real app, this would use distance, speed, and route to calculate ETA
  // For demo purposes, we'll just return the existing estArrivalTime
  return new Date(flight.estArrivalTime).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Class to handle animations and updates of flight positions
export class FlightAnimation {
  private flights: Record<string, Flight> = {};
  private updateCallbacks: Array<(flights: Flight[]) => void> = [];
  private interval: number | null = null;

  constructor(initialFlights: Flight[] = []) {
    initialFlights.forEach(flight => {
      this.flights[flight.id] = flight;
    });
  }

  public addFlight(flight: Flight): void {
    this.flights[flight.id] = flight;
    this.notifySubscribers();
  }

  public updateFlight(flightId: string, updates: Partial<Flight>): void {
    if (this.flights[flightId]) {
      this.flights[flightId] = { ...this.flights[flightId], ...updates };
      this.notifySubscribers();
    }
  }

  public removeFlight(flightId: string): void {
    if (this.flights[flightId]) {
      delete this.flights[flightId];
      this.notifySubscribers();
    }
  }

  public getAllFlights(): Flight[] {
    return Object.values(this.flights);
  }

  public subscribe(callback: (flights: Flight[]) => void): () => void {
    this.updateCallbacks.push(callback);
    // Initial call with current data
    callback(this.getAllFlights());
    
    // Return unsubscribe function
    return () => {
      this.updateCallbacks = this.updateCallbacks.filter(cb => cb !== callback);
    };
  }

  private notifySubscribers(): void {
    const allFlights = this.getAllFlights();
    this.updateCallbacks.forEach(callback => callback(allFlights));
  }

  public startSimulation(updateIntervalMs: number = 2000): void {
    if (this.interval !== null) {
      return;
    }

    this.interval = window.setInterval(() => {
      // Update each flight position based on heading and speed
      Object.keys(this.flights).forEach(flightId => {
        const flight = this.flights[flightId];
        
        // Skip landed or cancelled flights
        if (flight.status === 'LANDED' || flight.status === 'CANCELLED') {
          return;
        }
        
        // Calculate new position based on heading and speed
        // This is a simplified model that doesn't account for Earth's curvature
        const headingRad = (flight.heading * Math.PI) / 180;
        const speedFactor = flight.speed / 500; // Adjust for visual effect
        const latChange = Math.cos(headingRad) * speedFactor * 0.01;
        const lngChange = Math.sin(headingRad) * speedFactor * 0.01;
        
        this.flights[flightId] = {
          ...flight,
          latitude: flight.latitude + latChange,
          longitude: flight.longitude + lngChange,
        };
      });
      
      this.notifySubscribers();
    }, updateIntervalMs);
  }

  public stopSimulation(): void {
    if (this.interval !== null) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }
}

// Generate demo flight data for testing
export const generateDemoFlights = (count: number = 15): Flight[] => {
  const airlines = ['American Airlines', 'Delta', 'United', 'Emirates', 'Lufthansa', 'British Airways'];
  const airports = ['JFK', 'LAX', 'ORD', 'LHR', 'CDG', 'DXB', 'HND', 'SIN'];
  const statuses = ['EN_ROUTE', 'DELAYED', 'LANDED', 'BOARDING', 'SCHEDULED'];
  const aircraftTypes = ['Boeing 737', 'Airbus A320', 'Boeing 777', 'Airbus A380', 'Bombardier CRJ', 'Embraer E190'];
  
  return Array.from({ length: count }).map((_, i) => {
    const airline = airlines[Math.floor(Math.random() * airlines.length)];
    const origin = airports[Math.floor(Math.random() * airports.length)];
    let destination;
    do {
      destination = airports[Math.floor(Math.random() * airports.length)];
    } while (destination === origin);
    
    const flightNumber = `${airline.substring(0, 2).toUpperCase()}${100 + Math.floor(Math.random() * 900)}`;
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    
    // Generate more realistic heading based on origin/destination
    const heading = Math.floor(Math.random() * 360);
    
    return {
      id: `flight-${i}`,
      callsign: `${airline.substring(0, 3).toUpperCase()}${100 + Math.floor(Math.random() * 900)}`,
      flightNumber,
      airline,
      origin,
      destination,
      altitude: Math.floor(10000 + Math.random() * 30000),
      speed: Math.floor(400 + Math.random() * 200),
      heading,
      latitude: Math.random() * 70 * (Math.random() > 0.5 ? 1 : -1) + 10,
      longitude: Math.random() * 170 * (Math.random() > 0.5 ? 1 : -1),
      status,
      estArrivalTime: new Date(Date.now() + Math.random() * 10800000).toISOString(),
      aircraft: aircraftTypes[Math.floor(Math.random() * aircraftTypes.length)],
      departureTime: new Date(Date.now() - Math.random() * 3600000).toISOString(),
    };
  });
};

// Function to fetch flights (in a real app, this would call an API)
export const fetchFlights = async (): Promise<Flight[]> => {
  // Simulate network request
  await new Promise(resolve => setTimeout(resolve, 800));
  return generateDemoFlights(30);
};

// Filter flights based on search query
export const filterFlights = (flights: Flight[], query: string): Flight[] => {
  if (!query.trim()) return flights;
  
  const lowercaseQuery = query.toLowerCase();
  return flights.filter(flight => 
    flight.flightNumber.toLowerCase().includes(lowercaseQuery) || 
    flight.origin.toLowerCase().includes(lowercaseQuery) || 
    flight.destination.toLowerCase().includes(lowercaseQuery) ||
    flight.airline.toLowerCase().includes(lowercaseQuery) ||
    flight.callsign.toLowerCase().includes(lowercaseQuery)
  );
};
