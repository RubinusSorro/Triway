import { Tabs } from 'expo-router';

import { AppBottomNav, DRIVER_ITEMS } from '@/components/ui/AppBottomNav';

export default function DriverLayout() {
  return (
    <Tabs
      tabBar={(props) => <AppBottomNav {...props} items={DRIVER_ITEMS} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="request" options={{ title: 'Request' }} />
      <Tabs.Screen name="ride" options={{ title: 'Ride' }} />
      <Tabs.Screen name="history" options={{ href: null }} />
      <Tabs.Screen name="completion" options={{ href: null }} />
      <Tabs.Screen name="details" options={{ href: null }} />
    </Tabs>
  );
}
