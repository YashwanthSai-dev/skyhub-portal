
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

export const useFlightData = () => {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadFlights = async () => {
      try {
        setLoading(true);
        // This would normally fetch from an API
        // For now, we'll use a placeholder until actual CSV is uploaded
        setFlights([
          {
            id: '1',
            flightNumber: 'SH101',
            origin: 'New York',
            destination: 'London',
            departureTime: '2023-06-15T08:00:00',
            arrivalTime: '2023-06-15T20:00:00',
            bookingReference: 'ABC123',
            passengerName: 'John Doe',
            passengerEmail: 'john@example.com',
            status: 'SCHEDULED'
          },
          {
            id: '2',
            flightNumber: 'SH202',
            origin: 'Paris',
            destination: 'Tokyo',
            departureTime: '2023-06-16T09:30:00',
            arrivalTime: '2023-06-17T11:00:00',
            bookingReference: 'DEF456',
            passengerName: 'Jane Smith',
            passengerEmail: 'jane@example.com',
            status: 'SCHEDULED'
          }
        ]);
      } catch (err) {
        setError('Failed to load flight data');
        console.error(err);
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

  // Function to parse CSV data when it's uploaded
  const parseCSVData = (csvText: string) => {
    try {
      const lines = csvText.split('\n');
      const headers = lines[0].split(',');
      
      const parsedFlights: Flight[] = [];
      
      for (let i = 1; i < lines.length; i++) {
        if (!lines[i].trim()) continue;
        
        const values = lines[i].split(',');
        const flight: Record<string, any> = {};
        
        headers.forEach((header, index) => {
          flight[header.trim()] = values[index]?.trim() || '';
        });
        
        // Convert to our Flight interface
        parsedFlights.push({
          id: flight.id || String(i),
          flightNumber: flight.flightNumber || '',
          origin: flight.origin || '',
          destination: flight.destination || '',
          departureTime: flight.departureTime || '',
          arrivalTime: flight.arrivalTime || '',
          bookingReference: flight.bookingReference || '',
          passengerName: flight.passengerName || '',
          passengerEmail: flight.passengerEmail || '',
          status: flight.status || 'SCHEDULED'
        });
      }
      
      setFlights(parsedFlights);
      return parsedFlights;
    } catch (err) {
      setError('Failed to parse CSV data');
      console.error(err);
      return [];
    }
  };

  return { flights, loading, error, validateCheckIn, parseCSVData };
};
