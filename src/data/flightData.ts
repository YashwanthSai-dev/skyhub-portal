
import { useEffect, useState } from 'react';

export interface Flight {
  id: string;
  flightNumber: string;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  bookingReference: string;
  passengerName: string;
  passengerEmail: string;
  status: 'SCHEDULED' | 'BOARDING' | 'DEPARTED' | 'ARRIVED' | 'CANCELLED';
}

// Mock flight data that will be available immediately without needing external files
const mockFlights: Flight[] = [
  {
    id: "1",
    flightNumber: "SH101",
    origin: "New York",
    destination: "London",
    departureTime: new Date(Date.now() + 3600000).toISOString(),
    arrivalTime: new Date(Date.now() + 3600000 * 9).toISOString(),
    bookingReference: "ABC123",
    passengerName: "John Smith",
    passengerEmail: "john@example.com",
    status: "SCHEDULED"
  },
  {
    id: "2",
    flightNumber: "SH102",
    origin: "London",
    destination: "Paris",
    departureTime: new Date(Date.now() + 7200000).toISOString(),
    arrivalTime: new Date(Date.now() + 3600000 * 3).toISOString(),
    bookingReference: "DEF456",
    passengerName: "Jane Doe",
    passengerEmail: "jane@example.com",
    status: "BOARDING"
  },
  {
    id: "3",
    flightNumber: "SH103",
    origin: "Paris",
    destination: "Berlin",
    departureTime: new Date(Date.now() - 3600000).toISOString(),
    arrivalTime: new Date(Date.now() + 3600000 * 2).toISOString(),
    bookingReference: "GHI789",
    passengerName: "Robert Johnson",
    passengerEmail: "robert@example.com",
    status: "DEPARTED"
  },
  {
    id: "4",
    flightNumber: "SH104",
    origin: "Berlin",
    destination: "Rome",
    departureTime: new Date(Date.now() - 7200000).toISOString(),
    arrivalTime: new Date(Date.now() + 3600000).toISOString(),
    bookingReference: "JKL012",
    passengerName: "Sarah Williams",
    passengerEmail: "sarah@example.com",
    status: "ARRIVED"
  },
  {
    id: "5",
    flightNumber: "SH105",
    origin: "Rome",
    destination: "Madrid",
    departureTime: new Date(Date.now() + 10800000).toISOString(),
    arrivalTime: new Date(Date.now() + 3600000 * 5).toISOString(),
    bookingReference: "MNO345",
    passengerName: "Michael Brown",
    passengerEmail: "michael@example.com",
    status: "SCHEDULED"
  },
  {
    id: "6",
    flightNumber: "SH106",
    origin: "Madrid",
    destination: "Amsterdam",
    departureTime: new Date(Date.now() + 14400000).toISOString(),
    arrivalTime: new Date(Date.now() + 3600000 * 4).toISOString(),
    bookingReference: "PQR678",
    passengerName: "Emily Davis",
    passengerEmail: "emily@example.com",
    status: "SCHEDULED"
  },
  {
    id: "7",
    flightNumber: "SH107",
    origin: "Amsterdam",
    destination: "Vienna",
    departureTime: new Date(Date.now() - 10800000).toISOString(),
    arrivalTime: new Date(Date.now() - 3600000 * 2).toISOString(),
    bookingReference: "STU901",
    passengerName: "David Wilson",
    passengerEmail: "david@example.com",
    status: "ARRIVED"
  },
  {
    id: "8",
    flightNumber: "SH108",
    origin: "Vienna",
    destination: "Athens",
    departureTime: new Date(Date.now() + 18000000).toISOString(),
    arrivalTime: new Date(Date.now() + 3600000 * 6).toISOString(),
    bookingReference: "VWX234",
    passengerName: "Lisa Martinez",
    passengerEmail: "lisa@example.com",
    status: "SCHEDULED"
  },
  {
    id: "9",
    flightNumber: "SH109",
    origin: "Athens",
    destination: "Stockholm",
    departureTime: new Date(Date.now() + 21600000).toISOString(),
    arrivalTime: new Date(Date.now() + 3600000 * 7).toISOString(),
    bookingReference: "YZA567",
    passengerName: "Kevin Taylor",
    passengerEmail: "kevin@example.com",
    status: "SCHEDULED"
  },
  {
    id: "10",
    flightNumber: "SH110",
    origin: "Stockholm",
    destination: "New York",
    departureTime: new Date(Date.now() - 14400000).toISOString(),
    arrivalTime: new Date(Date.now() + 3600000 * 8).toISOString(),
    bookingReference: "BCD890",
    passengerName: "Amanda Garcia",
    passengerEmail: "amanda@example.com",
    status: "DEPARTED"
  },
  {
    id: "11",
    flightNumber: "SH111",
    origin: "Saint Louis",
    destination: "Chicago",
    departureTime: new Date(Date.now() + 3600000 * 2).toISOString(),
    arrivalTime: new Date(Date.now() + 3600000 * 4).toISOString(),
    bookingReference: "EFG123",
    passengerName: "Thomas Roberts",
    passengerEmail: "thomas@example.com",
    status: "SCHEDULED"
  },
  {
    id: "12",
    flightNumber: "SH112",
    origin: "Chicago",
    destination: "Denver",
    departureTime: new Date(Date.now() + 3600000 * 5).toISOString(),
    arrivalTime: new Date(Date.now() + 3600000 * 8).toISOString(),
    bookingReference: "HIJ456",
    passengerName: "Patricia White",
    passengerEmail: "patricia@example.com",
    status: "SCHEDULED"
  }
];

