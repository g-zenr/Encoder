// CardEncoder API Configuration
export interface CardEncoderConfig {
  // TTLock Cloud API Configuration
  ttlock: {
    baseUrl: string;
    clientId: string;
    clientSecret: string;
    timeout: number; // milliseconds
  };

  // CardEncoder Hardware Configuration
  encoder: {
    defaultPort: string;
    connectionTimeout: number; // milliseconds
    retryAttempts: number;
    retryDelay: number; // milliseconds
  };

  // Card Configuration
  card: {
    defaultExpiryHours: number;
    maxExpiryDays: number;
    defaultBeepDuration: number; // milliseconds
    defaultBeepInterval: number; // milliseconds
    defaultBeepCount: number;
  };

  // Error Handling Configuration
  errorHandling: {
    autoDisconnectOnError: boolean;
    logErrors: boolean;
    retryOnConnectionError: boolean;
  };
}

// Default configuration
export const defaultConfig: CardEncoderConfig = {
  ttlock: {
    baseUrl: "https://euapi.ttlock.com/v3",
    clientId: process.env.TTLOCK_CLIENT_ID || "",
    clientSecret: process.env.TTLOCK_CLIENT_SECRET || "",
    timeout: 30000, // 30 seconds
  },

  encoder: {
    defaultPort: "COM3",
    connectionTimeout: 10000, // 10 seconds
    retryAttempts: 3,
    retryDelay: 1000, // 1 second
  },

  card: {
    defaultExpiryHours: 24,
    maxExpiryDays: 30,
    defaultBeepDuration: 100,
    defaultBeepInterval: 50,
    defaultBeepCount: 3,
  },

  errorHandling: {
    autoDisconnectOnError: true,
    logErrors: true,
    retryOnConnectionError: true,
  },
};

// Configuration validation
export function validateConfig(config: CardEncoderConfig): string[] {
  const errors: string[] = [];

  // Validate TTLock configuration
  if (!config.ttlock.clientId) {
    errors.push("TTLock client ID is required");
  }

  if (!config.ttlock.clientSecret) {
    errors.push("TTLock client secret is required");
  }

  if (config.ttlock.timeout <= 0) {
    errors.push("TTLock timeout must be greater than 0");
  }

  // Validate encoder configuration
  if (!config.encoder.defaultPort) {
    errors.push("Default encoder port is required");
  }

  if (config.encoder.connectionTimeout <= 0) {
    errors.push("Connection timeout must be greater than 0");
  }

  if (config.encoder.retryAttempts < 0) {
    errors.push("Retry attempts must be non-negative");
  }

  // Validate card configuration
  if (config.card.defaultExpiryHours <= 0) {
    errors.push("Default expiry hours must be greater than 0");
  }

  if (config.card.maxExpiryDays <= 0) {
    errors.push("Max expiry days must be greater than 0");
  }

  return errors;
}

// Environment variable helpers
export function loadConfigFromEnv(): CardEncoderConfig {
  return {
    ttlock: {
      baseUrl: process.env.TTLOCK_BASE_URL || defaultConfig.ttlock.baseUrl,
      clientId: process.env.TTLOCK_CLIENT_ID || defaultConfig.ttlock.clientId,
      clientSecret:
        process.env.TTLOCK_CLIENT_SECRET || defaultConfig.ttlock.clientSecret,
      timeout: parseInt(process.env.TTLOCK_TIMEOUT || "30000"),
    },

    encoder: {
      defaultPort:
        process.env.ENCODER_DEFAULT_PORT || defaultConfig.encoder.defaultPort,
      connectionTimeout: parseInt(
        process.env.ENCODER_CONNECTION_TIMEOUT || "10000"
      ),
      retryAttempts: parseInt(process.env.ENCODER_RETRY_ATTEMPTS || "3"),
      retryDelay: parseInt(process.env.ENCODER_RETRY_DELAY || "1000"),
    },

    card: {
      defaultExpiryHours: parseInt(
        process.env.CARD_DEFAULT_EXPIRY_HOURS || "24"
      ),
      maxExpiryDays: parseInt(process.env.CARD_MAX_EXPIRY_DAYS || "30"),
      defaultBeepDuration: parseInt(
        process.env.CARD_DEFAULT_BEEP_DURATION || "100"
      ),
      defaultBeepInterval: parseInt(
        process.env.CARD_DEFAULT_BEEP_INTERVAL || "50"
      ),
      defaultBeepCount: parseInt(process.env.CARD_DEFAULT_BEEP_COUNT || "3"),
    },

    errorHandling: {
      autoDisconnectOnError: process.env.AUTO_DISCONNECT_ON_ERROR !== "false",
      logErrors: process.env.LOG_ERRORS !== "false",
      retryOnConnectionError: process.env.RETRY_ON_CONNECTION_ERROR !== "false",
    },
  };
}

// Configuration singleton
let currentConfig: CardEncoderConfig = defaultConfig;

export function getConfig(): CardEncoderConfig {
  return currentConfig;
}

export function setConfig(config: CardEncoderConfig): void {
  const errors = validateConfig(config);
  if (errors.length > 0) {
    throw new Error(`Invalid configuration: ${errors.join(", ")}`);
  }
  currentConfig = config;
}

export function updateConfig(updates: Partial<CardEncoderConfig>): void {
  const newConfig = { ...currentConfig, ...updates };
  setConfig(newConfig);
}

// Initialize configuration from environment
export function initializeConfig(): void {
  try {
    const envConfig = loadConfigFromEnv();
    setConfig(envConfig);
  } catch (error) {
    console.warn(
      "Failed to load configuration from environment, using defaults:",
      error
    );
  }
}
