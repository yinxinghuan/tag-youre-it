// Master state hook for Tag, You're It.
//
// Tracks:
//   - my outgoing tags (saved to platform via save/data + localStorage mirror)
//   - my incoming tags (scanned from get/data/list across the 6 most active users)
//   - whether I'm currently "IT" (have unacknowledged incoming tags newer than
//     my own most recent outgoing tag — the "you got tagged, tag back to escape"
//     loop)
//
// Why scan all 6 saves instead of using an inbox: the platform's save list
// returns the latest save from the 6 most-active users. If anyone tags me,
// their save will contain my id in `outgoing[].target_id`. This naturally
// scopes "active threats" to the recent active player ring without needing
// a server-side inbox table. Limited but viable for v1 viral loop.

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  callAigramAPI,
  postAigramAPI,
  isInAigram,
  telegramId,
  type AigramResponse,
} from '@shared/runtime';
import { getGameUuid } from '@shared/runtime';
import type {
  AigramContact,
  AllUserSave,
  IncomingTag,
  OutgoingTag,
  TagSave,
} from '../types';

const LS_KEY = 'tag-youre-it-save';

const DEFAULT_SAVE: TagSave = {
  outgoing: [],
  acknowledged_incoming_ts: 0,
  last_open_ts: 0,
};

function loadLocal(): TagSave {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return { ...DEFAULT_SAVE };
    const parsed = JSON.parse(raw) as TagSave;
    return {
      outgoing: Array.isArray(parsed.outgoing) ? parsed.outgoing : [],
      acknowledged_incoming_ts: parsed.acknowledged_incoming_ts || 0,
      last_open_ts: parsed.last_open_ts || 0,
    };
  } catch {
    return { ...DEFAULT_SAVE };
  }
}

function writeLocal(s: TagSave) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(s));
  } catch {
    // quota / private mode
  }
}

export interface UseTagState {
  /** My save (always defined; defaults if cloud/local empty) */
  save: TagSave;
  /** Tags directed at ME from other recent users */
  incoming: IncomingTag[];
  /** Newest unread incoming tag (drives "YOU'RE IT" lobby state) */
  newestIncoming: IncomingTag | null;
  /** Am I "IT"? (have unacknowledged incoming tag) */
  isIt: boolean;
  /** Last 12 community tags from the wall (everyone, including me) */
  wall: IncomingTag[];
  /** True once initial probe completed */
  loaded: boolean;
  /** Record a new outgoing tag (saves both locally and to cloud). */
  recordOutgoing: (tag: OutgoingTag) => void;
  /** Mark all incoming tags as seen (clears IT state). */
  acknowledgeIncoming: () => void;
  /** Re-pull all-user saves (the wall + incoming) from cloud. */
  refresh: () => Promise<void>;
}

interface AllSaveRow extends AllUserSave {
  // Same shape, alias for clarity
}

async function fetchAllSaves(sessionId: string): Promise<AllSaveRow[]> {
  try {
    const res = await callAigramAPI<AigramResponse<AllSaveRow[]>>(
      `/note/aigram/ai/game/get/data/list?session_id=${encodeURIComponent(sessionId)}`,
      'GET',
    );
    return Array.isArray(res?.data) ? res.data : [];
  } catch {
    return [];
  }
}

function parseSave(row: AllSaveRow): TagSave | null {
  if (!row.resource_data) return null;
  try {
    return JSON.parse(row.resource_data) as TagSave;
  } catch {
    return null;
  }
}

interface ResolvedUser {
  name: string;
  head_url: string;
}

interface UserCache {
  [id: string]: ResolvedUser;
}

/**
 * Tag, You're It master state.
 *
 * `contacts` is passed in so we can resolve sender_id → {name, head_url} from
 * the player's contact list. The platform's get/data/list response includes
 * `user_name` / `head_url` only sometimes — when absent we'd otherwise display
 * the raw telegram_id as the sender name (visible bug + breaks tag-back since
 * the synthetic contact built by the parent inherits that bad name).
 *
 * Resolution order, per sender_id:
 *   1. row.user_name / row.head_url if present on the save row
 *   2. contacts entry with matching telegram_id
 *   3. one-shot fetch of /note/telegram/user/get/info/by/telegram_id (cached)
 *   4. fall back to id as last-resort label
 */
