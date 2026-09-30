import Svg, { Path } from 'react-native-svg';

import { colors } from '@/constants/theme';

export function SkylineRoad() {
  return (
    <Svg width="100%" height="100%" viewBox="0 0 430 250" preserveAspectRatio="none" accessibilityElementsHidden>
      <Path d="M0 128h34V91h19v37h18V70h24v58h16V100h18v28h25V82h23v46h16V64h27v64h18V96h20v32h22V77h30v51h18V105h24v23h23V88h23v40h38v122H0Z" fill={colors.skyline} />
      <Path d="M-20 212c103-42 164-42 225-3 56 36 127 36 245-15v56H-20Z" fill={colors.primaryDark} />
      <Path d="M-10 224c100-39 157-36 214 0 53 33 121 30 245-16" stroke={colors.primarySoft} strokeWidth="3" fill="none" />
    </Svg>
  );
}
