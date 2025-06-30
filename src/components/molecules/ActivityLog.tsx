import React from "react";
import Card from "../atoms/Card";

interface LogEntry {
  time: string;
  message: string;
  type: "success" | "info" | "error";
}

interface ActivityLogProps {
  logs: LogEntry[];
}

const typeColor = {
  success: "text-green-600",
  info: "text-blue-600",
  error: "text-red-600",
};

const ActivityLog: React.FC<ActivityLogProps> = ({ logs }) => (
  <Card>
    <div className="text-lg font-semibold mb-2">Activity Log</div>
    <div className="text-xs text-gray-500 mb-2">
      Recent operations and events
    </div>
    <div className="max-h-64 overflow-y-auto space-y-1">
      {logs.length === 0 ? (
        <div className="text-gray-400 text-sm">No activity yet</div>
      ) : (
        logs.map((log, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <span className="text-gray-400 w-20 text-right">{log.time}</span>
            <span
              className={`w-2 h-2 rounded-full ${
                log.type === "success"
                  ? "bg-green-500"
                  : log.type === "info"
                  ? "bg-blue-500"
                  : "bg-red-500"
              }`}
            ></span>
            <span className={`ml-2 ${typeColor[log.type]}`}>{log.message}</span>
          </div>
        ))
      )}
    </div>
  </Card>
);

export default ActivityLog;
