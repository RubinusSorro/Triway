import { StyleProp, ViewStyle } from 'react-native';
import { ComponentProps } from 'react';
import { Feather } from '@expo/vector-icons';

import { AppButton } from './AppButton';

type PrimaryButtonProps = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
  icon?: ComponentProps<typeof Feather>['name'];
};

export function PrimaryButton({ label, onPress, disabled, loading, style, accessibilityLabel, icon }: PrimaryButtonProps) {
  return <AppButton label={label} onPress={onPress} disabled={disabled} loading={loading} style={style} accessibilityLabel={accessibilityLabel} icon={icon} />;
}
