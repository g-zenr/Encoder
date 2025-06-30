import React from "react";
import Card from "../atoms/Card";
import Input from "../atoms/Input";
import Button from "../atoms/Button";
import Label from "../atoms/Label";

interface HotelConfigurationProps {
  clientId: string;
  clientSecret: string;
  onClientIdChange: (v: string) => void;
  onClientSecretChange: (v: string) => void;
  onFetchHotelInfo: () => void;
  onInitializeEncoder: () => void;
  isFetching: boolean;
  isInitialized: boolean;
}

const HotelConfiguration: React.FC<HotelConfigurationProps> = ({
  clientId,
  clientSecret,
  onClientIdChange,
  onClientSecretChange,
  onFetchHotelInfo,
  onInitializeEncoder,
  isFetching,
  isInitialized,
}) => (
  <Card>
    <div className="text-xl font-semibold mb-2 flex items-center gap-2">
      Hotel Configuration
    </div>
    <div className="text-gray-500 text-sm mb-4">
      Configure hotel information from TTLock API
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      <div>
        <Label htmlFor="client-id">Client ID</Label>
        <Input
          id="client-id"
          value={clientId}
          onChange={(e) => onClientIdChange(e.target.value)}
          placeholder="Enter client ID"
        />
      </div>
      <div>
        <Label htmlFor="client-secret">Client Secret</Label>
        <Input
          id="client-secret"
          value={clientSecret}
          onChange={(e) => onClientSecretChange(e.target.value)}
          placeholder="Enter client secret"
        />
      </div>
    </div>
    <div className="flex gap-4">
      <Button
        onClick={onFetchHotelInfo}
        disabled={isFetching}
        className="flex-1 bg-black text-white"
        type="button"
      >
        Hotel Info
      </Button>
      <Button
        onClick={onInitializeEncoder}
        disabled={!isInitialized}
        className="flex-1 bg-gray-100 text-gray-500 cursor-not-allowed"
        type="button"
      >
        Initialize Encoder
      </Button>
    </div>
  </Card>
);

export default HotelConfiguration;
