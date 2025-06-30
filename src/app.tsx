import React, { useState } from "react";
import * as ReactDOM from "react-dom/client";
import DashboardLayout from "./components/templates/DashboardLayout";
import EncoderConnection from "./components/organisms/EncoderConnection";
import HotelConfiguration from "./components/organisms/HotelConfiguration";
import CardOperations from "./components/organisms/CardOperations";
import AdvancedOperations from "./components/organisms/AdvancedOperations";

const TABS = [
  { label: "Connection", value: "connection" },
  { label: "Hotel Setup", value: "hotel" },
  { label: "Card Operations", value: "card" },
  { label: "Advanced", value: "advanced" },
];

const MOCK_COM_PORTS = ["COM3", "COM4", "COM5"];
const MOCK_LOGS = [
  { time: "9:37:21 AM", message: "Card cleared successfully", type: "success" },
  { time: "9:37:19 AM", message: "Clearing card data...", type: "info" },
  {
    time: "9:37:16 AM",
    message: "Card data read successfully",
    type: "success",
  },
  { time: "9:37:15 AM", message: "Reading card data...", type: "info" },
  {
    time: "9:37:14 AM",
    message: "Card initialized: CARD_BHN5XENMR9L",
    type: "success",
  },
  {
    time: "9:37:11 AM",
    message: "Initializing card - Please place card on reader...",
    type: "info",
  },
  {
    time: "9:36:51 AM",
    message: "Successfully connected to COM3",
    type: "success",
  },
  {
    time: "9:36:49 AM",
    message: "Attempting to connect to COM3...",
    type: "info",
  },
  { time: "9:36:48 AM", message: "Disconnected from encoder", type: "info" },
  {
    time: "9:36:47 AM",
    message: "Disconnecting from encoder...",
    type: "info",
  },
];

const App = () => {
  const [selectedTab, setSelectedTab] = useState("connection");
  // Connection state
  const [comPorts] = useState(MOCK_COM_PORTS);
  const [selectedPort, setSelectedPort] = useState("COM3");
  const [isConnected, setIsConnected] = useState(true);
  // Hotel state
  const [clientId, setClientId] = useState("");
  const [clientSecret, setClientSecret] = useState("");
  const [isFetching, setIsFetching] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  // Card operations state
  const [cardType, setCardType] = useState("Room Access");
  const [macAddress, setMacAddress] = useState("ABCDEF123456");
  const [buildingNumber, setBuildingNumber] = useState("1");
  const [floorNumber, setFloorNumber] = useState("1");
  // Advanced state
  const [sectorData, setSectorData] = useState("");
  // Logs
  const [logs] = useState(MOCK_LOGS);

  // System status mock
  const systemStatusProps = {
    connection: isConnected ? "connected" : "disconnected",
    operation: logs[0]?.type === "success" ? "success" : "idle",
    hotel: clientId ? clientId : "Not Set",
    card: "None",
  };

  // Activity log mock
  const activityLogProps = { logs };

  let content = null;
  if (selectedTab === "connection") {
    content = (
      <EncoderConnection
        comPorts={comPorts}
        selectedPort={selectedPort}
        status={isConnected ? "connected" : "disconnected"}
        onConnect={() => setIsConnected(true)}
        onDisconnect={() => setIsConnected(false)}
        onPortChange={setSelectedPort}
        isConnected={isConnected}
      />
    );
  } else if (selectedTab === "hotel") {
    content = (
      <HotelConfiguration
        clientId={clientId}
        clientSecret={clientSecret}
        onClientIdChange={setClientId}
        onClientSecretChange={setClientSecret}
        onFetchHotelInfo={() => setIsFetching(true)}
        onInitializeEncoder={() => setIsInitialized(true)}
        isFetching={isFetching}
        isInitialized={isInitialized}
      />
    );
  } else if (selectedTab === "card") {
    content = (
      <CardOperations
        cardType={cardType}
        macAddress={macAddress}
        buildingNumber={buildingNumber}
        floorNumber={floorNumber}
        onCardTypeChange={setCardType}
        onMacAddressChange={setMacAddress}
        onBuildingNumberChange={setBuildingNumber}
        onFloorNumberChange={setFloorNumber}
        onInitCard={() => {}}
        onWrite={() => {}}
        onRead={() => {}}
        onClear={() => {}}
        isConnected={isConnected}
      />
    );
  } else if (selectedTab === "advanced") {
    content = (
      <AdvancedOperations
        sectorData={sectorData}
        onSectorDataChange={setSectorData}
        onParseSector={() => {}}
        onGenerateData={() => {}}
        onReadRaw={() => {}}
        onWriteRaw={() => {}}
        isConnected={isConnected}
      />
    );
  }

  return (
    <DashboardLayout
      tabs={TABS}
      selectedTab={selectedTab}
      onTabChange={setSelectedTab}
      systemStatusProps={systemStatusProps}
      activityLogProps={activityLogProps}
    >
      {content}
    </DashboardLayout>
  );
};

function render() {
  const root = ReactDOM.createRoot(document.getElementById("app"));
  root.render(<App />);
}

render();
