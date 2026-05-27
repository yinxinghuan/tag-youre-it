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

        <ul className="tyi-picker__list">
          {contacts.map((c, i) => {
            const isSelected = selectedId === c.telegram_id;
            return (
              <li key={c.telegram_id}>
                <button
                  className={`tyi-picker__row ${isSelected ? 'tyi-picker__row--sel' : ''}`}
                  onPointerDown={(e) => {
                    e.preventDefault();
                    onSelect(c.telegram_id);
                  }}
                >
                  <Avatar src={c.head_url} name={c.name} size={48} tilt={i % 3 === 0 ? -4 : 4} />
                  <span className="tyi-picker__row-name tyi-prose-strong">{c.name}</span>
                  {isSelected && (
                    <span className="tyi-picker__row-pick tyi-prose-strong">
                      {t('picker.picked_badge')}
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
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
      .tyi-picker__list {
        list-style: none;
        margin: 14px 0 0;
        padding: 0;
        display: flex;
        flex-direction: column;
        gap: 10px;
      }
      .tyi-picker__list > li {
        width: 100%;
      }
      .tyi-picker__row {
        width: 100%;
        background: var(--white);
        border: 4px solid var(--ink);
        box-shadow: 4px 4px 0 var(--ink);
        padding: 10px 14px;
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 14px;
        cursor: pointer;
        font-family: var(--font-impact);
        text-transform: uppercase;
        text-align: left;
        transition: transform 0.06s, box-shadow 0.06s;
        min-width: 0; /* allow children to shrink so ellipsis works */
      }
      .tyi-picker__row:active {
        transform: translate(2px, 2px);
        box-shadow: 2px 2px 0 var(--ink);
      }
      .tyi-picker__row--sel {
        background: var(--tag);
        transform: translate(2px, 2px) rotate(-1deg);
        box-shadow: 2px 2px 0 var(--ink), -3px -3px 0 var(--it);
      }
      .tyi-picker__row-name {
        flex: 1 1 auto;
        min-width: 0;
        font-size: 17px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .tyi-picker__row-pick {
        flex: 0 0 auto;
        background: var(--it);
        color: var(--white);
        border: 3px solid var(--ink);
        box-shadow: 2px 2px 0 var(--ink);
        font-size: 11px;
        padding: 3px 7px;
        transform: rotate(4deg);
      }
    `;
    document.head.appendChild(el);
    return () => {
      if (el.parentNode) el.parentNode.removeChild(el);
    };
  }, []);
  return null;
}
