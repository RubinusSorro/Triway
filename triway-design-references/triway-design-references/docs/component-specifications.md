# Component specifications
All components are demonstrated in components/*.html. Dimensions in dp.
| Component | Variants | Size / rules | A11y | RN guidance |
|---|---|---|---|---|
| Button | primary, secondary, outline, destructive, disabled, loading | min-height 52, pill, 16/600 | accessibilityRole=button, state disabled/busy | Pressable + scale .98 |
| Input | text, phone, password, search, pickup, destination, error | min-height 52, radius 12, 1.5 border | label + error with accessibilityLiveRegion | TextInput |
| Card | standard, route ticket, driver, fare, empty, error | radius 16, padding 16 | group as one focusable item when tappable | View + shadow/elevation |
| Nav | rider tabs (Home, Routes, Trips, Profile), driver tabs (Home, Requests, History, Profile) | item min 48 high | selected state announced | Expo Router Tabs |
| Feedback | badge, toast, progress | badge 12/600 | toast role=status | accessibilityLiveRegion polite |
| Transport | markers, ETA, availability switch, countdown, timeline, cash confirm, rating | switch 48 target | countdown not announced every second | react-native-maps custom markers |
Not built as dedicated demos: dialogs, tab control, verification indicator (covered only in screens), rating (inline on rating.html).