export function useTagState(contacts: AigramContact[] = []): UseTagState {
  const [save, setSave] = useState<TagSave>(() => loadLocal());
  const [allSaves, setAllSaves] = useState<AllSaveRow[]>([]);
  const [userCache, setUserCache] = useState<UserCache>({});
  const [loaded, setLoaded] = useState(false);
  const sessionId = getGameUuid();
  const canSync = isInAigram && !!sessionId && !!telegramId;
  const cloudTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inflightRef = useRef<Set<string>>(new Set());

  // Initial fetch: cloud my-save + all-users-saves
  const refresh = useCallback(async () => {
    if (!canSync || !sessionId) {
      setLoaded(true);
      return;
    }
    const rows = await fetchAllSaves(sessionId);
    setAllSaves(rows);
    const mine = rows.find((r) => String(r.user_id) === telegramId);
    if (mine) {
      const parsed = parseSave(mine);
      if (parsed) {
        // Merge cloud + local outgoing (dedup by id, keep newer ts)
        setSave((prev) => mergeSaves(prev, parsed));
      }
    }
    setLoaded(true);
  }, [canSync, sessionId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  // Persist debounced
  const persist = useCallback(
    (next: TagSave) => {
      writeLocal(next);
      if (!canSync || !sessionId) return;
      if (cloudTimerRef.current) clearTimeout(cloudTimerRef.current);
      cloudTimerRef.current = setTimeout(() => {
        postAigramAPI('/note/aigram/ai/game/save/data', {
          session_id: sessionId,
          resource_data: JSON.stringify(next),
        });
      }, 600);
    },
    [canSync, sessionId],
  );

  // Flush on unmount
  useEffect(() => {
    return () => {
      if (cloudTimerRef.current) clearTimeout(cloudTimerRef.current);
    };
  }, []);

  const recordOutgoing = useCallback(
    (tag: OutgoingTag) => {
      setSave((prev) => {
        const next: TagSave = {
          ...prev,
          outgoing: [tag, ...prev.outgoing.filter((t) => t.id !== tag.id)].slice(0, 12),
          // Sending a tag also clears IT — you've passed it on
          acknowledged_incoming_ts: Date.now(),
        };
        persist(next);
        return next;
      });
    },
    [persist],
  );

  const acknowledgeIncoming = useCallback(() => {
    setSave((prev) => {
      const next: TagSave = {
        ...prev,
        acknowledged_incoming_ts: Date.now(),
      };
      persist(next);
      return next;
    });
  }, [persist]);

  // Build a contact-id → contact lookup for O(1) resolution.
  const contactById = new Map<string, AigramContact>();
  for (const c of contacts) {
    contactById.set(String(c.telegram_id), c);
  }

  function resolveUser(id: string, rowName?: string, rowAvatar?: string): ResolvedUser {
    // 1. Trust the row's own user_name/head_url when present + non-blank
    if (rowName && rowName !== id) {
      return { name: rowName, head_url: rowAvatar || '' };
    }
    // 2. Look up the player's own contacts (covers the common "tagged by a friend" case)
    const c = contactById.get(id);
    if (c) return { name: c.name, head_url: c.head_url };
    // 3. Lazy-fetched cache (populated by the effect below)
    const cached = userCache[id];
    if (cached) return cached;
    // 4. Last resort — show id as a placeholder so the UI doesn't crash. The
    //    fetch effect will populate the cache and trigger a re-render shortly.
    return { name: rowName || id, head_url: rowAvatar || '' };
  }

  // Derived: scan all-user saves for tags whose target_id == me
  const incoming: IncomingTag[] = [];
  const wall: IncomingTag[] = [];
  for (const row of allSaves) {
    const parsed = parseSave(row);
    if (!parsed?.outgoing) continue;
    const senderId = String(row.user_id);
    const resolved = resolveUser(senderId, row.user_name, row.head_url);
    for (const t of parsed.outgoing) {
      const item: IncomingTag = {
        ...t,
        sender_id: senderId,
        sender_name: resolved.name,
        sender_avatar: resolved.head_url,
      };
      wall.push(item);
      if (telegramId && t.target_id === telegramId && senderId !== telegramId) {
        incoming.push(item);
      }
    }
  }
  incoming.sort((a, b) => b.ts - a.ts);
  wall.sort((a, b) => b.ts - a.ts);

  // Side effect: for any sender_id that resolveUser can't satisfy from row
  // metadata + contacts + cache, fetch user info once and cache it. Triggers
  // a re-render once cache updates so the UI swaps id → real name/avatar.
  useEffect(() => {
    if (!isInAigram) return;
    const need = new Set<string>();
    for (const row of allSaves) {
      const id = String(row.user_id);
      if (id === telegramId) continue;
      // Skip ids we've already resolved
      if (row.user_name && row.user_name !== id) continue;
      if (contactById.has(id)) continue;
      if (userCache[id]) continue;
      if (inflightRef.current.has(id)) continue;
      need.add(id);
    }
    if (need.size === 0) return;
    for (const id of need) {
      inflightRef.current.add(id);
      callAigramAPI<AigramResponse<{ name: string; head_url: string }>>(
        `/note/telegram/user/get/info/by/telegram_id?telegram_id=${encodeURIComponent(id)}`,
        'GET',
      )
        .then((res) => {
          const data = res?.data;
          if (data && (data.name || data.head_url)) {
            setUserCache((prev) =>
              prev[id]
                ? prev
                : { ...prev, [id]: { name: data.name || id, head_url: data.head_url || '' } },
            );
          }
        })
        .catch(() => {
          /* silent — leave as id fallback */
        })
        .finally(() => {
          inflightRef.current.delete(id);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allSaves, contacts]);

  const newestIncoming = incoming[0] || null;
  const isIt = !!newestIncoming && newestIncoming.ts > save.acknowledged_incoming_ts;

  return {
    save,
    incoming,
    newestIncoming,
    isIt,
    wall: wall.slice(0, 24),
    loaded,
    recordOutgoing,
    acknowledgeIncoming,
    refresh,
  };
}

function mergeSaves(local: TagSave, cloud: TagSave): TagSave {
  const byId = new Map<string, OutgoingTag>();
  for (const t of cloud.outgoing || []) byId.set(t.id, t);
  for (const t of local.outgoing || []) {
    const existing = byId.get(t.id);
    if (!existing || t.ts > existing.ts) byId.set(t.id, t);
  }
  const outgoing = Array.from(byId.values())
    .sort((a, b) => b.ts - a.ts)
    .slice(0, 12);
  return {
    outgoing,
    acknowledged_incoming_ts: Math.max(
      local.acknowledged_incoming_ts || 0,
      cloud.acknowledged_incoming_ts || 0,
    ),
    last_open_ts: Math.max(local.last_open_ts || 0, cloud.last_open_ts || 0),
  };
}
