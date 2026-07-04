import type { ProjectColors, ProjectFonts } from '@/types'

export type FontFamilyKind = 'serif' | 'sans' | 'cursive'

export interface WeddingFont {
  heading: string
  body: string
  label: string
  kind: FontFamilyKind
  cyrillic: boolean // корректно отображает кириллицу
}

// 25 аккуратных свадебных / каллиграфических шрифтов.
// cyrillic:true — шрифт умеет кириллицу (для имён Айгерим / Дамир).
// cyrillic:false — латиница (для имён вида Adele & David), в превью используем латинский образец.
export const WEDDING_FONTS: WeddingFont[] = [
  { heading: 'Cormorant Garamond', body: 'Lato',    label: 'Cormorant',     kind: 'serif',   cyrillic: true },
  { heading: 'Playfair Display',   body: 'Lato',    label: 'Playfair',      kind: 'serif',   cyrillic: true },
  { heading: 'EB Garamond',        body: 'Lato',    label: 'EB Garamond',   kind: 'serif',   cyrillic: true },
  { heading: 'Cormorant',          body: 'Raleway', label: 'Cormorant Alt', kind: 'serif',   cyrillic: true },
  { heading: 'Lora',               body: 'Inter',   label: 'Lora',          kind: 'serif',   cyrillic: true },
  { heading: 'Prata',              body: 'Raleway', label: 'Prata',         kind: 'serif',   cyrillic: true },
  { heading: 'Spectral',           body: 'Inter',   label: 'Spectral',      kind: 'serif',   cyrillic: true },
  { heading: 'PT Serif',           body: 'Lato',    label: 'PT Serif',      kind: 'serif',   cyrillic: true },
  { heading: 'Alice',              body: 'Raleway', label: 'Alice',         kind: 'serif',   cyrillic: true },
  { heading: 'Yeseva One',         body: 'Lato',    label: 'Yeseva One',    kind: 'serif',   cyrillic: true },
  { heading: 'Forum',              body: 'Manrope', label: 'Forum',         kind: 'serif',   cyrillic: true },
  { heading: 'Philosopher',        body: 'Raleway', label: 'Philosopher',   kind: 'sans',    cyrillic: true },
  { heading: 'Tenor Sans',         body: 'Manrope', label: 'Tenor Sans',    kind: 'sans',    cyrillic: true },
  { heading: 'Marcellus',          body: 'Raleway', label: 'Marcellus',     kind: 'serif',   cyrillic: false },
  { heading: 'Cinzel',             body: 'Raleway', label: 'Cinzel',        kind: 'serif',   cyrillic: false },
  { heading: 'Dancing Script',     body: 'Lato',    label: 'Dancing Script',kind: 'cursive', cyrillic: true },
  { heading: 'Marck Script',       body: 'Lato',    label: 'Marck Script',  kind: 'cursive', cyrillic: true },
  { heading: 'Caveat',             body: 'Lato',    label: 'Caveat',        kind: 'cursive', cyrillic: true },
  { heading: 'Pacifico',           body: 'Lato',    label: 'Pacifico',      kind: 'cursive', cyrillic: true },
  { heading: 'Great Vibes',        body: 'Lato',    label: 'Great Vibes',   kind: 'cursive', cyrillic: false },
  { heading: 'Sacramento',         body: 'Lato',    label: 'Sacramento',    kind: 'cursive', cyrillic: false },
  { heading: 'Parisienne',         body: 'Lato',    label: 'Parisienne',    kind: 'cursive', cyrillic: false },
  { heading: 'Allura',             body: 'Lato',    label: 'Allura',        kind: 'cursive', cyrillic: false },
  { heading: 'Alex Brush',         body: 'Lato',    label: 'Alex Brush',    kind: 'cursive', cyrillic: false },
  { heading: 'Pinyon Script',      body: 'Lato',    label: 'Pinyon Script', kind: 'cursive', cyrillic: false },
]

export function fontFamilyValue(font: string): string {
  const meta = WEDDING_FONTS.find((f) => f.heading === font)
  if (meta) {
    if (meta.kind === 'cursive') return `'${font}', cursive`
    if (meta.kind === 'sans') return `'${font}', sans-serif`
    return `'${font}', serif`
  }
  return `'${font}', serif`
}

// Готовые цельные стили — задают палитру + типографику одним нажатием.
export interface StylePreset {
  id: string
  name: string
  desc: string
  colors: ProjectColors
  fonts: ProjectFonts
}

