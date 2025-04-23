
import React from "react";
import { cn } from "@/lib/utils";

interface AircraftMarkerProps {
  heading: number;
  status: string;
  isSelected?: boolean;
  onClick?: () => void;
}

export const AircraftMarker: React.FC<AircraftMarkerProps> = ({ 
  heading, 
  status,
  isSelected = false,
  onClick 
}) => {
  // Get custom rotation class based on heading
  const getRotationClass = () => {
    // Map heading (0-360) to closest 45-degree increment
    const normalizedHeading = Math.round(heading / 45) * 45;
    // Handle 360 -> 0 edge case
    return normalizedHeading === 360 ? "rotate-0" : `rotate-${normalizedHeading}`;
  };
  
  // Different colors for different flight statuses
  const getStatusColor = () => {
    switch(status.toUpperCase()) {
      case 'EN_ROUTE':
        return 'text-blue-500';
      case 'DELAYED':
        return 'text-orange-500';
      case 'LANDED':
      case 'ARRIVED':
        return 'text-green-500';
      case 'CANCELLED':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };
  
  return (
    <div 
      className={cn(
        "flight-marker cursor-pointer transition-all duration-300",
        isSelected ? "scale-150 z-50" : "hover:scale-125"
      )}
      onClick={onClick}
    >
      <div className={cn("transform", getRotationClass())}>
        <svg 
          width="24" 
          height="24" 
          viewBox="0 0 24 24" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className={cn(
            "stroke-1", 
            getStatusColor(),
            isSelected ? "drop-shadow-glow" : ""
          )}
        >
          <path 
            d="M21 15L15 8.25L15.6 3.5C15.6 3.225 15.45 3 15.15 3H12.825C12.6 3 12.45 3.15 12.375 3.3L10.5 8.25L4.5 10.5L1.5 13.5C1.275 13.65 1.2 13.95 1.35 14.175C1.575 14.4 1.95 14.4 2.25 14.175L6.75 11.025L12.375 9.15L10.05 13.5L6.375 16.125L3.375 15.45C3.15 15.375 2.85 15.45 2.7 15.675C2.475 15.9 2.4 16.275 2.625 16.5L4.5 18.75C4.575 18.9 4.8 18.975 4.95 18.975H5.1L8.025 18.15L10.725 15.375L14.625 18.975H15C15.15 18.975 15.3 18.9 15.375 18.75L16.875 15.15L21 16.5V15Z"
            fill="currentColor"
          />
        </svg>
      </div>
      {isSelected && (
        <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-white rounded-full animate-ping"></div>
      )}
    </div>
  );
};
