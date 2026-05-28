import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import './TagYoureIt.less';
import { isInAigram, telegramId, useGenImage, useGameEvent, callAigramAPI } from '@shared/runtime';
import type { AigramResponse } from '@shared/runtime';
import { LocaleProvider } from './i18n';
import { useAigramContacts } from './hooks/useAigramContacts';
import { useTagState } from './hooks/useTagState';
import Lobby from './screens/Lobby';
import ContactPicker from './screens/ContactPicker';
import MovePicker from './screens/MovePicker';
import Slam from './screens/Slam';
import Reveal from './screens/Reveal';
import Wall from './screens/Wall';
import Poster from './screens/Poster';
import { MOVES, getMoveSpec } from './utils/moves';
import { unlockAudio, playClick } from './utils/sounds';
import { generateTagId } from './utils/format';
import type { AigramContact, IncomingTag, MoveId, OutgoingTag, Screen } from './types';

// Demo state forcing — useful for screenshots / poster shoots
type DemoMode =
  | null
  | 'lobby'
  | 'lobby-it'
  | 'picker'
  | 'move'
  | 'slam'
  | 'reveal'
  | 'wall'
  | 'poster';

function readDemoMode(): DemoMode {
  if (typeof window === 'undefined') return null;
  const params = new URLSearchParams(window.location.search);
  const v = params.get('demo');
  if (!v) return null;
  const allowed: DemoMode[] = [
    'lobby',
    'lobby-it',
    'picker',
    'move',
    'slam',
    'reveal',
    'wall',
    'poster',
  ];
  return (allowed.includes(v as DemoMode) ? v : null) as DemoMode;
}

// In demo mode we deliberately leave the AI image null so the fallback
// panel renders — gives screenshots a reliable preview without depending on
// an externally hosted asset.
const DEMO_PIE_IMG = null as string | null;

const DEMO_INCOMING: IncomingTag = {
  id: 'demo-incoming',
  target_id: 'me',
  target_name: 'YOU',
  target_avatar: '',
  move_id: 'pie',
  image_url: null,
  ts: Date.now() - 4 * 60 * 1000,
  sender_id: 'demo1',
  sender_name: 'Algram',
  sender_avatar: '',
};

const DEMO_WALL: IncomingTag[] = [
  {
    id: 'd1',
    target_id: 'me',
    target_name: 'YOU',
    target_avatar: '',
    move_id: 'pie',
    image_url: null,
    ts: Date.now() - 4 * 60 * 1000,
    sender_id: 'demo1',
    sender_name: 'Algram',
    sender_avatar: '',
  },
  {
    id: 'd2',
    target_id: 'demo5',
    target_name: 'Isaya',
    target_avatar: '',
    move_id: 'slime',
    image_url: null,
    ts: Date.now() - 18 * 60 * 1000,
    sender_id: 'demo2',
    sender_name: 'Jenny',
    sender_avatar: '',
  },
  {
    id: 'd3',
    target_id: 'demo3',
    target_name: 'JM·F',
    target_avatar: '',
    move_id: 'banana',
    image_url: null,
    ts: Date.now() - 42 * 60 * 1000,
    sender_id: 'demo4',
    sender_name: 'ghostpixel',
    sender_avatar: '',
  },
  {
    id: 'd4',
    target_id: 'demo2',
    target_name: 'Jenny',
    target_avatar: '',
    move_id: 'confetti',
    image_url: null,
    ts: Date.now() - 60 * 60 * 1000,
    sender_id: 'demo6',
    sender_name: 'Isabel',
    sender_avatar: '',
  },
];

export default function TagYoureIt() {
  return (
    <LocaleProvider>
      <TagYoureItInner />
    </LocaleProvider>
  );
}

