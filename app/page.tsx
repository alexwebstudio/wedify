import type { Metadata } from 'next'
import { pageMetadata } from '@/lib/seo'
import LandingPage from '@/components/LandingPage'

export const metadata: Metadata = {
  ...pageMetadata({
    title: 'Свадебные сайты-приглашения — конструктор Maruno',
    description:
      'Создайте свадебный сайт-приглашение за вечер: выберите шаблон, впишите имена и дату, ' +
      'отправьте гостям личную ссылку и собирайте ответы в одном месте.',
    path: '/',
  }),
  // На главной бренд уже внутри заголовка — шаблон «%s — Maruno Wedding» не нужен
  title: {
    absolute: 'Свадебные сайты-приглашения — конструктор Maruno',
  },
}

export default function Page() {
  return <LandingPage />
}
