// Lightweight i18n — 5 locales, navigator.language auto-detect,
// localStorage override.
//
// Rule (mirrors Wake-Up Service split):
//  - Decorative all-caps shouts in burst SVGs (TAG / YOU'RE IT! / POW! /
//    BAM! / SPLAT! / PIE! / TAGGED!) stay English-only because their
//    custom hand-drawn fonts (Knewave, Bangers, Permanent Marker) only
//    cover Latin glyphs.
//  - All readable prose (CTAs, descriptions, status, time, captions)
//    goes through t() and renders in Inter so CJK + Cyrillic + accented
//    Latin all work.

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

export type Locale = 'en' | 'zh' | 'ja' | 'ko' | 'es';
export const LOCALES: Locale[] = ['en', 'zh', 'ja', 'ko', 'es'];
const LS_KEY = 'tag-youre-it_locale';

function detectLocale(): Locale {
  try {
    const override = localStorage.getItem(LS_KEY) as Locale | null;
    if (override && LOCALES.includes(override)) return override;
  } catch {
    /* ignore */
  }
  const lang =
    (typeof navigator !== 'undefined' ? navigator.language : 'en').toLowerCase();
  if (lang.startsWith('zh')) return 'zh';
  if (lang.startsWith('ja')) return 'ja';
  if (lang.startsWith('ko')) return 'ko';
  if (lang.startsWith('es')) return 'es';
  return 'en';
}

type Dict = Record<string, string>;

// ─── English (master) ───────────────────────────────────────────────────────
const EN: Dict = {
  // Lobby
  'lobby.brand': 'No. 14 · AlterU',
  'lobby.wall_count': 'Wall · {n}',
  'lobby.status': 'Status',
  'lobby.free_big': "You're free.",
  'lobby.free_sub': '…for now.',
  'lobby.tagged_by': 'tagged by',
  'lobby.move_ago': '{shout} · {time} ago',
  'lobby.more_incoming': '+ {n} more incoming tag',
  'lobby.more_incoming_plural': '+ {n} more incoming tags',
  'lobby.friends_unsuspecting': '{n} friend unsuspecting…',
  'lobby.friends_unsuspecting_plural': '{n} friends unsuspecting…',
  'lobby.no_friends': 'Open in Aigram to load your friends',
  'lobby.inbox': '{n} incoming tag on the wall',
  'lobby.inbox_plural': '{n} incoming tags on the wall',
  'lobby.cta_tag': 'Tag someone',
  'lobby.cta_tag_back': 'Tag back now',
  'lobby.cta_back': 'Back',

  // Picker
  'picker.title_bar': 'Pick · your · mark',
  'picker.h2_tag': 'Who gets tagged?',
  'picker.h2_tag_back': 'Who gets tagged back?',
  'picker.preview_hint': 'Preview mode — open in Aigram for real friends',
  'picker.loading': 'Loading friends…',
  'picker.empty': 'No friends found on Aigram yet. Invite some first.',
  'picker.picked_badge': 'Picked',
  'picker.cta_empty': 'Pick a friend',
  'picker.cta_next': '→ Tag {name}',

  // Move picker
  'move.title_bar': 'Armory',
  'move.target_cue': 'Target acquired:',
  'move.h2': 'Pick your weapon',
  'move.loaded_badge': 'Loaded',
  'move.cta_empty': 'Pick a weapon',
  'move.cta_next': 'Slam {shout}',

  // Weapon descriptions
  'weapon.pie.desc': 'Cream pie to the face',
  'weapon.slime.desc': 'Bucket of green slime',
  'weapon.confetti.desc': 'Confetti cannon explosion',
  'weapon.sticker.desc': 'Giant "IT!" sticker',
  'weapon.pizza.desc': 'Pizza splat',
  'weapon.banana.desc': 'Banana peel slip',

  // Slam (cooking lines)
  'slam.cook.1': 'Inking the panel…',
  'slam.cook.2': 'Mixing halftone dots…',
  'slam.cook.3': 'Printing the punchline…',
  'slam.cook.4': 'Bringing in the letterer…',
  'slam.cook.5': 'Filling the burst…',
  'slam.ready': 'Ready!',

  // Reveal
  'reveal.tagged_badge': 'Tagged!',
  'reveal.evidence': 'Evidence',
  'reveal.caption_line': 'just got it.',
  'reveal.fallback_title': '{name} gets {shout}',
  'reveal.notice_sent': "Sent to {name}'s phone",
  'reveal.notice_demo': 'Demo mode · notification not sent',
  'reveal.notice_queuing': 'Queuing notification…',
  'reveal.cta_share': 'Post to feed',
  'reveal.cta_lobby': 'Back to lobby',

  // Wall
  'wall.title_bar': 'The wall',
  'wall.h2_recent': 'Recent',
  'wall.h2_tags': 'tags',
  'wall.sub': 'last {n} hit from the ring',
  'wall.sub_plural': 'last {n} hits from the ring',
  'wall.empty': 'No tags yet. Be the first one out there.',
  'wall.line': '{sender} tagged {target}',
  'wall.you_got_tagged': '↳ You got tagged',
  'wall.your_hit': '↳ Your hit',
  'wall.cta_tag_back': 'Tag {name} back',
  'wall.time_ago': '{t} ago',
};

