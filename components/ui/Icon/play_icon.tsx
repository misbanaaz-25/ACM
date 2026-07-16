import React from 'react';
import Svg, { Path } from 'react-native-svg';

type Props = { size?: number; color?: string };

export default function PlayIcon({ size = 22, color = '#E90000' }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 22 22" fill="none">
      <Path
        d="M10.8999 20.9004C16.4228 20.9004 20.8999 16.4232 20.8999 10.9004C20.8999 5.37754 16.4228 0.900391 10.8999 0.900391C5.37705 0.900391 0.899902 5.37754 0.899902 10.9004C0.899902 16.4232 5.37705 20.9004 10.8999 20.9004Z"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M8.3999 7.86572C8.3999 7.38844 8.3999 7.1498 8.49964 7.01657C8.58656 6.90047 8.71962 6.82783 8.86428 6.81749C9.03029 6.80564 9.23103 6.93468 9.63251 7.19278L14.3531 10.2274C14.7015 10.4514 14.8757 10.5634 14.9358 10.7058C14.9884 10.8302 14.9884 10.9706 14.9358 11.095C14.8757 11.2374 14.7015 11.3494 14.3531 11.5733L9.63251 14.608C9.23103 14.8661 9.03029 14.9951 8.86428 14.9833C8.71962 14.973 8.58656 14.9003 8.49964 14.7842C8.3999 14.651 8.3999 14.4123 8.3999 13.9351V7.86572Z"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}