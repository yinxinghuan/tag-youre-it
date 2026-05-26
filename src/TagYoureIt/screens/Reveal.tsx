import { useEffect } from 'react';
import Burst from '../components/Burst';
import Halftone from '../components/Halftone';
import Avatar from '../components/Avatar';
import Watermark from '../components/Watermark';
import { ArrowIcon, ShareIcon, CheckIcon, MoveIcon } from '../utils/icons';
import { MOVES } from '../utils/moves';
import { playFanfare } from '../utils/sounds';
import { useLocale } from '../i18n';
import type { AigramContact, MoveId } from '../types';

interface Props {
  target: AigramContact;
  moveId: MoveId;
  imageUrl: string | null;
  errored: boolean;
  /** True if the platform notify request was successfully fired */
  notified: boolean;
  isDemo: boolean;
  onShare: () => void;
  onLobby: () => void;
}

export default function Reveal({
  target,
  moveId,
  imageUrl,
  errored,
  notified,
  isDemo,
  onShare,
  onLobby,
}: Props) {
  const { t } = useLocale();
  const move = MOVES.find((m) => m.id === moveId);

  useEffect(() => {
    playFanfare();
  }, []);

  if (!move) return null;

  return (
    <>
      <Halftone color="var(--ink)" spacing={12} radius={2} opacity={0.12} />

      <div className="tyi-stage__header">
        {/* Decorative shout — stays English in comic font */}
        <div className="tyi-sticker tyi-sticker--it tyi-sticker--small">TAGGED!</div>
        <div className="tyi-sticker tyi-sticker--paper tyi-sticker--small">
          {move.num} · {move.shout}
        </div>
      </div>

      <div className="tyi-stage__scroll">
        <div className="tyi-reveal__panel">
          <div className="tyi-panel__caption tyi-prose-strong">{t('reveal.evidence')}</div>

          <div className="tyi-reveal__art">
            {imageUrl && !errored ? (
              <img
                src={imageUrl}
                alt="comic panel"
                className="tyi-reveal__img"
                onError={() => {
                  /* swallow */
                }}
              />
            ) : (
              <div className="tyi-reveal__fallback">
                <Halftone color="var(--ink)" spacing={9} radius={1.8} opacity={0.28} />
                <div className="tyi-reveal__fallbackInner">
                  <div className="tyi-reveal__targetMug">
                    <Avatar src={target.head_url} name={target.name} size={150} />
                  </div>
                  <div className="tyi-reveal__bigWeapon">
                    <MoveIcon id={moveId} size={180} />
                  </div>
                  <div className="tyi-prose-strong tyi-reveal__fallbackTxt">
                    {t('reveal.fallback_title', {
                      name: target.name,
                      shout: move.shout,
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Stamped burst overlay */}
            <div className="tyi-reveal__stamp">
              <Burst fill="var(--it)" stroke="var(--ink)" outer={48} inner={28} points={20}>
                <div className="tyi-reveal__stampStack">
                  <span className="tyi-shout tyi-reveal__stampTop">{move.shout}</span>
                  <span className="tyi-shout tyi-reveal__stampBot">YOU&apos;RE IT</span>
                </div>
              </Burst>
            </div>
          </div>

          <div className="tyi-reveal__caption">
            <Avatar src={target.head_url} name={target.name} size={42} />
            <div>
              <div className="tyi-prose-strong tyi-reveal__capName">{target.name}</div>
              <div className="tyi-prose tyi-reveal__capLine">{t('reveal.caption_line')}</div>
            </div>
          </div>
        </div>

        {/* Notify status sticker */}
        <div
          className={`tyi-reveal__notice tyi-prose-strong ${
            notified ? 'tyi-reveal__notice--ok' : 'tyi-reveal__notice--info'
          }`}
        >
          {isDemo ? (
            <>
              <CheckIcon size={20} />
              {t('reveal.notice_demo')}
            </>
          ) : notified ? (
            <>
              <CheckIcon size={20} />
              {t('reveal.notice_sent', { name: target.name })}
            </>
          ) : (
            <>{t('reveal.notice_queuing')}</>
          )}
        </div>
      </div>

      <div className="tyi-stage__footer">
        <button
          className="tyi-btn tyi-btn--block tyi-btn--it"
          onPointerDown={(e) => {
            e.preventDefault();
            onShare();
          }}
          disabled={!imageUrl || errored || isDemo}
        >
          <ShareIcon size={20} />
          <span className="tyi-prose-strong">{t('reveal.cta_share')}</span>
        </button>
        <button
          className="tyi-btn tyi-btn--block tyi-btn--ghost"
          onPointerDown={(e) => {
            e.preventDefault();
            onLobby();
          }}
        >
          <span className="tyi-prose-strong">{t('reveal.cta_lobby')}</span>
          <ArrowIcon size={16} />
        </button>
      </div>

      <Watermark />
      <RevealStyles />
    </>
  );
}

function RevealStyles() {
  useEffect(() => {
    const id = 'tyi-reveal-style';
    if (document.getElementById(id)) return;
    const el = document.createElement('style');
    el.id = id;
    el.textContent = `
      .tyi-reveal__panel {
        position: relative;
        background: var(--white);
        border: 6px solid var(--ink);
        box-shadow: 6px 6px 0 var(--ink);
        margin-top: 6px;
        overflow: hidden;
        animation: tyi-arrival-pop 0.5s ease-out;
      }
      .tyi-reveal__art {
        position: relative;
        width: 100%;
        aspect-ratio: 1 / 1;
        background: var(--paper);
        overflow: hidden;
      }
      .tyi-reveal__img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
      }
      .tyi-reveal__fallback {
        position: relative;
        width: 100%;
        height: 100%;
        background: var(--tag);
      }
      .tyi-reveal__fallbackInner {
        position: absolute;
        inset: 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
      }
      .tyi-reveal__targetMug {
        position: absolute;
        left: 8%;
        top: 12%;
      }
      .tyi-reveal__bigWeapon {
        position: absolute;
        right: 6%;
        top: 30%;
        filter: drop-shadow(4px 4px 0 var(--ink));
        transform: rotate(-12deg);
      }
      .tyi-reveal__fallbackTxt {
        position: absolute;
        top: 10%;
        left: 50%;
        transform: translateX(-50%) rotate(-2deg);
        font-size: 18px;
        color: var(--white);
        background: var(--ink);
        padding: 5px 12px;
        white-space: nowrap;
        max-width: 92%;
        text-align: center;
      }
      .tyi-reveal__stamp {
        position: absolute;
        bottom: 4%;
        right: -4%;
        width: 56%;
        max-width: 220px;
        aspect-ratio: 1.4 / 1;
        transform: rotate(-8deg);
        animation: tyi-slam 0.5s cubic-bezier(.3,1.6,.4,1) 0.2s backwards;
      }
      .tyi-reveal__stampStack {
        display: flex;
        flex-direction: column;
        gap: 2px;
      }
      .tyi-reveal__stampTop {
        font-size: 24px;
        color: var(--white);
        text-shadow: 2px 2px 0 var(--ink);
      }
      .tyi-reveal__stampBot {
        font-size: 16px;
        color: var(--tag);
        text-shadow: 2px 2px 0 var(--ink);
        letter-spacing: 0.06em;
      }
      .tyi-reveal__caption {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 10px 12px;
        border-top: 4px solid var(--ink);
        background: var(--paper-light);
      }
      .tyi-reveal__capName {
        font-size: 18px;
      }
      .tyi-reveal__capLine {
        font-size: 13px;
        color: var(--ink-soft);
      }
      .tyi-reveal__notice {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        margin: 14px 0 6px;
        font-family: var(--font-impact);
        font-size: 13px;
        background: var(--white);
        border: 3px solid var(--ink);
        padding: 8px 10px;
        text-transform: uppercase;
      }
      .tyi-reveal__notice--ok {
        background: var(--mint);
      }
      .tyi-reveal__notice--info {
        background: var(--paper);
      }
    `;
    document.head.appendChild(el);
    return () => {
      if (el.parentNode) el.parentNode.removeChild(el);
    };
  }, []);
  return null;
}
