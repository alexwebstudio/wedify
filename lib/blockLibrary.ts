import type { BlockData, BlockType } from '@/types'

export type BlockCategory =
  | 'hero' | 'story' | 'timing' | 'location' | 'rsvp' | 'gallery' | 'info' | 'footer'

export type PreviewKind = 'photo' | 'text' | 'timeline' | 'map' | 'form' | 'grid' | 'video' | 'info' | 'footer'

export interface CatalogItem {
  id: string
  category: BlockCategory
  name: string
  desc: string
  type: BlockType
  preview: PreviewKind
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
]

const IMG = {
  couple1: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1600&q=80',
  couple2: 'https://images.unsplash.com/photo-1523438885200-e635ba2c371e?w=1600&q=80',
  couple3: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=1600&q=80',
  couple4: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1600&q=80',
  couple5: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=1600&q=80',
  story1: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=1200&q=80',
  story2: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=1200&q=80',
}

const sched = (items: { time: string; title: string; desc: string }[]) => JSON.stringify(items)
const gal = (imgs: string[]) => JSON.stringify(imgs)

export const BLOCK_CATALOG: CatalogItem[] = [
  // ── Главный экран ──
  {
    id: 'hero-classic', category: 'hero', name: 'Hero Classic', desc: 'Имена, дата и приглашающая фраза', type: 'hero', preview: 'photo',
    content: { bride: 'Айгерим', groom: 'Дамир', date: '', time: '16:00', tagline: 'Приглашаем вас разделить с нами этот особенный день', backgroundImage: IMG.couple1 },
  },
  {
    id: 'hero-minimal', category: 'hero', name: 'Hero Minimal', desc: 'Чистый экран без фонового фото', type: 'hero', preview: 'text',
    content: { bride: 'Айгерим', groom: 'Дамир', date: '', time: '16:00', tagline: 'Мы женимся', backgroundImage: '' },
  },
  {
    id: 'hero-luxury', category: 'hero', name: 'Hero Luxury', desc: 'Кинематографичный тёмный кадр', type: 'hero', preview: 'photo',
    content: { bride: 'Айгерим', groom: 'Дамир', date: '', time: '17:00', tagline: 'С радостью приглашаем вас на нашу свадьбу', backgroundImage: IMG.couple3 },
  },
  {
    id: 'hero-photo', category: 'hero', name: 'Hero с большим фото', desc: 'Крупное фото пары на весь экран', type: 'hero', preview: 'photo',
    content: { bride: 'Айгерим', groom: 'Дамир', date: '', time: '16:00', tagline: 'Наш день начинается здесь', backgroundImage: IMG.couple2 },
  },
  {
    id: 'hero-timer', category: 'hero', name: 'Hero с таймером', desc: 'Экран с акцентом на обратный отсчёт', type: 'hero', preview: 'photo',
    content: { bride: 'Айгерим', groom: 'Дамир', date: '', time: '16:00', tagline: 'Совсем скоро мы скажем «да»', backgroundImage: IMG.couple4 },
  },
  {
    id: 'hero-envelope', category: 'hero', name: 'Hero с конвертом', desc: 'Приглашение в стиле открытого конверта', type: 'hero', preview: 'photo',
    content: { bride: 'Айгерим', groom: 'Дамир', date: '', time: '16:00', tagline: 'Вы приглашены на нашу свадьбу', backgroundImage: IMG.couple5 },
  },

  // ── История ──
  {
    id: 'story-love', category: 'story', name: 'История любви', desc: 'Тёплый рассказ о вашем пути', type: 'story', preview: 'text',
    content: { title: 'История любви', text: 'Мы встретились случайно, но поняли — это судьба. С тех пор каждый день вместе становится дороже предыдущего.', image: IMG.story1, meetDate: '12 мая 2022', proposeDate: '14 февраля 2024' },
  },
  {
    id: 'story-meet', category: 'story', name: 'Как познакомились', desc: 'С чего всё началось', type: 'story', preview: 'text',
    content: { title: 'Как мы познакомились', text: 'Один взгляд — и стало ясно, что это надолго. Мы часто вспоминаем тот самый вечер, когда всё началось.', image: IMG.story2, meetDate: '12 мая 2022', proposeDate: '' },
  },
  {
    id: 'story-propose', category: 'story', name: 'Предложение', desc: 'Момент, когда прозвучало «да»', type: 'story', preview: 'text',
    content: { title: 'Предложение', text: 'Он опустился на колено там, где мы впервые сказали друг другу о своих чувствах. И это было идеально.', image: IMG.story1, meetDate: '', proposeDate: '14 февраля 2024' },
  },
  {
    id: 'story-first', category: 'story', name: 'Первая встреча', desc: 'Ваше первое свидание', type: 'story', preview: 'text',
    content: { title: 'Наше первое свидание', text: 'Кофе, который затянулся на пять часов, и разговор, который не хотелось прерывать. Так мы поняли — это оно.', image: IMG.story2, meetDate: '', proposeDate: '' },
  },
  {
    id: 'story-our', category: 'story', name: 'Наша история', desc: 'Общий рассказ пары', type: 'story', preview: 'text',
    content: { title: 'Наша история', text: 'От первой встречи до этого дня — целая жизнь маленьких моментов, которые привели нас к самому главному.', image: IMG.story1, meetDate: '12 мая 2022', proposeDate: '14 февраля 2024' },
  },

  // ── Тайминг ──
  {
    id: 'sched-day', category: 'timing', name: 'Расписание дня', desc: 'Тайминг ключевых моментов', type: 'schedule', preview: 'timeline',
    content: { title: 'Расписание дня', subtitle: '', items: sched([
      { time: '15:30', title: 'Сбор гостей', desc: 'Welcome-зона, лёгкие закуски и напитки' },
      { time: '16:00', title: 'Церемония', desc: 'Начало торжественной части' },
      { time: '17:00', title: 'Фуршет', desc: 'Поздравления и фотосессия' },
      { time: '18:30', title: 'Банкет', desc: 'Ужин, тосты и танцы до утра' },
    ]) },
  },
  {
    id: 'sched-timeline', category: 'timing', name: 'Таймлайн', desc: 'Вертикальная лента событий', type: 'schedule', preview: 'timeline',
    content: { title: 'Программа вечера', subtitle: 'Чтобы вы ничего не пропустили', items: sched([
      { time: '16:00', title: 'Регистрация', desc: '' },
      { time: '18:00', title: 'Первый танец', desc: '' },
      { time: '20:00', title: 'Торт', desc: '' },
      { time: '22:00', title: 'Салют', desc: '' },
    ]) },
  },
  {
    id: 'sched-plan', category: 'timing', name: 'План мероприятия', desc: 'Крупные этапы дня', type: 'schedule', preview: 'timeline',
    content: { title: 'План мероприятия', subtitle: '', items: sched([
      { time: 'Часть 1', title: 'Церемония', desc: 'Официальная и выездная регистрация' },
      { time: 'Часть 2', title: 'Праздник', desc: 'Банкет, развлечения, живая музыка' },
    ]) },
  },
  {
    id: 'sched-stages', category: 'timing', name: 'Этапы свадьбы', desc: 'Красивые вехи торжества', type: 'schedule', preview: 'timeline',
    content: { title: 'Этапы свадьбы', subtitle: '', items: sched([
      { time: 'Утро', title: 'Сборы', desc: 'Подготовка и утренние кадры' },
      { time: 'День', title: 'Церемония', desc: 'Главный момент дня' },
      { time: 'Вечер', title: 'Банкет', desc: 'Праздничный ужин и танцы' },
      { time: 'Ночь', title: 'Афтепати', desc: 'Продолжение для самых близких' },
    ]) },
  },

  // ── Локация ──
  {
    id: 'loc-map', category: 'location', name: 'Карта', desc: 'Площадка с кнопкой на карту', type: 'location', preview: 'map',
    content: { title: 'Место проведения', venue: 'Grand Palace Hotel', address: 'ул. Достык 1, Алматы', mapUrl: 'https://maps.google.com', dresscode: '', note: '' },
  },
  {
    id: 'loc-address', category: 'location', name: 'Адрес', desc: 'Акцент на адресе и времени', type: 'location', preview: 'map',
    content: { title: 'Где нас найти', venue: 'Ресторан «Астана»', address: 'пр. Абая 25, Караганда', mapUrl: 'https://maps.google.com', dresscode: '', note: 'Просим прибыть за 30 минут до начала' },
  },
  {
    id: 'loc-parking', category: 'location', name: 'Парковка', desc: 'Информация о парковке', type: 'infocard', preview: 'info',
    content: { icon: '🅿️', title: 'Парковка', text: 'Для гостей доступна бесплатная охраняемая парковка прямо у входа. Мест хватит всем.', note: '' },
  },
  {
    id: 'loc-transfer', category: 'location', name: 'Трансфер', desc: 'Как добраться на площадку', type: 'infocard', preview: 'info',
    content: { icon: '🚌', title: 'Трансфер', text: 'От центра города будет организован трансфер. Автобус отправляется в 15:00 от главной площади.', note: 'Уточните место у организаторов' },
  },

  // ── RSVP ──
  {
    id: 'rsvp-confirm', category: 'rsvp', name: 'Подтверждение участия', desc: 'Классическая форма ответа', type: 'rsvp', preview: 'form',
    content: { title: 'Подтвердите присутствие', subtitle: 'Пожалуйста, ответьте до 1 июня', phone: '+7 777 123 4567' },
  },
  {
    id: 'rsvp-guests', category: 'rsvp', name: 'Количество гостей', desc: 'Форма с числом гостей', type: 'rsvp', preview: 'form',
    content: { title: 'Сколько вас будет?', subtitle: 'Укажите количество гостей в форме', phone: '+7 777 123 4567' },
  },
  {
    id: 'rsvp-comment', category: 'rsvp', name: 'Комментарий', desc: 'Форма с полем комментария', type: 'rsvp', preview: 'form',
    content: { title: 'Ждём вашего ответа', subtitle: 'Оставьте комментарий, если есть пожелания', phone: '+7 777 123 4567' },
  },
  {
    id: 'rsvp-wishes', category: 'rsvp', name: 'Пожелания', desc: 'Ответ и пожелания к меню', type: 'rsvp', preview: 'form',
    content: { title: 'Ваши пожелания', subtitle: 'Расскажите об аллергиях или предпочтениях в меню', phone: '+7 777 123 4567' },
  },

  // ── Галерея ──
  {
    id: 'gal-slider', category: 'gallery', name: 'Слайдер', desc: 'Фотографии в виде слайдера', type: 'gallery', preview: 'grid',
    content: { title: 'Наши моменты', images: gal([IMG.couple1, IMG.couple2, IMG.couple3, IMG.couple4]) },
  },
  {
    id: 'gal-collage', category: 'gallery', name: 'Коллаж', desc: 'Плотная сетка фотографий', type: 'gallery', preview: 'grid',
    content: { title: 'Счастливые кадры', images: gal([IMG.couple2, IMG.couple3, IMG.couple5, IMG.couple1, IMG.couple4]) },
  },
  {
    id: 'gal-video', category: 'gallery', name: 'Видео', desc: 'Встроенное видео YouTube / Vimeo', type: 'video', preview: 'video',
    content: { title: 'Наше видео', url: '' },
  },
  {
    id: 'gal-photos', category: 'gallery', name: 'Фотографии', desc: 'Простая галерея снимков', type: 'gallery', preview: 'grid',
    content: { title: 'Фотографии', images: gal([IMG.couple3, IMG.couple1, IMG.couple4]) },
  },

  // ── Информация ──
  {
    id: 'info-dresscode', category: 'info', name: 'Дресс-код', desc: 'Пожелания к нарядам гостей', type: 'infocard', preview: 'info',
    content: { icon: '👗', title: 'Дресс-код', text: 'Будем благодарны, если вы поддержите палитру торжества — пастельные и приглушённые тона.', note: 'Просьба избегать белого' },
  },
  {
    id: 'info-gifts', category: 'info', name: 'Подарки', desc: 'Пожелания по подаркам', type: 'infocard', preview: 'info',
    content: { icon: '🎁', title: 'Подарки', text: 'Ваше присутствие — уже лучший подарок. Если хотите порадовать нас, мы будем признательны вкладу в наше свадебное путешествие.', note: '' },
  },
  {
    id: 'info-contacts', category: 'info', name: 'Контакты', desc: 'С кем связаться по вопросам', type: 'infocard', preview: 'info',
    content: { icon: '📞', title: 'Контакты', text: 'По всем вопросам вы можете связаться с нашими организаторами.', note: 'Салтанат · +7 777 000 00 00' },
  },
  {
    id: 'info-organizers', category: 'info', name: 'Организаторы', desc: 'Команда торжества', type: 'infocard', preview: 'info',
    content: { icon: '💌', title: 'Организаторы', text: 'Наши свидетели и организаторы помогут вам сориентироваться в этот день. Не стесняйтесь обращаться.', note: '' },
  },
  {
    id: 'info-after', category: 'info', name: 'После свадьбы', desc: 'Афтепати и продолжение', type: 'infocard', preview: 'info',
    content: { icon: '🥂', title: 'После свадьбы', text: 'После банкета мы приглашаем самых близких продолжить вечер в тёплой компании.', note: '' },
  },
  {
    id: 'info-thanks', category: 'info', name: 'Благодарность', desc: 'Тёплые слова гостям', type: 'infocard', preview: 'info',
    content: { icon: '🙏', title: 'Спасибо', text: 'Спасибо, что будете рядом в этот важный для нас день. Ваше присутствие сделает его по-настоящему особенным.', note: '' },
  },

  // ── Footer ──
  {
    id: 'footer-minimal', category: 'footer', name: 'Футер · Минимал', desc: 'Имена, дата и благодарность', type: 'footer', preview: 'footer',
    content: { variant: '1', names: 'Айгерим & Дамир', date: '15.08.2026', thanks: 'Спасибо, что вы с нами', hashtag: '' },
  },
  {
    id: 'footer-accent', category: 'footer', name: 'Футер · Акцент', desc: 'Тёмная акцентная полоса', type: 'footer', preview: 'footer',
    content: { variant: '2', names: 'Айгерим & Дамир', date: '15.08.2026', thanks: 'С любовью, ваши молодожёны', hashtag: '' },
  },
  {
    id: 'footer-ornament', category: 'footer', name: 'Футер · Орнамент', desc: 'Орнамент и свадебный хэштег', type: 'footer', preview: 'footer',
    content: { variant: '3', names: 'Айгерим & Дамир', date: '15.08.2026', thanks: '', hashtag: '#АйгеримИДамир2026' },
  },
  {
    id: 'footer-date', category: 'footer', name: 'Футер · Дата', desc: 'Крупная дата, двухцветный', type: 'footer', preview: 'footer',
    content: { variant: '4', names: 'Айгерим & Дамир', date: '15.08.2026', thanks: 'До встречи на празднике', hashtag: '' },
  },
]

// Создаёт новый экземпляр блока из каталога (с уникальным id).
export function makeBlockFromCatalog(item: CatalogItem, order: number): BlockData {
  const uid =
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : `${item.type}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
  return {
    id: `${item.type}-${uid}`,
    type: item.type,
    enabled: true,
    order,
    content: structuredClone(item.content),
  }
}

export const CATALOG_COUNT = BLOCK_CATALOG.length
