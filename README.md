# GymBuddy 💪

GymBuddy is a mobile application designed to connect individuals seeking workout partners. The core mission is to eliminate the intimidation and inconsistency of going to the gym alone by fostering a community of motivated, compatible partners.

## Design Philosophy

The app should feel **motivating, approachable, and trustworthy.** It's not just a utility; it's a social motivator. The user experience should be seamless and encouraging, making the process of finding and meeting a gym partner feel safe and exciting.

## Features

- **Partner Matching**: Find compatible workout partners based on fitness goals, schedule, and location
- **Safety & Trust**: Built-in verification and safety features to ensure secure connections
- **Motivation**: Social features to keep users engaged and motivated in their fitness journey
- **Seamless Experience**: Intuitive interface that makes finding a gym partner effortless

## Tech Stack

This project is built with:
- [Expo](https://expo.dev) - React Native framework for cross-platform development
- [React Native](https://reactnative.dev) - Mobile app development
- [TypeScript](https://www.typescriptlang.org) - Type-safe JavaScript

## Getting Started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the development server

   ```bash
   npx expo start
   ```

3. Run on your preferred platform:
   - **iOS Simulator**: Press `i` in the terminal or scan the QR code with Expo Go
   - **Android Emulator**: Press `a` in the terminal
   - **Physical Device**: Scan the QR code with the Expo Go app

## Development

This project uses [file-based routing](https://docs.expo.dev/router/introduction) with the Expo Router. You can start developing by editing the files inside the **app** directory.

### Project Structure

```
gymbuddy/
├── app/                 # Main application screens and routing
│   ├── (tabs)/         # Tab-based navigation screens
│   │   ├── index.tsx   # Home screen
│   │   ├── explore.tsx # Explore screen
│   │   └── _layout.tsx # Tab layout configuration
│   ├── _layout.tsx     # Root layout configuration
│   ├── global.css      # Global styles
│   └── +not-found.tsx # 404 error page
├── components/          # Reusable UI components
├── constants/           # App constants and configuration
├── hooks/              # Custom React hooks
├── assets/             # Images, fonts, and other static assets
├── tailwind.config.js  # Tailwind CSS configuration
└── metro.config.js     # Metro bundler configuration
```

## Contributing

We welcome contributions! Please feel free to submit pull requests or open issues for bugs and feature requests.

## License

This project is licensed under the MIT License.

---

**Built with ❤️ for the fitness community**
