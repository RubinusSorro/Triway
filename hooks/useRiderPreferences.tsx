import { PropsWithChildren, createContext, useContext, useMemo, useState } from 'react';

type RiderPreferencesContextValue = {
  rideUpdatesEnabled: boolean;
  setRideUpdatesEnabled: (enabled: boolean) => void;
};

const RiderPreferencesContext = createContext<RiderPreferencesContextValue | undefined>(undefined);

/** Demo-only preferences; values intentionally last only for the mounted Rider session. */
export function RiderPreferencesProvider({ children }: PropsWithChildren) {
  const [rideUpdatesEnabled, setRideUpdatesEnabled] = useState(true);
  const value = useMemo(() => ({ rideUpdatesEnabled, setRideUpdatesEnabled }), [rideUpdatesEnabled]);

  return <RiderPreferencesContext.Provider value={value}>{children}</RiderPreferencesContext.Provider>;
}

export function useRiderPreferences() {
  const value = useContext(RiderPreferencesContext);
  if (!value) throw new Error('useRiderPreferences must be used inside RiderPreferencesProvider');
  return value;
}
