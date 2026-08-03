import type { BlockData, ProjectColors, ProjectFonts, ProjectMusic, TemplateId } from '@/types'
import { getTemplate, templateImage, toneBackdrop, type TemplateEntry } from './templateCatalog'

export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[а-яёa-z]+/gi, (match) => transliterate(match))
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 40)
}

function transliterate(str: string): string {
  const map: Record<string, string> = {
    а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ё: 'yo',
    ж: 'zh', з: 'z', и: 'i', й: 'y', к: 'k', л: 'l', м: 'm',
    н: 'n', о: 'o', п: 'p', р: 'r', с: 's', т: 't', у: 'u',
    ф: 'f', х: 'h', ц: 'ts', ч: 'ch', ш: 'sh', щ: 'sch',
    ъ: '', ы: 'y', ь: '', э: 'e', ю: 'yu', я: 'ya',
  }
  return str.split('').map(c => map[c.toLowerCase()] || c).join('')
}

/**
 * Оформление шаблона по умолчанию.
 * Значения берутся из единого каталога (lib/templateCatalog.ts), а не дублируются здесь.
 */
export function getTemplateDefaults(templateId: TemplateId): {
  colors: ProjectColors
  fonts: ProjectFonts
} {
  const tpl = getTemplate(templateId)
  return { colors: tpl.colors, fonts: tpl.fonts }
}

/**
 * Стартовое наполнение сайта.
 *
 * Изображения и композиция берутся из того же шаблона, что показан в каталоге,
 * поэтому созданный сайт выглядит так же, как превью. Раньше здесь стояли
 * контурные SVG-заглушки (пара, кольца, торт) — они и создавали расхождение.
 */
export function getDefaultBlocks(
  vars: Partial<import('@/types').SiteVariables> = {},
  template?: TemplateEntry,
): BlockData[] {
  const tpl = template ?? getTemplate('classic-luxury')
  const heroVariant = tpl.heroVariant

  // Тональные подложки в палитре шаблона — те же, что в превью каталога
  const heroImage = templateImage(tpl, 0)
  const softImage = (seed: number) => toneBackdrop(tpl.colors, seed, false)

  const bride = vars.bride || tpl.demo.bride
  const groom = vars.groom || tpl.demo.groom
  const weddingDate = vars.date || tpl.demo.date
  const time = vars.time || tpl.demo.time
  const venue = vars.venue || 'Grand Palace Hotel'
  const address = vars.address || 'ул. Достык 1, Алматы'
  const mapUrl = vars.mapUrl || vars.coords || 'https://maps.google.com'
  const dresscode = vars.dresscode || 'Вечерний наряд'
  const phone = vars.contactPhone || '+7 777 123 4567'

  return [
    {
      id: 'hero',
      type: 'hero',
      enabled: true,
      order: 0,
      content: {
        variant: heroVariant,
        bride,
        groom,
        date: weddingDate,
        time,
        tagline: tpl.demo.tagline,
        backgroundImage: heroImage,
        // Коллажный первый экран использует три кадра
        image2: heroImage ? softImage(3) : '',
        image3: heroImage ? softImage(7) : '',
      },
    },
    {
      id: 'story',
      type: 'story',
      enabled: true,
      order: 1,
      content: {
        variant: '1',
        title: 'Наша история',
        text: 'Мы встретились случайно, но поняли — это судьба. С тех пор каждый день с тобой — это подарок.',
        image: softImage(2),
        meetDate: '12 мая 2022',
        proposeDate: '14 февраля 2024',
      },
    },
    {
      id: 'gallery',
      type: 'gallery',
      enabled: true,
      order: 2,
      content: {
        variant: 'masonry',
        title: 'Наши моменты',
        images: JSON.stringify([softImage(1), softImage(4), softImage(6), softImage(9)]),
      },
    },
    {
      id: 'timer',
      type: 'timer',
      enabled: true,
      order: 3,
      content: {
        title: 'До нашей свадьбы',
        date: weddingDate,
      },
    },
    {
      id: 'location',
      type: 'location',
      enabled: true,
      order: 4,
      content: {
        variant: '1',
        title: 'Место проведения',
        venue,
        address,
        mapUrl,
        coords: vars.coords || '',
        dresscode,
        note: 'Просим прибыть за 30 минут до начала церемонии',
      },
    },
    {
      id: 'rsvp',
      type: 'rsvp',
      enabled: true,
      order: 5,
      content: {
        variant: '1',
        title: 'Подтвердите присутствие',
        subtitle: 'Пожалуйста, ответьте до 1 июня 2026',
        phone,
      },
    },
    {
      id: 'footer',
      type: 'footer',
      enabled: true,
      order: 6,
      content: {
        variant: '1',
        names: `${bride} & ${groom}`,
        date: `${String(new Date(weddingDate).getDate()).padStart(2, '0')}.${String(new Date(weddingDate).getMonth() + 1).padStart(2, '0')}.${new Date(weddingDate).getFullYear()}`,
        thanks: 'Спасибо, что вы с нами',
        hashtag: '',
        instagram: vars.instagram || '',
        telegram: vars.telegram || '',
        whatsapp: vars.whatsapp || '',
      },
    },
  ]
}

/**
 * Минимальный старт — «собрать самостоятельно».
 * Только главный экран и подвал: остальное пользователь добавляет
 * из библиотеки блоков редактора.
 */
export function getBlankBlocks(
  vars: Partial<import('@/types').SiteVariables> = {},
  template?: TemplateEntry,
): BlockData[] {
  const full = getDefaultBlocks(vars, template)
  const keep = new Set(['hero', 'footer'])
  return full
    .filter((b) => keep.has(b.id))
    .map((b, i) => ({ ...b, order: i }))
}

export function getDefaultMusic(): ProjectMusic {
  return {
    url: null,
    autoplay: false,
    title: '',
  }
}

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ')
}
