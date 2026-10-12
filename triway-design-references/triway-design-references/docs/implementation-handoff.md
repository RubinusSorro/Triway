# Implementation handoff (Expo / React Native / Expo Router / TypeScript)
This is a reference for the existing project, not a rewrite.
- **Tokens:** map foundations/design-tokens.json to a theme file (colors, spacing, radius, typography). Load Inter 400/600/800 via expo-font.
- **Shared components:** Button, TextField, Card, RouteTicket, StatusBadge, TabBar, MapMarker, CountdownBar, FareSummary.
- **Navigation:** Expo Router groups (auth), (rider) tabs, (driver) tabs. Ride flow screens as stack routes.
- **Screens to components:** see docs/screen-inventory.md; Review/Receipt use FareSummary; Tracking/Progress use map + MapMarker.
- **Icons:** assets/icons/*.svg are 24px line icons; convert with react-native-svg using currentColor props.
- **Images:** logo from assets/logo/TRIWAY.png, unmodified; never stretch.
- **Safe area and keyboard:** SafeAreaView on screens, KeyboardAvoidingView on forms.
- **States:** disabled = grey fill; loading = busy label plus disabled; error = border + message.
- **Not provided:** real routes, fares, GPS or dispatch logic.
