import type { ProjectColors, ProjectFonts, TemplateId, SiteVariables } from '@/types'

/**
 * ЕДИНЫЙ КАТАЛОГ ШАБЛОНОВ — источник правды и для превью, и для создания сайта.
 *
 * Ключевое правило: всё, что показано в карточке, пользователь получает
 * после нажатия «Выбрать». Демо-содержимое и подложка отсюда же попадают
 * в getDefaultBlocks(), поэтому превью не может разойтись с результатом.
 *
 * `id` совпадают со значениями колонки `projects.template` и не переименовываются —
 * иначе сломались бы уже созданные проекты.
 *
 * Все различия шаблонов опираются только на то, что реально умеет редактор:
 * вариант первого экрана (BLOCK_CATALOG, категория hero), палитра, пара шрифтов,
 * форма кнопок (BUTTON_SHAPES) и форма изображений (IMAGE_SHAPES).
 */

/** Насколько формальным ощущается шаблон — помогает выбирать, а не листать. */
export type Formality = 'камерно' | 'спокойно' | 'торжественно'

export interface TemplateEntry {
  id: TemplateId
  /** Название для человека: сценарий свадьбы, а не «Шаблон 3». */
  name: string
  /** Одна строка о том, кому он подойдёт. */
  tagline: string
  /** Короткое описание: для какой свадьбы, какое настроение, чем отличается. */
  description: string
  formality: Formality
  /** Короткие метки — по ним видно характер до открытия. */
  tags: string[]
  /** Что входит в шаблон при создании. Только реально включённые блоки. */
  includes: string[]
  /** Композиция первого экрана — вариант HeroBlock из библиотеки редактора. */
  heroVariant: string
  colors: ProjectColors
  fonts: ProjectFonts
  /**
   * Фотография первого экрана. Пока не заполнено — используется тональная
   * подложка из палитры шаблона. Когда появятся снимки, класть их в
   * public/templates/<id>/hero.jpg и указывать путь здесь: превью и созданный
   * сайт подхватят её одновременно, менять больше ничего не нужно.
   */
  photo?: string
  /** Демо-содержимое первого экрана. Оно же подставляется при создании сайта. */
  demo: {
    bride: string
    groom: string
    date: string
    time: string
    tagline: string
  }
}

/**
 * Композиции, которые кладут поверх фотографии белый текст.
 * Для них подложка должна быть глубокой, иначе имена не прочитать.
 */
const DEEP_BACKDROP_VARIANTS = new Set(['cinematic', '1', '4', '6', '7'])

/** Нужна ли этому шаблону приглушённая подложка под белый текст. */
export function needsDeepBackdrop(heroVariant: string): boolean {
  return DEEP_BACKDROP_VARIANTS.has(heroVariant)
}

/**
 * Тональная подложка — временная замена фотографии.
 *
 * Не клипарт и не стоковое фото: только свет и цвет из палитры шаблона.
 * Светлота зависит от композиции, чтобы светлые шаблоны не выглядели
 * такими же тёмными, как вечерние.
 */
