
import React from 'react';
import { Flight } from '@/data/flightData';
import FlightSearch from '@/components/dashboard/FlightSearch';

interface FlightSearchTabProps {
  flights: Flight[];
}

const FlightSearchTab: React.FC<FlightSearchTabProps> = ({ flights }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold mb-4">Flight Search</h2>
      <p className="text-lg mb-6">
        Search for flight information by flight number, route, passenger name, or booking reference.
        Data is loaded from our SQLite database created by dataset.py script.
      </p>
      
      <FlightSearch flights={flights} />
    </div>
  );
};

export default FlightSearchTab;