function TagYoureItInner() {
  // First-touch audio unlock — captured at document root.
  const audioReady = useRef(false);
  useEffect(() => {
    if (audioReady.current) return;
    const onFirst = () => {
      if (audioReady.current) return;
      unlockAudio();
      audioReady.current = true;
      document.removeEventListener('pointerdown', onFirst, true);
    };
    document.addEventListener('pointerdown', onFirst, true);
    return () => document.removeEventListener('pointerdown', onFirst, true);
  }, []);

  const demoMode = useMemo(readDemoMode, []);
  const { contacts, loading: contactsLoading, isDemo } = useAigramContacts();
  const tagState = useTagState(contacts);
  const { generate, loading: generating, lastUrl, error: genError } = useGenImage();
  const { trigger, canEmit } = useGameEvent();

  const [screen, setScreen] = useState<Screen>('lobby');
  const [targetId, setTargetId] = useState<string | null>(null);
  // Synthetic contact for tag-back when the sender isn't in our
  // contact list. Lets the move screen render without forcing the
  // sender into the contacts array. Cleared on goToLobby.
  const [syntheticTarget, setSyntheticTarget] = useState<AigramContact | null>(null);
  const [moveId, setMoveId] = useState<MoveId | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [genErrored, setGenErrored] = useState(false);
  const [notified, setNotified] = useState(false);
  const [pendingTag, setPendingTag] = useState<OutgoingTag | null>(null);

  // Mirror gen-image result into local state
  useEffect(() => {
    if (lastUrl) setImageUrl(lastUrl);
  }, [lastUrl]);
  useEffect(() => {
    if (genError) setGenErrored(true);
  }, [genError]);

  // Demo override — applies state for screenshot URLs
  const isDemoView = !!demoMode;
  const target =
    contacts.find((c) => c.telegram_id === targetId) ||
    (syntheticTarget && syntheticTarget.telegram_id === targetId ? syntheticTarget : null);
  const move = getMoveSpec(moveId);

  // ── Flow controls ────────────────────────────────────────────────────
  const goToLobby = useCallback(() => {
    setScreen('lobby');
    setTargetId(null);
    setSyntheticTarget(null);
    setMoveId(null);
    setImageUrl(null);
    setGenErrored(false);
    setNotified(false);
    setPendingTag(null);
  }, []);

  const goToPicker = useCallback(() => {
    setScreen('picker');
  }, []);

  const goToMovePicker = useCallback(() => {
    setScreen('move');
  }, []);

  const goToWall = useCallback(() => {
    setScreen('wall');
    // Acknowledge any incoming tags when wall is opened
    tagState.acknowledgeIncoming();
  }, [tagState]);

  const startSlam = useCallback(() => {
    if (!target || !move) return;
    playClick();

    // Build the outgoing tag record now (image_url filled in once gen returns)
    const tag: OutgoingTag = {
      id: generateTagId(),
      target_id: target.telegram_id,
      target_name: target.name,
      target_avatar: target.head_url || '',
      move_id: move.id,
      image_url: null,
      ts: Date.now(),
    };
    setPendingTag(tag);
    setImageUrl(null);
    setGenErrored(false);
    setNotified(false);
    setScreen('slam');

    // Kick off AI image generation. Use target's avatar as ref when available
    // so the comic panel has a chance of resembling them.
    const opts = target.head_url
      ? { prompt: move.prompt, ref_url: target.head_url }
      : { prompt: move.prompt };
    generate(opts).catch(() => {
      // error is captured via the hook's error state; swallow here.
    });
  }, [target, move, generate]);

  // ── Fire notify + record outgoing once image is ready ────────────────
  useEffect(() => {
    if (!pendingTag || !target || !move) return;
    // wait until generation finishes (success or fail)
    if (generating) return;
    if (!imageUrl && !genErrored) return;

    const finalTag: OutgoingTag = { ...pendingTag, image_url: imageUrl || null };

    // Record once
    tagState.recordOutgoing(finalTag);

    // Fire platform notify event (only when in real Aigram with a real target)
    if (canEmit && target.telegram_id && !target.telegram_id.startsWith('demo')) {
      const config = {
        actions: [
          {
            type: 'notify',
            target_user_id: target.telegram_id,
            image: imageUrl
              ? { url: imageUrl }
              : { prompt: move.prompt, ref_url: target.head_url || undefined },
            message: {
              template: move.msg,
              variables: ['sender_name'],
              locale: 'en',
            },
          },
        ],
      };
      trigger('tag_sent', config);
      setNotified(true);
    }
    // Clear pending so we don't double-fire
    setPendingTag(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendingTag, generating, imageUrl, genErrored]);

  const onSlamDone = useCallback(() => {
    setScreen('reveal');
  }, []);

  // ── Share to Aigram feed ─────────────────────────────────────────────
  const onShareToFeed = useCallback(async () => {
    if (!imageUrl) return;
    try {
      await callAigramAPI<AigramResponse<unknown>>(
        '/note/telegram/note/add',
        'POST',
        {
          photo_url: imageUrl,
          type: 7,
          telegram_id_list: [telegramId].filter(Boolean),
          style: 'No Style',
        },
      );
    } catch {
      // swallow — UI just goes back to lobby
    } finally {
      goToLobby();
    }
  }, [imageUrl, goToLobby]);

  // ── Tag-back shortcut from wall ──────────────────────────────────────
  const onTagBack = useCallback(
    (incoming: IncomingTag) => {
      const existing = contacts.find((c) => c.telegram_id === incoming.sender_id);
      if (existing) {
        setTargetId(existing.telegram_id);
        setSyntheticTarget(null);
      } else {
        // Sender isn't in contacts (Aigram contact list returned ≠ tag senders).
        // Build a synthetic contact from the tag's sender metadata so the move
        // screen can render — otherwise `target` resolves to null and the
        // screen-gate `screen === 'move' && target` would short-circuit to a
        // blank page.
        setTargetId(incoming.sender_id);
        setSyntheticTarget({
          telegram_id: incoming.sender_id,
          name: incoming.sender_name,
          head_url: incoming.sender_avatar,
        });
      }
      setScreen('move');
    },
    [contacts],
  );

  // ── Render ───────────────────────────────────────────────────────────
  if (isDemoView) {
    return <DemoView mode={demoMode!} />;
  }

  const isDemoMode = isDemo || !isInAigram;
  const myId = telegramId || null;

  return (
    <div className="tyi-root">
      <div className="tyi-stage">
        {screen === 'lobby' && (
          <Lobby
            isIt={tagState.isIt}
            newestIncoming={tagState.newestIncoming}
            incomingCount={tagState.unreadIncomingCount}
            contactsCount={contacts.length}
            contacts={contacts}
            wallCount={tagState.wall.length}
            onTagSomeone={goToPicker}
            onOpenWall={goToWall}
          />
        )}

        {screen === 'picker' && (
          <ContactPicker
            contacts={contacts}
            loading={contactsLoading}
            isDemo={isDemoMode}
            selectedId={targetId}
            isIt={tagState.isIt}
            onSelect={setTargetId}
            onNext={goToMovePicker}
            onBack={goToLobby}
          />
        )}

        {screen === 'move' && target && (
          <MovePicker
            target={target}
            selectedMove={moveId}
            onSelectMove={setMoveId}
            onConfirm={startSlam}
            onBack={() => setScreen('picker')}
          />
        )}

        {screen === 'slam' && target && moveId && (
          <Slam
            target={target}
            moveId={moveId}
            generating={generating || (!imageUrl && !genErrored)}
            imageUrl={imageUrl}
            errored={genErrored}
            onDone={onSlamDone}
          />
        )}

        {screen === 'reveal' && target && moveId && (
          <Reveal
            target={target}
            moveId={moveId}
            imageUrl={imageUrl}
            errored={genErrored}
            notified={notified}
            isDemo={isDemoMode}
            onShare={onShareToFeed}
            onLobby={goToLobby}
          />
        )}

        {screen === 'wall' && (
          <Wall
            wall={tagState.wall}
            myId={myId}
            onTagBack={onTagBack}
            onBack={goToLobby}
          />
        )}
      </div>
    </div>
  );
}

// ─── Demo wrapper — forces specific screen states for posters/screenshots ───

// These names are placeholder users for poster/screenshot purposes only —
// they never appear in production (real player contacts come from Aigram).
const DEMO_CONTACTS_FOR_SHOWCASE: AigramContact[] = [
  { telegram_id: 'demo1', name: 'Algram', head_url: '' },
  { telegram_id: 'demo2', name: 'Jenny', head_url: '' },
  { telegram_id: 'demo3', name: 'JM·F', head_url: '' },
  { telegram_id: 'demo4', name: 'ghostpixel', head_url: '' },
  { telegram_id: 'demo5', name: 'Isaya', head_url: '' },
  { telegram_id: 'demo6', name: 'Isabel', head_url: '' },
];

function DemoView({ mode }: { mode: DemoMode }) {
  const contacts = DEMO_CONTACTS_FOR_SHOWCASE;
  const demoTarget: AigramContact = contacts[0];
  const demoMove: MoveId = 'pie';

  return (
    <div className="tyi-root">
      <div className="tyi-stage">
        {mode === 'lobby' && (
          <Lobby
            isIt={false}
            newestIncoming={null}
            incomingCount={0}
            contactsCount={contacts.length}
            contacts={contacts}
            wallCount={4}
            onTagSomeone={() => {}}
            onOpenWall={() => {}}
          />
        )}
        {mode === 'lobby-it' && (
          <Lobby
            isIt={true}
            newestIncoming={DEMO_INCOMING}
            incomingCount={2}
            contactsCount={contacts.length}
            contacts={contacts}
            wallCount={4}
            onTagSomeone={() => {}}
            onOpenWall={() => {}}
          />
        )}
        {mode === 'picker' && (
          <ContactPicker
            contacts={contacts}
            loading={false}
            isDemo={true}
            selectedId={contacts[1]?.telegram_id || null}
            isIt={false}
            onSelect={() => {}}
            onNext={() => {}}
            onBack={() => {}}
          />
        )}
        {mode === 'move' && (
          <MovePicker
            target={demoTarget}
            selectedMove="pizza"
            onSelectMove={() => {}}
            onConfirm={() => {}}
            onBack={() => {}}
          />
        )}
        {mode === 'slam' && (
          <Slam
            target={demoTarget}
            moveId={demoMove}
            generating={true}
            imageUrl={null}
            errored={false}
            onDone={() => {}}
          />
        )}
        {mode === 'reveal' && (
          <Reveal
            target={demoTarget}
            moveId={demoMove}
            imageUrl={DEMO_PIE_IMG}
            errored={false}
            notified={true}
            isDemo={false}
            onShare={() => {}}
            onLobby={() => {}}
          />
        )}
        {mode === 'wall' && (
          <Wall
            wall={DEMO_WALL}
            myId="me"
            onTagBack={() => {}}
            onBack={() => {}}
          />
        )}
        {mode === 'poster' && <Poster />}
      </div>
    </div>
  );
}

// Silence unused-import warnings for MOVES (used elsewhere indirectly)
void MOVES;
