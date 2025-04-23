
import React from "react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Info } from "lucide-react";

interface FlightDetailsTooltipProps {
  flight: {
    gate?: string;
    terminal?: string;
    aircraftType?: string;
    boardingTime?: string;
    [key: string]: any;
  };
}

export const FlightDetailsTooltip: React.FC<FlightDetailsTooltipProps> = ({ flight }) => (
  <Popover>
    <PopoverTrigger asChild>
      <button
        tabIndex={0}
        aria-label="Show flight details"
        className="ml-2 p-1 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-800 transition-all focus:ring-2 focus:ring-airport-secondary"
        style={{ minWidth: 32, minHeight: 32 }}
      >
        <Info className="w-4 h-4" />
      </button>
    </PopoverTrigger>
    <PopoverContent className="w-60">
      <div className="space-y-2">
        {flight.terminal && (
          <div>
            <span className="font-semibold">Terminal:</span>{" "}
            <span>{flight.terminal}</span>
          </div>
        )}
        {flight.gate && (
          <div>
            <span className="font-semibold">Gate:</span>{" "}
            <span>{flight.gate}</span>
          </div>
        )}
        {flight.aircraftType && (
          <div>
            <span className="font-semibold">Aircraft:</span>{" "}
            <span>{flight.aircraftType}</span>
          </div>
        )}
        {flight.boardingTime && (
          <div>
            <span className="font-semibold">Boarding:</span>{" "}
            <span>{flight.boardingTime}</span>
          </div>
        )}
      </div>
    </PopoverContent>
  </Popover>
);
