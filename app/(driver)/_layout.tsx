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
      <Tabs.Screen name="request" options={{ title: 'Requests' }} />
      <Tabs.Screen name="history" options={{ title: 'History' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
      <Tabs.Screen name="ride" options={{ href: null }} />
      <Tabs.Screen name="completion" options={{ href: null }} />
      <Tabs.Screen name="details" options={{ href: null }} />
    </Tabs>
  );
}
