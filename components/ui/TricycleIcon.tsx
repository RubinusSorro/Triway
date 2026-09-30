import Svg, { Circle, Line, Path, Rect } from 'react-native-svg';

type TricycleIconProps = { size?: number; color?: string; strokeWidth?: number };

export function TricycleIcon({ size = 28, color = 'currentColor', strokeWidth = 1.8 }: TricycleIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <Path d="M8 28h24l5 6H13l-5-6Z" stroke={color} strokeWidth={strokeWidth} strokeLinejoin="round" />
      <Path d="M18 28V14h15c4 0 7 3 7 7v13" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      <Path d="M18 15h13l4 8H18" stroke={color} strokeWidth={strokeWidth} strokeLinejoin="round" />
      <Rect x="8" y="22" width="10" height="8" rx="2" stroke={color} strokeWidth={strokeWidth} />
      <Line x1="9" y1="22" x2="13" y2="17" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      <Circle cx="14" cy="36" r="4" stroke={color} strokeWidth={strokeWidth} />
      <Circle cx="35" cy="36" r="4" stroke={color} strokeWidth={strokeWidth} />
    </Svg>
  );
}
