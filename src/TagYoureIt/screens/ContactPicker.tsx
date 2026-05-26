import { useEffect } from 'react';
import Avatar from '../components/Avatar';
import Watermark from '../components/Watermark';
import { BackIcon } from '../utils/icons';
import type { AigramContact } from '../types';

interface Props {
  contacts: AigramContact[];
  loading: boolean;
  isDemo: boolean;
  selectedId: string | null;
  isIt: boolean;
  onSelect: (id: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function ContactPicker({
  contacts,
  loading,
  isDemo,
  selectedId,
  isIt,
  onSelect,
  onNext,
  onBack,
}: Props) {
  const selected = contacts.find((c) => c.telegram_id === selectedId);

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
          PICK · YOUR · MARK
        </div>
        <div style={{ width: 88 }} />
      </div>

      <div className="tyi-stage__scroll">
        <h2 className="tyi-shout tyi-picker__title">
          WHO GETS{' '}
          <span style={{ color: isIt ? 'var(--it)' : 'var(--cool)' }}>
            {isIt ? 'TAGGED BACK' : 'TAGGED'}?
          </span>
        </h2>
        {isDemo && (
          <div className="tyi-picker__hint">
            (DEMO friends — log in via Aigram to see your real ones)
          </div>
        )}
        {loading && <div className="tyi-picker__empty">Loading friends…</div>}
        {!loading && contacts.length === 0 && (
          <div className="tyi-picker__empty">
            No friends found on Aigram yet. Invite some first!
          </div>
        )}

        <div className="tyi-picker__grid">
          {contacts.map((c, i) => {
            const isSelected = selectedId === c.telegram_id;
            return (
              <button
                key={c.telegram_id}
                className={`tyi-picker__card ${isSelected ? 'tyi-picker__card--sel' : ''}`}
                onPointerDown={(e) => {
                  e.preventDefault();
                  onSelect(c.telegram_id);
                }}
              >
                <Avatar src={c.head_url} name={c.name} size={64} tilt={i % 3 === 0 ? -4 : 4} />
                <div className="tyi-picker__name">{c.name}</div>
                {isSelected && (
                  <div className="tyi-picker__pick">PICKED</div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="tyi-stage__footer">
        <button
          className={`tyi-btn tyi-btn--block ${selected ? 'tyi-btn--it' : ''}`}
          onPointerDown={(e) => {
            e.preventDefault();
            if (selected) onNext();
          }}
          disabled={!selected}
        >
          {selected ? `→ TAG ${selected.name.toUpperCase()}` : 'PICK A FRIEND'}
        </button>
      </div>

      <Watermark />
      <PickerStyles />
    </>
  );
}

function PickerStyles() {
  useEffect(() => {
    const id = 'tyi-picker-style';
    if (document.getElementById(id)) return;
    const el = document.createElement('style');
    el.id = id;
    el.textContent = `
      .tyi-picker__title {
        font-size: 32px;
        line-height: 1.05;
        margin: 4px 0 6px;
        text-transform: uppercase;
        text-shadow: 2px 2px 0 var(--white);
      }
      .tyi-picker__hint {
        font-family: var(--font-marker);
        font-size: 13px;
        color: var(--ink-soft);
        margin-bottom: 14px;
      }
      .tyi-picker__empty {
        text-align: center;
        font-family: var(--font-marker);
        font-size: 16px;
        padding: 32px 0;
        color: var(--ink-soft);
      }
      .tyi-picker__grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 12px;
        margin-top: 14px;
      }
      .tyi-picker__card {
        position: relative;
        background: var(--white);
        border: 4px solid var(--ink);
        box-shadow: 4px 4px 0 var(--ink);
        padding: 12px 8px 10px;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 6px;
        cursor: pointer;
        font-family: var(--font-impact);
        text-transform: uppercase;
        font-size: 14px;
        transition: transform 0.06s, box-shadow 0.06s;
      }
      .tyi-picker__card:active {
        transform: translate(2px, 2px);
        box-shadow: 2px 2px 0 var(--ink);
      }
      .tyi-picker__card--sel {
        background: var(--tag);
        transform: translate(2px, 2px) rotate(-1deg);
        box-shadow: 2px 2px 0 var(--ink), -3px -3px 0 var(--it);
      }
      .tyi-picker__name {
        font-size: 14px;
        max-width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .tyi-picker__pick {
        position: absolute;
        top: -10px;
        right: -8px;
        background: var(--it);
        color: var(--white);
        border: 3px solid var(--ink);
        box-shadow: 2px 2px 0 var(--ink);
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
