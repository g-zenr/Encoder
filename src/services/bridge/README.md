# CardEncoderBridge

This folder contains the CardEncoderBridge components for integrating with the CardEncoder.dll.

## Files

- `CardEncoderBridge.cs` - C# source code for the bridge
- `CardEncoderBridge.exe` - Compiled executable
- `CardEncoderBridge.dll` - Compiled library
- `CardEncoderBridge.pdb` - Debug symbols
- `CardEncoderBridge.deps.json` - .NET dependencies
- `CardEncoderBridge.runtimeconfig.json` - .NET runtime configuration
- `build-bridge.bat` - Build script for the bridge
- `CARD_ENCODER_INTEGRATION.md` - Integration documentation
- `CARD_ENCODER_SUCCESS.md` - Success documentation

## Usage

The bridge provides a command-line interface for connecting to and disconnecting from the card encoder:

```bash
# Connect to a specific port
CardEncoderBridge.exe connect <port>

# Disconnect
CardEncoderBridge.exe disconnect
```

## Building

Run the build script to compile the bridge:

```bash
build-bridge.bat
```

## Dependencies

The CardEncoder.dll and its dependencies are located in `../assets/encoderDDL/`.
