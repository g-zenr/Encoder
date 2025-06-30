# CardEncoder API Implementation

This module provides a comprehensive TypeScript/JavaScript API for integrating with the CardEncoder.dll hardware and TTLock Cloud services.

## 🚀 Quick Start

```typescript
import { cardEncoderAPI } from "./api";

// Basic card encoding workflow
async function encodeCard() {
  try {
    const cardData = await cardEncoderAPI.performCompleteCardEncoding("COM3", {
      buildNo: 1,
      floorNo: 2,
      mac: "ABCDEF123456",
      timestamp: Math.floor(Date.now() / 1000) + 24 * 60 * 60, // 24 hours
      allowLockOut: true,
    });

    console.log("Card encoded:", cardData.cardNumber);
  } catch (error) {
    console.error("Encoding failed:", error);
  }
}
```

## 📋 Prerequisites

### Hardware Requirements

- Windows 7 or Windows 10
- Card encoder device connected via COM port
- Required DLLs in the bridge directory:
  - `CardEncoder.dll`
  - `mfc140u.dll`
  - `msvcp140.dll`
  - `ucrtbase.dll`
  - `vcruntime140.dll`

### Software Requirements

- Node.js 16+ with Electron
- TTLock Cloud API credentials
- Card encoder drivers installed

### Environment Variables

```bash
# TTLock Cloud API
TTLOCK_CLIENT_ID=your_client_id
TTLOCK_CLIENT_SECRET=your_client_secret
TTLOCK_BASE_URL=https://euapi.ttlock.com/v3

# Encoder Configuration
ENCODER_DEFAULT_PORT=COM3
ENCODER_CONNECTION_TIMEOUT=10000
ENCODER_RETRY_ATTEMPTS=3

# Card Configuration
CARD_DEFAULT_EXPIRY_HOURS=24
CARD_MAX_EXPIRY_DAYS=30
```

## 🔧 API Reference

### Core Classes

#### `CardEncoderAPI`

Main API class for all CardEncoder operations.

#### `cardEncoderAPI`

Singleton instance of `CardEncoderAPI` for easy usage.

### TTLock Cloud API Methods

#### `getHotelInfo(): Promise<HotelInfo>`

Fetches hotel information from TTLock Cloud API.

```typescript
const hotelInfo = await cardEncoderAPI.getHotelInfo();
console.log("Hotel:", hotelInfo.hotelName);
```

#### `getServerTime(): Promise<number>`

Gets current server time from TTLock.

```typescript
const serverTime = await cardEncoderAPI.getServerTime();
console.log("Server time:", new Date(serverTime * 1000));
```

### CardEncoder Hardware Methods

#### `connectToEncoder(port: string): Promise<boolean>`

Connects to the card encoder on the specified COM port.

```typescript
await cardEncoderAPI.connectToEncoder("COM3");
```

#### `disconnectFromEncoder(): Promise<boolean>`

Disconnects from the card encoder.

```typescript
await cardEncoderAPI.disconnectFromEncoder();
```

#### `initializeCardEncoder(): Promise<boolean>`

Initializes the card encoder with hotel information.

```typescript
await cardEncoderAPI.initializeCardEncoder();
```

#### `initializeCard(): Promise<boolean>`

Initializes a card for encoding (place card on reader).

```typescript
await cardEncoderAPI.initializeCard();
```

#### `writeCardAccess(access: CardAccess): Promise<boolean>`

Writes access permissions to the card.

```typescript
await cardEncoderAPI.writeCardAccess({
  buildNo: 1,
  floorNo: 2,
  mac: "ABCDEF123456",
  timestamp: Math.floor(Date.now() / 1000) + 24 * 60 * 60,
  allowLockOut: true,
});
```

#### `readCardData(): Promise<CardData>`

Reads data from the card.

```typescript
const cardData = await cardEncoderAPI.readCardData();
console.log("Card number:", cardData.cardNumber);
```

#### `clearCard(): Promise<boolean>`

Clears all data from the card.

```typescript
await cardEncoderAPI.clearCard();
```

