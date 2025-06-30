import React from "react";
import Card from "../atoms/Card";
import Select from "../atoms/Select";
import Input from "../atoms/Input";
import Button from "../atoms/Button";
import Label from "../atoms/Label";

interface CardOperationsProps {
  cardType: string;
  macAddress: string;
  buildingNumber: string;
  floorNumber: string;
  onCardTypeChange: (v: string) => void;
  onMacAddressChange: (v: string) => void;
  onBuildingNumberChange: (v: string) => void;
  onFloorNumberChange: (v: string) => void;
  onInitCard: () => void;
  onWrite: () => void;
  onRead: () => void;
  onClear: () => void;
  isConnected: boolean;
}

const CardOperations: React.FC<CardOperationsProps> = ({
  cardType,
  macAddress,
  buildingNumber,
  floorNumber,
  onCardTypeChange,
  onMacAddressChange,
  onBuildingNumberChange,
  onFloorNumberChange,
  onInitCard,
  onWrite,
  onRead,
  onClear,
  isConnected,
}) => (
  <Card>
    <div className="text-xl font-semibold mb-2 flex items-center gap-2">
      Card Operations
    </div>
    <div className="text-gray-500 text-sm mb-4">
      Initialize, write, read, and manage cards
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      <div>
        <Label htmlFor="card-type">Card Type</Label>
        <Select
          id="card-type"
          value={cardType}
          onChange={(e) => onCardTypeChange(e.target.value)}
          className="w-full"
        >
          <option value="Room Access">Room Access</option>
          <option value="Other">Other</option>
        </Select>
      </div>
      <div>
        <Label htmlFor="mac-address">MAC Address</Label>
        <Input
          id="mac-address"
          value={macAddress}
          onChange={(e) => onMacAddressChange(e.target.value)}
          placeholder="ABCDEF123456"
        />
      </div>
      <div>
        <Label htmlFor="building-number">Building Number</Label>
        <Input
          id="building-number"
          value={buildingNumber}
          onChange={(e) => onBuildingNumberChange(e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="floor-number">Floor Number</Label>
        <Input
          id="floor-number"
          value={floorNumber}
          onChange={(e) => onFloorNumberChange(e.target.value)}
        />
      </div>
    </div>
    <div className="flex gap-4">
      <Button
        onClick={onInitCard}
        disabled={!isConnected}
        className="flex-1 bg-gray-200 text-gray-700"
        type="button"
      >
        Init Card
      </Button>
      <Button
        onClick={onWrite}
        disabled={!isConnected}
        className="flex-1 bg-gray-200 text-gray-700"
        type="button"
      >
        Write
      </Button>
      <Button
        onClick={onRead}
        disabled={!isConnected}
        className="flex-1 bg-gray-100 text-gray-700"
        type="button"
      >
        Read
      </Button>
      <Button
        onClick={onClear}
        disabled={!isConnected}
        className="flex-1 bg-red-100 text-red-700"
        type="button"
      >
        Clear
      </Button>
    </div>
  </Card>
);

export default CardOperations;