export const STYLE_PRESETS: StylePreset[] = [
  {
    id: 'luxury',
    name: 'Luxury',
    desc: 'Тёмный фон, золото, кинематографично',
    colors: { primary: '#D4AF7A', secondary: '#A0896A', accent: '#3D3025', background: '#1C1812', text: '#F0E8D8' },
    fonts: { heading: 'Playfair Display', body: 'Raleway' },
  },
  {
    id: 'minimal',
    name: 'Minimal',
    desc: 'Чистота, воздух, лаконичность',
    colors: { primary: '#1A1A1A', secondary: '#6B6B6B', accent: '#EEEAE4', background: '#FFFFFF', text: '#1A1A1A' },
    fonts: { heading: 'Tenor Sans', body: 'Inter' },
  },
  {
    id: 'classic',
    name: 'Classic',
    desc: 'Золото и кремовые тона, классика',
    colors: { primary: '#C4A97D', secondary: '#8B6F47', accent: '#F5EDD6', background: '#FAF8F5', text: '#2C2017' },
    fonts: { heading: 'Cormorant Garamond', body: 'Lato' },
  },
  {
    id: 'romantic',
    name: 'Romantic',
    desc: 'Нежная роза, тепло, романтика',
    colors: { primary: '#D4829A', secondary: '#A85C72', accent: '#FCF0F4', background: '#FFF8FA', text: '#2A1520' },
    fonts: { heading: 'Prata', body: 'Raleway' },
  },
  {
    id: 'botanical',
    name: 'Botanical',
    desc: 'Шалфей, зелень, природные тона',
    colors: { primary: '#7E8E6A', secondary: '#526044', accent: '#DDE4D2', background: '#F5F7F0', text: '#2D3520' },
    fonts: { heading: 'Cormorant Garamond', body: 'Raleway' },
  },
  {
    id: 'modern',
    name: 'Modern',
    desc: 'Гротеск, графика, современный минимал',
    colors: { primary: '#B5654A', secondary: '#7A4230', accent: '#EFE9E3', background: '#F7F4F1', text: '#1E1A17' },
    fonts: { heading: 'Manrope', body: 'Inter' },
  },
]

// Готовые палитры (быстрый выбор цвета).
export const COLOR_PRESETS: { name: string; colors: ProjectColors }[] = [
  { name: 'Gold & Cream',  colors: { primary: '#C4A97D', secondary: '#8B6F47', accent: '#F5EDD6', background: '#FAF8F5', text: '#2C2017' } },
  { name: 'Rose & Blush',  colors: { primary: '#D4829A', secondary: '#A85C72', accent: '#FCF0F4', background: '#FFF8FA', text: '#2A1520' } },
  { name: 'Sage & White',  colors: { primary: '#7C9E7E', secondary: '#5A7A5C', accent: '#EBF2EB', background: '#F8FBF8', text: '#1A261A' } },
  { name: 'Dark Gold',     colors: { primary: '#D4AF7A', secondary: '#A0896A', accent: '#3D3025', background: '#1C1812', text: '#F0E8D8' } },
  { name: 'Navy & Silver', colors: { primary: '#8090A8', secondary: '#5A6880', accent: '#E8EDF5', background: '#F5F7FA', text: '#1A2233' } },
  { name: 'Terracotta',    colors: { primary: '#C4714A', secondary: '#9A5535', accent: '#F5E8E0', background: '#FBF5F0', text: '#2C1810' } },
  { name: 'Dusty Blue',    colors: { primary: '#7C93A6', secondary: '#54697A', accent: '#E7EDF2', background: '#F6F9FB', text: '#1B2730' } },
  { name: 'Mauve',         colors: { primary: '#A5798E', secondary: '#7E5468', accent: '#F1E7EE', background: '#FBF7F9', text: '#281A22' } },
]

// ── HEX / RGB утилиты для цветового пикера ──
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex.trim())
  if (!m) return null
  return { r: parseInt(m[1], 16), g: parseInt(m[2], 16), b: parseInt(m[3], 16) }
}

export function rgbToHex(r: number, g: number, b: number): string {
  const c = (n: number) => Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, '0')
  return `#${c(r)}${c(g)}${c(b)}`.toUpperCase()
}

export function normalizeHex(input: string): string | null {
  let v = input.trim().replace(/^#/, '')
  if (/^[a-f\d]{3}$/i.test(v)) v = v.split('').map((c) => c + c).join('')
  if (/^[a-f\d]{6}$/i.test(v)) return `#${v.toUpperCase()}`
  return null
}