// ─── Chinese ────────────────────────────────────────────────────────────────
const ZH: Dict = {
  'lobby.brand': '第 14 号 · AlterU',
  'lobby.wall_count': '墙 · {n}',
  'lobby.status': '状态',
  'lobby.free_big': '暂时安全。',
  'lobby.free_sub': '……目前。',
  'lobby.tagged_by': '被标记自',
  'lobby.move_ago': '{shout} · {time}前',
  'lobby.more_incoming': '+ 还有 {n} 个新的标签',
  'lobby.more_incoming_plural': '+ 还有 {n} 个新的标签',
  'lobby.friends_unsuspecting': '{n} 个好友毫无防备…',
  'lobby.friends_unsuspecting_plural': '{n} 个好友毫无防备…',
  'lobby.no_friends': '在 Aigram 里打开才能看到好友',
  'lobby.inbox': '墙上有 {n} 个待处理标签',
  'lobby.inbox_plural': '墙上有 {n} 个待处理标签',
  'lobby.cta_tag': '选一个人标记',
  'lobby.cta_tag_back': '立刻反击',
  'lobby.cta_back': '返回',

  'picker.title_bar': '选 · 你的 · 目标',
  'picker.h2_tag': '标记谁？',
  'picker.h2_tag_back': '反击谁？',
  'picker.preview_hint': '预览模式——在 Aigram 里打开看真实好友',
  'picker.loading': '加载好友中…',
  'picker.empty': 'Aigram 里还没添加好友，先去加几个吧。',
  'picker.picked_badge': '已选',
  'picker.cta_empty': '选一个好友',
  'picker.cta_next': '→ 标记 {name}',

  'move.title_bar': '武器库',
  'move.target_cue': '已锁定目标：',
  'move.h2': '选一件武器',
  'move.loaded_badge': '已上膛',
  'move.cta_empty': '选一件武器',
  'move.cta_next': '出手：{shout}',

  'weapon.pie.desc': '奶油派糊脸',
  'weapon.slime.desc': '绿史莱姆一桶',
  'weapon.confetti.desc': '彩纸炮近距离',
  'weapon.sticker.desc': '巨大的「IT!」贴纸',
  'weapon.pizza.desc': '披萨拍脸',
  'weapon.banana.desc': '香蕉皮一滑',

  'slam.cook.1': '正在勾线…',
  'slam.cook.2': '调配波点…',
  'slam.cook.3': '印刷笑点…',
  'slam.cook.4': '召唤字体师…',
  'slam.cook.5': '填充星爆…',
  'slam.ready': '出来了！',

  'reveal.tagged_badge': '已贴！',
  'reveal.evidence': '证据',
  'reveal.caption_line': '已被贴中。',
  'reveal.fallback_title': '{name} 中招 · {shout}',
  'reveal.notice_sent': '已推送到 {name} 的手机',
  'reveal.notice_demo': '演示模式 · 不会真的发送',
  'reveal.notice_queuing': '正在推送…',
  'reveal.cta_share': '发布到动态',
  'reveal.cta_lobby': '回到大厅',

  'wall.title_bar': '标记墙',
  'wall.h2_recent': '最近的',
  'wall.h2_tags': '标记',
  'wall.sub': '场上最近 {n} 次出手',
  'wall.sub_plural': '场上最近 {n} 次出手',
  'wall.empty': '还没有人出手，做第一个。',
  'wall.line': '{sender} 标记了 {target}',
  'wall.you_got_tagged': '↳ 你被标记了',
  'wall.your_hit': '↳ 你的出手',
  'wall.cta_tag_back': '反击 {name}',
  'wall.time_ago': '{t}前',
};

