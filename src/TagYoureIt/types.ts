// Tag, You're It — type definitions

export type MoveId =
  | 'pie'
  | 'slime'
  | 'confetti'
  | 'sticker'
  | 'pizza'
  | 'banana'
  | 'anvil'
  | 'glove'
  | 'paint'
  | 'water'
  | 'horn'
  | 'glitter';

export type Screen =
  | 'lobby'
  | 'picker'
  | 'move'
  | 'slam'
  | 'reveal'
  | 'wall';

export interface AigramContact {
  telegram_id: string;
  name: string;
  head_url: string;
}

export interface OutgoingTag {
  /** uuid for this individual tag */
  id: string;
  /** target user we tagged */
  target_id: string;
  target_name: string;
  target_avatar: string;
  /** weapon used */
  move_id: MoveId;
  /** AI-generated image URL (may be null if gen failed) */
  image_url: string | null;
  /** unix ms */
  ts: number;
}

export interface TagSave {
  /** Tags I've sent — last 12 kept (front of array = newest) */
  outgoing: OutgoingTag[];
  /** ID of the last incoming tag I've "seen" (used to compute unread / IT) */
  acknowledged_incoming_ts: number;
  /** Unix ms of my last open of the app (used to detect new incoming) */
  last_open_ts: number;
}

/** Save row from a single user (raw from save/data/list) */
export interface AllUserSave {
  user_id: string;
  user_name?: string;
  head_url?: string;
  time: string;
  resource_data: string;
}

/** Inbound tag = someone else's outgoing tag that targeted me */
export interface IncomingTag extends OutgoingTag {
  /** Who sent this tag */
  sender_id: string;
  sender_name: string;
  sender_avatar: string;
}
