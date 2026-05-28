// All UI glyphs as SVG — no emoji.

import type { MoveId } from '../types';

interface IconProps {
  size?: number;
}

export function PieIcon({ size = 40 }: IconProps) {
  return (
    <svg viewBox="0 0 40 40" width={size} height={size}>
      <path
        d="M3 24 Q20 8 37 24 Q37 30 20 30 Q3 30 3 24Z"
        fill="#fff8e0"
        stroke="#111"
        strokeWidth="2.5"
      />
      <ellipse cx="20" cy="22" rx="14" ry="3" fill="#ffe9b3" stroke="#111" strokeWidth="2" />
      <circle cx="20" cy="17" r="3" fill="#ff3b6b" stroke="#111" strokeWidth="2" />
    </svg>
  );
}

export function SlimeIcon({ size = 40 }: IconProps) {
  return (
    <svg viewBox="0 0 40 40" width={size} height={size}>
      <path
        d="M8 8 H32 V20 Q32 28 28 32 Q24 36 20 36 Q16 36 12 32 Q8 28 8 20 Z"
        fill="#7cfc00"
        stroke="#111"
        strokeWidth="2.5"
      />
      <path d="M6 6 H34 V10 H6 Z" fill="#444" stroke="#111" strokeWidth="2.5" />
      <path
        d="M12 32 Q12 36 14 38 M20 34 Q20 39 22 39 M26 32 Q26 36 28 38"
        stroke="#111"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function ConfettiIcon({ size = 40 }: IconProps) {
  return (
    <svg viewBox="0 0 40 40" width={size} height={size}>
      <path d="M4 36 L20 8 L36 36 Z" fill="#888" stroke="#111" strokeWidth="2.5" />
      <rect x="8" y="4" width="3" height="6" fill="#ff3b6b" stroke="#111" strokeWidth="1.2" transform="rotate(-15 9.5 7)" />
      <rect x="18" y="2" width="3" height="6" fill="#ffd60a" stroke="#111" strokeWidth="1.2" />
      <rect x="28" y="4" width="3" height="6" fill="#2c6df4" stroke="#111" strokeWidth="1.2" transform="rotate(15 29.5 7)" />
      <circle cx="14" cy="14" r="1.8" fill="#ff6b9d" />
      <circle cx="26" cy="12" r="1.8" fill="#7cfc00" />
      <circle cx="20" cy="20" r="1.8" fill="#ffd60a" />
    </svg>
  );
}

export function StickerIcon({ size = 40 }: IconProps) {
  return (
    <svg viewBox="0 0 40 40" width={size} height={size}>
      <g transform="rotate(-12 20 20)">
        <circle cx="20" cy="20" r="15" fill="#ffd60a" stroke="#111" strokeWidth="2.5" />
        <text
          x="20"
          y="26"
          fontFamily="Bangers, sans-serif"
          fontSize="18"
          textAnchor="middle"
          fill="#111"
        >
          IT!
        </text>
      </g>
    </svg>
  );
}

export function PizzaIcon({ size = 40 }: IconProps) {
  return (
    <svg viewBox="0 0 40 40" width={size} height={size}>
      <circle cx="20" cy="20" r="15" fill="#ffd166" stroke="#111" strokeWidth="2.5" />
      <circle cx="20" cy="20" r="12" fill="#ff6b3d" stroke="#111" strokeWidth="1.5" />
      <circle cx="14" cy="16" r="2.5" fill="#c1121f" stroke="#111" strokeWidth="1.2" />
      <circle cx="26" cy="14" r="2.5" fill="#c1121f" stroke="#111" strokeWidth="1.2" />
      <circle cx="22" cy="24" r="2.5" fill="#c1121f" stroke="#111" strokeWidth="1.2" />
      <circle cx="14" cy="26" r="2" fill="#c1121f" stroke="#111" strokeWidth="1.2" />
    </svg>
  );
}

export function BananaIcon({ size = 40 }: IconProps) {
  return (
    <svg viewBox="0 0 40 40" width={size} height={size}>
      <path
        d="M6 22 Q12 6 28 8 Q34 9 34 14 Q22 18 14 28 Q8 32 6 22Z"
        fill="#ffd60a"
        stroke="#111"
        strokeWidth="2.5"
      />
      <path d="M28 8 L32 4" stroke="#111" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

export function AnvilIcon({ size = 40 }: IconProps) {
  return (
    <svg viewBox="0 0 40 40" width={size} height={size}>
      {/* Body */}
      <path
        d="M6 16 H34 V22 H30 L28 28 H12 L10 22 H6 Z"
        fill="#6b7280"
        stroke="#111"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      {/* Horn */}
      <path
        d="M34 16 Q38 16 38 19 Q38 22 34 22"
        fill="#6b7280"
        stroke="#111"
        strokeWidth="2.5"
      />
      {/* Top plate */}
      <rect x="8" y="10" width="24" height="6" fill="#9ca3af" stroke="#111" strokeWidth="2.5" />
      {/* Highlight on top */}
      <rect x="11" y="11" width="14" height="1.5" fill="#e5e7eb" />
    </svg>
  );
}

export function GloveIcon({ size = 40 }: IconProps) {
  return (
    <svg viewBox="0 0 40 40" width={size} height={size}>
      {/* Spring zig-zag */}
      <path
        d="M4 36 L8 32 L4 28 L8 24 L4 20"
        stroke="#111"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Glove body */}
      <path
        d="M10 22 Q10 14 18 14 Q26 14 30 18 Q36 22 36 28 Q36 32 32 32 Q28 32 26 30 Q22 32 18 32 Q10 32 10 22 Z"
        fill="#e63946"
        stroke="#111"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      {/* Wrist cuff */}
      <path d="M10 22 L8 22 L8 26 L10 26" fill="#b51d2a" stroke="#111" strokeWidth="2" />
      {/* Highlight */}
      <ellipse cx="22" cy="20" rx="6" ry="2" fill="#ff8a95" opacity="0.5" />
    </svg>
  );
}

export function PaintIcon({ size = 40 }: IconProps) {
  return (
    <svg viewBox="0 0 40 40" width={size} height={size}>
      {/* Can */}
      <path
        d="M10 6 L30 6 L28 22 L12 22 Z"
        fill="#9b59b6"
        stroke="#111"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      {/* Rim */}
      <ellipse cx="20" cy="6" rx="10" ry="2.5" fill="#bd80d3" stroke="#111" strokeWidth="2.5" />
      {/* Handle (sideways) */}
      <path d="M30 9 Q34 12 30 14" stroke="#111" strokeWidth="2" fill="none" />
      {/* Drips */}
      <path d="M14 22 Q14 30 16 32 Q18 34 18 28 Q18 24 14 22" fill="#9b59b6" stroke="#111" strokeWidth="2" strokeLinejoin="round" />
      <path d="M22 22 Q22 34 24 36 Q26 38 26 30 Q26 26 22 22" fill="#ff6b9d" stroke="#111" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );
}

export function WaterIcon({ size = 40 }: IconProps) {
  return (
    <svg viewBox="0 0 40 40" width={size} height={size}>
      {/* Main droplet/balloon */}
      <path
        d="M20 6 Q12 18 12 26 Q12 34 20 34 Q28 34 28 26 Q28 18 20 6 Z"
        fill="#2c6df4"
        stroke="#111"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      {/* Knot at top */}
      <path d="M18 6 Q20 3 22 6" stroke="#111" strokeWidth="2.5" fill="none" />
      {/* Highlight */}
      <ellipse cx="16" cy="20" rx="2" ry="5" fill="#7fa8ff" opacity="0.7" />
      {/* Splash droplets */}
      <circle cx="6" cy="14" r="1.5" fill="#2c6df4" stroke="#111" strokeWidth="1.5" />
      <circle cx="34" cy="16" r="1.5" fill="#2c6df4" stroke="#111" strokeWidth="1.5" />
      <circle cx="4" cy="28" r="1.2" fill="#2c6df4" stroke="#111" strokeWidth="1.2" />
    </svg>
  );
}

export function HornIcon({ size = 40 }: IconProps) {
  return (
    <svg viewBox="0 0 40 40" width={size} height={size}>
      {/* Horn cone */}
      <path
        d="M4 14 L4 26 L20 30 L20 10 Z"
        fill="#ffd60a"
        stroke="#111"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      {/* Mouthpiece */}
      <rect x="20" y="16" width="6" height="8" fill="#444" stroke="#111" strokeWidth="2" />
      {/* Sound waves */}
      <path d="M28 14 Q32 20 28 26" stroke="#111" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M32 10 Q38 20 32 30" stroke="#111" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    </svg>
  );
}

export function GlitterIcon({ size = 40 }: IconProps) {
  return (
    <svg viewBox="0 0 40 40" width={size} height={size}>
      {/* Big star */}
      <path
        d="M20 6 L23 16 L33 16 L25 22 L28 32 L20 26 L12 32 L15 22 L7 16 L17 16 Z"
        fill="#ff6b9d"
        stroke="#111"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      {/* Small sparkles */}
      <path d="M6 8 L7 11 L10 12 L7 13 L6 16 L5 13 L2 12 L5 11 Z" fill="#ffd60a" stroke="#111" strokeWidth="1" />
      <path d="M34 8 L35 10 L37 11 L35 12 L34 14 L33 12 L31 11 L33 10 Z" fill="#7cfc00" stroke="#111" strokeWidth="1" />
      <path d="M34 30 L35 32 L37 33 L35 34 L34 36 L33 34 L31 33 L33 32 Z" fill="#2c6df4" stroke="#111" strokeWidth="1" />
    </svg>
  );
}

const ICON_MAP: Record<MoveId, (p: IconProps) => JSX.Element> = {
  pie: PieIcon,
  slime: SlimeIcon,
  confetti: ConfettiIcon,
  sticker: StickerIcon,
  pizza: PizzaIcon,
  banana: BananaIcon,
  anvil: AnvilIcon,
  glove: GloveIcon,
  paint: PaintIcon,
  water: WaterIcon,
  horn: HornIcon,
  glitter: GlitterIcon,
};

export function MoveIcon({ id, size = 40 }: { id: MoveId; size?: number }) {
  const Comp = ICON_MAP[id];
  return Comp ? <Comp size={size} /> : null;
}

export function ArrowIcon({ size = 24 }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size}>
      <path
        d="M4 12 H18 M12 6 L18 12 L12 18"
        stroke="currentColor"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function BackIcon({ size = 24 }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size}>
      <path
        d="M20 12 H6 M12 6 L6 12 L12 18"
        stroke="currentColor"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function CheckIcon({ size = 24 }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size}>
      <path
        d="M4 13 L9 18 L20 6"
        stroke="currentColor"
        strokeWidth="3.5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function HandIcon({ size = 32 }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size}>
      <path
        d="M12 4 V14 M16 2 V14 M20 4 V14 M8 8 V20 Q8 28 16 28 Q24 28 24 20 V12"
        stroke="currentColor"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ShareIcon({ size = 24 }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size}>
      <circle cx="18" cy="5" r="3" stroke="currentColor" strokeWidth="2.5" fill="none" />
      <circle cx="6" cy="12" r="3" stroke="currentColor" strokeWidth="2.5" fill="none" />
      <circle cx="18" cy="19" r="3" stroke="currentColor" strokeWidth="2.5" fill="none" />
      <path d="M8.5 10.5 L15.5 6.5 M8.5 13.5 L15.5 17.5" stroke="currentColor" strokeWidth="2.5" />
    </svg>
  );
}

export function MailIcon({ size = 24 }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size}>
      <rect
        x="3"
        y="6"
        width="18"
        height="13"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
      />
      <path d="M3 8 L12 14 L21 8" stroke="currentColor" strokeWidth="2.5" fill="none" />
    </svg>
  );
}