// ─── Japanese ───────────────────────────────────────────────────────────────
const JA: Dict = {
  'lobby.brand': 'No. 14 · AlterU',
  'lobby.wall_count': 'ウォール · {n}',
  'lobby.status': 'ステータス',
  'lobby.free_big': '今は安全。',
  'lobby.free_sub': '…今のところは。',
  'lobby.tagged_by': 'タグした人：',
  'lobby.move_ago': '{shout} · {time}前',
  'lobby.more_incoming': '+ あと {n} 件タグあり',
  'lobby.more_incoming_plural': '+ あと {n} 件タグあり',
  'lobby.friends_unsuspecting': '{n} 人の友達が無防備…',
  'lobby.friends_unsuspecting_plural': '{n} 人の友達が無防備…',
  'lobby.no_friends': 'Aigram で開くと友達が表示されます',
  'lobby.inbox': 'ウォールに {n} 件のタグが届いています',
  'lobby.inbox_plural': 'ウォールに {n} 件のタグが届いています',
  'lobby.cta_tag': '誰かをタグする',
  'lobby.cta_tag_back': 'タグし返す',
  'lobby.cta_back': '戻る',

  'picker.title_bar': '選 · 標的 · 選択',
  'picker.h2_tag': '誰にタグする？',
  'picker.h2_tag_back': '誰にタグし返す？',
  'picker.preview_hint': 'プレビュー · Aigram で開いて本物の友達を読み込む',
  'picker.loading': '友達を読み込み中…',
  'picker.empty': 'Aigram にまだ友達がいません。先に追加してね。',
  'picker.picked_badge': '選択中',
  'picker.cta_empty': '友達を選んでね',
  'picker.cta_next': '→ {name} にタグ',

  'move.title_bar': '武器庫',
  'move.target_cue': 'ターゲット：',
  'move.h2': '武器を選んでね',
  'move.loaded_badge': '装填済',
  'move.cta_empty': '武器を選んでね',
  'move.cta_next': '叩け：{shout}',

  'weapon.pie.desc': 'クリームパイを顔に',
  'weapon.slime.desc': '緑のスライムをバケツで',
  'weapon.confetti.desc': 'コンフェッティ大砲',
  'weapon.sticker.desc': '巨大「IT!」シール',
  'weapon.pizza.desc': 'ピザをベタッ',
  'weapon.banana.desc': 'バナナの皮ですべる',

  'slam.cook.1': 'インクを引いてる…',
  'slam.cook.2': 'ハーフトーンを調合中…',
  'slam.cook.3': 'オチを印刷中…',
  'slam.cook.4': 'レタラーを呼んでる…',
  'slam.cook.5': '星爆を塗りつぶし中…',
  'slam.ready': '完成！',

  'reveal.tagged_badge': 'タグ完了！',
  'reveal.evidence': '証拠',
  'reveal.caption_line': 'タグされました。',
  'reveal.fallback_title': '{name} に {shout}',
  'reveal.notice_sent': '{name} のスマホに送信済み',
  'reveal.notice_demo': 'デモモード · 通知は送られません',
  'reveal.notice_queuing': '通知を送信中…',
  'reveal.cta_share': 'フィードに投稿',
  'reveal.cta_lobby': 'ロビーへ戻る',

  'wall.title_bar': 'ウォール',
  'wall.h2_recent': '最近の',
  'wall.h2_tags': 'タグ',
  'wall.sub': '直近の {n} 件',
  'wall.sub_plural': '直近の {n} 件',
  'wall.empty': 'まだタグはありません。最初の一人になろう。',
  'wall.line': '{sender} → {target}',
  'wall.you_got_tagged': '↳ あなたへのタグ',
  'wall.your_hit': '↳ あなたの一撃',
  'wall.cta_tag_back': '{name} にタグし返す',
  'wall.time_ago': '{t}前',
};

