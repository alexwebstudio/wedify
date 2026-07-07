// Свадебные заглушки-изображения в виде SVG data-URI.
// Никаких случайных стоковых фото (докторов/офисов) — только свадебные мотивы
// и мягкие премиальные градиенты. Работают офлайн, ничего не грузится извне.

type Motif = 'couple' | 'flowers' | 'rings' | 'decor' | 'venue' | 'story' | 'portrait' | 'cake' | 'bouquet'

interface Tone { a: string; b: string; ink: string }

// мягкие свадебные палитры для заглушек
const TONES: Tone[] = [
  { a: '#F3EADD', b: '#E4CBA8', ink: '#B8956A' }, // золото/крем
  { a: '#F7ECEF', b: '#E9C9D3', ink: '#C98AA0' }, // роза
  { a: '#EEF2E8', b: '#CFDCC2', ink: '#7E8E6A' }, // шалфей
  { a: '#ECEFF4', b: '#C9D6E2', ink: '#7C93A6' }, // пыльно-голубой
  { a: '#F1ECF1', b: '#D8C6D6', ink: '#A5798E' }, // мов
  { a: '#F4EDE7', b: '#DCC7B6', ink: '#B5654A' }, // терракота
]

function motifPath(m: Motif, ink: string): string {
  const s = (d: string, extra = '') => `<path d="${d}" fill="none" stroke="${ink}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" ${extra}/>`
  switch (m) {
    case 'rings':
      return `<circle cx="-16" cy="0" r="26" fill="none" stroke="${ink}" stroke-width="2.4"/><circle cx="16" cy="0" r="26" fill="none" stroke="${ink}" stroke-width="2.4"/>`
    case 'couple':
      return s('M0,20 C-18,2 -30,-6 -30,-20 C-30,-32 -14,-34 0,-18 C14,-34 30,-32 30,-20 C30,-6 18,2 0,20 Z')
    case 'flowers':
    case 'bouquet':
      return s('M0,34 L0,-6 M0,-6 C-4,-22 -22,-24 -22,-8 C-22,2 -8,2 0,-6 M0,-6 C4,-22 22,-24 22,-8 C22,2 8,2 0,-6 M0,-4 C-2,-18 -12,-30 0,-34 C12,-30 2,-18 0,-4') + `<circle cx="0" cy="-14" r="4.5" fill="${ink}"/>`
    case 'venue':
      return s('M-30,26 L-30,-6 L0,-28 L30,-6 L30,26 M-12,26 L-12,4 L12,4 L12,26')
    case 'cake':
      return s('M-24,28 L-24,6 L24,6 L24,28 Z M-16,6 L-16,-8 L16,-8 L16,6 M0,-8 L0,-22') + `<circle cx="0" cy="-24" r="3.4" fill="${ink}"/>`
    case 'decor':
      return s('M-32,0 C-16,-22 16,22 32,0') + `<circle cx="0" cy="0" r="4" fill="${ink}"/><circle cx="-32" cy="0" r="3" fill="${ink}"/><circle cx="32" cy="0" r="3" fill="${ink}"/>`
    case 'story':
    case 'portrait':
    default:
      return `<circle cx="0" cy="-8" r="14" fill="none" stroke="${ink}" stroke-width="2.2"/>` + s('M-24,30 C-24,6 24,6 24,30')
  }
}

export function weddingPlaceholder(
  motif: Motif = 'couple',
  opts: { w?: number; h?: number; tone?: number } = {}
): string {
  const w = opts.w ?? 1200
  const h = opts.h ?? 1500
  const t = TONES[(opts.tone ?? 0) % TONES.length]
  const cx = w / 2
  const cy = h / 2
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
<defs>
<linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
<stop offset="0" stop-color="${t.a}"/><stop offset="1" stop-color="${t.b}"/>
</linearGradient>
<radialGradient id="v" cx="0.5" cy="0.42" r="0.75">
<stop offset="0.55" stop-color="#000000" stop-opacity="0"/><stop offset="1" stop-color="#000000" stop-opacity="0.06"/>
</radialGradient>
</defs>
<rect width="${w}" height="${h}" fill="url(#g)"/>
<rect width="${w}" height="${h}" fill="url(#v)"/>
<g transform="translate(${cx} ${cy - 30}) scale(2.1)" opacity="0.5">${motifPath(motif, t.ink)}</g>
<g transform="translate(${cx} ${cy + 96})" opacity="0.55">
<line x1="-34" y1="0" x2="-10" y2="0" stroke="${t.ink}" stroke-width="1.6"/>
<circle cx="0" cy="0" r="2.6" fill="${t.ink}"/>
<line x1="10" y1="0" x2="34" y2="0" stroke="${t.ink}" stroke-width="1.6"/>
</g>
</svg>`
  return `data:image/svg+xml,${encodeURIComponent(svg)}`
}

// Готовые наборы под конкретные блоки (портрет / широкие).
export const PH = {
  heroCouple: () => weddingPlaceholder('couple', { w: 1600, h: 1000, tone: 0 }),
  heroFlowers: () => weddingPlaceholder('flowers', { w: 1600, h: 1000, tone: 1 }),
  heroVenue: () => weddingPlaceholder('venue', { w: 1600, h: 1000, tone: 3 }),
  heroDecor: () => weddingPlaceholder('decor', { w: 1600, h: 1000, tone: 2 }),
  storyPortrait: (tone = 0) => weddingPlaceholder('story', { w: 1000, h: 1300, tone }),
  galleryTile: (i = 0) => weddingPlaceholder((['couple', 'flowers', 'rings', 'decor', 'cake', 'bouquet'] as Motif[])[i % 6], { w: 1000, h: 1200, tone: i % TONES.length }),
}

// Пресеты для выбора фото — красивые нейтральные свадебные заглушки по категориям.
export const PLACEHOLDER_PRESETS: { url: string; label: string }[] = [
  { url: weddingPlaceholder('couple', { tone: 0 }), label: 'Пара' },
  { url: weddingPlaceholder('flowers', { tone: 1 }), label: 'Цветы' },
  { url: weddingPlaceholder('rings', { tone: 0 }), label: 'Кольца' },
  { url: weddingPlaceholder('bouquet', { tone: 2 }), label: 'Букет' },
  { url: weddingPlaceholder('venue', { tone: 3 }), label: 'Площадка' },
  { url: weddingPlaceholder('decor', { tone: 4 }), label: 'Декор' },
  { url: weddingPlaceholder('cake', { tone: 5 }), label: 'Торт' },
  { url: weddingPlaceholder('portrait', { tone: 1 }), label: 'Портрет' },
]
