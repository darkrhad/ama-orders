// Small drawings for the menu tiles, one per product (48×48).

const INK = '#2a170b';
const COFFEE = '#4a2410';
const MILK = '#f6ead2';
const CREAM = '#fffaf0';
const TAN = '#c99a63';
const GOLD = '#e8a83a';
const GREEN = '#4f9a46';
const RED = '#c8281e';
const ICE = '#dff0fb';

// A tall glass from y=8 to y=42, wider at the top; `layer` fills it between two heights.
const gx = (y: number) => 12 + (3 * (y - 8)) / 34;
const layer = (y1: number, y2: number, fill: string) => (
  <polygon points={`${gx(y1)},${y1} ${48 - gx(y1)},${y1} ${48 - gx(y2)},${y2} ${gx(y2)},${y2}`} fill={fill} />
);
const glassOutline = <path d="M12 8 H36 L33 42 H15 Z" fill="none" stroke={INK} strokeWidth="2" strokeLinejoin="round" />;
const cubes = (
  <g fill={ICE} stroke="#9cc6e0" strokeWidth="1">
    <rect x="16" y="14" width="7" height="7" rx="1.5" transform="rotate(-12 19 17)" />
    <rect x="25" y="12" width="7" height="7" rx="1.5" transform="rotate(10 28 15)" />
  </g>
);
const salt = (
  <g fill="#fff" stroke="#b9a58e" strokeWidth="0.6">
    <rect x="19" y="5" width="2.5" height="2.5" />
    <rect x="24" y="3.5" width="2.5" height="2.5" />
    <rect x="28" y="5.5" width="2.5" height="2.5" />
  </g>
);

// A cup on a saucer, filled with `top` over coffee.
const cup = (top: string, extra?: JSX.Element) => (
  <>
    <ellipse cx="23" cy="41" rx="17" ry="3.5" fill={MILK} stroke={INK} strokeWidth="2" />
    <path d="M36 22 h3 a5 5 0 0 1 0 10 h-4" fill="none" stroke={INK} strokeWidth="2.5" />
    <path d="M9 18 H37 V26 A14 13 0 0 1 9 26 Z" fill={COFFEE} stroke={INK} strokeWidth="2" strokeLinejoin="round" />
    <path d="M10 18 H36 V22 C30 25 16 25 10 22 Z" fill={top} />
    {extra}
  </>
);

const baguette = (
  <>
    <path d="M4 26 C4 18 10 16 24 16 C38 16 44 18 44 26 C44 30 40 31 24 31 C8 31 4 30 4 26 Z" fill="#d99a4e" stroke={INK} strokeWidth="2" />
    <path d="M12 19 l4 -2 M21 18 l4 -2 M30 18 l4 -2" stroke="#f3c98c" strokeWidth="2" strokeLinecap="round" />
  </>
);

const bowl = (inside: JSX.Element) => (
  <>
    {inside}
    <path d="M4 24 H44 A20 17 0 0 1 4 24 Z" fill="#fffaf0" stroke={INK} strokeWidth="2" strokeLinejoin="round" />
    <path d="M10 31 H38" stroke={RED} strokeWidth="2.5" />
  </>
);

const bag = (label: string, mark: JSX.Element) => (
  <>
    <path d="M12 10 H36 L38 42 H10 Z" fill="#8a6a45" stroke={INK} strokeWidth="2" strokeLinejoin="round" />
    <path d="M12 10 L15 6 H33 L36 10" fill="#6d5233" stroke={INK} strokeWidth="2" strokeLinejoin="round" />
    <rect x="15" y="18" width="18" height="16" rx="2" fill={label} />
    {mark}
    {bean(8, 42)}
    {bean(41, 41)}
  </>
);

function bean(x: number, y: number) {
  return (
  <g transform={`translate(${x} ${y}) rotate(-25)`}>
    <ellipse rx="3.4" ry="2.4" fill={COFFEE} />
    <path d="M-2.6 0 C-1 -1 1 1 2.6 0" stroke="#c99a63" strokeWidth="0.8" fill="none" />
  </g>
  );
}

