# CardEncoder DLL Integration Guide

This document explains how the CardEncoder.dll has been integrated into the Electron React TypeScript project.

## Overview

The integration allows the Electron application to communicate with card encoding hardware through a native Windows DLL using the `ffi-napi` library. The implementation follows Electron's security best practices with proper context isolation and IPC communication.

## Project Structure

```
src/
├── services/
│   └── CardEncoderService.ts    # DLL integration service
├── components/
│   └── CardEncoderControl.tsx   # React UI component
├── @types/
│   └── global.d.ts             # TypeScript declarations
├── index.ts                    # Main process with IPC handlers
├── preload.ts                  # Preload script with API exposure
└── app.tsx                     # Main React app with UI
```

## Key Components

### 1. CardEncoderService.ts

- **Location**: `src/services/CardEncoderService.ts`
- **Purpose**: Handles DLL loading and function calls
- **Features**:
  - Automatic path resolution for development and production
  - TypeScript interfaces for type safety
  - Error handling and logging
  - Singleton pattern for consistent state

### 2. Main Process Integration

- **Location**: `src/index.ts`
- **Purpose**: Initializes the service and handles IPC communication
- **Features**:
  - Service initialization on app startup
  - IPC handlers for renderer communication
  - Error handling and response formatting

### 3. Preload Script

- **Location**: `src/preload.ts`
- **Purpose**: Securely exposes DLL functions to renderer process
- **Features**:
  - Context isolation compliance
  - Type-safe API exposure
  - Promise-based communication

### 4. React Component

- **Location**: `src/components/CardEncoderControl.tsx`
- **Purpose**: Provides user interface for DLL interaction
- **Features**:
  - Real-time status display
  - Connection management
  - Error messaging
  - Modern UI with Tailwind CSS

## Installation and Setup

### 1. Install Dependencies

```bash
npm install ffi-napi ref-napi ref-struct-napi electron-is-dev
npm install --save-dev @types/node
```

### 2. DLL Files

Ensure the following files are in `assets/encoderDDL/`:

- `CardEncoder.dll` (main library)
- `mfc140u.dll` (runtime dependency)
- `mfc140ud.dll` (debug runtime dependency)
- `msvcp140.dll` (runtime dependency)
- `msvcp140d.dll` (debug runtime dependency)
- `ucrtbase.dll` (runtime dependency)
- `ucrtbased.dll` (debug runtime dependency)
- `vcruntime140.dll` (runtime dependency)
- `vcruntime140d.dll` (debug runtime dependency)

### 3. Build Configuration

The `package.json` includes build configuration to include DLL files:

```json
{
  "build": {
    "extraResources": [
      {
        "from": "assets/encoderDDL",
        "to": "assets/encoderDDL",
        "filter": ["**/*.dll"]
      }
    ]
  }
}
```

## Usage

### Development

1. Start the application: `npm start`
2. The CardEncoder service will automatically initialize
3. Use the UI to connect to your device via COM port

### Production Build

1. Package the application: `npm run package`
2. The DLL files will be included in the final build
3. The application will automatically locate the DLL in the resources folder

## API Reference

### CardEncoderService Methods

#### `initialize(): boolean`

Initializes the DLL and returns success status.

#### `connectComm(port: string): number`

Connects to the device on the specified COM port.

- **Parameters**: `port` - COM port (e.g., 'COM3')
- **Returns**: Result code from the DLL

#### `disconnectComm(): number`

Disconnects from the device.

- **Returns**: Result code from the DLL

#### `isInitialized(): boolean`

Checks if the service is properly initialized.

### Renderer Process API

The renderer process can access these functions through `window.electronAPI.cardEncoder`:

#### `connectComm(port: string): Promise<{success: boolean, result?: number, error?: string}>`

#### `disconnectComm(): Promise<{success: boolean, result?: number, error?: string}>`

#### `isInitialized(): Promise<boolean>`

## Error Handling

The integration includes comprehensive error handling:

1. **DLL Loading Errors**: Caught during initialization
2. **Connection Errors**: Handled with detailed error messages
3. **IPC Communication Errors**: Proper error propagation
4. **Type Safety**: TypeScript interfaces prevent runtime errors

## Security Considerations

1. **Context Isolation**: All native calls go through the main process
2. **Input Validation**: COM port validation before DLL calls
3. **Error Boundaries**: Graceful handling of DLL failures
4. **Resource Management**: Proper cleanup on disconnect

## Troubleshooting

### Common Issues

1. **DLL Not Found**

   - Ensure DLL files are in the correct location
   - Check file permissions
   - Verify 32-bit/64-bit compatibility

2. **Connection Failures**

   - Verify COM port is correct
   - Check device is connected and powered
   - Ensure no other application is using the port

3. **Build Issues**
   - Verify DLL files are included in build configuration
   - Check file paths are correct for your OS

### Debug Information

The application logs detailed information to the console:

- DLL loading status
- Connection attempts and results
- Error details and stack traces

## Extending the Integration

To add more DLL functions:

1. **Update CardEncoderService.ts**:

   - Add function signature to `CardEncoderLibrary` interface
   - Implement the method in the service class

2. **Update IPC handlers**:

   - Add new handler in `setupCardEncoderHandlers()`
   - Handle parameters and return values

3. **Update preload script**:

   - Expose new function to renderer process

4. **Update TypeScript declarations**:

   - Add new function to `ElectronAPI` interface

5. **Update React component**:
   - Add UI controls for new functionality

## Performance Considerations

- DLL functions are called synchronously in the main process
- IPC communication is asynchronous for UI responsiveness
- Error handling prevents blocking on DLL failures
- Resource cleanup ensures proper memory management

## License

This integration follows the same license as the main project (MIT).
