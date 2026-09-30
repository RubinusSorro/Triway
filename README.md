# TriWay

TriWay is an academic Expo/React Native MVP for demonstrating a tricycle-booking flow in Antipolo City, Rizal. A rider can choose a sample route, create a cash booking, track its status, switch to the driver view, complete the trip, and then see it in ride history.

The current MVP uses local prototype users and an in-memory ride repository. It does not require a backend or a Firebase account. Routes, fares, locations, passes, the map, and driver details are demo data and are not official or production-ready.

## Requirements

Required:

- [Git](https://git-scm.com/downloads) to clone the repository.
- [Node.js](https://nodejs.org/) **22.13.x or newer**. Expo SDK 57 has a minimum Node.js version of 22.13.x.
- [pnpm](https://pnpm.io/installation). The repository contains `pnpm-lock.yaml` and must be installed with pnpm. The setup was verified with pnpm 11.25.0.

Choose at least one way to open the app:

- [Expo Go](https://expo.dev/go) on a physical Android or iOS device for the simplest student demo.
- A modern web browser for Expo Web.
- [Android Studio](https://developer.android.com/studio) with an Android Virtual Device, only if you want to use an emulator.

Firebase, a global Expo CLI installation, Android Studio, Xcode, and EAS CLI are **not required** for the default demo. Expo's project-local CLI is run through the package scripts or `npx expo`.

Check the required tools:

```bash
node --version
pnpm --version
git --version
```

## Clone / Project Setup

The repository URL is not available in this checkout. Replace the marked placeholder with the real Git URL supplied by the project owner:

```bash
git clone <YOUR-REPOSITORY-URL>
cd Triway
```

If the project was provided as a ZIP file, extract it and open a terminal in the extracted `Triway` directory instead.

## Install Dependencies

Install the exact dependency graph recorded in `pnpm-lock.yaml`:

```bash
pnpm install --frozen-lockfile
```

Use plain `pnpm install` only when intentionally updating the lockfile. Do not use `npm install`, Yarn, or Bun for this repository.

The main installed runtime packages are Expo SDK 57, React Native 0.86, React 19, Expo Router, React Native Web, Firebase's JavaScript SDK, Expo Image, Expo Fonts/Inter, Expo Linear Gradient, React Native SVG, and the React Native screen/safe-area packages. pnpm installs all transitive packages automatically; no individual package installation is needed.

## Environment Variables

No environment file is needed for the working mock/demo mode. When `EXPO_PUBLIC_USE_FIREBASE` is absent or set to `false`, TriWay automatically uses the in-memory ride repository.

The repository includes `.env.example` for the unfinished Firebase integration. If you want a local copy of the template, copy it to `.env.local`, which is already ignored by Git.

macOS, Linux, or Git Bash:

```bash
cp .env.example .env.local
```

Windows PowerShell:

```powershell
Copy-Item .env.example .env.local
```

The supported structure is:

```dotenv
EXPO_PUBLIC_FIREBASE_API_KEY=
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=
EXPO_PUBLIC_FIREBASE_PROJECT_ID=
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
EXPO_PUBLIC_FIREBASE_APP_ID=
EXPO_PUBLIC_USE_FIREBASE=false
```

Keep `EXPO_PUBLIC_USE_FIREBASE=false` for this MVP. Expo embeds every `EXPO_PUBLIC_` value in the client bundle, so never put private keys, service-account credentials, passwords, or other secrets in these variables.

## Firebase Setup

### Mock/demo mode (working and recommended)

- Firebase is not required.
- Prototype rider/driver identities are created locally; Firebase Authentication is not used.
- Routes and passes come from local sample data.
- Ride creation, status changes, and history use one in-memory repository inside the running app.
- Data resets after a full app reload, refresh, or development-server restart and does not synchronize between separate devices.

Start the app without an environment file, or leave `EXPO_PUBLIC_USE_FIREBASE=false`.

### Firebase mode (scaffold only; not currently usable)

The repository contains Firebase app, Authentication, and Firestore initialization helpers, but they are not connected to the UI. `features/rides/services/firebaseRideRepository.ts` is a placeholder: write operations throw an error and subscriptions return no rides. No Firestore collection structure, security rules, required documents, or Firebase Authentication flow has been implemented.

Therefore:

- Do not set `EXPO_PUBLIC_USE_FIREBASE=true` for the current MVP.
- No Firebase services need to be enabled to install or demonstrate the app.
- Adding Firebase web-app values alone will **not** enable cloud persistence or cross-device synchronization.
- A future Firebase mode must first implement the ride repository, authentication, Firestore schema, and security rules. This setup guide intentionally does not invent them.

## Start the Development Server

Start Metro with the project script:

```bash
pnpm start
```

The equivalent direct Expo CLI command is:

```bash
npx expo start
```

After Metro starts, use the terminal shortcuts shown by Expo:

- Scan the QR code to open the project in Expo Go.
- Press `a` to open it on a running Android emulator.
- Press `w` to open it in a web browser.

Leave this terminal running while using the app. Press `Ctrl+C` to stop the development server.

## QR Code / Expo Go

1. Install Expo Go on the phone.
2. Connect the phone and development PC to the same Wi-Fi network.
3. From the project root, run:

   ```bash
   npx expo start
   ```

4. Wait for the terminal QR code.
5. On Android, scan it from Expo Go. On iOS, scan it with the Camera app and open the link in Expo Go. Current Expo Go on a physical iOS device may require Expo CLI and Expo Go to be signed in to the same Expo account; use `npx expo login` if Expo reports that requirement.

If LAN discovery is blocked by a school/public network, router isolation, VPN, or firewall, use a tunnel:

```bash
npx expo start --tunnel
```

Tunnel mode is usually slower than LAN mode and may prompt to install tunnel support, so use it only when the normal QR code cannot reach the PC.

## PC Testing (Expo Web)

Expo Web is supported: `react-dom` and `react-native-web` are installed, and the project defines a web script and favicon.

```bash
pnpm run web
```

Equivalent Expo CLI command:

```bash
npx expo start --web
```

This starts Metro and opens the app in the default browser. The same in-memory demo flow works in one browser tab. Refreshing the page clears its ride state.

## Android Emulator

Android Studio is optional. To use it:

1. Install Android Studio with the Android SDK, Android SDK Platform-Tools, and Android Emulator.
2. In Android Studio's Device Manager, create an Android Virtual Device and start it.
3. In the TriWay project directory, run:

   ```bash
   npx expo start
   ```

4. When Expo shows the interactive terminal, press:

   ```text
   a
   ```

Expo opens the project in Expo Go on the running emulator. If no device is found, start the emulator first and confirm that `adb devices` lists it. On Windows, an Android emulator is the practical local simulator; the iOS Simulator requires macOS.

The repository has no checked-in `android/` or `ios/` projects and does not require a native build for the current dependency set. Do not manually create or edit those directories for normal Expo Go development.

## Project Structure

```text
app/                         Expo Router screens and route-group layouts
  (auth)/                    Welcome and rider/driver role selection
  (rider)/                   Rider home, routes, booking, tracker, history, passes, account
  (driver)/                  Driver home, incoming request, and ride controls
assets/                      App icon, splash image, Android icons, and web favicon
components/                  Shared layout, common-state, and reusable UI components
constants/                   Theme tokens, Antipolo service area, and runtime mode flag
data/                        Sample routes, suggested locations, passes, and mock notes
features/
  auth/                      Local prototype authentication service and React context
  driver/                    Driver ride-state hook
  passes/                    Pass-list hook
  rides/                     Ride types, hooks, UI, and repository implementations
  routes/                    Route types, local data adapter, hooks, and UI
hooks/                       App-wide theme state
services/firebase/           Optional Firebase SDK initialization helpers
types/                       Shared application types
app.json                     Expo app, plugins, icons, splash, scheme, and platform config
package.json                 Scripts and direct dependencies
pnpm-lock.yaml               Reproducible pnpm dependency lockfile
.env.example                 Optional Firebase variable template
```

Expo Router is configured by `"main": "expo-router/entry"`. Every screen is a file under `app/`, and each `_layout.tsx` defines its stack or tabs.

## Available Demo Flow

Use one running app instance so the in-memory rider and driver views share the same ride:

```text
Splash / Welcome
→ Choose "Continue as Rider"
→ Open Rides and select one of the sample Antipolo routes
→ Review or edit pickup and destination within the service area
→ Tap "Find Rides" to create a cash booking
→ View the rider tracker with status "Requested"
→ Switch to Driver
→ Review and accept the incoming request
→ Mark arriving
→ Start trip
→ Complete trip
→ Return to the Rider view
→ Open ride history and view the completed ride
```

Also available:

- Driver online/offline UI and request/active-ride screens.
- Rider route browsing, account/role switching, and sign-out.
- A Wallet tab showing placeholder weekly, student, and monthly passes. Purchase is not implemented.
- A simulated route map/status display. There is no GPS, live map, payment processing, or real dispatch backend.

## Troubleshooting

### `pnpm` or dependencies are missing

Confirm Node.js and pnpm are installed, then reinstall from the project root:

```bash
node --version
pnpm --version
pnpm install --frozen-lockfile
```

Node.js must be at least 22.13.x. If the lockfile was intentionally changed, use `pnpm install` once to update it.

### Expo or Metro does not start

Make sure no other process is using the requested port. Retry with a cleared Metro cache:

```bash
npx expo start --clear
```

If dependency versions appear incompatible with Expo SDK 57, diagnose before changing anything:

```bash
npx expo-doctor@latest
```

Only when the doctor reports Expo package-version mismatches, use Expo's compatible-version installer and review its changes:

```bash
npx expo install --fix
```

### QR code opens nothing or the phone cannot reach the PC

- Put the phone and PC on the same Wi-Fi network.
- Temporarily disable a VPN or allow Node.js/Expo through the firewall.
- Avoid guest Wi-Fi networks that isolate connected devices.
- Close Expo Go, restart Metro, and scan the new QR code.
- If LAN still fails, run `npx expo start --tunnel`.

### Environment variable changes do not appear

Use `.env.local`, keep the exact `EXPO_PUBLIC_` names shown above, and perform a full reload in Expo Go or the browser. Restart Metro if needed. Remember that these values are public in the client bundle.

### Firebase configuration or ride errors

Firebase ride persistence is not implemented. Remove the local mode override or set:

```dotenv
EXPO_PUBLIC_USE_FIREBASE=false
```

Then restart Metro. Blank Firebase variables are valid in mock mode.

### TypeScript or lint errors

Run the repository checks directly:

```bash
pnpm run typecheck
pnpm run lint
```

Fix reported source errors rather than disabling strict TypeScript or ESLint rules.

### Android emulator is not detected

- Start the virtual device before pressing `a`.
- Check `adb devices`; restart Android Studio's emulator if it is absent or offline.
- Confirm Android SDK Platform-Tools is installed and `adb` is available on `PATH`.
- If Expo Go is not installed, Expo CLI should offer to install/open it on the emulator.

### Demo data disappeared or rider and driver do not synchronize

This is expected after a reload because the repository is in memory. Complete the rider and driver flow in the same running app process. Separate phones, separate browser tabs, and independently opened clients do not share state.

## Verification Checklist

After setup, verify:

- [ ] `pnpm install --frozen-lockfile` completes.
- [ ] `pnpm start` launches Expo without a configuration error.
- [ ] The app opens in Expo Go, Android emulator, or a web browser.
- [ ] The welcome screen reaches rider/driver role selection.
- [ ] Rider view lists the sample Antipolo routes.
- [ ] A rider can create a cash ride and see the requested status.
- [ ] Driver view receives and accepts that request in the same app instance.
- [ ] Driver controls advance the ride through arriving, ongoing, and completed.
- [ ] Rider history shows the completed ride.
- [ ] `pnpm run lint` passes.
- [ ] `pnpm run typecheck` passes.
- [ ] `npx expo-doctor@latest` completes its project checks (online metadata checks require working access to Expo's services).

## Useful Commands

```bash
pnpm start             # Start Expo/Metro
pnpm run android       # Start Expo and target Android
pnpm run web           # Start Expo Web
pnpm run lint          # Run Expo ESLint
pnpm run typecheck     # Run strict TypeScript checking
npx expo-doctor@latest # Check Expo dependency and configuration health
```

Official references: [Expo SDK 57](https://docs.expo.dev/versions/v57.0.0/), [start developing](https://docs.expo.dev/get-started/start-developing/), [environment variables](https://docs.expo.dev/guides/environment-variables/), and [Android emulator setup](https://docs.expo.dev/workflow/android-studio-emulator/).
