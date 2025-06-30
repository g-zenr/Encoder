import React from "react";

interface StatusBadgeProps {
  status: string;
  color: string; // Tailwind color class, e.g. 'bg-green-500'
  className?: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  color,
  className = "",
}) => (
  <span
    className={`inline-flex items-center gap-2 text-sm font-medium ${className}`}
  >
    <span className={`w-2 h-2 rounded-full ${color}`}></span>
    {status}
  </span>
);

export default StatusBadge;
