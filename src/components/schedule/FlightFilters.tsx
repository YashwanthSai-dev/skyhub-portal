
import React from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface FlightFiltersProps {
  departureCities: string[];
  airlines: string[];
  filter: {
    city: string;
    airline: string;
    timeOfDay: string;
  };
  onFilterChange: (key: string, value: string) => void;
}

const timeOfDayOptions = [
  { value: "", label: "All Times" },
  { value: "morning", label: "Morning (5AM-12PM)" },
  { value: "afternoon", label: "Afternoon (12PM-5PM)" },
  { value: "evening", label: "Evening (5PM-9PM)" },
  { value: "night", label: "Night (9PM-5AM)" },
];

export const FlightFilters: React.FC<FlightFiltersProps> = ({
  departureCities,
  airlines,
  filter,
  onFilterChange,
}) => (
  <div className={cn(
    "mb-5 gap-3 grid grid-cols-1 sm:grid-cols-3 bg-white/90 dark:bg-background rounded-xl p-3 shadow-md transition-all",
    "md:flex md:space-x-4 md:space-y-0 w-full items-center"
  )}>
    <div>
      <Select
        value={filter.city}
        onValueChange={val => onFilterChange("city", val)}
      >
        <SelectTrigger className="w-full md:w-[180px] h-10 bg-white dark:bg-background rounded-md border shadow">
          <SelectValue placeholder="Departure City" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">All Cities</SelectItem>
          {departureCities.map(city => (
            <SelectItem key={city} value={city}>
              {city}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
    <div>
      <Select
        value={filter.airline}
        onValueChange={val => onFilterChange("airline", val)}
      >
        <SelectTrigger className="w-full md:w-[180px] h-10 bg-white dark:bg-background rounded-md border shadow">
          <SelectValue placeholder="Airline" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">All Airlines</SelectItem>
          {airlines.map(air => (
            <SelectItem key={air} value={air}>
              {air}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
    <div>
      <Select
        value={filter.timeOfDay}
        onValueChange={val => onFilterChange("timeOfDay", val)}
      >
        <SelectTrigger className="w-full md:w-[180px] h-10 bg-white dark:bg-background rounded-md border shadow">
          <SelectValue placeholder="Time of Day" />
        </SelectTrigger>
        <SelectContent>
          {timeOfDayOptions.map(({ value, label }) => (
            <SelectItem key={value} value={value}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  </div>
);