export function toneBackdrop(colors: ProjectColors, seed = 0, deep = true): string {
  const { accent, primary, secondary, background } = colors
  const a = 26 + ((seed * 13) % 26)
  const b = 24 + ((seed * 7) % 26)

  const shade = deep
    ? `<linearGradient id="shade" x1="0" y1="0" x2="0" y2="1">
<stop offset="0" stop-color="#000000" stop-opacity="0.34"/>
<stop offset="0.5" stop-color="#000000" stop-opacity="0.46"/>
<stop offset="1" stop-color="#000000" stop-opacity="0.62"/>
</linearGradient>`
    : `<linearGradient id="shade" x1="0" y1="0" x2="0.3" y2="1">
<stop offset="0" stop-color="${background}" stop-opacity="0.55"/>
<stop offset="1" stop-color="${background}" stop-opacity="0.18"/>
</linearGradient>`

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="1600" viewBox="0 0 1200 1600">
<defs>
<linearGradient id="base" x1="0.1" y1="0" x2="0.9" y2="1">
<stop offset="0" stop-color="${secondary}"/><stop offset="0.55" stop-color="${primary}"/><stop offset="1" stop-color="${secondary}"/>
</linearGradient>
<radialGradient id="glow" cx="${a}%" cy="${b}%" r="70%">
<stop offset="0" stop-color="${accent}" stop-opacity="0.5"/>
<stop offset="1" stop-color="${accent}" stop-opacity="0"/>
</radialGradient>
${shade}
</defs>
<rect width="1200" height="1600" fill="url(#base)"/>
<rect width="1200" height="1600" fill="url(#glow)"/>
<rect width="1200" height="1600" fill="url(#shade)"/>
</svg>`
  return `data:image/svg+xml,${encodeURIComponent(svg)}`
}

/**
 * Изображения шаблона: одна точка входа для превью и для создания сайта.
 * `seed` разводит кадры коллажа, чтобы они не были идентичными.
 */
export function templateImage(tpl: TemplateEntry, seed = 0): string {
  if (tpl.photo) return tpl.photo
  // Минималистичный первый экран задуман без фотографии — подложка ему не нужна
  if (tpl.heroVariant === '5') return ''
  return toneBackdrop(tpl.colors, seed || tpl.name.length, needsDeepBackdrop(tpl.heroVariant))
}

export const TEMPLATE_CATALOG: TemplateEntry[] = [
  {
    id: 'minimal-white',
    name: 'Тихий свет',
    tagline: 'Ничего лишнего: имена, дата и воздух',
    description:
      'Светлый шаблон для современной свадьбы без декора. Первый экран без фотографии — только крупные имена, дата и много воздуха.',
    formality: 'спокойно',
    tags: ['минимализм', 'светлый', 'без фото'],
    includes: ['Главный экран', 'История', 'Галерея', 'Таймер', 'Локация', 'RSVP'],
    heroVariant: '5',
    colors: { primary: '#1A1A1A', secondary: '#6B6B6B', accent: '#EFEBE5', background: '#FFFFFF', text: '#1A1A1A' },
    fonts: { heading: 'Manrope', body: 'Inter', buttonStyle: 'sharp', imageStyle: 'square' },
    demo: {
      bride: 'Алия', groom: 'Дамир', date: '2026-06-13', time: '16:00',
      tagline: 'Будем рады видеть вас в этот день рядом с нами',
    },
  },
  {
    id: 'modern-editorial',
    name: 'Первая полоса',
    tagline: 'Журнальная подача с крупной типографикой',
    description:
      'Имена набраны во всю ширину экрана, как заголовок на обложке. Для пары, которой ближе графика и типографика, чем цветы и вензеля.',
    formality: 'спокойно',
    tags: ['editorial', 'контрастный', 'крупный шрифт'],
    includes: ['Главный экран', 'История', 'Галерея', 'Тайминг дня', 'Локация', 'RSVP'],
    heroVariant: 'cinematic',
    colors: { primary: '#B08D57', secondary: '#5A5A5A', accent: '#E6E2DC', background: '#F7F6F4', text: '#141414' },
    fonts: { heading: 'Playfair Display', body: 'Inter', buttonStyle: 'sharp', imageStyle: 'square' },
    demo: {
      bride: 'София', groom: 'Артур', date: '2026-09-05', time: '17:00',
      tagline: 'Один день, который мы хотим прожить вместе с вами',
    },
  },
  {
    id: 'sage-garden',
    name: 'Полевая свадьба',
    tagline: 'Дневное торжество за городом',
    description:
      'Зелёная палитра и разделённый экран: фотография во всю высоту рядом с текстом. Для свадьбы в саду, на поле или у воды.',
    formality: 'спокойно',
    tags: ['природа', 'дневной', 'зелёный'],
    includes: ['Главный экран', 'История', 'Галерея', 'Тайминг дня', 'Локация', 'RSVP'],
    heroVariant: '3',
    colors: { primary: '#6E8060', secondary: '#4F5F49', accent: '#DCE4D2', background: '#F6F8F2', text: '#232B1D' },
    fonts: { heading: 'Cormorant Garamond', body: 'Raleway', buttonStyle: 'pill', imageStyle: 'rounded' },
    demo: {
      bride: 'Зарина', groom: 'Алексей', date: '2026-07-18', time: '15:00',
      tagline: 'Собираемся в саду, чтобы отметить начало нашей семьи',
    },
  },
  {
    id: 'classic-luxury',
    name: 'Вечерний приём',
    tagline: 'Классическое приглашение-карточка',
    description:
      'Приглашение подано как печатная карточка поверх тёплого фона. Для торжества с церемонией, рассадкой и банкетом.',
    formality: 'торжественно',
    tags: ['классика', 'тёплый', 'церемония'],
    includes: ['Главный экран', 'История', 'Галерея', 'Таймер', 'Локация', 'RSVP'],
    heroVariant: '8',
    colors: { primary: '#B08D57', secondary: '#8B6F47', accent: '#F1E7D6', background: '#FBF8F3', text: '#2C2017' },
    fonts: { heading: 'Cormorant Garamond', body: 'Lato', buttonStyle: 'rounded', imageStyle: 'rounded' },
    demo: {
      bride: 'Виктория', groom: 'Марат', date: '2026-08-22', time: '17:30',
      tagline: 'Приглашаем вас разделить с нами этот особенный вечер',
    },
  },
  {
    id: 'dark-elegant',
    name: 'После заката',
    tagline: 'Вечерняя свадьба, приглушённый свет',
    description:
      'Тёмный фон, тонкая рамка и шампань в акцентах. Для торжества, которое начинается вечером и продолжается ночью.',
    formality: 'торжественно',
    tags: ['вечерний', 'тёмный', 'шампань'],
    includes: ['Главный экран', 'История', 'Галерея', 'Таймер', 'Локация', 'RSVP'],
    heroVariant: '6',
    colors: { primary: '#D9C3A5', secondary: '#A0896A', accent: '#2A241C', background: '#15120E', text: '#F2EBDF' },
    fonts: { heading: 'Prata', body: 'Manrope', buttonStyle: 'sharp', imageStyle: 'square' },
    demo: {
      bride: 'Камила', groom: 'Тимур', date: '2026-10-03', time: '19:00',
      tagline: 'Вечер, который мы хотим запомнить надолго',
    },
  },
  {
    id: 'rose-blush',
    name: 'Домашнее торжество',
    tagline: 'Камерно, для двадцати самых близких',
    description:
      'Пудровая палитра и коллаж из трёх кадров вместо одного большого фото. Для небольшой свадьбы, где важнее атмосфера, чем протокол.',
    formality: 'камерно',
    tags: ['камерный', 'пудровый', 'коллаж'],
    includes: ['Главный экран', 'История', 'Галерея', 'Таймер', 'Локация', 'RSVP'],
    heroVariant: '9',
    colors: { primary: '#B8737F', secondary: '#8E4750', accent: '#F5E6E2', background: '#FDF8F6', text: '#2A1B1D' },
    fonts: { heading: 'Lora', body: 'Inter', buttonStyle: 'pill', imageStyle: 'circle' },
    demo: {
      bride: 'Айгерим', groom: 'Ерлан', date: '2026-05-30', time: '14:00',
      tagline: 'Хотим отметить этот день в кругу самых близких',
    },
  },
]

/** Шрифты, которые нужны каталогу для живых превью. Меньше библиотеки редактора. */
export const CATALOG_FONT_FAMILIES = Array.from(
  new Set(TEMPLATE_CATALOG.flatMap((t) => [t.fonts.heading, t.fonts.body])),
)

export const DEFAULT_TEMPLATE_ID: TemplateId = 'classic-luxury'

export function getTemplate(id: TemplateId | string): TemplateEntry {
  return TEMPLATE_CATALOG.find((t) => t.id === id) ?? TEMPLATE_CATALOG.find((t) => t.id === DEFAULT_TEMPLATE_ID)!
}

/**
 * Демо-данные шаблона в формате переменных сайта.
 * Используются, когда пользователь не заполнил свои — тогда созданный сайт
 * выглядит ровно так же, как превью в каталоге.
 */
export function templateDemoVars(tpl: TemplateEntry): Partial<SiteVariables> {
  return {
    bride: tpl.demo.bride,
    groom: tpl.demo.groom,
    date: tpl.demo.date,
    time: tpl.demo.time,
  }
}
