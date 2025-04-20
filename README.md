# DriverConnect - Professional Driver Hiring App

DriverConnect is a comprehensive mobile application that connects users with professional drivers and other service providers. The app allows users to search for professionals, view their profiles, chat with them, and hire them for jobs.

## Features

- **User Authentication**: Secure login and signup with OTP verification
- **Professional Search**: Find drivers and other professionals based on location, skills, and availability
- **Real-time Chat**: Communicate with professionals directly through the app
- **Job Posting**: Post jobs and receive applications from professionals
- **Profile Management**: Create and manage detailed profiles with skills, vehicle types, and government verification
- **Availability Management**: Professionals can set their availability status and working hours
- **Rating System**: Rate and review professionals after service completion
- **Dual Mode**: Switch between "Hire" and "Work" modes for different user experiences

## Tech Stack

- **Framework**: React Native with Expo
- **State Management**: Zustand with AsyncStorage persistence
- **Navigation**: Expo Router (file-based routing)
- **UI Components**: Custom components with react-native StyleSheet
- **Icons**: Lucide React Native
- **Animations**: React Native Animated API
- **Visual Effects**: Expo LinearGradient

## Project Structure

```
/
├── app/                    # Main application screens (Expo Router)
│   ├── (auth)/             # Authentication screens
│   ├── (tabs)/             # Tab navigation screens
│   ├── chat/               # Chat screens
│   ├── driver/             # Driver profile screens
│   └── _layout.tsx         # Root layout with navigation setup
├── assets/                 # Static assets (images, fonts)
├── components/             # Reusable UI components
├── constants/              # App constants (colors, etc.)
├── hooks/                  # Custom React hooks
├── store/                  # Zustand state management
├── styles/                 # Shared styles
├── types/                  # TypeScript type definitions
└── utils/                  # Utility functions
```

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/driver-connect.git
cd driver-connect
```

2. Install dependencies:
```bash
npm install