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

const ICON_MAP: Record<MoveId, (p: IconProps) => JSX.Element> = {
  pie: PieIcon,
  slime: SlimeIcon,
  confetti: ConfettiIcon,
  sticker: StickerIcon,
  pizza: PizzaIcon,
  banana: BananaIcon,
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