### Utility Methods

#### `beep(voiceLen: number, interval: number, voiceCount: number): Promise<boolean>`

Triggers the encoder's beep sound.

```typescript
await cardEncoderAPI.beep(100, 50, 3); // 100ms duration, 50ms interval, 3 beeps
```

#### `getVersion(): Promise<EncoderVersion>`

Gets the encoder's firmware version information.

```typescript
const version = await cardEncoderAPI.getVersion();
console.log("Firmware:", version.firmware);
```

#### `isConnectedToEncoder(): boolean`

Checks if the encoder is connected.

```typescript
const isConnected = cardEncoderAPI.isConnectedToEncoder();
console.log("Encoder connection status:", isConnected);
```

#### `getCurrentPort(): string | null`

Gets the current connected port.

```typescript
const currentPort = cardEncoderAPI.getCurrentPort();
console.log("Current connected port:", currentPort);
```

#### `getCachedHotelInfo(): HotelInfo | null`

Gets the cached hotel information.

```typescript
const hotelInfo = cardEncoderAPI.getCachedHotelInfo();
console.log("Hotel:", hotelInfo?.hotelName);
```

### Workflow Methods

#### `performCompleteCardEncoding(port: string, access: CardAccess): Promise<CardData>`

Complete workflow for encoding a card.

```typescript
const cardData = await cardEncoderAPI.performCompleteCardEncoding("COM3", {
  buildNo: 1,
  floorNo: 2,
  mac: "ABCDEF123456",
  timestamp: Math.floor(Date.now() / 1000) + 24 * 60 * 60,
  allowLockOut: true,
});
```

#### `performCardReading(port: string): Promise<CardData>`

Complete workflow for reading a card.

```typescript
const cardData = await cardEncoderAPI.performCardReading("COM3");
```

## 📊 Data Types

### `HotelInfo`

```typescript
interface HotelInfo {
  hotelId: string;
  hotelName: string;
  hotelInfo: string; // The actual hotelInfo string for CardEncoder
  validUntil: number;
}
```

### `CardAccess`

```typescript
interface CardAccess {
  buildNo: number;
  floorNo: number;
  mac: string;
  timestamp: number;
  allowLockOut: boolean;
}
```

### `CardData`

```typescript
interface CardData {
  cardNumber: string;
  cardId: string;
  hotelArray: string;
}
```

### `CancellationInfo`

```typescript
interface CancellationInfo {
  cardNumber: string;
  timestamp: number;
  reason: string;
}
```

## 🎯 Card Types

### Master Card

- **Build**: 0
- **Floor**: 0
- **MAC**: 000000000000
- **Purpose**: Administrative access

### Building Card

- **Build**: ✓ (specific building)
- **Floor**: 0
- **MAC**: 000000000000
- **Purpose**: Access to entire building

### Floor Card

- **Build**: ✓ (specific building)
- **Floor**: ✓ (specific floor)
- **MAC**: 000000000000
- **Purpose**: Access to specific floor

### Room Card

- **Build**: ✓ (specific building)
- **Floor**: ✓ (specific floor)
- **MAC**: ✓ (specific room MAC)
- **Purpose**: Access to specific room

## ⚠️ Error Codes

| Code | Meaning                            |
| ---- | ---------------------------------- |
| 0    | Success                            |
| 1    | Fail                               |
| 2    | Bad parameter                      |
| 3-5  | Communication error                |
| 13   | Bad hotelInfo                      |
| 106  | Key mismatch or uninitialized card |
| 101  | Card misplaced on reader           |

## 🔄 Advanced Usage Examples

### Manual Step-by-Step Process

