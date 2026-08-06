import type { Metadata } from 'next'
import { pageMetadata } from '@/lib/seo'
import RegisterClient from './RegisterClient'

// Служебная страница — из индекса закрыта
export const metadata: Metadata = pageMetadata({
  title: 'Регистрация',
  description: 'Создание аккаунта в Maruno — конструкторе свадебных сайтов-приглашений.',
  path: '/auth/register',
  noindex: true,
})

export default function Page() {
  return <RegisterClient />
}
