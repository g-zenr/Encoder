import React from "react";
import Card from "../atoms/Card";
import Select from "../atoms/Select";
import Button from "../atoms/Button";
import StatusBadge from "../atoms/StatusBadge";
import Label from "../atoms/Label";

interface EncoderConnectionProps {
  comPorts: string[];
  selectedPort: string;
  status: "connected" | "disconnected";
  onConnect: () => void;
  onDisconnect: () => void;
  onPortChange: (port: string) => void;
  isConnected: boolean;
}

const EncoderConnection: React.FC<EncoderConnectionProps> = ({
  comPorts,
  selectedPort,
  status,
  onConnect,
  onDisconnect,
  onPortChange,
  isConnected,
}) => (
  <Card>
    <div className="text-xl font-semibold mb-2 flex items-center gap-2">
      Encoder Connection
    </div>
    <div className="text-gray-500 text-sm mb-4">
      Connect to the card encoder via COM port
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
      <div>
        <Label htmlFor="com-port">COM Port</Label>
        <Select
          id="com-port"
          value={selectedPort}
          onChange={(e) => onPortChange(e.target.value)}
          disabled={isConnected}
          className="w-full"
        >
          {comPorts.map((port) => (
            <option key={port} value={port}>
              {port}
            </option>
          ))}
        </Select>
      </div>
      <div>
        <Label>Status</Label>
        <StatusBadge
          status={status}
          color={status === "connected" ? "bg-green-500" : "bg-gray-400"}
        />
      </div>
    </div>
    <div className="flex gap-4 mt-6">
      <Button
        onClick={onConnect}
        disabled={isConnected}
        className="flex-1 bg-gray-200 text-gray-500 cursor-not-allowed"
        type="button"
      >
        Connect
      </Button>
      <Button
        onClick={onDisconnect}
        disabled={!isConnected}
        className="flex-1 bg-white border text-gray-700"
        type="button"
      >
        Disconnect
      </Button>
    </div>
  </Card>
);

export default EncoderConnection;
