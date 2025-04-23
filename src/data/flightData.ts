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
  checkedInPassengers?: CheckedInPassenger[];
  date?: string;
  airline?: string;
}

export interface CheckedInPassenger {
  id: string;
  name: string;
  email: string;
  seatNumber?: string;
  checkInTime: string;
}

export interface BookingDetails {
  id: string;
  flightId: string;
  passengerName: string;
  passengerEmail: string;
  bookingReference: string;
  seatNumber?: string;
  hasCheckedIn: boolean;
  checkInTime?: string;
}

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
    status: "SCHEDULED",
    checkedInPassengers: [],
    airline: "Airline A"
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
    status: "BOARDING",
    checkedInPassengers: [],
    airline: "Airline B"
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
    status: "DEPARTED",
    checkedInPassengers: [],
    airline: "Airline C"
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
    status: "ARRIVED",
    checkedInPassengers: [],
    airline: "Airline D"
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
    status: "SCHEDULED",
    checkedInPassengers: [],
    airline: "Airline E"
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
    status: "SCHEDULED",
    checkedInPassengers: [],
    airline: "Airline F"
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
    status: "ARRIVED",
    checkedInPassengers: [],
    airline: "Airline G"
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
    status: "SCHEDULED",
    checkedInPassengers: [],
    airline: "Airline H"
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
    status: "SCHEDULED",
    checkedInPassengers: [],
    airline: "Airline I"
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
    status: "DEPARTED",
    checkedInPassengers: [],
    airline: "Airline J"
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
    status: "SCHEDULED",
    checkedInPassengers: [],
    airline: "Airline K"
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
    status: "SCHEDULED",
    checkedInPassengers: [],
    airline: "Airline L"
  }
];

const mockBookings: BookingDetails[] = [
  {
    id: "b1",
    flightId: "1",
    passengerName: "John Smith",
    passengerEmail: "john@example.com",
    bookingReference: "ABC123",
    seatNumber: "12A",
    hasCheckedIn: false
  },
  {
    id: "b2",
    flightId: "1",
    passengerName: "Alice Johnson",
    passengerEmail: "alice@example.com",
    bookingReference: "ABC124",
    seatNumber: "12B",
    hasCheckedIn: true,
    checkInTime: new Date().toISOString()
  },
  {
    id: "b3",
    flightId: "2",
    passengerName: "Jane Doe",
    passengerEmail: "jane@example.com",
    bookingReference: "DEF456",
    seatNumber: "14C",
    hasCheckedIn: false
  },
  {
    id: "b4",
    flightId: "3",
    passengerName: "Robert Johnson",
    passengerEmail: "robert@example.com",
    bookingReference: "GHI789",
    seatNumber: "8D",
    hasCheckedIn: true,
    checkInTime: new Date().toISOString()
  }
];

