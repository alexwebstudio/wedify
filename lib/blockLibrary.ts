import type { BlockData, BlockType } from '@/types'
import { weddingPlaceholder, PH } from './placeholders'

export type BlockCategory =
  | 'hero' | 'story' | 'timing' | 'location' | 'rsvp' | 'gallery' | 'info' | 'footer' | 'divider' | 'premium'

export type PreviewKind = 'photo' | 'text' | 'timeline' | 'map' | 'form' | 'grid' | 'video' | 'info' | 'footer'

export type LayoutKind =
  | 'hero-center' | 'hero-split-r' | 'hero-split-l' | 'hero-full' | 'hero-minimal'
  | 'hero-luxury' | 'hero-timer' | 'hero-envelope' | 'hero-collage'
  | 'story-right' | 'story-left' | 'story-stack' | 'story-cards' | 'story-editorial'
  | 'tl-vertical' | 'tl-horizontal' | 'tl-cards' | 'tl-circular' | 'tl-connected' | 'tl-minimal'
  | 'map-split' | 'map-stack' | 'info'
  | 'form' | 'form-card' | 'form-split' | 'form-glass' | 'form-full' | 'form-min'
  | 'grid' | 'masonry' | 'strip' | 'video'
  | 'footer-center' | 'footer-dark' | 'footer-ornament' | 'footer-date'
  | 'curtains' | 'preloader' | 'envelope' | 'dresscode' | 'custom' | 'loc-card' | 'cinematic' | 'divider'

export interface CatalogItem {
  id: string
  category: BlockCategory
  name: string
  desc: string
  type: BlockType
  preview: PreviewKind
  layout: LayoutKind
  premium?: boolean
  content: BlockData['content']
}

export const CATEGORIES: { id: BlockCategory; label: string; icon: string }[] = [
  { id: 'hero',     label: 'Главный экран', icon: '✨' },
  { id: 'story',    label: 'История',       icon: '💫' },
  { id: 'timing',   label: 'Тайминг',       icon: '⏱' },
  { id: 'location', label: 'Локация',       icon: '📍' },
  { id: 'rsvp',     label: 'RSVP',          icon: '💌' },
  { id: 'gallery',  label: 'Галерея',       icon: '📸' },
  { id: 'info',     label: 'Информация',    icon: 'ℹ️' },
  { id: 'footer',   label: 'Footer',        icon: '🌹' },
  { id: 'divider',  label: 'Разделители',   icon: '➰' },
  { id: 'premium',  label: 'Premium',       icon: '👑' },
]

const IMG = {
  couple1: weddingPlaceholder('couple', { w: 1600, h: 1000, tone: 0 }),
  couple2: weddingPlaceholder('flowers', { w: 1600, h: 1000, tone: 1 }),
  couple3: weddingPlaceholder('venue', { w: 1600, h: 1000, tone: 3 }),
  couple4: weddingPlaceholder('decor', { w: 1600, h: 1000, tone: 2 }),
  couple5: weddingPlaceholder('rings', { w: 1600, h: 1000, tone: 5 }),
  portrait1: weddingPlaceholder('couple', { w: 1000, h: 1300, tone: 0 }),
  portrait2: weddingPlaceholder('portrait', { w: 1000, h: 1300, tone: 1 }),
  story1: PH.storyPortrait(0),
  story2: PH.storyPortrait(1),
}

const sched = (items: { time: string; title: string; desc: string }[]) => JSON.stringify(items)
const gal = (imgs: string[]) => JSON.stringify(imgs)
const DAY = [
  { time: '15:30', title: 'Сбор гостей', desc: 'Welcome-зона и напитки' },
  { time: '16:00', title: 'Церемония', desc: 'Торжественная регистрация' },
  { time: '17:00', title: 'Фуршет', desc: 'Поздравления и фото' },
  { time: '18:30', title: 'Банкет', desc: 'Ужин, тосты и танцы' },
]

