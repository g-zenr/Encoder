import React from "react";
import Card from "../atoms/Card";
import StatusBadge from "../atoms/StatusBadge";

interface SystemStatusProps {
  connection: "connected" | "disconnected";
  operation: "success" | "idle";
  hotel: string;
  card: string;
}

const SystemStatus: React.FC<SystemStatusProps> = ({
  connection,
  operation,
  hotel,
  card,
}) => {
  return (
    <Card className="mb-4">
      <div className="text-lg font-semibold mb-2">System Status</div>
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span>Connection</span>
          <StatusBadge
            status={connection}
            color={connection === "connected" ? "bg-green-500" : "bg-gray-400"}
          />
        </div>
        <div className="flex justify-between items-center">
          <span>Operation</span>
          <StatusBadge
            status={operation}
            color={operation === "success" ? "bg-green-500" : "bg-gray-400"}
          />
        </div>
        <div className="flex justify-between items-center">
          <span>Hotel</span>
          <span className="text-xs px-2 py-1 rounded bg-gray-100">{hotel}</span>
        </div>
        <div className="flex justify-between items-center">
          <span>Card</span>
          <span className="text-xs px-2 py-1 rounded bg-gray-100">{card}</span>
        </div>
      </div>
    </Card>
  );
};

export default SystemStatus;