export const useFlightData = () => {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load mock flight data with a slight delay to simulate loading
  useEffect(() => {
    const loadFlights = async () => {
      try {
        setLoading(true);
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 800));
        console.log('Loading mock flight data:', mockFlights.length, 'flights');
        setFlights(mockFlights);
      } catch (err) {
        console.error('Error loading flight data:', err);
        setError('Failed to load flight data.');
      } finally {
        setLoading(false);
      }
    };

    loadFlights();
  }, []);

  // Function to validate a check-in request
  const validateCheckIn = (bookingRef: string, emailOrName: string): Flight | null => {
    const flight = flights.find(f => 
      f.bookingReference.toLowerCase() === bookingRef.toLowerCase() && 
      (f.passengerEmail.toLowerCase() === emailOrName.toLowerCase() || 
       f.passengerName.toLowerCase().includes(emailOrName.toLowerCase()))
    );
    
    return flight || null;
  };

  // Function to parse CSV data is kept but modified to handle direct data
  const parseCSVData = (csvText: string): Flight[] => {
    try {
      // If CSV parsing is needed, we can still support it
      // But for now, return the mock flights if the CSV is empty
      if (!csvText.trim()) {
        console.log('No CSV provided, using mock data');
        return mockFlights;
      }
      
      const lines = csvText.split('\n');
      if (lines.length <= 1) {
        console.log('CSV file is empty or has only headers, using mock data');
        return mockFlights;
      }
      
      const headers = lines[0].split(',');
      
      const parsedFlights: Flight[] = [];
      
      for (let i = 1; i < lines.length; i++) {
        if (!lines[i].trim()) continue;
        
        const values = lines[i].split(',');
        const flight: Record<string, any> = {};
        
        headers.forEach((header, index) => {
          flight[header.trim()] = values[index]?.trim() || '';
        });
        
        // Convert to our Flight interface and add a unique id if not present
        parsedFlights.push({
          id: flight.id || String(i + Date.now()), // Ensure unique ID
          flightNumber: flight.flightNumber || '',
          origin: flight.origin || '',
          destination: flight.destination || '',
          departureTime: flight.departureTime || new Date().toISOString(),
          arrivalTime: flight.arrivalTime || new Date().toISOString(),
          bookingReference: flight.bookingReference || '',
          passengerName: flight.passengerName || '',
          passengerEmail: flight.passengerEmail || '',
          status: (flight.status as Flight['status']) || 'SCHEDULED'
        });
      }
      
      console.log(`Parsed ${parsedFlights.length} flights from CSV`);
      return parsedFlights;
    } catch (err) {
      console.error('Error parsing CSV data:', err);
      return mockFlights; // Fall back to mock data on error
    }
  };

  return { 
    flights, 
    setFlights, // Expose this for CSV uploader to update flights
    loading, 
    error, 
    validateCheckIn, 
    parseCSVData 
  };
};