export const BLOCK_CATALOG: CatalogItem[] = [
  // ── Hero ──
  { id: 'hero-classic', category: 'hero', name: 'Классический', desc: 'Имена по центру на фоне фото', type: 'hero', preview: 'photo', layout: 'hero-center',
    content: { variant: '1', bride: 'Айгерім', groom: 'Дамир', date: '', time: '16:00', tagline: 'Приглашаем вас разделить с нами этот особенный день', backgroundImage: IMG.couple1 } },
  { id: 'hero-split-right', category: 'hero', name: 'Фото справа', desc: 'Текст слева, фотография справа', type: 'hero', preview: 'photo', layout: 'hero-split-r',
    content: { variant: '2', bride: 'Айгерім', groom: 'Дамир', date: '', time: '16:00', tagline: 'Мы женимся и хотим разделить это с вами', backgroundImage: IMG.portrait1 } },
  { id: 'hero-split-left', category: 'hero', name: 'Фото слева', desc: 'Фотография слева, текст справа', type: 'hero', preview: 'photo', layout: 'hero-split-l',
    content: { variant: '3', bride: 'Айгерім', groom: 'Дамир', date: '', time: '16:00', tagline: 'Начало нашей общей истории', backgroundImage: IMG.portrait2 } },
  { id: 'hero-photo', category: 'hero', name: 'Фото на весь экран', desc: 'Крупный кадр, подпись снизу', type: 'hero', preview: 'photo', layout: 'hero-full',
    content: { variant: '4', bride: 'Айгерім', groom: 'Дамир', date: '', time: '16:00', tagline: 'Наш день начинается здесь', backgroundImage: IMG.couple2 } },
  { id: 'hero-minimal', category: 'hero', name: 'Минимализм', desc: 'Чистый экран без фото', type: 'hero', preview: 'text', layout: 'hero-minimal',
    content: { variant: '5', bride: 'Айгерім', groom: 'Дамир', date: '', time: '16:00', tagline: 'Мы женимся', backgroundImage: '' } },
  { id: 'hero-timer', category: 'hero', name: 'С таймером', desc: 'Имена и обратный отсчёт', type: 'hero', preview: 'photo', layout: 'hero-timer',
    content: { variant: '7', bride: 'Айгерім', groom: 'Дамир', date: '', time: '16:00', tagline: 'Совсем скоро мы скажем «да»', backgroundImage: IMG.couple4 } },
  { id: 'hero-collage', category: 'hero', name: 'Коллаж', desc: 'Несколько кадров и имена', type: 'hero', preview: 'photo', layout: 'hero-collage',
    content: { variant: '9', bride: 'Айгерім', groom: 'Дамир', date: '', time: '16:00', tagline: 'Каждый момент — про нас', backgroundImage: IMG.couple1, image2: IMG.couple2, image3: IMG.couple4 } },

  // ── История ──
  { id: 'story-love', category: 'story', name: 'Две колонки · фото справа', desc: 'Текст слева, фото справа', type: 'story', preview: 'text', layout: 'story-right',
    content: { variant: '1', title: 'История любви', text: 'Мы встретились случайно, но поняли — это судьба. С тех пор каждый день вместе дороже предыдущего.', image: IMG.story1, meetDate: '12 мая 2022', proposeDate: '14 февраля 2024' } },
  { id: 'story-meet', category: 'story', name: 'Две колонки · фото слева', desc: 'Фото слева, текст справа', type: 'story', preview: 'text', layout: 'story-left',
    content: { variant: '2', title: 'Как мы познакомились', text: 'Один взгляд — и стало ясно, что это надолго. Мы часто вспоминаем тот самый вечер.', image: IMG.story2, meetDate: '12 мая 2022', proposeDate: '' } },
  { id: 'story-propose', category: 'story', name: 'Вертикальный рассказ', desc: 'Фото сверху, текст по центру', type: 'story', preview: 'text', layout: 'story-stack',
    content: { variant: '3', title: 'Предложение', text: 'Он опустился на колено там, где мы впервые сказали о своих чувствах. Это было идеально.', image: IMG.story1, meetDate: '', proposeDate: '14 февраля 2024' } },
  { id: 'story-cards', category: 'story', name: 'Карточки-вехи', desc: 'Рассказ и три карточки дат', type: 'story', preview: 'text', layout: 'story-cards',
    content: { variant: 'cards', title: 'Наша история', text: 'От первой встречи до этого дня — целая жизнь маленьких моментов, которые привели нас к главному.', image: IMG.story2, meetDate: '12 мая 2022', proposeDate: '14 февраля 2024' } },
  { id: 'story-editorial', category: 'story', name: 'Editorial', desc: 'Журнальная вёрстка', type: 'story', preview: 'text', layout: 'story-editorial',
    content: { variant: 'editorial', title: 'Наша история', text: 'Кофе, который затянулся на пять часов, и разговор, который не хотелось прерывать. Так мы поняли — это оно.', image: IMG.story1, meetDate: '12 мая 2022', proposeDate: '14 февраля 2024' } },

  // ── Тайминг ──
  { id: 'tl-vertical', category: 'timing', name: 'Вертикальный', desc: 'Классический timeline с линией', type: 'schedule', preview: 'timeline', layout: 'tl-vertical',
    content: { variant: 'vertical', title: 'Расписание дня', subtitle: '', items: sched(DAY) } },
  { id: 'tl-horizontal', category: 'timing', name: 'Горизонтальный', desc: 'Лента карточек по времени', type: 'schedule', preview: 'timeline', layout: 'tl-horizontal',
    content: { variant: 'horizontal', title: 'Программа', subtitle: '', items: sched(DAY) } },
  { id: 'tl-cards', category: 'timing', name: 'Карточки', desc: 'Сетка карточек этапов', type: 'schedule', preview: 'timeline', layout: 'tl-cards',
    content: { variant: 'cards', title: 'Этапы дня', subtitle: '', items: sched(DAY) } },
  { id: 'tl-circular', category: 'timing', name: 'Круглая шкала', desc: 'Время в кругах', type: 'schedule', preview: 'timeline', layout: 'tl-circular',
    content: { variant: 'circular', title: 'Тайминг', subtitle: '', items: sched(DAY) } },
  { id: 'tl-connected', category: 'timing', name: 'Соединённые линии', desc: 'Зигзаг вдоль центральной оси', type: 'schedule', preview: 'timeline', layout: 'tl-connected',
    content: { variant: 'connected', title: 'Программа вечера', subtitle: 'Чтобы вы ничего не пропустили', items: sched(DAY) } },
  { id: 'tl-minimal', category: 'timing', name: 'Минимал', desc: 'Простой список время — событие', type: 'schedule', preview: 'timeline', layout: 'tl-minimal',
    content: { variant: 'minimal', title: 'Расписание', subtitle: '', items: sched(DAY) } },

  // ── Локация ──
  { id: 'loc-map', category: 'location', name: 'Карта · сплит', desc: 'Карта слева, детали справа', type: 'location', preview: 'map', layout: 'map-split',
    content: { variant: '1', title: 'Место проведения', venue: 'Grand Palace Hotel', address: 'ул. Достык 1, Алматы', mapUrl: 'https://maps.google.com', dresscode: 'Вечерний наряд', note: '' } },
  { id: 'loc-address', category: 'location', name: 'Адрес · по центру', desc: 'Крупный адрес и кнопка карты', type: 'location', preview: 'map', layout: 'map-stack',
    content: { variant: '2', title: 'Где нас найти', venue: 'Ресторан «Астана»', address: 'пр. Абая 25, Караганда', mapUrl: 'https://maps.google.com', dresscode: '', note: 'Просим прибыть за 30 минут до начала' } },
  { id: 'loc-parking', category: 'location', name: 'Парковка', desc: 'Информация о парковке', type: 'infocard', preview: 'info', layout: 'info',
    content: { icon: '🅿️', title: 'Парковка', text: 'Для гостей доступна бесплатная охраняемая парковка прямо у входа.', note: '' } },
  { id: 'loc-card', category: 'location', name: 'Карточка места', desc: 'Иллюстрация, адрес и кнопка карты', type: 'location', preview: 'map', layout: 'loc-card',
    content: { variant: '3', title: 'Место проведения', venue: 'Ресторан «Астана»', address: 'пр. Абая 25, Караганда', mapUrl: 'https://maps.google.com', dresscode: '', note: '' } },

  // ── RSVP ──
  { id: 'rsvp-classic', category: 'rsvp', name: 'Классический', desc: 'Форма в мягкой карточке', type: 'rsvp', preview: 'form', layout: 'form',
    content: { variant: '1', title: 'Подтвердите присутствие', subtitle: 'Пожалуйста, ответьте до 1 июня', phone: '+7 777 123 4567' } },
  { id: 'rsvp-card', category: 'rsvp', name: 'Карточка', desc: 'Белая карточка с тенью', type: 'rsvp', preview: 'form', layout: 'form-card',
    content: { variant: 'card', title: 'Будете с нами?', subtitle: 'Подтвердите участие', phone: '+7 777 123 4567' } },
  { id: 'rsvp-minimal', category: 'rsvp', name: 'Минимализм', desc: 'Без карточки, только форма', type: 'rsvp', preview: 'form', layout: 'form-min',
    content: { variant: 'minimal', title: 'Ждём вашего ответа', subtitle: '', phone: '+7 777 123 4567' } },
  { id: 'rsvp-split', category: 'rsvp', name: 'Split layout', desc: 'Текст слева, форма справа', type: 'rsvp', preview: 'form', layout: 'form-split',
    content: { variant: 'split', title: 'Подтверждение', subtitle: 'Ответьте, пожалуйста', phone: '+7 777 123 4567' } },
  { id: 'rsvp-glass', category: 'rsvp', name: 'Стеклянная карточка', desc: 'Glassmorphism на градиенте', type: 'rsvp', preview: 'form', layout: 'form-glass',
    content: { variant: 'glass', title: 'Подтвердите присутствие', subtitle: 'Нам важен ваш ответ', phone: '+7 777 123 4567' } },
  { id: 'rsvp-full', category: 'rsvp', name: 'Полноэкранный', desc: 'Секция на весь экран', type: 'rsvp', preview: 'form', layout: 'form-full',
    content: { variant: 'fullscreen', title: 'Вы приглашены', subtitle: 'Подтвердите участие ниже', phone: '+7 777 123 4567' } },

  // ── Галерея ──
  { id: 'gal-slider', category: 'gallery', name: 'Лента', desc: 'Горизонтальная лента фото', type: 'gallery', preview: 'grid', layout: 'strip',
    content: { variant: 'strip', title: 'Наши моменты', images: gal([PH.galleryTile(0), PH.galleryTile(1), PH.galleryTile(2), PH.galleryTile(3)]) } },
  { id: 'gal-collage', category: 'gallery', name: 'Коллаж', desc: 'Мозаичная сетка', type: 'gallery', preview: 'grid', layout: 'masonry',
    content: { variant: 'masonry', title: 'Счастливые кадры', images: gal([PH.galleryTile(1), PH.galleryTile(2), PH.galleryTile(4), PH.galleryTile(0), PH.galleryTile(3)]) } },
  { id: 'gal-photos', category: 'gallery', name: 'Ровная сетка', desc: 'Простая галерея', type: 'gallery', preview: 'grid', layout: 'grid',
    content: { variant: 'grid', title: 'Фотографии', images: gal([PH.galleryTile(2), PH.galleryTile(0), PH.galleryTile(3), PH.galleryTile(5)]) } },
  { id: 'gal-video', category: 'gallery', name: 'Видео', desc: 'YouTube / Vimeo', type: 'video', preview: 'video', layout: 'video',
    content: { title: 'Наше видео', url: '' } },

  // ── Информация ──
  { id: 'info-dresscode', category: 'info', name: 'Дресс-код', desc: 'Пожелания к нарядам', type: 'infocard', preview: 'info', layout: 'info',
    content: { icon: '👗', title: 'Дресс-код', text: 'Будем благодарны, если поддержите палитру торжества — пастельные тона.', note: 'Просьба избегать белого' } },
  { id: 'info-gifts', category: 'info', name: 'Подарки', desc: 'Пожелания по подаркам', type: 'infocard', preview: 'info', layout: 'info',
    content: { icon: '🎁', title: 'Подарки', text: 'Ваше присутствие — уже лучший подарок. Будем признательны вкладу в наше свадебное путешествие.', note: '' } },
  { id: 'info-contacts', category: 'info', name: 'Контакты', desc: 'С кем связаться', type: 'infocard', preview: 'info', layout: 'info',
    content: { icon: '📞', title: 'Контакты', text: 'По всем вопросам свяжитесь с нашими организаторами.', note: 'Салтанат · +7 777 000 00 00' } },
  { id: 'info-thanks', category: 'info', name: 'Благодарность', desc: 'Тёплые слова гостям', type: 'infocard', preview: 'info', layout: 'info',
    content: { icon: '🙏', title: 'Спасибо', text: 'Спасибо, что будете рядом в этот важный день. Ваше присутствие сделает его особенным.', note: '' } },
  { id: 'block-dresscode', category: 'info', name: 'Дресс-код (палитра)', desc: 'Иллюстрация, палитра, рекомендации', type: 'dresscode', preview: 'info', layout: 'dresscode',
    content: { title: 'Дресс-код торжества', description: 'Поддержите палитру нашего праздника в своих нарядах.', recommendations: 'Дамы — вечерние платья в тёплых тонах. Господа — костюмы бежевой и коричневой гаммы. Просьба избегать белого.', palette: JSON.stringify(['#E8DED2', '#C9B79C', '#8B6F47', '#5A4A3A', '#2C2017']) } },
  { id: 'block-custom', category: 'info', name: 'Свой блок (Custom)', desc: 'Гибкий блок: текст, фото, фон, ширина', type: 'custom', preview: 'text', layout: 'custom',
    content: { title: 'Свой блок', text: 'Настройте расположение текста и фото, фон, отступы, ширину и порядок элементов.', layout: 'split', align: 'left', paddingY: 'md', maxWidth: 'normal' } },

  // ── Footer ──
  { id: 'footer-minimal', category: 'footer', name: 'Футер · Минимал', desc: 'Имена, дата, благодарность', type: 'footer', preview: 'footer', layout: 'footer-center',
    content: { variant: '1', names: 'Айгерім & Дамир', date: '15.08.2026', thanks: 'Спасибо, что вы с нами', hashtag: '' } },
  { id: 'footer-accent', category: 'footer', name: 'Футер · Акцент', desc: 'Тёмная акцентная полоса', type: 'footer', preview: 'footer', layout: 'footer-dark',
    content: { variant: '2', names: 'Айгерім & Дамир', date: '15.08.2026', thanks: 'С любовью, молодожёны', hashtag: '' } },
  { id: 'footer-ornament', category: 'footer', name: 'Футер · Орнамент', desc: 'Орнамент и хэштег', type: 'footer', preview: 'footer', layout: 'footer-ornament',
    content: { variant: '3', names: 'Айгерім & Дамир', date: '15.08.2026', thanks: '', hashtag: '#АйгерімИДамир2026' } },
  { id: 'footer-date', category: 'footer', name: 'Футер · Дата', desc: 'Крупная дата, двухцветный', type: 'footer', preview: 'footer', layout: 'footer-date',
    content: { variant: '4', names: 'Айгерім & Дамир', date: '15.08.2026', thanks: 'До встречи на празднике', hashtag: '' } },

  // ── Разделители ──
  { id: 'div-1', category: 'divider', name: 'Ромб на линии', desc: 'Линия с ромбом по центру', type: 'divider', preview: 'text', layout: 'divider',
    content: { variant: '1', useAccent: false, padY: 44 } },
  { id: 'div-2', category: 'divider', name: 'Ботаника', desc: 'Тонкий росток между линиями', type: 'divider', preview: 'text', layout: 'divider',
    content: { variant: '2', useAccent: true, padY: 44 } },
  { id: 'div-3', category: 'divider', name: 'Двойная линия', desc: 'Двойная линия с ромбом', type: 'divider', preview: 'text', layout: 'divider',
    content: { variant: '3', useAccent: false, padY: 44 } },
  { id: 'div-4', category: 'divider', name: 'Флориш', desc: 'Волнистый узор с точкой', type: 'divider', preview: 'text', layout: 'divider',
    content: { variant: '4', useAccent: true, padY: 44 } },

  // ── Premium ──
  { id: 'prem-preloader', category: 'premium', name: 'Premium Preloader', desc: 'Полноэкранное вступление 0→100, затем автопереход', type: 'preloader', preview: 'text', layout: 'preloader', premium: true,
    content: { names: 'Айгерім & Дамир', subtitle: 'Приглашение на свадьбу' } },
  { id: 'prem-envelope', category: 'premium', name: 'Открывающийся конверт', desc: 'Полноэкранное видео-приглашение с открытием', type: 'envelope', preview: 'video', layout: 'envelope', premium: true,
    content: { names: 'Айгерім & Дамир', date: '', note: '', video: '/premium/envelope.mp4' } },
  { id: 'prem-curtains', category: 'premium', name: 'Шторки (Hero)', desc: 'Полноэкранный занавес, раскрывается по кнопке', type: 'curtains', preview: 'photo', layout: 'curtains', premium: true,
    content: { label: 'Добро пожаловать', names: 'Айгерім & Дамир', date: '', message: '', backgroundImage: IMG.couple1 } },
  { id: 'prem-cinematic', category: 'premium', name: 'Cinematic Hero', desc: 'Кинематографичный полноэкранный герой', type: 'hero', preview: 'photo', layout: 'cinematic', premium: true,
    content: { variant: 'cinematic', bride: 'Айгерім', groom: 'Дамир', date: '', time: '17:00', tagline: 'История, которую мы будем рассказывать всю жизнь', backgroundImage: IMG.couple3 } },
  { id: 'prem-gallery', category: 'premium', name: 'Premium Gallery', desc: 'Разноразмерная сетка, hover и lightbox', type: 'gallery', preview: 'grid', layout: 'masonry', premium: true,
    content: { variant: 'premium', title: 'Галерея', images: gal([PH.galleryTile(0), PH.galleryTile(3), PH.galleryTile(1), PH.galleryTile(4), PH.galleryTile(2), PH.galleryTile(5)]) } },
]

export function makeBlockFromCatalog(item: CatalogItem, order: number): BlockData {
  const uid = typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `${item.type}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
  return { id: `${item.type}-${uid}`, type: item.type, enabled: true, order, content: structuredClone(item.content) }
}

export const CATALOG_COUNT = BLOCK_CATALOG.length
