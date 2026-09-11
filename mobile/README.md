# NudgePath Mobile

The official open-source companion mobile application for [NudgePath](https://github.com/ezykl/NudgePath).

Built with **React Native** and **Expo**, designed with a clean, high-contrast dark developer aesthetic.

## ✨ Features

- **Instant QR Pairing**: Point your phone camera at the QR code in your NudgePath Web Settings (**Settings > Mobile Pairing**) to connect immediately. No manual passwords or IP addresses needed.
- **Direct & 100% Self-Hosted**: Connects directly to your local Docker container, Railway, or Render instance via REST API (`/api/v1/`). No third-party servers, no analytics trackers.
- **Job Pipeline Tracker**: View and filter your tracked jobs by status (Applied, Interviewing, Offer, Draft).
- **One-Tap Status Transitions**: Change application status and update records on the go.
- **Smart Link Auto-Fill**: Paste job URLs from **JobStreet**, **Seek**, **Indeed**, and company ATS portals to auto-extract company, title, salary, and requirements.

---

## 🚀 Running the App

### Prerequisites
- Node.js 18+
- [Expo Go](https://expo.dev/go) app installed on your physical iOS or Android device, OR iOS Simulator / Android Studio Emulator.

### Installation

```sh
cd mobile
npm install
```

### Start Development Server

```sh
npm start
```

- Scan the terminal QR code with your camera (iOS) or the **Expo Go** app (Android) to launch on your device.
- Press `a` to open Android Emulator.
- Press `i` to open iOS Simulator.

---

## 📱 Pairing with your NudgePath Instance

1. Ensure your NudgePath Web instance is running (locally or on Railway/Render).
2. On your computer browser, go to **Settings > Mobile Pairing**.
3. In NudgePath Mobile, tap **Scan Pairing QR Code**.
4. Align the QR code in the camera frame — you will be instantly signed in!
