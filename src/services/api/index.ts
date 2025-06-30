// Main API exports
export {
  cardEncoderAPI,
  ErrorCodes,
  type HotelInfo,
  type CardAccess,
  type CardData,
  type CancellationInfo,
  type EncoderVersion,
  type SectorData,
  type ErrorCode,
} from "./cardEncoderApi";

// Export the class as default
export { default as CardEncoderAPI } from "./cardEncoderApi";

// Configuration exports
export {
  getConfig,
  setConfig,
  updateConfig,
  initializeConfig,
  loadConfigFromEnv,
  validateConfig,
  type CardEncoderConfig,
  defaultConfig,
} from "./config";
