// Comic-book starburst: jagged 16-point starlike outline behind text.

import { useMemo } from 'react';

interface BurstProps {
  /** burst body fill */
  fill?: string;
  /** outline */
  stroke?: string;
  /** number of points */
  points?: number;
  /** outer radius ratio (max 50) */
  outer?: number;
  /** inner radius ratio */
  inner?: number;
  /** content rendered centered */
  children?: React.ReactNode;
  className?: string;
}

function makePoints(n: number, outer: number, inner: number): string {
  const pts: string[] = [];
  // Slight irregularity for hand-drawn feel
  for (let i = 0; i < n * 2; i++) {
    const isOuter = i % 2 === 0;
    const angle = (i / (n * 2)) * Math.PI * 2 - Math.PI / 2;
    const base = isOuter ? outer : inner;
    const jitter = isOuter ? base * (0.95 + ((i * 13) % 10) / 100) : base;
    const x = 50 + Math.cos(angle) * jitter;
    const y = 50 + Math.sin(angle) * jitter;
    pts.push(`${x.toFixed(2)},${y.toFixed(2)}`);
  }
  return pts.join(' ');
}

export default function Burst({
  fill = '#ffd60a',
  stroke = '#111',
  points = 16,
  outer = 48,
  inner = 32,
  children,
  className,
}: BurstProps) {
  const path = useMemo(() => makePoints(points, outer, inner), [points, outer, inner]);
  return (
    <div
      className={`tyi-burst ${className || ''}`}
      style={{
        position: 'relative',
        display: 'block',
        width: '100%',
        height: '100%',
      }}
    >
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        style={{ width: '100%', height: '100%', display: 'block' }}
      >
        <polygon
          points={path}
          fill={fill}
          stroke={stroke}
          strokeWidth="2.5"
          strokeLinejoin="miter"
        />
      </svg>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '12%',
          textAlign: 'center',
        }}
      >
        {children}
      </div>
    </div>
  );
}
