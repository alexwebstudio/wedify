import type { BlockData, Project, ProjectColors, ProjectFonts, ProjectMusic, TemplateId } from '@/types'

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

export function getTemplateDefaults(templateId: TemplateId): {
  colors: ProjectColors
  fonts: ProjectFonts
} {
  const templates: Record<TemplateId, { colors: ProjectColors; fonts: ProjectFonts }> = {
    'classic-luxury': {
      colors: {
        primary: '#C4A97D',
        secondary: '#8B6F47',
        accent: '#F5EDD6',
        background: '#FAF8F5',
        text: '#2C2017',
      },
      fonts: { heading: 'Cormorant Garamond', body: 'Lato' },
    },
    'minimal-white': {
      colors: {
        primary: '#1A1A1A',
        secondary: '#666666',
        accent: '#E8E0D8',
        background: '#FFFFFF',
        text: '#1A1A1A',
      },
      fonts: { heading: 'Playfair Display', body: 'Source Sans Pro' },
    },
    'dark-elegant': {
      colors: {
        primary: '#D4AF7A',
        secondary: '#A0896A',
        accent: '#3D3025',
        background: '#1C1812',
        text: '#F0E8D8',
      },
      fonts: { heading: 'Cinzel', body: 'Raleway' },
    },
    'sage-garden': {
      colors: {
        primary: '#7E8E6A',
        secondary: '#526044',
        accent: '#DDE4D2',
        background: '#F5F7F0',
        text: '#2D3520',
      },
      fonts: { heading: 'Playfair Display', body: 'Lato' },
    },
    'rose-blush': {
      colors: {
        primary: '#D4829A',
        secondary: '#A85C72',
        accent: '#FCF0F4',
        background: '#FFF8FA',
        text: '#2A1520',
      },
      fonts: { heading: 'Cormorant Garamond', body: 'Lato' },
    },
  }
  return templates[templateId] || templates['classic-luxury']
}

export function getDefaultBlocks(bride = 'Александр', groom = 'Мария', date = ''): BlockData[] {
  const weddingDate = date || new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

  return [
    {
      id: 'hero',
      type: 'hero',
      enabled: true,
      order: 0,
      content: {
        bride,
        groom,
        date: weddingDate,
        time: '16:00',
        tagline: 'Приглашаем вас разделить с нами этот особенный день',
        backgroundImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1600&q=80',
      },
    },
    {
      id: 'story',
      type: 'story',
      enabled: true,
      order: 1,
      content: {
        title: 'Наша история',
        text: 'Мы встретились случайно, но поняли — это судьба. С тех пор каждый день с тобой — это подарок.',
        image: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=1200&q=80',
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
        title: 'Наши моменты',
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80',
          'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800&q=80',
          'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&q=80',
          'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800&q=80',
        ]),
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
        title: 'Место проведения',
        venue: 'Grand Palace Hotel',
        address: 'ул. Достык 1, Алматы',
        mapUrl: 'https://maps.google.com',
        dresscode: 'Evening dress',
        note: 'Просим прибыть за 30 минут до начала церемонии',
      },
    },
    {
      id: 'rsvp',
      type: 'rsvp',
      enabled: true,
      order: 5,
      content: {
        title: 'Подтвердите присутствие',
        subtitle: 'Пожалуйста, ответьте до 1 июня 2026',
        phone: '+7 777 123 4567',
      },
    },
    {
      id: 'final',
      type: 'final',
      enabled: true,
      order: 6,
      content: {
        title: `${bride} & ${groom}`,
        message: 'Мы ждём вас с нетерпением и благодарны за то, что вы разделите с нами этот особенный день',
        date: weddingDate,
      },
    },
  ]
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
