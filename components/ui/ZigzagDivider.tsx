import Svg, { Path } from 'react-native-svg';

import { colors } from '@/constants/theme';

export function ZigzagDivider() {
  return (
    <Svg width="100%" height={12} viewBox="0 0 280 12" preserveAspectRatio="none" accessibilityElementsHidden>
      <Path d="M0 7 7 2l7 5 7-5 7 5 7-5 7 5 7-5 7 5 7-5 7 5 7-5 7 5 7-5 7 5 7-5 7 5 7-5 7 5 7-5 7 5 7-5 7 5 7-5 7 5 7-5 7 5 7-5 7 5 7-5 7 5 7-5 7 5 7-5 7 5 7-5 7 5" fill="none" stroke={colors.primarySoft} strokeWidth="2" />
    </Svg>
  );
}
