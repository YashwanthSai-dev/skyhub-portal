
import React, { useState } from 'react';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Check, Filter, X } from 'lucide-react';

interface FilterPanelProps {
  onFilterChange: (filters: FilterCriteria) => void;
}

export interface FilterCriteria {
  airline: string;
  status: string[];
  altitudeRange: [number, number];
  speedRange: [number, number];
}

const initialFilters: FilterCriteria = {
  airline: '',
  status: [],
  altitudeRange: [0, 40000],
  speedRange: [0, 700]
};

const availableStatuses = [
  { id: 'en_route', name: 'En Route', color: 'bg-blue-500' },
  { id: 'scheduled', name: 'Scheduled', color: 'bg-blue-400' },
  { id: 'delayed', name: 'Delayed', color: 'bg-orange-500' },
  { id: 'landed', name: 'Landed', color: 'bg-green-500' },
  { id: 'cancelled', name: 'Cancelled', color: 'bg-red-500' }
];

export const FilterPanel: React.FC<FilterPanelProps> = ({ onFilterChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<FilterCriteria>(initialFilters);
  const [activeFilters, setActiveFilters] = useState<number>(0);

  const handleFilterChange = (newFilters: Partial<FilterCriteria>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
    
    // Count active filters
    let count = 0;
    if (updatedFilters.airline) count++;
    if (updatedFilters.status.length) count++;
    if (updatedFilters.altitudeRange[0] > 0 || updatedFilters.altitudeRange[1] < 40000) count++;
    if (updatedFilters.speedRange[0] > 0 || updatedFilters.speedRange[1] < 700) count++;
    setActiveFilters(count);
  };
  
  const toggleStatus = (statusId: string) => {
    const newStatus = [...filters.status];
    const index = newStatus.indexOf(statusId);
    
    if (index === -1) {
      newStatus.push(statusId);
    } else {
      newStatus.splice(index, 1);
    }
    
    handleFilterChange({ status: newStatus });
  };
  
  const resetFilters = () => {
    setFilters(initialFilters);
    onFilterChange(initialFilters);
    setActiveFilters(0);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="bg-white/80 backdrop-blur-sm border-gray-200 shadow-lg hover:bg-white relative"
        >
          <Filter className="w-4 h-4 mr-2" />
          <span>Filters</span>
          {activeFilters > 0 && (
            <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
              {activeFilters}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4 bg-white/95 backdrop-blur-md border-gray-200 shadow-xl rounded-xl">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-base">Filter Flights</h3>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={resetFilters}
              className="h-8 px-2 text-xs"
            >
              <X className="w-3 h-3 mr-1" />
              Reset
            </Button>
          </div>
          
          <div className="space-y-2">
            <label className="text-xs font-medium">Airline</label>
            <Input 
              placeholder="Filter by airline..." 
              value={filters.airline} 
              onChange={(e) => handleFilterChange({ airline: e.target.value })}
              className="h-8 text-sm"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-xs font-medium">Status</label>
            <div className="flex flex-wrap gap-2">
              {availableStatuses.map((status) => (
                <Badge 
                  key={status.id}
                  variant={filters.status.includes(status.id) ? "default" : "outline"}
                  className={`cursor-pointer ${filters.status.includes(status.id) ? status.color : ""}`}
                  onClick={() => toggleStatus(status.id)}
                >
                  {filters.status.includes(status.id) && (
                    <Check className="w-3 h-3 mr-1" />
                  )}
                  {status.name}
                </Badge>
              ))}
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium">Altitude Range</label>
              <span className="text-xs text-gray-600">
                {filters.altitudeRange[0].toLocaleString()} - {filters.altitudeRange[1].toLocaleString()} ft
              </span>
            </div>
            <Slider 
              defaultValue={[0, 40000]}
              min={0}
              max={40000}
              step={1000}
              value={filters.altitudeRange}
              onValueChange={(value) => handleFilterChange({ altitudeRange: value as [number, number] })}
              className="py-2"
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium">Speed Range</label>
              <span className="text-xs text-gray-600">
                {filters.speedRange[0]} - {filters.speedRange[1]} mph
              </span>
            </div>
            <Slider 
              defaultValue={[0, 700]}
              min={0}
              max={700}
              step={10}
              value={filters.speedRange}
              onValueChange={(value) => handleFilterChange({ speedRange: value as [number, number] })}
              className="py-2"
            />
          </div>
          
          <div className="pt-2 flex justify-between">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setIsOpen(false)}
              className="text-xs"
            >
              Close
            </Button>
            <Button 
              variant="default"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="text-xs"
            >
              Apply Filters
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