// ─── Korean ─────────────────────────────────────────────────────────────────
const KO: Dict = {
  'lobby.brand': 'No. 14 · AlterU',
  'lobby.wall_count': '게시판 · {n}',
  'lobby.status': '상태',
  'lobby.free_big': '지금은 안전.',
  'lobby.free_sub': '…잠시 동안은.',
  'lobby.tagged_by': '태그한 사람:',
  'lobby.move_ago': '{shout} · {time} 전',
  'lobby.more_incoming': '+ {n}개의 새로운 태그',
  'lobby.more_incoming_plural': '+ {n}개의 새로운 태그',
  'lobby.friends_unsuspecting': '친구 {n}명이 무방비…',
  'lobby.friends_unsuspecting_plural': '친구 {n}명이 무방비…',
  'lobby.no_friends': 'Aigram에서 열면 친구가 보입니다',
  'lobby.inbox': '게시판에 받은 태그 {n}개',
  'lobby.inbox_plural': '게시판에 받은 태그 {n}개',
  'lobby.cta_tag': '누군가에게 태그',
  'lobby.cta_tag_back': '바로 되갚기',
  'lobby.cta_back': '뒤로',

  'picker.title_bar': '선택 · 목표 · 지정',
  'picker.h2_tag': '누구한테?',
  'picker.h2_tag_back': '누구한테 되갚을까?',
  'picker.preview_hint': '미리보기 · Aigram에서 열어야 실제 친구가 나옵니다',
  'picker.loading': '친구 불러오는 중…',
  'picker.empty': 'Aigram에 친구가 없습니다. 먼저 친구를 추가하세요.',
  'picker.picked_badge': '선택됨',
  'picker.cta_empty': '친구를 선택하세요',
  'picker.cta_next': '→ {name} 태그',

  'move.title_bar': '무기고',
  'move.target_cue': '대상 지정됨:',
  'move.h2': '무기를 골라요',
  'move.loaded_badge': '장전됨',
  'move.cta_empty': '무기를 골라요',
  'move.cta_next': '쾅! {shout}',

  'weapon.pie.desc': '크림 파이로 얼굴에',
  'weapon.slime.desc': '초록 슬라임 한 양동이',
  'weapon.confetti.desc': '폭죽 캐논 폭발',
  'weapon.sticker.desc': '거대한 "IT!" 스티커',
  'weapon.pizza.desc': '피자 철썩',
  'weapon.banana.desc': '바나나 껍질에 미끄덩',

  'slam.cook.1': '잉크 그리는 중…',
  'slam.cook.2': '하프톤 도트 섞는 중…',
  'slam.cook.3': '펀치라인 인쇄 중…',
  'slam.cook.4': '레터러 호출 중…',
  'slam.cook.5': '버스트 채우는 중…',
  'slam.ready': '완성!',

  'reveal.tagged_badge': '태그!',
  'reveal.evidence': '증거',
  'reveal.caption_line': '태그 당함.',
  'reveal.fallback_title': '{name}이(가) {shout}',
  'reveal.notice_sent': '{name}의 폰에 전송 완료',
  'reveal.notice_demo': '데모 모드 · 알림 미전송',
  'reveal.notice_queuing': '알림 큐 대기 중…',
  'reveal.cta_share': '피드에 올리기',
  'reveal.cta_lobby': '로비로',

  'wall.title_bar': '게시판',
  'wall.h2_recent': '최근',
  'wall.h2_tags': '태그',
  'wall.sub': '최근 {n}회의 공격',
  'wall.sub_plural': '최근 {n}회의 공격',
  'wall.empty': '아직 태그가 없네요. 첫 번째가 되어 보세요.',
  'wall.line': '{sender} → {target}',
  'wall.you_got_tagged': '↳ 당신이 태그됨',
  'wall.your_hit': '↳ 당신의 공격',
  'wall.cta_tag_back': '{name}에게 되갚기',
  'wall.time_ago': '{t} 전',
};

