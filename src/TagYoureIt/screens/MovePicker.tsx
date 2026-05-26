import { useEffect } from 'react';
import Avatar from '../components/Avatar';
import Watermark from '../components/Watermark';
import { MoveIcon, BackIcon } from '../utils/icons';
import { MOVES } from '../utils/moves';
import { useLocale } from '../i18n';
import type { AigramContact, MoveId } from '../types';

interface Props {
  target: AigramContact;
  selectedMove: MoveId | null;
  onSelectMove: (id: MoveId) => void;
  onConfirm: () => void;
  onBack: () => void;
}

const COLOR_MAP: Record<string, { bg: string; text: string }> = {
  cream: { bg: '#fff4d9', text: '#111' },
  green: { bg: '#7cfc00', text: '#111' },
  pink: { bg: '#ff6b9d', text: '#fff' },
  yellow: { bg: '#ffd60a', text: '#111' },
  red: { bg: '#e63946', text: '#fff' },
  blue: { bg: '#2c6df4', text: '#fff' },
};

export default function MovePicker({
  target,
  selectedMove,
  onSelectMove,
  onConfirm,
  onBack,
}: Props) {
  const { t } = useLocale();
  const selectedSpec = MOVES.find((m) => m.id === selectedMove);

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
          <span className="tyi-prose-strong">{t('lobby.cta_back')}</span>
        </button>
        <div className="tyi-sticker tyi-sticker--paper tyi-sticker--small tyi-prose-strong">
          {t('move.title_bar')}
        </div>
        <div style={{ width: 88 }} />
      </div>

      <div className="tyi-stage__scroll">
        <div className="tyi-move__targetRow">
          <Avatar src={target.head_url} name={target.name} size={56} />
          <div>
            <div className="tyi-prose tyi-move__targetCue">{t('move.target_cue')}</div>
            <div className="tyi-prose-strong tyi-move__targetName">{target.name}</div>
          </div>
        </div>

        <h2 className="tyi-move__title tyi-prose-strong">{t('move.h2')}</h2>

        <div className="tyi-move__grid">
          {MOVES.map((m) => {
            const isSel = selectedMove === m.id;
            const c = COLOR_MAP[m.color];
            return (
              <button
                key={m.id}
                className={`tyi-move__card ${isSel ? 'tyi-move__card--sel' : ''}`}
                style={{ background: c.bg, color: c.text }}
                onPointerDown={(e) => {
                  e.preventDefault();
                  onSelectMove(m.id);
                }}
              >
                <div className="tyi-move__num">{m.num}</div>
                <div className="tyi-move__icon">
                  <MoveIcon id={m.id} size={56} />
                </div>
                {/* Weapon shout — stays English in comic font. */}
                <div className="tyi-move__shout">{m.shout}</div>
                <div className="tyi-move__desc tyi-prose-strong">
                  {t(`weapon.${m.id}.desc`)}
                </div>
                {isSel && (
                  <div className="tyi-move__loaded tyi-prose-strong">
                    {t('move.loaded_badge')}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="tyi-stage__footer">
        <button
          className={`tyi-btn tyi-btn--block ${selectedSpec ? 'tyi-btn--it' : ''}`}
          onPointerDown={(e) => {
            e.preventDefault();
            if (selectedSpec) onConfirm();
          }}
          disabled={!selectedSpec}
        >
          <span className="tyi-prose-strong">
            {selectedSpec
              ? t('move.cta_next', { shout: selectedSpec.shout })
              : t('move.cta_empty')}
          </span>
        </button>
      </div>

      <Watermark />
      <MoveStyles />
    </>
  );
}

function MoveStyles() {
  useEffect(() => {
    const id = 'tyi-move-style';
    if (document.getElementById(id)) return;
    const el = document.createElement('style');
    el.id = id;
    el.textContent = `
      .tyi-move__targetRow {
        display: flex;
        align-items: center;
        gap: 12px;
        background: var(--white);
        border: 3px solid var(--ink);
        box-shadow: 3px 3px 0 var(--ink);
        padding: 8px 12px;
        margin-bottom: 14px;
      }
      .tyi-move__targetCue {
        font-size: 13px;
        color: var(--ink-soft);
      }
      .tyi-move__targetName {
        font-size: 22px;
      }
      .tyi-move__title {
        font-size: 26px;
        margin: 6px 0 12px;
        font-weight: 900;
        letter-spacing: -0.01em;
        line-height: 1.1;
      }
      .tyi-move__grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 12px;
      }
      .tyi-move__card {
        position: relative;
        border: 4px solid var(--ink);
        box-shadow: 4px 4px 0 var(--ink);
        padding: 10px 8px 8px;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 4px;
        cursor: pointer;
        text-align: center;
        transition: transform 0.06s, box-shadow 0.06s;
        font-family: var(--font-impact);
      }
      .tyi-move__card:active {
        transform: translate(2px, 2px);
        box-shadow: 2px 2px 0 var(--ink);
      }
      .tyi-move__card--sel {
        transform: rotate(-1.5deg) translate(0, -2px);
        box-shadow: 4px 4px 0 var(--ink), -3px -3px 0 var(--it);
      }
      .tyi-move__num {
        position: absolute;
        top: 4px;
        left: 6px;
        font-size: 11px;
        opacity: 0.5;
      }
      .tyi-move__icon {
        margin: 6px 0 2px;
        filter: drop-shadow(2px 2px 0 rgba(0,0,0,0.5));
      }
      .tyi-move__shout {
        font-family: var(--font-shout);
        font-size: 22px;
        line-height: 1;
        text-transform: uppercase;
      }
      .tyi-move__desc {
        font-size: 12px;
        line-height: 1.25;
        letter-spacing: 0.01em;
        opacity: 0.9;
        text-align: center;
        max-width: 100%;
      }
      .tyi-move__loaded {
        position: absolute;
        top: -10px;
        right: -8px;
        background: var(--it);
        color: var(--white);
        border: 3px solid var(--ink);
        box-shadow: 2px 2px 0 var(--ink);
        font-family: var(--font-impact);
        font-size: 11px;
        padding: 3px 7px;
        transform: rotate(8deg);
      }
    `;
    document.head.appendChild(el);
    return () => {
      if (el.parentNode) el.parentNode.removeChild(el);
    };
  }, []);
  return null;
}
