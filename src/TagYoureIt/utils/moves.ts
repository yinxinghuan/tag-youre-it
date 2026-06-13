import type { MoveId } from '../types';

export interface MoveSpec {
  id: MoveId;
  /** Code shown in UI (01-06) */
  num: string;
  /** Verb shouted on slam ("PIE!", "SLIME!") */
  shout: string;
  /** One-line description */
  desc: string;
  /** Notification body template — {sender_name} is replaced platform-side */
  msg: string;
  /** Background color used on this move's chip */
  color:
    | 'red'
    | 'green'
    | 'pink'
    | 'yellow'
    | 'blue'
    | 'cream'
    | 'steel'
    | 'punch'
    | 'purple';
  /** AI image prompt — always English */
  prompt: string;
}

export const MOVES: MoveSpec[] = [
  {
    id: 'pie',
    num: '01',
    shout: 'PIE!',
    desc: 'Cream pie to the face',
    msg: '{sender_name} just slapped a cream pie in your face. YOU\'RE IT!',
    color: 'cream',
    prompt:
      'a person taking a giant whipped cream pie directly to the face, cream splattering everywhere, comic book pop art illustration, halftone dots, bold black outlines, Lichtenstein style',
  },
  {
    id: 'slime',
    num: '02',
    shout: 'SLIME!',
    desc: 'Bucket of green slime',
    msg: '{sender_name} just dumped a bucket of green slime over your head. YOU\'RE IT!',
    color: 'green',
    prompt:
      'a person with a bucket of bright green slime being dumped over their head, slime dripping down, Nickelodeon game show, comic book pop art, halftone, bold black outlines',
  },
  {
    id: 'confetti',
    num: '03',
    shout: 'BLAM!',
    desc: 'Confetti cannon explosion',
    msg: '{sender_name} just point-blank confetti-cannoned you. YOU\'RE IT!',
    color: 'pink',
    prompt:
      'a person hit point-blank by a giant confetti cannon, rainbow confetti exploding everywhere, party chaos, comic book pop art, halftone dots, bold black outlines',
  },
  {
    id: 'sticker',
    num: '04',
    shout: 'SLAP!',
    desc: 'Giant "IT!" sticker',
    msg: '{sender_name} slapped a giant IT! sticker on your forehead. YOU\'RE IT!',
    color: 'yellow',
    prompt:
      'a person with a giant yellow circular sticker reading "IT!" slapped flat on their forehead, surprised expression, comic book pop art, halftone, bold black outlines',
  },
  {
    id: 'pizza',
    num: '05',
    shout: 'SPLAT!',
    desc: 'Pizza splat',
    msg: '{sender_name} just splatted a hot pizza in your face. YOU\'RE IT!',
    color: 'red',
    prompt:
      'a person taking an entire hot pepperoni pizza to the face, cheese and toppings splattering, comic book pop art, halftone dots, bold black outlines, dramatic',
  },
  {
    id: 'banana',
    num: '06',
    shout: 'WHOOPS!',
    desc: 'Banana peel slip',
    msg: '{sender_name} just made you slip on a banana peel mid-stride. YOU\'RE IT!',
    color: 'blue',
    prompt:
      'a person slipping on a banana peel, mid-air pratfall, legs up, comic book pop art, halftone dots, bold black outlines, classic slapstick',
  },
  {
    id: 'anvil',
    num: '07',
    shout: 'CLANG!',
    desc: 'Acme anvil drop',
    msg: '{sender_name} just dropped an Acme anvil on your head. YOU\'RE IT!',
    color: 'steel',
    prompt:
      'an Acme cast iron anvil falling onto a person\'s head from above, dazed expression, stars and birds circling around the head, comic book pop art, halftone dots, bold black outlines, Lichtenstein style',
  },
  {
    id: 'glove',
    num: '08',
    shout: 'BOP!',
    desc: 'Spring-loaded boxing glove',
    msg: '{sender_name} just sprung a boxing glove out of nowhere and BOP\'d you. YOU\'RE IT!',
    color: 'punch',
    prompt:
      'a giant red boxing glove on a coiled spring punching a person square in the face, cheeks puffing outward, comic book pop art, halftone dots, bold black outlines, Lichtenstein style',
  },
  {
    id: 'paint',
    num: '09',
    shout: 'SPLOOT!',
    desc: 'Paint can dump',
    msg: '{sender_name} just upturned a giant paint can over your head. YOU\'RE IT!',
    color: 'purple',
    prompt:
      'a person under an overturned paint can with thick rainbow paint pouring down their head and shoulders, drips everywhere, comic book pop art, halftone dots, bold black outlines, Lichtenstein style',
  },
  {
    id: 'water',
    num: '10',
    shout: 'SPLOOSH!',
    desc: 'Water balloon burst',
    msg: '{sender_name} just lobbed a giant water balloon at you. SPLOOSH! YOU\'RE IT!',
    color: 'blue',
    prompt:
      'a person getting drenched by a giant water balloon bursting on their chest, water spraying outward in cartoon arcs, surprised expression, comic book pop art, halftone dots, bold black outlines, Lichtenstein style',
  },
  {
    id: 'horn',
    num: '11',
    shout: 'HONK!',
    desc: 'Giant air horn point-blank',
    msg: '{sender_name} just HONK\'d a giant air horn point-blank at your face. YOU\'RE IT!',
    color: 'yellow',
    prompt:
      'a person with their hair blown straight back by a giant cartoon air horn aimed at their face point-blank, concentric sound wave rings visible, eyes wide, comic book pop art, halftone dots, bold black outlines, Lichtenstein style',
  },
  {
    id: 'glitter',
    num: '12',
    shout: 'SPARKLE!',
    desc: 'Glitter bomb explosion',
    msg: '{sender_name} just set off a glitter bomb in your face. YOU\'RE IT (and shiny)!',
    color: 'pink',
    prompt:
      'a person covered head-to-toe in rainbow glitter from a glitter bomb explosion, sparkles flying outward, joyful chaos, comic book pop art, halftone dots, bold black outlines, Lichtenstein style',
  },
];

export function getMoveSpec(id: MoveId | string | null): MoveSpec | null {
  if (!id) return null;
  return MOVES.find((m) => m.id === id) ?? null;
}
