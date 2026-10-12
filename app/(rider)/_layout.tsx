import { Tabs } from 'expo-router';

import { AppBottomNav } from '@/components/ui/AppBottomNav';

export default function RiderLayout() {
  return (
    <Tabs
      tabBar={(props) => <AppBottomNav {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="routes" options={{ title: 'Routes' }} />
      <Tabs.Screen name="history" options={{ title: 'Trips' }} />
      <Tabs.Screen name="account" options={{ title: 'Profile' }} />
      <Tabs.Screen name="booking" options={{ href: null }} />
      <Tabs.Screen name="review" options={{ href: null }} />
      <Tabs.Screen name="search" options={{ href: null }} />
      <Tabs.Screen name="passes" options={{ href: null }} />
      <Tabs.Screen name="ride" options={{ href: null }} />
      <Tabs.Screen name="matching" options={{ href: null }} />
      <Tabs.Screen name="assigned" options={{ href: null }} />
      <Tabs.Screen name="tracking" options={{ href: null }} />
      <Tabs.Screen name="progress" options={{ href: null }} />
      <Tabs.Screen name="completed" options={{ href: null }} />
      <Tabs.Screen name="receipt" options={{ href: null }} />
      <Tabs.Screen name="rating" options={{ href: null }} />
      <Tabs.Screen name="details" options={{ href: null }} />
    </Tabs>
  );
}
