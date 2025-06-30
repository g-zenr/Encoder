import { spawn } from "child_process";
import path from "path";

// Types and Interfaces
export interface HotelInfo {
  hotelId: string;
  hotelName: string;
  hotelInfo: string; // The actual hotelInfo string for CardEncoder
  validUntil: number;
}

export interface CardAccess {
  buildNo: number;
  floorNo: number;
  mac: string;
  timestamp: number;
  allowLockOut: boolean;
}

export interface CardData {
  cardNumber: string;
  cardId: string;
  hotelArray: string;
}

export interface CancellationInfo {
  cardNumber: string;
  timestamp: number;
  reason: string;
}

export interface EncoderVersion {
  firmware: string;
  hardware: string;
  protocol: string;
}

export interface SectorData {
  sectorNum: number;
  blockNum: number;
  isEncrypted: boolean;
  icKey: string;
  blockData: string;
}

// Error codes mapping
export const ErrorCodes = {
  SUCCESS: 0,
  FAIL: 1,
  BAD_PARAM: 2,
  COMM_ERROR_3: 3,
  COMM_ERROR_4: 4,
  COMM_ERROR_5: 5,
  BAD_HOTEL_INFO: 13,
  KEY_MISMATCH: 106,
  CARD_MISPLACED: 101,
} as const;

export type ErrorCode = (typeof ErrorCodes)[keyof typeof ErrorCodes];

// TTLock Cloud API Configuration
const TTLOCK_BASE_URL = "https://euapi.ttlock.com/v3";
const TTLOCK_CLIENT_ID = process.env.TTLOCK_CLIENT_ID || "";
const TTLOCK_CLIENT_SECRET = process.env.TTLOCK_CLIENT_SECRET || "";

// Bridge executable path
const BRIDGE_PATH = path.join(__dirname, "../bridge/CardEncoderBridge.exe");

class CardEncoderAPI {
  private hotelInfo: HotelInfo | null = null;
  private isConnected = false;
  private currentPort: string | null = null;

  // TTLock Cloud API Methods
  async getHotelInfo(): Promise<HotelInfo> {
    try {
      const date = Math.floor(Date.now() / 1000);
      const url = `${TTLOCK_BASE_URL}/hotel/getInfo?clientId=${TTLOCK_CLIENT_ID}&clientSecret=${TTLOCK_CLIENT_SECRET}&date=${date}`;

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.errcode !== 0) {
        throw new Error(`TTLock API error: ${data.errmsg}`);
      }

      this.hotelInfo = {
        hotelId: data.hotelId,
        hotelName: data.hotelName,
        hotelInfo: data.hotelInfo,
        validUntil: Date.now() + 10 * 60 * 1000, // 10 minutes
      };

      return this.hotelInfo;
    } catch (error) {
      throw new Error(
        `Failed to get hotel info: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  async getServerTime(): Promise<number> {
    try {
      const url = `${TTLOCK_BASE_URL}/hotel/getServerDateTime`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.errcode !== 0) {
        throw new Error(`TTLock API error: ${data.errmsg}`);
      }

      return data.serverDateTime;
    } catch (error) {
      throw new Error(
        `Failed to get server time: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  // Bridge Communication Helper
  private async executeBridgeCommand(
    command: string,
    args: string[] = []
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const process = spawn(BRIDGE_PATH, [command, ...args]);

      let stdout = "";
      let stderr = "";

      process.stdout.on("data", (data) => {
        stdout += data.toString();
      });

      process.stderr.on("data", (data) => {
        stderr += data.toString();
      });

      process.on("close", (code) => {
        if (code === 0) {
          resolve(stdout.trim());
        } else {
          reject(
            new Error(`Bridge command failed with code ${code}: ${stderr}`)
          );
        }
      });

      process.on("error", (error) => {
        reject(new Error(`Failed to execute bridge command: ${error.message}`));
      });
    });
  }

