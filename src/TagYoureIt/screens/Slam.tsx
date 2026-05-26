import { useEffect, useRef, useState } from 'react';
import Halftone from '../components/Halftone';
import Burst from '../components/Burst';
import Avatar from '../components/Avatar';
import { MoveIcon } from '../utils/icons';
import { playSlap, playWhip } from '../utils/sounds';
import { MOVES } from '../utils/moves';
import { useLocale } from '../i18n';
import type { AigramContact, MoveId } from '../types';

interface Props {
  target: AigramContact;
  moveId: MoveId;
  /** Loading state while gen-image runs */
  generating: boolean;
  /** Final image URL once gen-image returns */
  imageUrl: string | null;
  /** True if gen-image errored — show reveal anyway with placeholder */
  errored: boolean;
  /** Called once animation+gen completes — moves to reveal */
  onDone: () => void;
}

type Phase = 'wind' | 'slam' | 'aftermath' | 'cooking';

const PHASE_TIMINGS: Record<Phase, number> = {
  wind: 700,
  slam: 350,
  aftermath: 900,
  cooking: 0, // open-ended — until image is ready
};

const COOKING_KEYS = [
  'slam.cook.1',
  'slam.cook.2',
  'slam.cook.3',
  'slam.cook.4',
  'slam.cook.5',
];

export default function Slam({
  target,
  moveId,
  generating,
  imageUrl,
  errored,
  onDone,
}: Props) {
  const { t } = useLocale();
  const [phase, setPhase] = useState<Phase>('wind');
  const [cookKey, setCookKey] = useState(COOKING_KEYS[0]);
  const move = MOVES.find((m) => m.id === moveId);
  const cookLineIdxRef = useRef(0);
  const doneRef = useRef(false);

  // Choreograph the animation phases
  useEffect(() => {
    const timers: number[] = [];
    timers.push(
      window.setTimeout(() => {
        playWhip();
        setPhase('slam');
      }, PHASE_TIMINGS.wind),
    );
    timers.push(
      window.setTimeout(() => {
        playSlap();
        setPhase('aftermath');
      }, PHASE_TIMINGS.wind + 60),
    );
    timers.push(
      window.setTimeout(() => {
        setPhase('cooking');
      }, PHASE_TIMINGS.wind + PHASE_TIMINGS.slam + PHASE_TIMINGS.aftermath),
    );
    return () => timers.forEach(window.clearTimeout);
  }, []);

  // Cooking-line cycle
  useEffect(() => {
    if (phase !== 'cooking') return;
    const intv = window.setInterval(() => {
      cookLineIdxRef.current = (cookLineIdxRef.current + 1) % COOKING_KEYS.length;
      setCookKey(COOKING_KEYS[cookLineIdxRef.current]);
    }, 1800);
    return () => clearInterval(intv);
  }, [phase]);

  // Once we're in cooking phase AND image is ready (or errored), fire onDone
  useEffect(() => {
    if (doneRef.current) return;
    if (phase !== 'cooking') return;
    if (!generating && (imageUrl || errored)) {
      doneRef.current = true;
      // Tiny beat so the "READY!" frame is visible
      const t = window.setTimeout(onDone, 420);
      return () => window.clearTimeout(t);
    }
    return;
  }, [phase, generating, imageUrl, errored, onDone]);

  if (!move) return null;

  return (
    <>
      <Halftone color="var(--ink)" spacing={16} radius={3} opacity={0.22} />

      <div className="tyi-slam__stage">
        {/* Target portrait — the receiving side */}
        <div className={`tyi-slam__target tyi-slam__target--${phase}`}>
          <Avatar src={target.head_url} name={target.name} size={200} halftone={true} />
          <div className="tyi-slam__targetName">{target.name.toUpperCase()}</div>
        </div>

        {/* Weapon — flies in from upper-right */}
        <div className={`tyi-slam__weapon tyi-slam__weapon--${phase}`}>
          <MoveIcon id={moveId} size={170} />
        </div>

        {/* Burst shout */}
        {(phase === 'aftermath' || phase === 'cooking') && (
          <div className="tyi-slam__shout">
            <Burst fill="var(--it)" stroke="var(--ink)" outer={48} inner={28} points={18}>
              <div className="tyi-shout tyi-slam__shoutText">{move.shout}</div>
            </Burst>
          </div>
        )}

        {/* Splatter halftone bursts (multiple, layered) */}
        {(phase === 'aftermath' || phase === 'cooking') && (
          <div className="tyi-slam__splatters" aria-hidden>
            {[0, 1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="tyi-slam__splat"
                style={{
                  ['--x' as any]: `${20 + ((i * 17) % 60)}%`,
                  ['--y' as any]: `${15 + ((i * 23) % 50)}%`,
                  ['--d' as any]: `${0.1 + i * 0.08}s`,
                }}
              >
                <Burst
                  fill={
                    i % 2 === 0 ? 'var(--tag)' : i % 3 === 0 ? 'var(--white)' : 'var(--pink)'
                  }
                  stroke="var(--ink)"
                  outer={48}
                  inner={20}
                  points={10 + i}
                />
              </div>
            ))}
          </div>
        )}

        {/* "Cooking" label after splatter, while AI image generates */}
        {phase === 'cooking' && (
          <div className="tyi-slam__cooking">
            <div className="tyi-prose-strong tyi-slam__cookHeader">
              {imageUrl ? t('slam.ready') : t(cookKey)}
            </div>
            <div className="tyi-slam__dots" aria-hidden>
              <span /><span /><span />
            </div>
          </div>
        )}
      </div>

      <SlamStyles />
    </>
  );
}

