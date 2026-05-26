// Comic-book avatar — circular crop with thick black border, optional
// halftone overlay applied through mix-blend-mode for that "printed comic"
// look. Falls back to initials if no head_url.

import { useState } from 'react';
import Halftone from './Halftone';

interface AvatarProps {
  src?: string;
  name: string;
  size?: number;
  tilt?: number;
  halftone?: boolean;
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((p) => p[0] || '').join('').toUpperCase() || '?';
}

export default function Avatar({
  src,
  name,
  size = 64,
  tilt = 0,
  halftone = true,
}: AvatarProps) {
  const [errored, setErrored] = useState(false);
  const show = src && !errored;
  return (
    <div
      className="tyi-avatar"
      style={{
        width: size,
        height: size,
        transform: tilt ? `rotate(${tilt}deg)` : undefined,
      }}
    >
      {show ? (
        <img
          src={src}
          alt=""
          onError={() => setErrored(true)}
          referrerPolicy="no-referrer"
        />
      ) : (
        <div className="tyi-avatar__initials">{initials(name)}</div>
      )}
      {halftone && (
        <div className="tyi-avatar__halftone">
          <Halftone color="#111" spacing={6} radius={1.1} opacity={0.32} />
        </div>
      )}
    </div>
  );
}
