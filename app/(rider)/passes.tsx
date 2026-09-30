import { Feather } from '@expo/vector-icons';
import { memo, useCallback } from 'react';
import { ActivityIndicator, Alert, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import { EmptyState } from '@/components/common/EmptyState';
import { Screen } from '@/components/layout/Screen';
import { Card } from '@/components/ui/Card';
import { IconCircle } from '@/components/ui/IconCircle';
import { colors, radii, spacing, typography } from '@/constants/theme';
import { SERVICE_AREA_CITY_NAME } from '@/constants/config';
import { RidePass } from '@/data/passes';
import { usePasses } from '@/features/passes/hooks/usePasses';

export default function PassesScreen() {
  const { passes, isLoading, error } = usePasses();
  const renderPass = useCallback(({ item }: { item: RidePass }) => <PassCard item={item} />, []);

  return (
    <Screen scroll={false}>
      <Text accessibilityRole="header" style={styles.screenTitle}>Available Passes</Text>
      {isLoading ? <ActivityIndicator style={styles.loader} color={colors.primary} /> : (
        <FlatList
          data={passes}
          style={styles.listView}
          renderItem={renderPass}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          ItemSeparatorComponent={Separator}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={<EmptyState title={error ? 'Passes unavailable' : `No passes available in ${SERVICE_AREA_CITY_NAME} yet`} body={error ?? 'New passes will appear here when they are available.'} />}
        />
      )}
    </Screen>
  );
}

const PassCard = memo(function PassCard({ item }: { item: RidePass }) {
  return (
    <Card style={styles.card}>
      <IconCircle />
      <View style={styles.copy}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.validity}>{item.validity}</Text>
        <Text style={styles.price}>₱{item.price.toFixed(2)}</Text>
      </View>
      <Pressable accessibilityRole="button" accessibilityLabel={`View ${item.name}`} onPress={() => Alert.alert(item.name, 'Pass purchase will be connected when live pass data is available.')} style={({ pressed }) => [styles.chevron, pressed && styles.pressed]}>
        <Feather name="chevron-right" size={20} color={colors.primary} />
      </Pressable>
    </Card>
  );
});

function Separator() { return <View style={styles.separator} />; }

const styles = StyleSheet.create({
  screenTitle: { ...typography.title, color: colors.text, marginBottom: spacing.xxl },
  listView: { flex: 1 },
  list: { flexGrow: 1, paddingBottom: spacing.xxl },
  card: { minHeight: 104, flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  copy: { flex: 1 },
  name: { ...typography.bodySemibold, color: colors.text },
  validity: { ...typography.subtitle, color: colors.textMuted, marginTop: spacing.xs },
  price: { ...typography.bodySemibold, color: colors.primaryDark, marginTop: spacing.xs },
  chevron: { width: 44, height: 44, borderRadius: radii.pill, backgroundColor: colors.tint, alignItems: 'center', justifyContent: 'center' },
  pressed: { opacity: 0.65 },
  separator: { height: spacing.md },
  loader: { marginTop: spacing.xxxl },
});