function SlamStyles() {
  useEffect(() => {
    const id = 'tyi-slam-style';
    if (document.getElementById(id)) return;
    const el = document.createElement('style');
    el.id = id;
    el.textContent = `
      .tyi-slam__stage {
        position: absolute;
        inset: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
      }
      .tyi-slam__target {
        position: absolute;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 10px;
        transition: transform 0.18s cubic-bezier(.3,1.3,.6,1);
      }
      .tyi-slam__targetName {
        font-family: var(--font-impact);
        font-size: 22px;
        background: var(--ink);
        color: var(--paper);
        border: 3px solid var(--ink);
        box-shadow: 3px 3px 0 var(--ink);
        padding: 4px 12px;
        letter-spacing: 0.06em;
      }
      .tyi-slam__target--wind { transform: scale(1); }
      .tyi-slam__target--slam {
        transform: scale(0.94) translate(-6px, 4px) rotate(-3deg);
      }
      .tyi-slam__target--aftermath,
      .tyi-slam__target--cooking {
        animation: tyi-shake 0.45s ease-in-out 1;
        transform: scale(1);
      }
      .tyi-slam__weapon {
        position: absolute;
        filter: drop-shadow(4px 4px 0 var(--ink));
      }
      .tyi-slam__weapon--wind {
        transform: translate(140px, -160px) rotate(-30deg);
        opacity: 0;
        transition: transform 0.6s cubic-bezier(.4,.0,.2,1), opacity 0.2s ease-out;
        animation: tyi-weapon-wind 0.7s cubic-bezier(.4,.0,.2,1) forwards;
      }
      @keyframes tyi-weapon-wind {
        0% { transform: translate(180px, -200px) rotate(-50deg); opacity: 0; }
        100% { transform: translate(80px, -100px) rotate(-25deg); opacity: 1; }
      }
      .tyi-slam__weapon--slam {
        animation: tyi-weapon-slam 0.18s cubic-bezier(.7,0,.4,1) forwards;
      }
      @keyframes tyi-weapon-slam {
        0% { transform: translate(80px, -100px) rotate(-25deg); }
        100% { transform: translate(0, 0) rotate(0); }
      }
      .tyi-slam__weapon--aftermath,
      .tyi-slam__weapon--cooking {
        transform: translate(0, 8px) rotate(2deg);
        opacity: 0.92;
        animation: tyi-weapon-aftermath 0.45s ease-in-out;
      }
      @keyframes tyi-weapon-aftermath {
        0% { transform: translate(0, 0) rotate(0); }
        100% { transform: translate(0, 8px) rotate(2deg); }
      }
      .tyi-slam__shout {
        position: absolute;
        top: 18%;
        right: 6%;
        width: 60%;
        max-width: 240px;
        aspect-ratio: 1.4 / 1;
        animation: tyi-slam 0.5s cubic-bezier(.3,1.6,.4,1);
        transform-origin: center;
        z-index: 4;
      }
      .tyi-slam__shoutText {
        font-size: 44px;
        color: var(--white);
        text-shadow: 3px 3px 0 var(--ink);
      }
      .tyi-slam__splatters {
        position: absolute;
        inset: 0;
        pointer-events: none;
        z-index: 3;
      }
      .tyi-slam__splat {
        position: absolute;
        left: var(--x);
        top: var(--y);
        width: 110px;
        height: 110px;
        opacity: 0;
        animation: tyi-splat-in 0.45s ease-out forwards;
        animation-delay: var(--d);
      }
      @keyframes tyi-splat-in {
        0% { opacity: 0; transform: scale(0) rotate(-30deg); }
        60% { opacity: 1; transform: scale(1.1) rotate(8deg); }
        100% { opacity: 1; transform: scale(1) rotate(0); }
      }
      .tyi-slam__cooking {
        position: absolute;
        bottom: 8%;
        left: 50%;
        transform: translateX(-50%);
        background: var(--tag);
        border: 4px solid var(--ink);
        box-shadow: 5px 5px 0 var(--ink);
        padding: 14px 22px;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 8px;
        animation: tyi-arrival-pop 0.5s ease-out;
        z-index: 5;
        min-width: 220px;
      }
      .tyi-slam__cookHeader {
        font-size: 22px;
        color: var(--ink);
        text-shadow: none;
      }
      .tyi-slam__dots {
        display: flex;
        gap: 4px;
      }
      .tyi-slam__dots span {
        width: 8px;
        height: 8px;
        background: var(--ink);
        border-radius: 50%;
        animation: tyi-dot-bounce 0.9s ease-in-out infinite;
      }
      .tyi-slam__dots span:nth-child(2) { animation-delay: 0.15s; }
      .tyi-slam__dots span:nth-child(3) { animation-delay: 0.3s; }
      @keyframes tyi-dot-bounce {
        0%, 100% { transform: translateY(0); opacity: 0.5; }
        50% { transform: translateY(-6px); opacity: 1; }
      }
    `;
    document.head.appendChild(el);
    return () => {
      if (el.parentNode) el.parentNode.removeChild(el);
    };
  }, []);
  return null;
}
