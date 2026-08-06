import type { Metadata } from 'next'
import { pageMetadata } from '@/lib/seo'
import LoginClient from './LoginClient'

// Служебная страница — из индекса закрыта
export const metadata: Metadata = pageMetadata({
  title: 'Вход в личный кабинет',
  description: 'Вход в личный кабинет Maruno — конструктора свадебных сайтов-приглашений.',
  path: '/auth/login',
  noindex: true,
})

export default function Page() {
  return <LoginClient />
}
