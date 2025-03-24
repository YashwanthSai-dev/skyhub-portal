
import React from 'react';
import { ChevronRight } from 'lucide-react';

const BreadcrumbNav: React.FC = () => {
  return (
    <div className="flex items-center text-sm text-muted-foreground">
      <a href="/" className="text-airport-primary hover:underline">Home</a>
      <ChevronRight className="h-4 w-4 mx-1" />
      <span>Web Check-In</span>
    </div>
  );
};

export default BreadcrumbNav;
