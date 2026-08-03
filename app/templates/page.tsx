import type { Metadata } from 'next'
import { pageMetadata } from '@/lib/seo'
import TemplatesPageClient from './TemplatesPageClient'

// Страница разделена на серверную обёртку с метаданными и клиентскую часть:
// клиентские компоненты не могут экспортировать metadata, поэтому раньше
// эта страница наследовала title и description главной.
export const metadata: Metadata = pageMetadata({
  title: 'Шаблоны свадебных сайтов-приглашений',
  description:
    'Шесть готовых шаблонов свадебного сайта: минимализм, editorial, свадьба на природе, классика, вечернее торжество и камерный формат. В карточке — живое превью первого экрана.',
  path: '/templates',
})

export default function Page() {
  return <TemplatesPageClient />
}
