import type { MetadataRoute } from 'next'
import { SITE_NAME } from '@/lib/seo'

/**
 * Web-манифест. Нужен, чтобы приглашение можно было добавить на домашний
 * экран телефона и чтобы браузер знал цвета интерфейса.
 *
 * display: 'standalone' не ставим намеренно — сервис живёт в браузере,
 * и полноэкранный режим только запутал бы возвратом назад.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_NAME,
    short_name: 'Maruno',
    description:
      'Конструктор свадебных сайтов-приглашений: выберите шаблон, впишите имена и дату, отправьте гостям ссылку.',
    lang: 'ru',
    start_url: '/',
    display: 'browser',
    background_color: '#FBF8F4',
    theme_color: '#4A1A22',
    icons: [
      { src: '/icon.svg', sizes: 'any', type: 'image/svg+xml' },
      { src: '/favicon.ico', sizes: '48x48', type: 'image/x-icon' },
    ],
  }
}
