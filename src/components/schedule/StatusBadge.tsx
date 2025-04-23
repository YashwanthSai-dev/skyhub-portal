
import React from "react";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: string;
}

const statusMap: Record<
  string,
  { color: string; text: string }
> = {
  ARRIVED: { color: "bg-green-500 text-white", text: "Arrived" },
  CANCELLED: { color: "bg-red-500 text-white", text: "Cancelled" },
  CANCELLED: { color: "bg-red-500 text-white", text: "Cancelled" },
  DEPARTED: { color: "bg-purple-500 text-white", text: "Departed" },
  BOARDING: { color: "bg-amber-400 text-white", text: "Boarding" },
  SCHEDULED: { color: "bg-blue-500 text-white", text: "Scheduled" },
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const mapping = statusMap[status?.toUpperCase()] || {
    color: "bg-gray-400 text-white",
    text: status,
  };
  return (
    <span
      className={cn(
        "inline-block rounded-full px-3 py-1 text-xs font-semibold shadow-sm transition-transform animate-fade-in",
        mapping.color,
      )}
      style={{ minWidth: 80, textAlign: "center" }}
    >
      {mapping.text}
    </span>
  );
};
