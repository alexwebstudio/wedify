import type { Metadata, Viewport } from 'next'
import { Prata, Onest, Caveat } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'
import SmoothScroll from '@/components/providers/SmoothScroll'
import { SITE_NAME, SITE_URL } from '@/lib/seo'

/**
 * Интерфейсные шрифты — ровно три, self-hosted через next/font.
 * Библиотека шрифтов для сайтов пользователей подключается отдельно
 * (components/providers/SiteFonts.tsx) и только там, где она нужна.
 */

// Дисплейная антиква с высоким контрастом штриха — заголовки и логотип.
const prata = Prata({
  weight: '400',
  subsets: ['latin', 'cyrillic', 'cyrillic-ext'],
  display: 'swap',
  variable: '--font-prata',
})

// Интерфейсный гротеск — навигация, текст, кнопки, формы.
const onest = Onest({
  subsets: ['latin', 'cyrillic', 'cyrillic-ext'],
  display: 'swap',
  variable: '--font-onest',
})

// Рукописный акцент — дозированно, одна фраза на экран.
const caveat = Caveat({
  subsets: ['latin', 'cyrillic', 'cyrillic-ext'],
  display: 'swap',
  variable: '--font-caveat',
})

const DESCRIPTION =
  'Конструктор свадебных сайтов-приглашений: выберите шаблон, впишите имена и дату, ' +
  'отправьте гостям личную ссылку и собирайте ответы в одном месте.'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Свадебные сайты-приглашения — конструктор Maruno',
    // Страницы задают свой заголовок, а бренд подставляется сюда
    template: '%s — Maruno Wedding',
  },
  description: DESCRIPTION,
  applicationName: SITE_NAME,
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    siteName: SITE_NAME,
    url: SITE_URL,
    title: 'Свадебные сайты-приглашения — конструктор Maruno',
    description: DESCRIPTION,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Свадебные сайты-приглашения — конструктор Maruno',
    description: DESCRIPTION,
  },
  robots: { index: true, follow: true },
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: '48x48' },
    ],
    apple: '/icon.svg',
  },
  manifest: '/manifest.webmanifest',
}

export const viewport: Viewport = {
  themeColor: '#FBF8F4',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru" className={`${prata.variable} ${onest.variable} ${caveat.variable}`}>
      <body className="antialiased">
        {/* Разметка для поисковых систем: что за сервис и кому принадлежит */}
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebApplication',
              name: SITE_NAME,
              url: SITE_URL,
              applicationCategory: 'DesignApplication',
              operatingSystem: 'Web',
              inLanguage: 'ru-RU',
              description: DESCRIPTION,
              offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'KZT',
                description: 'Базовый тариф — создание и публикация приглашения без оплаты',
              },
              publisher: {
                '@type': 'Organization',
                name: 'AlexWebStudio',
                url: 'https://alexwebstudio.ru',
              },
            }),
          }}
        />
        <SmoothScroll>{children}</SmoothScroll>
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#16130F',
              color: '#FBF8F4',
              border: '1px solid rgba(251,248,244,0.14)',
              borderRadius: '10px',
              fontFamily: 'var(--font-onest), system-ui, sans-serif',
              fontSize: '14px',
            },
            success: { iconTheme: { primary: '#D9C3A5', secondary: '#16130F' } },
            error: {
              style: { background: '#3A1219', border: '1px solid rgba(217,195,165,0.25)' },
            },
          }}
        />
      </body>
    </html>
  )
}
