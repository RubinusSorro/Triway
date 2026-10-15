import { StyleSheet, Text, View } from 'react-native';

import { Card } from '@/components/ui/Card';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Ride } from '@/features/rides/types/ride';
import { useAppTheme } from '@/hooks/useAppTheme';

function formatDate(value?: string) {
  return value ? new Date(value).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }) : 'Not available';
}

function actorLabel(actor?: Ride['cancelledBy']) {
  return actor === 'rider' ? 'Rider' : actor === 'driver' ? 'Driver' : 'Not available';
}

export function RideDetails({ ride }: { ride: Ride }) {
  const { theme } = useAppTheme();
  const isCancelled = ride.status === 'cancelled';

  return (
    <View style={styles.container}>
      <Card>
        <View style={styles.header}>
          <View style={styles.copy}>
            {ride.isReturnRide ? <Text style={[styles.returnLabel, { color: theme.colors.primary }]}>QUICK RETURN</Text> : null}
            <Text style={[styles.title, { color: theme.colors.text }]}>{isCancelled ? 'Ride cancelled' : 'Digital receipt'}</Text>
            <Text style={[styles.route, { color: theme.colors.mutedText }]}>{ride.routeName}</Text>
          </View>
          <StatusBadge status={ride.status} />
        </View>
      </Card>

      <Card>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Trip</Text>
        {ride.isReturnRide ? (
          <>
            <Text style={[styles.detail, { color: theme.colors.text }]}>Outbound: {ride.pickup} to {ride.destination}</Text>
            <Text style={[styles.detail, { color: theme.colors.text }]}>Return: {ride.destination} to {ride.pickup}</Text>
          </>
        ) : (
          <>
            <Text style={[styles.detail, { color: theme.colors.text }]}>Pickup: {ride.pickup}</Text>
            <Text style={[styles.detail, { color: theme.colors.text }]}>Destination: {ride.destination}</Text>
          </>
        )}
      </Card>

      <Card>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Ride information</Text>
        <Text style={[styles.detail, { color: theme.colors.text }]}>Date: {formatDate(ride.createdAt)}</Text>
        <Text style={[styles.detail, { color: theme.colors.text }]}>Rider: {ride.riderName ?? 'Rider'}</Text>
        <Text style={[styles.detail, { color: theme.colors.text }]}>Driver: {ride.driver?.name ?? ride.preferredDriverName ?? 'Not assigned'}</Text>
        <Text style={[styles.detail, { color: theme.colors.mutedText }]}>Ride ID: {ride.id}</Text>
      </Card>

      <Card>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Payment</Text>
        {isCancelled ? (
          <Text style={[styles.detail, { color: theme.colors.mutedText }]}>Not charged</Text>
        ) : (
          <>
            <Text style={[styles.detail, { color: theme.colors.text }]}>Payment method: {ride.paymentMethod === 'cash' ? 'Cash' : ride.paymentMethod}</Text>
            {ride.isReturnRide ? <Text style={[styles.detail, { color: theme.colors.text }]}>Outbound: PHP {ride.outboundFare ?? ride.fare}</Text> : null}
            {ride.isReturnRide ? <Text style={[styles.detail, { color: theme.colors.text }]}>Return: PHP {ride.returnFare ?? ride.fare}</Text> : null}
            <Text style={[styles.fare, { color: theme.colors.primary }]}>Total: PHP {ride.isReturnRide ? ride.totalFare ?? ride.fare : ride.fare}</Text>
            <Text style={[styles.detail, { color: theme.colors.mutedText }]}>Completed: {formatDate(ride.completedAt)}</Text>
          </>
        )}
      </Card>

      {isCancelled ? (
        <Card>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Cancellation</Text>
          <Text style={[styles.detail, { color: theme.colors.text }]}>Cancelled by: {actorLabel(ride.cancelledBy)}</Text>
          <Text style={[styles.detail, { color: theme.colors.text }]}>Reason: {ride.cancellationReason ?? 'Not provided'}</Text>
          <Text style={[styles.detail, { color: theme.colors.mutedText }]}>Cancelled: {formatDate(ride.cancelledAt)}</Text>
        </Card>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 12 },
  header: { flexDirection: 'row', gap: 12, alignItems: 'flex-start' },
  copy: { flex: 1, gap: 5 },
  title: { fontSize: 19, fontWeight: '800', lineHeight: 24 },
  returnLabel: { fontSize: 11, fontWeight: '800', letterSpacing: 0.5 },
  route: { fontSize: 14, lineHeight: 20 },
  sectionTitle: { fontSize: 16, fontWeight: '800', marginBottom: 8 },
  detail: { fontSize: 14, lineHeight: 22 },
  fare: { fontSize: 22, fontWeight: '800', marginTop: 6 },
});