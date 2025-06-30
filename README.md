# Lock-Encoder

A cross-platform desktop application for managing card encoders and hotel access systems. Built with Electron, React, TypeScript, and Tailwind CSS.

## 🏨 Overview

Lock-Encoder is a comprehensive desktop application designed for hotel management systems that use card-based access control. It provides an intuitive interface for connecting to card encoders, configuring hotel settings, and performing various card operations.

## ✨ Features

### 🔌 Encoder Connection

- Connect to card encoders via COM ports
- Real-time connection status monitoring
- Support for multiple COM port configurations
- Easy connect/disconnect functionality

### 🏨 Hotel Configuration

- Integration with TTLock API
- Client ID and Secret management
- Hotel information fetching
- Encoder initialization

### 🎫 Card Operations

- Initialize new cards
- Write card data with hotel information
- Read existing card data
- Clear card data
- Support for different card types (Room Access, etc.)
- Building and floor number configuration
- MAC address management

### ⚙️ Advanced Operations

- Raw sector data reading and writing
- Sector data parsing
- Data generation utilities
- Hexadecimal data management

### 📊 System Monitoring

- Real-time system status dashboard
- Activity logging with timestamps
- Operation success/failure tracking
- Connection status indicators

## 🛠️ Technology Stack

- **Electron** - Cross-platform desktop application framework
- **React** - Component-based UI library
- **TypeScript** - Type-safe JavaScript development
- **Tailwind CSS** - Utility-first CSS framework
- **Electron Forge** - Packaging and distribution tool

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository:

```bash
git clone <your-repository-url>
cd Lock-Encoder
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run start
```

### Building for Production

Package the application for distribution:

```bash
npm run make
```

This will create distributable packages for your platform (Windows, macOS, Linux).

## 📁 Project Structure

```
src/
├── components/
│   ├── atoms/          # Basic UI components (Button, Input, etc.)
│   ├── molecules/      # Composite components (ActivityLog, SystemStatus)
│   ├── organisms/      # Complex feature components
│   │   ├── EncoderConnection.tsx
│   │   ├── HotelConfiguration.tsx
│   │   ├── CardOperations.tsx
│   │   └── AdvancedOperations.tsx
│   └── templates/      # Layout templates
├── services/           # Business logic and API services
├── app.tsx            # Main application component
└── index.ts           # Application entry point
```

## 🔧 Configuration

### COM Port Setup

- The application automatically detects available COM ports
- Select the appropriate port for your card encoder
- Ensure the encoder is properly connected before attempting to connect

### Hotel API Configuration

- Obtain Client ID and Secret from your TTLock account
- Configure hotel settings before performing card operations
- Initialize the encoder after successful hotel configuration

## 📝 Usage

1. **Connect to Encoder**: Select the appropriate COM port and click "Connect"
2. **Configure Hotel**: Enter your TTLock API credentials and fetch hotel information
3. **Initialize Encoder**: Set up the encoder with hotel configuration
4. **Perform Card Operations**: Use the card operations panel to manage cards
5. **Monitor Activity**: Check the activity log for operation status and history

## 🐛 Troubleshooting

### Connection Issues

- Verify the card encoder is properly connected
- Check if the COM port is available and not in use by another application
- Ensure proper drivers are installed for your encoder

### API Configuration

- Verify your TTLock API credentials are correct
- Check your internet connection for API calls
- Ensure your account has the necessary permissions

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

For support and questions, please open an issue in the repository or contact the development team.

---

**Note**: This application is designed for use with compatible card encoders and TTLock hotel management systems. Ensure your hardware and API credentials are properly configured before use.
