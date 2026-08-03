import type { Metadata } from 'next'
import { pageMetadata } from '@/lib/seo'
import PricingPageClient from './PricingPageClient'

export const metadata: Metadata = pageMetadata({
  title: 'Тарифы на свадебный сайт-приглашение',
  description:
    'Сейчас конструктор свадебных сайтов Maruno бесплатный. Платные тарифы появятся позже: разовая покупка без подписок и ежемесячных списаний.',
  path: '/pricing',
})

export default function Page() {
  return <PricingPageClient />
}
