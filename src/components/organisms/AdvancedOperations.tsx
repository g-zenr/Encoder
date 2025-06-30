import React from "react";
import Card from "../atoms/Card";
import Button from "../atoms/Button";
import Label from "../atoms/Label";

interface AdvancedOperationsProps {
  sectorData: string;
  onSectorDataChange: (v: string) => void;
  onParseSector: () => void;
  onGenerateData: () => void;
  onReadRaw: () => void;
  onWriteRaw: () => void;
  isConnected: boolean;
}

const AdvancedOperations: React.FC<AdvancedOperationsProps> = ({
  sectorData,
  onSectorDataChange,
  onParseSector,
  onGenerateData,
  onReadRaw,
  onWriteRaw,
  isConnected,
}) => (
  <Card>
    <div className="text-xl font-semibold mb-2 flex items-center gap-2">
      Advanced Operations
    </div>
    <div className="text-gray-500 text-sm mb-4">
      Advanced card operations and sector management
    </div>
    <div className="mb-4">
      <Label htmlFor="sector-data">Sector Data (Hex)</Label>
      <textarea
        id="sector-data"
        value={sectorData}
        onChange={(e) => onSectorDataChange(e.target.value)}
        placeholder="Enter sector data in hexadecimal format..."
        className="w-full min-h-[80px] border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Button
        onClick={onParseSector}
        disabled={!isConnected}
        className="bg-gray-100 text-gray-700"
        type="button"
      >
        Parse Sector
      </Button>
      <Button
        onClick={onGenerateData}
        disabled={!isConnected}
        className="bg-gray-100 text-gray-700"
        type="button"
      >
        Generate Data
      </Button>
      <Button
        onClick={onReadRaw}
        disabled={!isConnected}
        className="bg-gray-100 text-gray-700"
        type="button"
      >
        Read Raw
      </Button>
      <Button
        onClick={onWriteRaw}
        disabled={!isConnected}
        className="bg-gray-100 text-gray-700"
        type="button"
      >
        Write Raw
      </Button>
    </div>
  </Card>
);

export default AdvancedOperations;
