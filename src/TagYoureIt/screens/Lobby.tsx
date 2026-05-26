import { useEffect, useMemo } from 'react';
import Burst from '../components/Burst';
import Halftone from '../components/Halftone';
import Avatar from '../components/Avatar';
import Watermark from '../components/Watermark';
import { ArrowIcon, MailIcon, ShareIcon } from '../utils/icons';
import { relativeTime } from '../utils/format';
import { getMoveSpec } from '../utils/moves';
import { useLocale } from '../i18n';
import type { IncomingTag, AigramContact } from '../types';

interface LobbyProps {
  isIt: boolean;
  newestIncoming: IncomingTag | null;
  incomingCount: number;
  contactsCount: number;
  contacts: AigramContact[];
  wallCount: number;
  onTagSomeone: () => void;
  onOpenWall: () => void;
}

export default function Lobby({
  isIt,
  newestIncoming,
  incomingCount,
  contactsCount,
  contacts,
  wallCount,
  onTagSomeone,
  onOpenWall,
}: LobbyProps) {
  const { t, tp } = useLocale();
  const dominantColor = isIt ? 'it' : 'tag';
  const ctaLabel = isIt ? t('lobby.cta_tag_back') : t('lobby.cta_tag');

  // Lobby avatar strip — show up to 5 from contacts to suggest "your friends"
  const stripContacts = useMemo(() => contacts.slice(0, 5), [contacts]);

  return (
    <>
      {isIt && <Halftone color="var(--it-dark)" spacing={14} radius={2.5} opacity={0.16} />}

      <div className="tyi-stage__header">
        <div className="tyi-sticker tyi-sticker--paper tyi-sticker--small">
          NO. 14 · ALTERU
        </div>
        <button
          className="tyi-btn tyi-btn--ghost tyi-btn--small"
          onPointerDown={(e) => {
            e.preventDefault();
            onOpenWall();
          }}
          aria-label="wall"
        >
          <ShareIcon size={18} />
          <span className="tyi-prose-strong">{t('lobby.wall_count', { n: wallCount })}</span>
        </button>
      </div>

      <div className="tyi-stage__scroll">
        {/* Title burst */}
        <div className="tyi-lobby__titleBurst">
          <Burst fill="var(--ink)" stroke="var(--ink)" outer={48} inner={36} points={20}>
            <div className="tyi-lobby__titleStack">
              <span className="tyi-shout tyi-lobby__t1">TAG,</span>
              <span className="tyi-shout tyi-lobby__t2">YOU'RE</span>
              <span className="tyi-shout tyi-lobby__t3">IT!</span>
            </div>
          </Burst>
        </div>

        {/* Status card */}
        {isIt && newestIncoming ? (
          <div className="tyi-panel tyi-panel--it tyi-lobby__status">
            <div className="tyi-panel__caption tyi-prose-strong">{t('lobby.status')}</div>
            <Halftone color="var(--white)" spacing={10} radius={1.5} opacity={0.16} />
            <div className="tyi-lobby__statusBody">
              {/* Decorative shout — English only, comic font */}
              <div className="tyi-shout tyi-lobby__statusShout">YOU'RE IT!</div>
              <div className="tyi-lobby__statusRow">
                <Avatar
                  src={newestIncoming.sender_avatar}
                  name={newestIncoming.sender_name}
                  size={56}
                />
                <div>
                  <div className="tyi-lobby__statusBy">
                    <span className="tyi-prose">{t('lobby.tagged_by')}</span>{' '}
                    <span className="tyi-prose-strong">{newestIncoming.sender_name}</span>
                  </div>
                  <div className="tyi-lobby__statusMeta tyi-prose-strong">
                    {t('lobby.move_ago', {
                      shout: getMoveSpec(newestIncoming.move_id)?.shout || 'TAGGED',
                      time: relativeTime(newestIncoming.ts),
                    })}
                  </div>
                </div>
              </div>
              {incomingCount > 1 && (
                <div className="tyi-lobby__moreIncoming tyi-prose">
                  {tp(
                    'lobby.more_incoming',
                    'lobby.more_incoming_plural',
                    incomingCount - 1,
                  )}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="tyi-panel tyi-panel--paper tyi-lobby__status">
            <div className="tyi-panel__caption tyi-prose-strong">{t('lobby.status')}</div>
            <div className="tyi-lobby__statusBody tyi-lobby__statusBody--free">
              <div className="tyi-lobby__statusShout tyi-lobby__statusShout--free tyi-prose-strong">
                {t('lobby.free_big')}
              </div>
              <div className="tyi-lobby__statusSub tyi-prose">{t('lobby.free_sub')}</div>
            </div>
          </div>
        )}

        {/* Friends strip */}
        {stripContacts.length > 0 ? (
          <div className="tyi-lobby__friends">
            <div className="tyi-prose tyi-lobby__friendsLabel">
              {tp(
                'lobby.friends_unsuspecting',
                'lobby.friends_unsuspecting_plural',
                contactsCount,
              )}
            </div>
            <div className="tyi-lobby__friendsRow">
              {stripContacts.map((c, i) => (
                <Avatar
                  key={c.telegram_id}
                  src={c.head_url}
                  name={c.name}
                  size={48}
                  tilt={i % 2 === 0 ? -6 : 6}
                />
              ))}
              {contactsCount > stripContacts.length && (
                <div className="tyi-lobby__friendsMore">
                  +{contactsCount - stripContacts.length}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="tyi-lobby__noFriends tyi-prose">
            {t('lobby.no_friends')}
          </div>
        )}

        {/* Inbox link */}
        {incomingCount > 0 && (
          <button
            className="tyi-lobby__inboxLink"
            onPointerDown={(e) => {
              e.preventDefault();
              onOpenWall();
            }}
          >
            <MailIcon size={20} />
            <span className="tyi-prose-strong">
              {tp('lobby.inbox', 'lobby.inbox_plural', incomingCount)}
            </span>
            <ArrowIcon size={18} />
          </button>
        )}
      </div>

      <div className="tyi-stage__footer">
        <button
          className={`tyi-btn tyi-btn--block tyi-btn--${dominantColor}`}
          onPointerDown={(e) => {
            e.preventDefault();
            onTagSomeone();
          }}
        >
          <span className="tyi-prose-strong">{ctaLabel}</span>
        </button>
      </div>

      <Watermark />
      <LobbyStyles />
    </>
  );
}

// Inline styles for Lobby-only layout — keeps the master .less lean
function LobbyStyles() {
  useEffect(() => {
    const id = 'tyi-lobby-style';
    if (document.getElementById(id)) return;
    const el = document.createElement('style');
    el.id = id;
    el.textContent = `
      .tyi-lobby__titleBurst {
        width: 90%;
        max-width: 320px;
        aspect-ratio: 1.4 / 1;
        margin: 8px auto 18px;
        animation: tyi-pop 0.6s ease-out;
      }
      .tyi-lobby__titleStack {
        display: flex;
        flex-direction: column;
        gap: 4px;
        color: var(--tag);
      }
      .tyi-lobby__t1 { font-size: 32px; }
      .tyi-lobby__t2 { font-size: 42px; }
      .tyi-lobby__t3 {
        font-size: 60px;
        color: var(--it);
        text-shadow: 3px 3px 0 var(--ink);
      }
      .tyi-lobby__status {
        margin-bottom: 18px;
      }
      .tyi-lobby__statusBody {
        position: relative;
        z-index: 1;
        padding-top: 10px;
        display: flex;
        flex-direction: column;
        gap: 14px;
      }
      .tyi-lobby__statusBody--free {
        align-items: center;
        text-align: center;
        padding: 16px 0 6px;
      }
      .tyi-lobby__statusShout {
        font-size: 44px;
        line-height: 1;
        color: var(--white);
        text-shadow: 3px 3px 0 var(--ink);
      }
      .tyi-lobby__statusShout--free {
        color: var(--ink);
        text-shadow: none;
        font-size: 32px;
        line-height: 1.05;
        font-weight: 900;
        letter-spacing: -0.01em;
      }
      .tyi-lobby__statusSub {
        font-size: 16px;
        color: var(--ink-soft);
      }
      .tyi-lobby__noFriends {
        text-align: center;
        font-size: 14px;
        padding: 10px 12px;
        background: var(--white);
        border: 3px dashed var(--ink);
        margin-bottom: 14px;
        color: var(--ink-soft);
      }
      .tyi-lobby__statusRow {
        display: flex;
        align-items: center;
        gap: 14px;
      }
      .tyi-lobby__statusBy {
        font-size: 16px;
        font-weight: 700;
      }
      .tyi-lobby__statusMeta {
        font-family: var(--font-impact);
        font-size: 13px;
        opacity: 0.85;
        margin-top: 2px;
      }
      .tyi-lobby__moreIncoming {
        font-family: var(--font-marker);
        font-size: 14px;
        text-align: center;
        background: rgba(0,0,0,0.18);
        padding: 4px 10px;
        align-self: center;
      }
      .tyi-lobby__friends {
        margin-bottom: 14px;
      }
      .tyi-lobby__friendsLabel {
        font-size: 16px;
        margin-bottom: 8px;
      }
      .tyi-lobby__friendsRow {
        display: flex;
        gap: 8px;
        align-items: center;
        flex-wrap: wrap;
      }
      .tyi-lobby__friendsMore {
        background: var(--ink);
        color: var(--paper);
        border: 3px solid var(--ink);
        box-shadow: 3px 3px 0 var(--ink);
        font-family: var(--font-impact);
        padding: 6px 12px;
        border-radius: 50%;
        font-size: 16px;
      }
      .tyi-lobby__inboxLink {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        width: 100%;
        background: var(--white);
        border: 3px solid var(--ink);
        box-shadow: 4px 4px 0 var(--ink);
        font-family: var(--font-impact);
        font-size: 15px;
        padding: 12px 14px;
        margin-top: 6px;
        cursor: pointer;
        text-align: left;
        text-transform: uppercase;
      }
      .tyi-lobby__inboxLink span { flex: 1; }
      .tyi-lobby__inboxLink:active {
        transform: translate(2px, 2px);
        box-shadow: 2px 2px 0 var(--ink);
      }
    `;
    document.head.appendChild(el);
    return () => {
      if (el.parentNode) el.parentNode.removeChild(el);
    };
  }, []);
  return null;
}
