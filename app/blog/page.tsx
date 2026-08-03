import type { Metadata } from 'next'
import { pageMetadata } from '@/lib/seo'
import BlogPageClient from './BlogPageClient'

// Серверная обёртка с метаданными: клиентские компоненты не могут
// экспортировать metadata, из-за чего страница наследовала title главной.
export const metadata: Metadata = pageMetadata({
  title: 'Как сделать свадебный сайт: гайды и советы',
  description: 'Пошаговые гайды по созданию свадебного сайта-приглашения, сбору ответов гостей и обновлениям сервиса Maruno.',
  path: '/blog',
})

export default function Page() {
  return <BlogPageClient />
}
