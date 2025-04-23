
import React from 'react';
import { X, Plane, ArrowRight, Clock } from 'lucide-react';
import { Flight, formatAltitude, formatSpeed, calculateETA } from '@/utils/flightTrackerUtils';
import { StatusBadge } from '@/components/schedule/StatusBadge';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface FlightDetailsCardProps {
  flight: Flight;
  onClose: () => void;
}

export const FlightDetailsCard: React.FC<FlightDetailsCardProps> = ({ flight, onClose }) => {
  if (!flight) return null;
  
  return (
    <Card className="w-full md:w-96 bg-white/95 backdrop-blur-md border-gray-200 shadow-xl animate-fade-in">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg font-bold">
            <Plane className="w-5 h-5 text-primary" />
            {flight.flightNumber}
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose} className="h-7 w-7 p-0">×</Button>
        </div>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="mb-3">
          <p className="text-sm font-semibold text-gray-700">{flight.airline}</p>
          <p className="text-xs text-gray-600">{flight.callsign} • {flight.aircraft || "Aircraft"}</p>
        </div>
        
        <div className="flex items-center justify-between py-2 text-sm border-t border-b border-gray-100">
          <div className="text-center">
            <p className="font-bold text-base">{flight.origin}</p>
            <p className="text-xs text-gray-500">Origin</p>
          </div>
          
          <ArrowRight className="w-4 h-4 text-gray-400" />
          
          <div className="text-center">
            <p className="font-bold text-base">{flight.destination}</p>
            <p className="text-xs text-gray-500">Destination</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <p className="text-xs text-gray-500">Status</p>
            <div className="mt-1">
              <StatusBadge status={flight.status} animated />
            </div>
          </div>
          <div>
            <p className="text-xs text-gray-500">ETA</p>
            <p className="font-mono text-sm mt-1 font-medium">
              {calculateETA(flight)}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Altitude</p>
            <p className="font-mono text-sm mt-1 font-medium">
              {formatAltitude(flight.altitude)}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Speed</p>
            <p className="font-mono text-sm mt-1 font-medium">
              {formatSpeed(flight.speed)}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Heading</p>
            <p className="font-mono text-sm mt-1 font-medium">
              {flight.heading}°
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Coordinates</p>
            <p className="font-mono text-sm mt-1 font-medium text-xs">
              {flight.latitude.toFixed(4)}, {flight.longitude.toFixed(4)}
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between pt-0">
        <Button 
          variant="outline" 
          size="sm"
          className="w-full text-xs"
        >
          <Clock className="w-4 h-4 mr-2" />
          Track Flight
        </Button>
      </CardFooter>
    </Card>
  );
};
