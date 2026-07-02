import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from 'react-hot-toast'

export const metadata: Metadata = {
  title: 'Wedify — Конструктор свадебных сайтов',
  description: 'Создайте красивый свадебный сайт-приглашение. Выберите шаблон, заполните данные и получите готовую ссылку.',
  keywords: 'свадебный сайт, приглашение, wedding website, той сайты, wedify',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Comfortaa:wght@300;400;500;600;700&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500&family=Cinzel:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,500;0,700;1,400;1,500&family=Great+Vibes&family=Marck+Script&family=Manrope:wght@300;400;500;600&family=Tenor+Sans&family=Forum&family=Montserrat:wght@300;400;500;600&family=Lato:wght@300;400;700&family=Raleway:wght@300;400;500;600&family=Inter:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        {children}
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#1C1812',
              color: '#F0E8D8',
              border: '1px solid rgba(196,169,125,0.3)',
              borderRadius: '12px',
              fontFamily: 'Lato, sans-serif',
              fontSize: '14px',
            },
            success: {
              iconTheme: { primary: '#C4A97D', secondary: '#fff' },
            },
            error: {
              style: {
                background: '#2C1010',
                border: '1px solid rgba(220,80,80,0.3)',
              },
            },
          }}
        />
      </body>
    </html>
  )
}
