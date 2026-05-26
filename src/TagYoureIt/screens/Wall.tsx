import { useEffect } from 'react';
import Avatar from '../components/Avatar';
import Halftone from '../components/Halftone';
import Watermark from '../components/Watermark';
import { BackIcon, MoveIcon } from '../utils/icons';
import { relativeTime } from '../utils/format';
import { MOVES } from '../utils/moves';
import type { IncomingTag, MoveId } from '../types';

function WallNoArt({ move, targetName }: { move: MoveId; targetName: string }) {
  const spec = MOVES.find((m) => m.id === move);
  const palette: Record<string, string> = {
    cream: '#ffd60a', // bump cream → tag yellow so it doesn't fade into paper bg
    green: '#7cfc00',
    pink: '#ff6b9d',
    yellow: '#ffd60a',
    red: '#e63946',
    blue: '#2c6df4',
  };
  const bg = (spec && palette[spec.color]) || '#ffd60a';
  return (
    <div className="tyi-wall__noart" style={{ background: bg }}>
      <Halftone color="var(--ink)" spacing={10} radius={2} opacity={0.22} />
      <div className="tyi-wall__noartIcon">
        <MoveIcon id={move} size={120} />
      </div>
      <div className="tyi-wall__noartName">{targetName.toUpperCase()}</div>
    </div>
  );
}

interface Props {
  wall: IncomingTag[];
  myId: string | null;
  onTagBack: (tag: IncomingTag) => void;
  onBack: () => void;
}

