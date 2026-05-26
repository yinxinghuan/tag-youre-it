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

export function useTagState(): UseTagState {
  const [save, setSave] = useState<TagSave>(() => loadLocal());
  const [allSaves, setAllSaves] = useState<AllSaveRow[]>([]);
  const [loaded, setLoaded] = useState(false);
  const sessionId = getGameUuid();
  const canSync = isInAigram && !!sessionId && !!telegramId;
  const cloudTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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

  // Derived: scan all-user saves for tags whose target_id == me
  const incoming: IncomingTag[] = [];
  const wall: IncomingTag[] = [];
  for (const row of allSaves) {
    const parsed = parseSave(row);
    if (!parsed?.outgoing) continue;
    const senderId = String(row.user_id);
    const senderName = row.user_name || senderId;
    const senderAvatar = row.head_url || '';
    for (const t of parsed.outgoing) {
      const item: IncomingTag = {
        ...t,
        sender_id: senderId,
        sender_name: senderName,
        sender_avatar: senderAvatar,
      };
      wall.push(item);
      if (telegramId && t.target_id === telegramId && senderId !== telegramId) {
        incoming.push(item);
      }
    }
  }
  incoming.sort((a, b) => b.ts - a.ts);
  wall.sort((a, b) => b.ts - a.ts);

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
