
import React from 'react';
import { cn } from "@/lib/utils";

interface AirportMarkerProps {
  code: string;
  name?: string;
  trafficLevel?: 'low' | 'medium' | 'high';
  isSelected?: boolean;
  onClick?: () => void;
}

export const AirportMarker: React.FC<AirportMarkerProps> = ({ 
  code,
  name,
  trafficLevel = 'low',
  isSelected = false,
  onClick
}) => {
  const getTrafficColor = () => {
    switch (trafficLevel) {
      case 'high':
        return 'bg-red-500';
      case 'medium':
        return 'bg-amber-500';
      case 'low':
      default:
        return 'bg-green-500';
    }
  };
  
  return (
    <div 
      className={cn(
        "airport-marker cursor-pointer transition-all duration-300",
        isSelected ? "z-40" : ""
      )}
      onClick={onClick}
    >
      <div className="relative">
        <div className={cn(
          "absolute w-12 h-12 rounded-full opacity-10",
          getTrafficColor()
        )} />
        <div className={cn(
          "absolute w-8 h-8 rounded-full opacity-20",
          getTrafficColor()
        )} />
        <div className={cn(
          "relative w-4 h-4 rounded-full border-2 border-white",
          getTrafficColor(),
          isSelected ? "ring-4 ring-white/30" : ""
        )} />
        <div className="absolute top-5 left-1/2 transform -translate-x-1/2 bg-black/70 text-white text-xs font-bold px-1.5 py-0.5 rounded">
          {code}
        </div>
      </div>
    </div>
  );
};
