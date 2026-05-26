import { useEffect } from 'react';
import Avatar from '../components/Avatar';
import Watermark from '../components/Watermark';
import { BackIcon } from '../utils/icons';
import { useLocale } from '../i18n';
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
  const { t } = useLocale();
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
          <span className="tyi-prose-strong">{t('lobby.cta_back')}</span>
        </button>
        <div className="tyi-sticker tyi-sticker--paper tyi-sticker--small tyi-prose-strong">
          {t('picker.title_bar')}
        </div>
        <div style={{ width: 88 }} />
      </div>

      <div className="tyi-stage__scroll">
        <h2 className="tyi-picker__title tyi-prose-strong">
          {isIt ? t('picker.h2_tag_back') : t('picker.h2_tag')}
        </h2>
        {isDemo && (
          <div className="tyi-picker__hint tyi-prose">{t('picker.preview_hint')}</div>
        )}
        {loading && (
          <div className="tyi-picker__empty tyi-prose">{t('picker.loading')}</div>
        )}
        {!loading && contacts.length === 0 && (
          <div className="tyi-picker__empty tyi-prose">{t('picker.empty')}</div>
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
                <div className="tyi-picker__name tyi-prose-strong">{c.name}</div>
                {isSelected && (
                  <div className="tyi-picker__pick tyi-prose-strong">
                    {t('picker.picked_badge')}
                  </div>
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
          <span className="tyi-prose-strong">
            {selected
              ? t('picker.cta_next', { name: selected.name })
              : t('picker.cta_empty')}
          </span>
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
        font-size: 28px;
        line-height: 1.1;
        margin: 4px 0 6px;
        font-weight: 900;
        letter-spacing: -0.01em;
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