export default function Wall({ wall, myId, onTagBack, onBack }: Props) {
  return (
    <>
      <div className="tyi-stage__header">
        <button
          className="tyi-btn tyi-btn--ghost tyi-btn--small"
          onPointerDown={(e) => {
            e.preventDefault();
            onBack();
          }}
          aria-label="back"
        >
          <BackIcon size={18} />
          BACK
        </button>
        <div className="tyi-sticker tyi-sticker--paper tyi-sticker--small">
          THE WALL
        </div>
        <div style={{ width: 88 }} />
      </div>

      <div className="tyi-stage__scroll">
        <h2 className="tyi-shout tyi-wall__title">
          RECENT <span style={{ color: 'var(--it)' }}>TAGS</span>
        </h2>
        <div className="tyi-wall__sub tyi-marker">
          last {wall.length} hits from the ring
        </div>

        {wall.length === 0 ? (
          <div className="tyi-wall__empty">
            No tags yet. Be the first one out there.
          </div>
        ) : (
          <div className="tyi-wall__feed">
            {wall.map((t) => {
              const move = MOVES.find((m) => m.id === t.move_id);
              const taggedMe = myId && t.target_id === myId;
              const senderIsMe = myId && t.sender_id === myId;
              return (
                <div key={t.id} className="tyi-wall__card">
                  {/* Image */}
                  <div className="tyi-wall__art">
                    {t.image_url ? (
                      <img src={t.image_url} alt="" className="tyi-wall__img" />
                    ) : (
                      <WallNoArt move={t.move_id} targetName={t.target_name} />
                    )}
                    <div className="tyi-wall__moveStamp">{move?.shout || 'TAGGED'}</div>
                  </div>

                  {/* Caption */}
                  <div className="tyi-wall__caption">
                    <div className="tyi-wall__faces">
                      <Avatar src={t.sender_avatar} name={t.sender_name} size={36} />
                      <div className="tyi-wall__arrow">→</div>
                      <Avatar src={t.target_avatar} name={t.target_name} size={36} />
                    </div>
                    <div className="tyi-wall__line">
                      <span className="tyi-impact">{t.sender_name}</span>
                      <span className="tyi-marker"> tagged </span>
                      <span className="tyi-impact">{t.target_name}</span>
                    </div>
                    <div className="tyi-wall__meta">
                      <span>{relativeTime(t.ts)} ago</span>
                      {taggedMe && (
                        <span className="tyi-wall__pingMe">↳ YOU GOT TAGGED</span>
                      )}
                      {senderIsMe && (
                        <span className="tyi-wall__pingMine">↳ YOUR HIT</span>
                      )}
                    </div>
                    {taggedMe && (
                      <button
                        className="tyi-btn tyi-btn--small tyi-btn--it"
                        style={{ marginTop: 6 }}
                        onPointerDown={(e) => {
                          e.preventDefault();
                          onTagBack(t);
                        }}
                      >
                        TAG {t.sender_name.toUpperCase()} BACK
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <Watermark />
      <WallStyles />
    </>
  );
}

function WallStyles() {
  useEffect(() => {
    const id = 'tyi-wall-style';
    if (document.getElementById(id)) return;
    const el = document.createElement('style');
    el.id = id;
    el.textContent = `
      .tyi-wall__title {
        font-size: 32px;
        margin: 4px 0 2px;
        text-transform: uppercase;
        text-shadow: 2px 2px 0 var(--white);
      }
      .tyi-wall__sub {
        font-size: 14px;
        margin-bottom: 14px;
        color: var(--ink-soft);
      }
      .tyi-wall__empty {
        text-align: center;
        font-family: var(--font-marker);
        font-size: 16px;
        padding: 36px 12px;
        color: var(--ink-soft);
      }
      .tyi-wall__feed {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }
      .tyi-wall__card {
        background: var(--white);
        border: 4px solid var(--ink);
        box-shadow: 5px 5px 0 var(--ink);
        overflow: hidden;
      }
      .tyi-wall__art {
        position: relative;
        width: 100%;
        aspect-ratio: 1 / 1;
        background: var(--paper);
        overflow: hidden;
        border-bottom: 4px solid var(--ink);
      }
      .tyi-wall__img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
      }
      .tyi-wall__noart {
        position: absolute;
        inset: 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 16px;
      }
      .tyi-wall__noartIcon {
        filter: drop-shadow(3px 3px 0 var(--ink));
        transform: rotate(-8deg);
      }
      .tyi-wall__noartName {
        position: relative;
        z-index: 1;
        font-family: var(--font-impact);
        font-size: 22px;
        background: var(--ink);
        color: var(--paper);
        border: 3px solid var(--ink);
        box-shadow: 3px 3px 0 var(--ink);
        padding: 4px 12px;
        transform: rotate(-2deg);
      }
      .tyi-wall__moveStamp {
        position: absolute;
        bottom: 10px;
        right: 10px;
        background: var(--it);
        color: var(--white);
        border: 3px solid var(--ink);
        box-shadow: 2px 2px 0 var(--ink);
        font-family: var(--font-impact);
        font-size: 14px;
        padding: 4px 8px;
        text-transform: uppercase;
        transform: rotate(-3deg);
      }
      .tyi-wall__caption {
        padding: 10px 12px;
        background: var(--paper-light);
      }
      .tyi-wall__faces {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 6px;
      }
      .tyi-wall__arrow {
        font-family: var(--font-impact);
        font-size: 22px;
      }
      .tyi-wall__line {
        font-size: 15px;
      }
      .tyi-wall__meta {
        display: flex;
        gap: 10px;
        align-items: center;
        flex-wrap: wrap;
        margin-top: 4px;
        font-family: var(--font-impact);
        font-size: 12px;
        color: var(--ink-soft);
      }
      .tyi-wall__pingMe {
        background: var(--it);
        color: var(--white);
        padding: 2px 6px;
        border: 2px solid var(--ink);
      }
      .tyi-wall__pingMine {
        background: var(--mint);
        color: var(--ink);
        padding: 2px 6px;
        border: 2px solid var(--ink);
      }
    `;
    document.head.appendChild(el);
    return () => {
      if (el.parentNode) el.parentNode.removeChild(el);
    };
  }, []);
  return null;
}
