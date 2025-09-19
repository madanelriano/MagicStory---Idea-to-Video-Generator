import React from 'react';

export const FadeIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <defs>
      <linearGradient id="fadeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" style={{ stopColor: 'currentColor', stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: 'currentColor', stopOpacity: 0 }} />
      </linearGradient>
    </defs>
    <rect width="24" height="24" fill="url(#fadeGradient)" />
  </svg>
);
