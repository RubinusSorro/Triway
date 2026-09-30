import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useCallback } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';

import { Screen } from '@/components/layout/Screen';
import { ListRow } from '@/components/ui/ListRow';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { SERVICE_AREA_CITY_NAME, SERVICE_AREA_SHORT_LABEL } from '@/constants/config';
import { colors, spacing, typography } from '@/constants/theme';
import { EmptyState } from '@/components/common/EmptyState';
import { useRoutes } from '@/features/routes/hooks/useRoutes';
import { TriwayRoute } from '@/features/routes/types/route';

export default function RiderRoutesScreen() {
  const { routes, isLoading, error } = useRoutes();
  const renderRoute = useCallback(({ item }: { item: TriwayRoute }) => (
    <ListRow title={item.name} subtitle={SERVICE_AREA_SHORT_LABEL} onPress={() => router.push({ pathname: '/(rider)/booking', params: { routeId: item.id } })} />
  ), []);

  return (
    <Screen scroll={false}>
      <ScreenHeader showBack />
      <View style={styles.heading}>
        <Feather name="tag" size={20} color={colors.primary} />
        <Text accessibilityRole="header" style={styles.headingText}>Choose one of the {SERVICE_AREA_CITY_NAME} Tricycle routes</Text>
      </View>
      {isLoading ? <ActivityIndicator style={styles.loader} color={colors.primary} /> : (
        <FlatList
          data={routes}
          style={styles.listView}
          renderItem={renderRoute}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          ItemSeparatorComponent={Separator}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={<EmptyState title={error ? 'Routes unavailable' : `No routes available in ${SERVICE_AREA_CITY_NAME} yet`} body={error ?? 'Verified routes will appear here when available.'} />}
        />
      )}
    </Screen>
  );
}

function Separator() { return <View style={styles.separator} />; }

const styles = StyleSheet.create({
  heading: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm, marginBottom: spacing.lg },
  headingText: { ...typography.sectionTitle, flex: 1, color: colors.text },
  listView: { flex: 1 },
  list: { flexGrow: 1, paddingBottom: spacing.xxl },
  separator: { height: spacing.sm },
  loader: { marginTop: spacing.xxxl },
});
