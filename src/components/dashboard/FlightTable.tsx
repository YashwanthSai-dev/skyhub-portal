
import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export interface Flight {
  id: string;
  flightNumber: string;
  airline: string;
  destination: string;
  origin: string;
  scheduledTime: string;
  actualTime: string;
  gate: string;
  terminal: string;
  status: 'On Time' | 'Delayed' | 'Boarding' | 'Departed' | 'Arrived' | 'Canceled';
  type: 'departure' | 'arrival';
}

interface FlightTableProps {
  flights: Flight[];
  type: 'departure' | 'arrival';
}

const FlightTable: React.FC<FlightTableProps> = ({ flights, type }) => {
  const getStatusColor = (status: Flight['status']) => {
    switch (status) {
      case 'On Time':
        return 'bg-green-100 text-green-800 border-green-500';
      case 'Boarding':
        return 'bg-blue-100 text-blue-800 border-blue-500';
      case 'Departed':
      case 'Arrived':
        return 'bg-purple-100 text-purple-800 border-purple-500';
      case 'Delayed':
        return 'bg-amber-100 text-amber-800 border-amber-500';
      case 'Canceled':
        return 'bg-red-100 text-red-800 border-red-500';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-500';
    }
  };

  return (
    <div className="rounded-lg border bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Flight</TableHead>
            <TableHead>{type === 'departure' ? 'Destination' : 'Origin'}</TableHead>
            <TableHead>Airline</TableHead>
            <TableHead>Scheduled</TableHead>
            <TableHead>Actual</TableHead>
            <TableHead>Terminal/Gate</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {flights.map((flight) => (
            <TableRow key={flight.id}>
              <TableCell className="font-medium">{flight.flightNumber}</TableCell>
              <TableCell>{type === 'departure' ? flight.destination : flight.origin}</TableCell>
              <TableCell>{flight.airline}</TableCell>
              <TableCell>{flight.scheduledTime}</TableCell>
              <TableCell>{flight.actualTime}</TableCell>
              <TableCell>{`${flight.terminal}/${flight.gate}`}</TableCell>
              <TableCell>
                <Badge className={cn("border-l-4 font-normal", getStatusColor(flight.status))}>
                  {flight.status}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default FlightTable;
