import React from 'react';
import Svg, { Path } from 'react-native-svg';

type Props = {
  size?: number;
  color?: string;
};

export default function UnsubscribeIcon({ size = 20, color = '#150000' }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 22 22" fill="none">
      <Path
        d="M15 15C15 15 13.5 13 11 13C8.5 13 7 15 7 15M16 8.24C15.605 8.725 15.065 9 14.5 9C13.935 9 13.41 8.725 13 8.24M9 8.24C8.605 8.725 8.065 9 7.5 9C6.935 9 6.41 8.725 6 8.24M21 11C21 16.5228 16.5228 21 11 21C5.47715 21 1 16.5228 1 11C1 5.47715 5.47715 1 11 1C16.5228 1 21 5.47715 21 11Z"
        stroke={color}
        strokeOpacity={0.7}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}