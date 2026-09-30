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
      <Tabs.Screen name="routes" options={{ title: 'Rides' }} />
      <Tabs.Screen name="booking" options={{ title: 'Book a ride' }} />
      <Tabs.Screen name="passes" options={{ title: 'Wallet' }} />
      <Tabs.Screen name="account" options={{ title: 'Account' }} />
      <Tabs.Screen name="ride" options={{ href: null }} />
      <Tabs.Screen name="history" options={{ href: null }} />
    </Tabs>
  );
}