const can = (body: string, text: string) => (
  <>
    <rect x="14" y="7" width="20" height="35" rx="3" fill={body} stroke={INK} strokeWidth="2" />
    <rect x="16" y="5" width="16" height="3" rx="1" fill="#c9c9c9" stroke={INK} strokeWidth="1.5" />
    <path d="M14 19 C20 23 28 15 34 21" stroke={text} strokeWidth="2.5" fill="none" />
    <path d="M14 29 C20 33 28 25 34 31" stroke={text} strokeWidth="1.5" fill="none" />
  </>
);

const ART: Record<string, JSX.Element> = {
  'cf-sua': (
    <>
      {layer(26, 42, MILK)}
      {layer(10, 26, COFFEE)}
      {cubes}
      {glassOutline}
    </>
  ),
  'cf-muoi': (
    <>
      {layer(20, 42, COFFEE)}
      {layer(10, 20, CREAM)}
      {cubes}
      {glassOutline}
      {salt}
    </>
  ),
  'cf-dua': (
    <>
      {layer(26, 42, COFFEE)}
      {layer(10, 26, '#fbf7ee')}
      <circle cx="35" cy="37" r="8" fill="#7a4a24" stroke={INK} strokeWidth="2" />
      <circle cx="35" cy="37" r="5" fill="#fffaf0" />
      {glassOutline}
    </>
  ),
  'cf-trung': cup(GOLD, <path d="M12 19 C18 15 28 15 34 19" stroke="#f6d27a" strokeWidth="2" fill="none" />),
  'bac-xiu': (
    <>
      {layer(32, 42, COFFEE)}
      {layer(10, 32, TAN)}
      {cubes}
      {glassOutline}
    </>
  ),
  'bac-xiu-muoi': (
    <>
      {layer(32, 42, COFFEE)}
      {layer(20, 32, TAN)}
      {layer(10, 20, CREAM)}
      {glassOutline}
      {salt}
    </>
  ),

  'bm-heo-quay': (
    <>
      {baguette}
      <path d="M8 26 H40" stroke={GREEN} strokeWidth="3" strokeLinecap="round" />
      <path d="M10 24 H38" stroke="#a6532a" strokeWidth="4" strokeLinecap="round" />
      <path d="M12 22 H36" stroke="#e9b15c" strokeWidth="2" strokeDasharray="3 2" />
      <circle cx="40" cy="22" r="2" fill={RED} />
    </>
  ),
  'bm-opla': (
    <>
      {baguette}
      <path d="M8 26 H40" stroke={GREEN} strokeWidth="3" strokeLinecap="round" />
      <ellipse cx="25" cy="22" rx="11" ry="5" fill="#fff" stroke={INK} strokeWidth="1.5" />
      <circle cx="25" cy="22" r="3.5" fill={GOLD} />
    </>
  ),
  'cha-gio': (
    <>
      <rect x="5" y="12" width="28" height="8" rx="4" fill="#d9842e" stroke={INK} strokeWidth="2" transform="rotate(-12 19 16)" />
      <rect x="6" y="22" width="28" height="8" rx="4" fill="#e39a3f" stroke={INK} strokeWidth="2" transform="rotate(-6 20 26)" />
      <path d="M11 13 l2 4 M18 11 l2 4 M25 10 l2 4" stroke="#f3c98c" strokeWidth="1.5" />
      <ellipse cx="36" cy="38" rx="9" ry="4" fill="#f0a24a" stroke={INK} strokeWidth="2" />
      <path d="M8 39 C14 35 20 41 26 37" stroke={GREEN} strokeWidth="3" fill="none" strokeLinecap="round" />
    </>
  ),
  'bun-thit-nuong': bowl(
    <>
      <path d="M8 24 C10 14 16 18 18 12 C21 18 26 12 29 18 C32 13 37 16 40 24 Z" fill="#fbf4e4" stroke="#d8c7a6" strokeWidth="1" />
      <rect x="21" y="13" width="9" height="6" rx="1.5" fill="#8a3f1c" transform="rotate(-15 25 16)" />
      <rect x="29" y="16" width="9" height="6" rx="1.5" fill="#a6532a" transform="rotate(12 33 19)" />
      <path d="M10 20 l5 -5 M13 22 l4 -6" stroke={GREEN} strokeWidth="2.5" strokeLinecap="round" />
    </>,
  ),
  'com-tam': (
    <>
      <ellipse cx="24" cy="34" rx="21" ry="8" fill="#fffaf0" stroke={INK} strokeWidth="2" />
      <path d="M8 32 C8 22 22 20 24 30 Z" fill="#fff" stroke="#d8c7a6" strokeWidth="1.2" />
      <path d="M22 30 C24 20 40 20 41 30 C38 34 26 34 22 30 Z" fill="#a6532a" stroke={INK} strokeWidth="1.5" />
      <path d="M27 25 l8 4 M27 28 l8 -3" stroke="#6b2d12" strokeWidth="1.3" />
      <path d="M12 37 h6" stroke={GREEN} strokeWidth="3" strokeLinecap="round" />
      <circle cx="21" cy="37" r="1.8" fill={RED} />
    </>
  ),
  'pho-ga': bowl(
    <>
      <path d="M32 2 L22 22 M38 4 L26 22" stroke="#b5874f" strokeWidth="2" strokeLinecap="round" />
      <ellipse cx="24" cy="24" rx="20" ry="4" fill="#e8b45a" />
      <path d="M10 23 C14 20 18 25 22 22 C26 19 30 25 34 22" stroke="#fbf4e4" strokeWidth="2" fill="none" />
      <ellipse cx="17" cy="22" rx="4" ry="2" fill="#f6ead2" stroke="#d8c7a6" strokeWidth="0.8" />
      <path d="M30 21 l3 -2 M34 23 l3 -2" stroke={GREEN} strokeWidth="2.2" strokeLinecap="round" />
    </>,
  ),

  'beans-dray-sap': bag('#e9d6b0', <path d="M19 22 V30 M24 21 V31 M29 22 V30" stroke="#5aa3c8" strokeWidth="2.2" strokeLinecap="round" />),
  'beans-serepok': bag('#e9d6b0', <path d="M17 29 C21 22 27 33 31 24" stroke="#4f9a46" strokeWidth="2.5" fill="none" strokeLinecap="round" />),
  'beans-yokdon': bag('#e9d6b0', <path d="M18 31 L22 23 L26 28 L30 21" stroke="#a6532a" strokeWidth="2.5" fill="none" strokeLinejoin="round" strokeLinecap="round" />),

  'coca-cola': can('#c8281e', '#fff'),
  'coca-cola-zero': can('#1d1d1d', '#e8303a'),
  'fruit-juice': (
    <>
      {layer(14, 42, '#f39a2b')}
      <circle cx="35" cy="10" r="7" fill="#f6c34a" stroke={INK} strokeWidth="2" />
      <path d="M35 4 V16 M29 10 H41 M31 6 L39 14 M39 6 L31 14" stroke="#e08a1e" strokeWidth="1" />
      <path d="M20 2 L24 30" stroke="#5aa3c8" strokeWidth="2.5" strokeLinecap="round" />
      {glassOutline}
    </>
  ),
  'tra-xanh': (
    <>
      {layer(12, 42, '#b7cf63')}
      {cubes}
      <path d="M30 22 C38 18 40 26 34 30 C30 32 28 26 30 22 Z" fill={GREEN} />
      {glassOutline}
    </>
  ),
};

export default function ProductArt({ id }: { id: string }) {
  const art = ART[id];
  if (!art) return null;
  return (
    <svg className="art" viewBox="0 0 48 48" aria-hidden="true">
      {art}
    </svg>
  );
}
