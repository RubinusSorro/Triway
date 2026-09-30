import { StyleSheet, View } from 'react-native';

import { colors, radii } from '@/constants/theme';
import { TricycleIcon } from './TricycleIcon';

type IconCircleProps = { size?: number };

export function IconCircle({ size = 54 }: IconCircleProps) {
  return (
    <View style={[styles.circle, { width: size, height: size }]}>
      <TricycleIcon size={size * 0.58} color={colors.onPrimary} />
    </View>
  );
}

const styles = StyleSheet.create({ circle: { borderRadius: radii.pill, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' } });