// ─── Spanish ────────────────────────────────────────────────────────────────
const ES: Dict = {
  'lobby.brand': 'No. 14 · AlterU',
  'lobby.wall_count': 'Muro · {n}',
  'lobby.status': 'Estado',
  'lobby.free_big': 'A salvo.',
  'lobby.free_sub': '…por ahora.',
  'lobby.tagged_by': 'te etiquetó',
  'lobby.move_ago': '{shout} · hace {time}',
  'lobby.more_incoming': '+ {n} etiqueta más',
  'lobby.more_incoming_plural': '+ {n} etiquetas más',
  'lobby.friends_unsuspecting': '{n} amigo desprevenido…',
  'lobby.friends_unsuspecting_plural': '{n} amigos desprevenidos…',
  'lobby.no_friends': 'Abre en Aigram para ver a tus amigos',
  'lobby.inbox': '{n} etiqueta en el muro',
  'lobby.inbox_plural': '{n} etiquetas en el muro',
  'lobby.cta_tag': 'Etiquetar a alguien',
  'lobby.cta_tag_back': 'Devolver ahora',
  'lobby.cta_back': 'Volver',

  'picker.title_bar': 'Elige · tu · objetivo',
  'picker.h2_tag': '¿A quién etiquetar?',
  'picker.h2_tag_back': '¿A quién devolver?',
  'picker.preview_hint': 'Previa — abre en Aigram para ver amigos reales',
  'picker.loading': 'Cargando amigos…',
  'picker.empty': 'Aún no hay amigos en Aigram. Añade alguno primero.',
  'picker.picked_badge': 'Elegido',
  'picker.cta_empty': 'Elige a un amigo',
  'picker.cta_next': '→ Etiquetar a {name}',

  'move.title_bar': 'Arsenal',
  'move.target_cue': 'Objetivo fijado:',
  'move.h2': 'Elige tu arma',
  'move.loaded_badge': 'Cargada',
  'move.cta_empty': 'Elige un arma',
  'move.cta_next': '¡Lanza {shout}!',

  'weapon.pie.desc': 'Tarta de crema a la cara',
  'weapon.slime.desc': 'Cubo de limo verde',
  'weapon.confetti.desc': 'Cañón de confeti',
  'weapon.sticker.desc': 'Pegatina gigante "IT!"',
  'weapon.pizza.desc': 'Pizzazo en la cara',
  'weapon.banana.desc': 'Patinazo con cáscara',

  'slam.cook.1': 'Entintando la viñeta…',
  'slam.cook.2': 'Mezclando los puntos…',
  'slam.cook.3': 'Imprimiendo la gracia…',
  'slam.cook.4': 'Llamando al rotulista…',
  'slam.cook.5': 'Rellenando el estallido…',
  'slam.ready': '¡Listo!',

  'reveal.tagged_badge': '¡Pillado!',
  'reveal.evidence': 'Evidencia',
  'reveal.caption_line': 'le ha tocado.',
  'reveal.fallback_title': '{name} recibe {shout}',
  'reveal.notice_sent': 'Enviado al móvil de {name}',
  'reveal.notice_demo': 'Modo demo · no se envía la notificación',
  'reveal.notice_queuing': 'Encolando notificación…',
  'reveal.cta_share': 'Publicar en el feed',
  'reveal.cta_lobby': 'Volver al lobby',

  'wall.title_bar': 'El muro',
  'wall.h2_recent': 'Etiquetas',
  'wall.h2_tags': 'recientes',
  'wall.sub': 'el último golpe del ring',
  'wall.sub_plural': 'los últimos {n} golpes del ring',
  'wall.empty': 'Aún no hay etiquetas. Sé el primero.',
  'wall.line': '{sender} etiquetó a {target}',
  'wall.you_got_tagged': '↳ Te etiquetaron',
  'wall.your_hit': '↳ Tu golpe',
  'wall.cta_tag_back': 'Devolver a {name}',
  'wall.time_ago': 'hace {t}',
};

const DICTS: Record<Locale, Dict> = { en: EN, zh: ZH, ja: JA, ko: KO, es: ES };

function formatVars(s: string, vars?: Record<string, string | number>): string {
  if (!vars) return s;
  return s.replace(/\{(\w+)\}/g, (_, k) =>
    Object.prototype.hasOwnProperty.call(vars, k) ? String(vars[k]) : `{${k}}`,
  );
}

interface LocaleCtx {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: string, vars?: Record<string, string | number>) => string;
  /** Convenience: t() picking singular/plural by `n`. */
  tp: (
    singularKey: string,
    pluralKey: string,
    n: number,
    vars?: Record<string, string | number>,
  ) => string;
}

const Ctx = createContext<LocaleCtx | null>(null);

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(detectLocale);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    try {
      localStorage.setItem(LS_KEY, l);
    } catch {
      /* ignore */
    }
  }, []);

  const t = useCallback(
    (key: string, vars?: Record<string, string | number>): string => {
      const dict = DICTS[locale] || EN;
      const raw = dict[key] ?? EN[key] ?? key;
      return formatVars(raw, vars);
    },
    [locale],
  );

  const tp = useCallback(
    (
      singularKey: string,
      pluralKey: string,
      n: number,
      vars?: Record<string, string | number>,
    ) => t(n === 1 ? singularKey : pluralKey, { ...(vars || {}), n }),
    [t],
  );

  const value = useMemo<LocaleCtx>(
    () => ({ locale, setLocale, t, tp }),
    [locale, setLocale, t, tp],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useLocale(): LocaleCtx {
  const v = useContext(Ctx);
  if (!v) throw new Error('useLocale must be used inside <LocaleProvider>');
  return v;
}
