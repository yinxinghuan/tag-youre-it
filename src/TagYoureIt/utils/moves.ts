import type { MoveId } from '../types';

export interface MoveSpec {
  id: MoveId;
  /** Code shown in UI (01-06) */
  num: string;
  /** Verb shouted on slam ("PIE!", "SLIME!") */
  shout: string;
  /** One-line description */
  desc: string;
  /** Notification body template ({sender} replaced server-side?) */
  msg: string;
  /** Background color used on this move's chip */
  color: 'red' | 'green' | 'pink' | 'yellow' | 'blue' | 'cream';
  /** AI image prompt — always English */
  prompt: string;
}

export const MOVES: MoveSpec[] = [
  {
    id: 'pie',
    num: '01',
    shout: 'PIE!',
    desc: 'Cream pie to the face',
    msg: '{sender} just slapped a cream pie in your face. YOU\'RE IT!',
    color: 'cream',
    prompt:
      'a person taking a giant whipped cream pie directly to the face, cream splattering everywhere, comic book pop art illustration, halftone dots, bold black outlines, Lichtenstein style',
  },
  {
    id: 'slime',
    num: '02',
    shout: 'SLIME!',
    desc: 'Bucket of green slime',
    msg: '{sender} just dumped a bucket of green slime over your head. YOU\'RE IT!',
    color: 'green',
    prompt:
      'a person with a bucket of bright green slime being dumped over their head, slime dripping down, Nickelodeon game show, comic book pop art, halftone, bold black outlines',
  },
  {
    id: 'confetti',
    num: '03',
    shout: 'BLAM!',
    desc: 'Confetti cannon explosion',
    msg: '{sender} just point-blank confetti-cannoned you. YOU\'RE IT!',
    color: 'pink',
    prompt:
      'a person hit point-blank by a giant confetti cannon, rainbow confetti exploding everywhere, party chaos, comic book pop art, halftone dots, bold black outlines',
  },
  {
    id: 'sticker',
    num: '04',
    shout: 'SLAP!',
    desc: 'Giant "IT!" sticker',
    msg: '{sender} slapped a giant IT! sticker on your forehead. YOU\'RE IT!',
    color: 'yellow',
    prompt:
      'a person with a giant yellow circular sticker reading "IT!" slapped flat on their forehead, surprised expression, comic book pop art, halftone, bold black outlines',
  },
  {
    id: 'pizza',
    num: '05',
    shout: 'SPLAT!',
    desc: 'Pizza splat',
    msg: '{sender} just splatted a hot pizza in your face. YOU\'RE IT!',
    color: 'red',
    prompt:
      'a person taking an entire hot pepperoni pizza to the face, cheese and toppings splattering, comic book pop art, halftone dots, bold black outlines, dramatic',
  },
  {
    id: 'banana',
    num: '06',
    shout: 'WHOOPS!',
    desc: 'Banana peel slip',
    msg: '{sender} just made you slip on a banana peel mid-stride. YOU\'RE IT!',
    color: 'blue',
    prompt:
      'a person slipping on a banana peel, mid-air pratfall, legs up, comic book pop art, halftone dots, bold black outlines, classic slapstick',
  },
];

export function getMoveSpec(id: MoveId | string | null): MoveSpec | null {
  if (!id) return null;
  return MOVES.find((m) => m.id === id) ?? null;
}
