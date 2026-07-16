import React from 'react';
import Svg, { Path } from 'react-native-svg';

type Props = {
  size?: number;
  color?: string;
};

export default function TutorialIcon({ size = 20, color = '#150000' }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 22 22" fill="none">
      <Path
        d="M9 16.6586V19C9 20.1046 9.89543 21 11 21C12.1046 21 13 20.1046 13 19V16.6586M11 1V2M2 11H1M4.5 4.5L3.8999 3.8999M17.5 4.5L18.1002 3.8999M21 11H20M17 11C17 14.3137 14.3137 17 11 17C7.68629 17 5 14.3137 5 11C5 7.68629 7.68629 5 11 5C14.3137 5 17 7.68629 17 11Z"
        stroke={color}
        strokeOpacity={0.7}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}