  // CardEncoder.dll API Methods
  async connectToEncoder(port: string): Promise<boolean> {
    try {
      const result = await this.executeBridgeCommand("connect", [port]);
      const resultCode = parseInt(result.split(": ")[1]);

      if (resultCode === ErrorCodes.SUCCESS) {
        this.isConnected = true;
        this.currentPort = port;
        return true;
      } else {
        throw new Error(`Connection failed with code: ${resultCode}`);
      }
    } catch (error) {
      throw new Error(
        `Failed to connect to encoder: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  async disconnectFromEncoder(): Promise<boolean> {
    try {
      const result = await this.executeBridgeCommand("disconnect");
      const resultCode = parseInt(result.split(": ")[1]);

      if (resultCode === ErrorCodes.SUCCESS) {
        this.isConnected = false;
        this.currentPort = null;
        return true;
      } else {
        throw new Error(`Disconnection failed with code: ${resultCode}`);
      }
    } catch (error) {
      throw new Error(
        `Failed to disconnect from encoder: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  async initializeCardEncoder(): Promise<boolean> {
    if (!this.hotelInfo) {
      throw new Error("Hotel info not available. Call getHotelInfo() first.");
    }

    try {
      const result = await this.executeBridgeCommand("initcardencoder", [
        this.hotelInfo.hotelInfo,
      ]);
      const resultCode = parseInt(result.split(": ")[1]);

      if (resultCode === ErrorCodes.SUCCESS) {
        return true;
      } else {
        throw new Error(
          `Card encoder initialization failed with code: ${resultCode}`
        );
      }
    } catch (error) {
      throw new Error(
        `Failed to initialize card encoder: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  async initializeCard(): Promise<boolean> {
    if (!this.hotelInfo) {
      throw new Error("Hotel info not available. Call getHotelInfo() first.");
    }

    try {
      const result = await this.executeBridgeCommand("initcard", [
        this.hotelInfo.hotelInfo,
      ]);
      const resultCode = parseInt(result.split(": ")[1]);

      if (resultCode === ErrorCodes.SUCCESS) {
        return true;
      } else {
        throw new Error(`Card initialization failed with code: ${resultCode}`);
      }
    } catch (error) {
      throw new Error(
        `Failed to initialize card: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  async stopCardInitialization(): Promise<boolean> {
    try {
      const result = await this.executeBridgeCommand("stopinitcard");
      const resultCode = parseInt(result.split(": ")[1]);

      if (resultCode === ErrorCodes.SUCCESS) {
        return true;
      } else {
        throw new Error(
          `Stop card initialization failed with code: ${resultCode}`
        );
      }
    } catch (error) {
      throw new Error(
        `Failed to stop card initialization: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  async writeCardAccess(access: CardAccess): Promise<boolean> {
    if (!this.hotelInfo) {
      throw new Error("Hotel info not available. Call getHotelInfo() first.");
    }

    try {
      const args = [
        this.hotelInfo.hotelInfo,
        access.buildNo.toString(),
        access.floorNo.toString(),
        access.mac,
        access.timestamp.toString(),
        access.allowLockOut.toString(),
      ];

      const result = await this.executeBridgeCommand("writecard", args);
      const resultCode = parseInt(result.split(": ")[1]);

      if (resultCode === ErrorCodes.SUCCESS) {
        return true;
      } else {
        throw new Error(`Write card access failed with code: ${resultCode}`);
      }
    } catch (error) {
      throw new Error(
        `Failed to write card access: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  async readCardData(): Promise<CardData> {
    if (!this.hotelInfo) {
      throw new Error("Hotel info not available. Call getHotelInfo() first.");
    }

    try {
      const readResult = await this.executeBridgeCommand("readcard", [
        this.hotelInfo.hotelInfo,
      ]);
      const cardNoResult = await this.executeBridgeCommand("getcardno");
      const cardIdResult = await this.executeBridgeCommand("getcardid");

      return {
        cardNumber: cardNoResult.split(": ")[1],
        cardId: cardIdResult.split(": ")[1],
        hotelArray: readResult.split(": ")[1],
      };
    } catch (error) {
      throw new Error(
        `Failed to read card data: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  async getCardNumber(): Promise<string> {
    try {
      const result = await this.executeBridgeCommand("getcardno");
      return result.split(": ")[1];
    } catch (error) {
      throw new Error(
        `Failed to get card number: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  async getCardId(): Promise<string> {
    try {
      const result = await this.executeBridgeCommand("getcardid");
      return result.split(": ")[1];
    } catch (error) {
      throw new Error(
        `Failed to get card ID: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  async clearCard(): Promise<boolean> {
    if (!this.hotelInfo) {
      throw new Error("Hotel info not available. Call getHotelInfo() first.");
    }

    try {
      const result = await this.executeBridgeCommand("clearcard", [
        this.hotelInfo.hotelInfo,
      ]);
      const resultCode = parseInt(result.split(": ")[1]);

      if (resultCode === ErrorCodes.SUCCESS) {
        return true;
      } else {
        throw new Error(`Clear card failed with code: ${resultCode}`);
      }
    } catch (error) {
      throw new Error(
        `Failed to clear card: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  async beep(
    voiceLen: number,
    interval: number,
    voiceCount: number
  ): Promise<boolean> {
    try {
      const result = await this.executeBridgeCommand("beep", [
        voiceLen.toString(),
        interval.toString(),
        voiceCount.toString(),
      ]);
      const resultCode = parseInt(result.split(": ")[1]);

      if (resultCode === ErrorCodes.SUCCESS) {
        return true;
      } else {
        throw new Error(`Beep failed with code: ${resultCode}`);
      }
    } catch (error) {
      throw new Error(
        `Failed to beep: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  async getVersion(): Promise<EncoderVersion> {
    try {
      const result = await this.executeBridgeCommand("getversion");
      const versionStr = result.split(": ")[1];

      // Parse version string (assuming JSON format)
      try {
        return JSON.parse(versionStr);
      } catch {
        // Fallback if not JSON
        return {
          firmware: versionStr,
          hardware: "Unknown",
          protocol: "Unknown",
        };
      }
    } catch (error) {
      throw new Error(
        `Failed to get version: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  async cancelCard(cardNumber: string, timestamp: number): Promise<boolean> {
    if (!this.hotelInfo) {
      throw new Error("Hotel info not available. Call getHotelInfo() first.");
    }

    try {
      const result = await this.executeBridgeCommand("cancelcard", [
        this.hotelInfo.hotelInfo,
        cardNumber,
        timestamp.toString(),
      ]);
      const resultCode = parseInt(result.split(": ")[1]);

      if (resultCode === ErrorCodes.SUCCESS) {
        return true;
      } else {
        throw new Error(`Cancel card failed with code: ${resultCode}`);
      }
    } catch (error) {
      throw new Error(
        `Failed to cancel card: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  async readCancellationInfo(): Promise<CancellationInfo[]> {
    if (!this.hotelInfo) {
      throw new Error("Hotel info not available. Call getHotelInfo() first.");
    }

    try {
      const result = await this.executeBridgeCommand("readcancellationinfo", [
        this.hotelInfo.hotelInfo,
      ]);
      const infoStr = result.split(": ")[1];

      // Parse cancellation info (assuming JSON array format)
      try {
        return JSON.parse(infoStr);
      } catch {
        // Fallback if not JSON
        return [];
      }
    } catch (error) {
      throw new Error(
        `Failed to read cancellation info: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  async configServer(url: string): Promise<boolean> {
    try {
      const result = await this.executeBridgeCommand("configserver", [url]);
      return result.toLowerCase().includes("true");
    } catch (error) {
      throw new Error(
        `Failed to config server: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  async setSectors(sectors: string): Promise<boolean> {
    try {
      const result = await this.executeBridgeCommand("setsectors", [sectors]);
      const resultCode = parseInt(result.split(": ")[1]);

      if (resultCode === ErrorCodes.SUCCESS) {
        return true;
      } else {
        throw new Error(`Set sectors failed with code: ${resultCode}`);
      }
    } catch (error) {
      throw new Error(
        `Failed to set sectors: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  async getSectors(): Promise<string> {
    try {
      const result = await this.executeBridgeCommand("getsectors");
      return result.split(": ")[1];
    } catch (error) {
      throw new Error(
        `Failed to get sectors: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  async readSectorRawData(sectorData: SectorData): Promise<string> {
    try {
      const args = [
        sectorData.sectorNum.toString(),
        sectorData.blockNum.toString(),
        sectorData.isEncrypted.toString(),
        sectorData.icKey,
        sectorData.blockData,
      ];

      const result = await this.executeBridgeCommand("readsectorrawdata", args);
      const resultCode = parseInt(result.split(": ")[1]);

      if (resultCode === ErrorCodes.SUCCESS) {
        return result.split("Block Data: ")[1];
      } else {
        throw new Error(`Read sector raw data failed with code: ${resultCode}`);
      }
    } catch (error) {
      throw new Error(
        `Failed to read sector raw data: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  async writeSectorRawData(sectorData: SectorData): Promise<boolean> {
    try {
      const args = [
        sectorData.sectorNum.toString(),
        sectorData.blockNum.toString(),
        sectorData.isEncrypted.toString(),
        sectorData.icKey,
        sectorData.blockData,
      ];

      const result = await this.executeBridgeCommand(
        "writesectorrawdata",
        args
      );
      const resultCode = parseInt(result.split(": ")[1]);

      if (resultCode === ErrorCodes.SUCCESS) {
        return true;
      } else {
        throw new Error(
          `Write sector raw data failed with code: ${resultCode}`
        );
      }
    } catch (error) {
      throw new Error(
        `Failed to write sector raw data: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  // Utility Methods
  isConnectedToEncoder(): boolean {
    return this.isConnected;
  }

  getCurrentPort(): string | null {
    return this.currentPort;
  }

  getCachedHotelInfo(): HotelInfo | null {
    return this.hotelInfo;
  }

  // Complete workflow methods
  async performCompleteCardEncoding(
    port: string,
    access: CardAccess
  ): Promise<CardData> {
    try {
      // 1. Get hotel info
      await this.getHotelInfo();

      // 2. Connect to encoder
      await this.connectToEncoder(port);

      // 3. Initialize card encoder
      await this.initializeCardEncoder();

      // 4. Initialize card
      await this.initializeCard();

      // 5. Write card access
      await this.writeCardAccess(access);

      // 6. Read card data
      const cardData = await this.readCardData();

      // 7. Disconnect
      await this.disconnectFromEncoder();

      return cardData;
    } catch (error) {
      // Ensure disconnection on error
      if (this.isConnected) {
        try {
          await this.disconnectFromEncoder();
        } catch (disconnectError) {
          console.error("Failed to disconnect after error:", disconnectError);
        }
      }
      throw error;
    }
  }

  async performCardReading(port: string): Promise<CardData> {
    try {
      // 1. Get hotel info
      await this.getHotelInfo();

      // 2. Connect to encoder
      await this.connectToEncoder(port);

      // 3. Initialize card encoder
      await this.initializeCardEncoder();

      // 4. Read card data
      const cardData = await this.readCardData();

      // 5. Disconnect
      await this.disconnectFromEncoder();

      return cardData;
    } catch (error) {
      // Ensure disconnection on error
      if (this.isConnected) {
        try {
          await this.disconnectFromEncoder();
        } catch (disconnectError) {
          console.error("Failed to disconnect after error:", disconnectError);
        }
      }
      throw error;
    }
  }
}

// Export singleton instance
export const cardEncoderAPI = new CardEncoderAPI();

// Export the class for custom instances
export default CardEncoderAPI;
