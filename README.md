# Project X - Mobile App Prototype

A React Native mobile app prototype showcasing a platform connecting workers with job opportunities.

## Features

- 📱 Beautiful and modern UI with smooth animations
- 🎨 Consistent design system with custom components
- 🔐 Authentication flow (with mock data)
- 👥 User profiles for workers and employers
- 💼 Job listings and categories
- 💬 Chat functionality (with mock conversations)
- 📍 Location-based job search
- ⭐ Ratings and reviews system

## Getting Started

### Prerequisites

- Node.js (v16 or later)
- npm or yarn
- Expo CLI
- iOS Simulator or Android Emulator

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/project-x.git
cd project-x
```

1. Install dependencies:

```bash
npm install
# or
yarn install
```

1. Start the development server:

```bash
npm start
# or
yarn start
```

1. Open the app in your simulator/emulator or scan the QR code with Expo Go app on your device.

## Demo Credentials

For testing the prototype, use these credentials:

- Phone: Any valid phone number
- OTP: 1234 (mock verification code)

## Tech Stack

- React Native
- Expo
- TypeScript
- Zustand (State Management)
- React Navigation
- React Native Reanimated
- AsyncStorage

## Project Structure

```plaintext
project-x/
├── app/                   # App screens and navigation
│   ├── (auth)/           # Authentication screens
│   ├── (tabs)/           # Main tab screens
│   ├── chat/             # Chat screens
│   ├── job/              # Job related screens
│   └── worker/           # Worker profile screens
├── src/
│   ├── components/       # Reusable components
│   ├── constants/        # Theme and mock data
│   ├── navigation/       # Navigation configuration
│   ├── store/           # State management
│   ├── types/           # TypeScript types
│   └── utils/           # Utility functions
└── assets/              # Images and fonts
```

## Contributing

This is a prototype version for demonstration purposes. Feel free to fork and modify for your needs.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
