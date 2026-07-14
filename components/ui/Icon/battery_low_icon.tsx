import Svg, { Path } from 'react-native-svg';

type Props = {
  size?: number;
  color?: string;
};

export default function BatteryLowIcon({ size = 32, color = '#D40000' }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <Path
        d="M6 11C6 9.89543 6.89543 9 8 9H21C22.1046 9 23 9.89543 23 11V21C23 22.1046 22.1046 23 21 23H8C6.89543 23 6 22.1046 6 21V11Z"
        stroke={color}
        strokeWidth="2"
        fill="none"
      />
      <Path
        d="M24 14H25C25.5523 14 26 14.4477 26 15V17C26 17.5523 25.5523 18 25 18H24V14Z"
        fill={color}
      />
      <Path
        d="M8.5 12.5H11.5V19.5H8.5V12.5Z"
        fill={color}
      />
    </Svg>
  );
}