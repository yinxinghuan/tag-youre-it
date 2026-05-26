// Square 1080×1080 poster composition — captured at the same URL with
// ?demo=poster. Intentionally NOT a normal screen; just a composed marketing
// frame for the game-list thumbnail.

import { useEffect } from 'react';
import Burst from '../components/Burst';
import Halftone from '../components/Halftone';
import { MoveIcon } from '../utils/icons';

export default function Poster() {
  return (
    <>
      <div className="tyi-poster">
        <Halftone color="var(--ink)" spacing={14} radius={2.6} opacity={0.16} />

        {/* Background diagonal speed-lines */}
        <svg className="tyi-poster__lines" viewBox="0 0 100 100" preserveAspectRatio="none">
          {Array.from({ length: 12 }).map((_, i) => {
            const y = i * 9 + 2;
            return (
              <line
                key={i}
                x1="0"
                y1={y}
                x2="100"
                y2={y - 6}
                stroke="rgba(17,17,17,0.07)"
                strokeWidth="0.4"
              />
            );
          })}
        </svg>

        {/* Main starburst with title stack */}
        <div className="tyi-poster__main">
          <Burst fill="var(--ink)" stroke="var(--ink)" outer={48} inner={38} points={22}>
            <div className="tyi-poster__titleStack">
              <span className="tyi-shout tyi-poster__t1">TAG,</span>
              <span className="tyi-shout tyi-poster__t2">YOU&apos;RE</span>
              <span className="tyi-shout tyi-poster__t3">IT!</span>
            </div>
          </Burst>
        </div>

        {/* Floating weapon icons */}
        <div className="tyi-poster__weapon tyi-poster__weapon--tl">
          <MoveIcon id="pie" size={140} />
        </div>
        <div className="tyi-poster__weapon tyi-poster__weapon--tr">
          <MoveIcon id="pizza" size={130} />
        </div>
        <div className="tyi-poster__weapon tyi-poster__weapon--bl">
          <MoveIcon id="banana" size={140} />
        </div>
        <div className="tyi-poster__weapon tyi-poster__weapon--br">
          <MoveIcon id="confetti" size={130} />
        </div>

        {/* Mini bursts around the title */}
        <div className="tyi-poster__burst tyi-poster__burst--a">
          <Burst fill="var(--it)" stroke="var(--ink)" outer={48} inner={26} points={14}>
            <span className="tyi-shout tyi-poster__burstTxt">POW!</span>
          </Burst>
        </div>
        <div className="tyi-poster__burst tyi-poster__burst--b">
          <Burst fill="var(--tag)" stroke="var(--ink)" outer={48} inner={24} points={12}>
            <span className="tyi-shout tyi-poster__burstTxt2">SPLAT!</span>
          </Burst>
        </div>
        <div className="tyi-poster__burst tyi-poster__burst--c">
          <Burst fill="var(--pink)" stroke="var(--ink)" outer={48} inner={24} points={10}>
            <span className="tyi-shout tyi-poster__burstTxt3">BAM!</span>
          </Burst>
        </div>

        {/* Tagline strip */}
        <div className="tyi-poster__tagline">
          PICK A FRIEND · TAG THE WEAPON · SLAM
        </div>
      </div>
      <PosterStyles />
    </>
  );
}

function PosterStyles() {
  useEffect(() => {
    const id = 'tyi-poster-style';
    if (document.getElementById(id)) return;
    const el = document.createElement('style');
    el.id = id;
    el.textContent = `
      .tyi-poster {
        position: absolute;
        inset: 0;
        background: var(--paper);
        background-image:
          radial-gradient(circle at 0.5px 0.5px, rgba(17, 17, 17, 0.18) 1px, transparent 1.2px);
        background-size: 12px 12px;
        overflow: hidden;
      }
      .tyi-poster__lines {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
      }
      .tyi-poster__main {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        width: 78%;
        max-width: 850px;
        aspect-ratio: 1.4 / 1;
        z-index: 3;
        filter: drop-shadow(8px 10px 0 rgba(0,0,0,0.18));
      }
      .tyi-poster__titleStack {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }
      .tyi-poster__t1 { font-size: 14vmin; color: var(--tag); }
      .tyi-poster__t2 { font-size: 18vmin; color: var(--tag); }
      .tyi-poster__t3 {
        font-size: 26vmin;
        color: var(--it);
        text-shadow: 5px 5px 0 var(--ink);
      }
      .tyi-poster__weapon {
        position: absolute;
        z-index: 2;
        filter: drop-shadow(4px 4px 0 var(--ink));
      }
      .tyi-poster__weapon--tl { left: 4%; top: 6%; transform: rotate(-18deg); }
      .tyi-poster__weapon--tr { right: 4%; top: 10%; transform: rotate(20deg); }
      .tyi-poster__weapon--bl { left: 6%; bottom: 14%; transform: rotate(18deg); }
      .tyi-poster__weapon--br { right: 6%; bottom: 10%; transform: rotate(-15deg); }
      .tyi-poster__burst {
        position: absolute;
        z-index: 4;
        width: 22%;
        aspect-ratio: 1.4 / 1;
      }
      .tyi-poster__burst--a { left: 2%; top: 38%; transform: rotate(-10deg); }
      .tyi-poster__burst--b { right: 4%; top: 38%; transform: rotate(12deg); }
      .tyi-poster__burst--c { left: 32%; bottom: 8%; transform: rotate(-6deg); }
      .tyi-poster__burstTxt { font-size: 4.2vmin; color: var(--white); text-shadow: 2px 2px 0 var(--ink); }
      .tyi-poster__burstTxt2 { font-size: 4vmin; color: var(--ink); }
      .tyi-poster__burstTxt3 { font-size: 4.4vmin; color: var(--white); text-shadow: 2px 2px 0 var(--ink); }
      .tyi-poster__tagline {
        position: absolute;
        bottom: 4%;
        left: 50%;
        transform: translateX(-50%);
        background: var(--ink);
        color: var(--paper);
        font-family: var(--font-impact);
        font-size: 3vmin;
        letter-spacing: 0.1em;
        padding: 1.2vmin 2.2vmin;
        z-index: 5;
        white-space: nowrap;
      }
    `;
    document.head.appendChild(el);
    return () => {
      if (el.parentNode) el.parentNode.removeChild(el);
    };
  }, []);
  return null;
}