const saveToLocalStorage = (key: string, data: any) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error saving to localStorage (${key}):`, error);
  }
};

const loadFromLocalStorage = <T>(key: string, defaultData: T): T => {
  try {
    const storedData = localStorage.getItem(key);
    return storedData ? JSON.parse(storedData) : defaultData;
  } catch (error) {
    console.error(`Error loading from localStorage (${key}):`, error);
    return defaultData;
  }
};

export const useFlightData = () => {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [bookings, setBookings] = useState<BookingDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadFlights = async () => {
      try {
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const storedFlights = loadFromLocalStorage<Flight[]>('skyHubFlights', mockFlights);
        const storedBookings = loadFromLocalStorage<BookingDetails[]>('skyHubBookings', mockBookings);
        
        console.log('Loading flight data:', storedFlights.length, 'flights');
        setFlights(storedFlights);
        setBookings(storedBookings);
      } catch (err) {
        console.error('Error loading flight data:', err);
        setError('Failed to load flight data.');
      } finally {
        setLoading(false);
      }
    };

    loadFlights();
  }, []);

  useEffect(() => {
    if (flights.length > 0 && !loading) {
      saveToLocalStorage('skyHubFlights', flights);
    }
  }, [flights, loading]);

  useEffect(() => {
    if (bookings.length > 0 && !loading) {
      saveToLocalStorage('skyHubBookings', bookings);
    }
  }, [bookings, loading]);

  const validateCheckIn = (passengerName: string): Flight | null => {
    const booking = bookings.find(b => 
      b.passengerName.toLowerCase() === passengerName.toLowerCase()
    );
    
    if (booking) {
      return flights.find(f => f.id === booking.flightId) || null;
    }
    
    const flight = flights.find(f => 
      f.passengerName.toLowerCase() === passengerName.toLowerCase()
    );
    
    return flight || null;
  };

  const performCheckIn = (passengerName: string): { success: boolean, flight: Flight | null } => {
    const bookingIndex = bookings.findIndex(b => 
      b.passengerName.toLowerCase() === passengerName.toLowerCase()
    );
    
    if (bookingIndex !== -1) {
      const booking = bookings[bookingIndex];
      const flightIndex = flights.findIndex(f => f.id === booking.flightId);
      
      if (flightIndex === -1) {
        return { success: false, flight: null };
      }
      
      if (booking.hasCheckedIn) {
        return { success: true, flight: flights[flightIndex] };
      }
      
      const updatedBooking = {
        ...booking,
        hasCheckedIn: true,
        checkInTime: new Date().toISOString()
      };
      
      const updatedFlight = { ...flights[flightIndex] };
      if (!updatedFlight.checkedInPassengers) {
        updatedFlight.checkedInPassengers = [];
      }
      
      updatedFlight.checkedInPassengers.push({
        id: updatedBooking.id,
        name: updatedBooking.passengerName,
        email: updatedBooking.passengerEmail,
        seatNumber: updatedBooking.seatNumber,
        checkInTime: updatedBooking.checkInTime!
      });
      
      const newBookings = [...bookings];
      newBookings[bookingIndex] = updatedBooking;
      setBookings(newBookings);
      
      const newFlights = [...flights];
      newFlights[flightIndex] = updatedFlight;
      setFlights(newFlights);
      
      return { success: true, flight: updatedFlight };
    } else {
      const flightIndex = flights.findIndex(f => 
        f.passengerName.toLowerCase() === passengerName.toLowerCase()
      );
      
      if (flightIndex === -1) {
        return { success: false, flight: null };
      }
      
      const flight = flights[flightIndex];
      const newBookingId = `b${Date.now()}`;
      
      const newBooking: BookingDetails = {
        id: newBookingId,
        flightId: flight.id,
        passengerName: passengerName,
        passengerEmail: flight.passengerEmail || `${passengerName.replace(/\s+/g, '.').toLowerCase()}@example.com`,
        bookingReference: `AUTO${Math.floor(1000 + Math.random() * 9000)}`,
        hasCheckedIn: true,
        checkInTime: new Date().toISOString()
      };
      
      setBookings([...bookings, newBooking]);
      
      const updatedFlight = { ...flight };
      if (!updatedFlight.checkedInPassengers) {
        updatedFlight.checkedInPassengers = [];
      }
      
      updatedFlight.checkedInPassengers.push({
        id: newBooking.id,
        name: newBooking.passengerName,
        email: newBooking.passengerEmail,
        checkInTime: newBooking.checkInTime!
      });
      
      const newFlights = [...flights];
      newFlights[flightIndex] = updatedFlight;
      setFlights(newFlights);
      
      return { success: true, flight: updatedFlight };
    }
  };

  const addFlight = (flight: Omit<Flight, 'id'>): Flight => {
    const newFlight: Flight = {
      ...flight,
      id: `f${Date.now()}`,
      checkedInPassengers: []
    };
    
    setFlights(prev => [...prev, newFlight]);
    return newFlight;
  };
  
  const updateFlight = (id: string, flightData: Partial<Flight>): boolean => {
    const index = flights.findIndex(f => f.id === id);
    if (index === -1) return false;
    
    const updatedFlights = [...flights];
    updatedFlights[index] = { ...updatedFlights[index], ...flightData };
    setFlights(updatedFlights);
    return true;
  };
  
  const addBooking = (booking: Omit<BookingDetails, 'id'>): BookingDetails => {
    const newBooking: BookingDetails = {
      ...booking,
      id: `b${Date.now()}`,
      hasCheckedIn: false
    };
    
    setBookings(prev => [...prev, newBooking]);
    
    const flightIndex = flights.findIndex(f => f.id === booking.flightId);
    if (flightIndex !== -1) {
      const flightsCopy = [...flights];
      const updatedFlight = {
        ...flightsCopy[flightIndex]
      };
      flightsCopy[flightIndex] = updatedFlight;
      setFlights(flightsCopy);
    }
    
    return newBooking;
  };

  const parseCSVData = (csvText: string): Flight[] => {
    try {
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
        
        parsedFlights.push({
          id: flight.id || String(i + Date.now()),
          flightNumber: flight.flightNumber || '',
          origin: flight.origin || '',
          destination: flight.destination || '',
          departureTime: flight.departureTime || new Date().toISOString(),
          arrivalTime: flight.arrivalTime || new Date().toISOString(),
          bookingReference: flight.bookingReference || '',
          passengerName: flight.passengerName || '',
          passengerEmail: flight.passengerEmail || '',
          status: (flight.status as Flight['status']) || 'SCHEDULED',
          checkedInPassengers: [],
          date: flight.date || '',
          airline: flight.airline || ''
        });
      }
      
      console.log(`Parsed ${parsedFlights.length} flights from CSV`);
      return parsedFlights;
    } catch (err) {
      console.error('Error parsing CSV data:', err);
      return mockFlights;
    }
  };

  return { 
    flights, 
    setFlights,
    bookings,
    setBookings,
    loading, 
    error, 
    validateCheckIn,
    performCheckIn,
    addFlight,
    updateFlight,
    addBooking,
    parseCSVData 
  };
};