```typescript
// 1. Get hotel info
const hotelInfo = await cardEncoderAPI.getHotelInfo();

// 2. Connect to encoder
await cardEncoderAPI.connectToEncoder("COM3");

// 3. Initialize card encoder
await cardEncoderAPI.initializeCardEncoder();

// 4. Initialize card (place card on reader)
await cardEncoderAPI.initializeCard();

// 5. Write access data
await cardEncoderAPI.writeCardAccess({
  buildNo: 1,
  floorNo: 3,
  mac: "123456789ABC",
  timestamp: Math.floor(Date.now() / 1000) + 12 * 60 * 60,
  allowLockOut: false,
});

// 6. Read card data
const cardData = await cardEncoderAPI.readCardData();

// 7. Disconnect
await cardEncoderAPI.disconnectFromEncoder();
```

### Card Cancellation

```typescript
// Cancel a specific card
await cardEncoderAPI.cancelCard("123456789", Math.floor(Date.now() / 1000));

// Read cancellation information
const cancellationInfo = await cardEncoderAPI.readCancellationInfo();
```

### Sector Operations

```typescript
// Read sector raw data
const rawData = await cardEncoderAPI.readSectorRawData({
  sectorNum: 1,
  blockNum: 0,
  isEncrypted: false,
  icKey: "0000000000000000",
  blockData: "0000000000000000",
});

// Write sector raw data
await cardEncoderAPI.writeSectorRawData({
  sectorNum: 1,
  blockNum: 0,
  isEncrypted: false,
  icKey: "0000000000000000",
  blockData: "ABCDEF1234567890",
});
```

## 🛠️ Configuration

### Using Configuration API

```typescript
import { getConfig, setConfig, updateConfig } from "./api/config";

// Get current configuration
const config = getConfig();

// Update specific settings
updateConfig({
  encoder: {
    defaultPort: "COM4",
  },
  card: {
    defaultExpiryHours: 48,
  },
});
```

### Environment Variables

All configuration can be set via environment variables:

```bash
# TTLock Configuration
TTLOCK_CLIENT_ID=your_client_id
TTLOCK_CLIENT_SECRET=your_client_secret
TTLOCK_BASE_URL=https://euapi.ttlock.com/v3
TTLOCK_TIMEOUT=30000

# Encoder Configuration
ENCODER_DEFAULT_PORT=COM3
ENCODER_CONNECTION_TIMEOUT=10000
ENCODER_RETRY_ATTEMPTS=3
ENCODER_RETRY_DELAY=1000

# Card Configuration
CARD_DEFAULT_EXPIRY_HOURS=24
CARD_MAX_EXPIRY_DAYS=30
CARD_DEFAULT_BEEP_DURATION=100
CARD_DEFAULT_BEEP_INTERVAL=50
CARD_DEFAULT_BEEP_COUNT=3

# Error Handling
AUTO_DISCONNECT_ON_ERROR=true
LOG_ERRORS=true
RETRY_ON_CONNECTION_ERROR=true
```

## 🔍 Troubleshooting

### Common Issues

#### Error 106: Key mismatch or uninitialized card

- Ensure hotel info is valid and not expired
- Check that card is properly initialized
- Verify sector configuration matches

#### Error 13: Bad hotelInfo

- Hotel info has expired (valid for 10 minutes)
- Call `getHotelInfo()` to refresh

#### Error 101: Card misplaced on reader

- Ensure card is properly placed on the encoder
- Check card orientation and position

#### Connection Errors

- Verify COM port is correct
- Check that encoder is powered on
- Ensure drivers are installed
- Try different COM ports

### Debug Mode

Enable detailed logging by setting environment variables:

```bash
LOG_ERRORS=true
DEBUG=true
```

## 📚 Additional Resources

- [CardEncoder.dll User Manual](./bridge/Card%20Encoder%20DLL%20User%20Manual-%20Eng.docx)
- [Integration Guide](./bridge/CARD_ENCODER_INTEGRATION.md)
- [Success Stories](./bridge/CARD_ENCODER_SUCCESS.md)
- [Bridge Documentation](./bridge/README.md)

## 🤝 Contributing

When contributing to this API:

1. Follow TypeScript best practices
2. Add proper error handling
3. Include JSDoc comments for new methods
4. Update this README for new features
5. Test with actual hardware when possible

## 📄 License

This implementation is part of the Encoder project. See the main project license for details.
