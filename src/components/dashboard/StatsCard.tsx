
import React from 'react';
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: number;
    positive: boolean;
  };
  className?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon,
  trend,
  className
}) => {
  return (
    <div className={cn(
      "bg-white rounded-xl shadow-sm p-6 flex flex-col gap-4",
      className
    )}>
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        <div className="size-10 rounded-full bg-blue-50 flex items-center justify-center text-airport-primary">
          {icon}
        </div>
      </div>
      <div className="flex items-end justify-between">
        <div className="text-2xl font-bold">{value}</div>
        {trend && (
          <div className={`flex items-center text-sm ${trend.positive ? 'text-green-600' : 'text-red-600'}`}>
            <span className="mr-1">
              {trend.positive ? '+' : '-'}{Math.abs(trend.value)}%
            </span>
            <svg
              className={`h-4 w-4 ${trend.positive ? 'rotate-0' : 'rotate-180'}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 15l7-7 7 7"
              />
            </svg>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatsCard;
