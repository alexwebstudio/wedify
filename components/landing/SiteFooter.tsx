'use client'

const WEDIFY_URL = 'https://wedify.kz'
const STUDIO_URL = 'https://alexweb.studio'

export function SiteFooter() {
  return (
    <footer style={{ padding: '52px 20px 32px', background: '#0C0A07', borderTop: '1px solid rgba(196,169,125,.1)' }}>
      <div style={{ maxWidth: 960, margin: '0 auto' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24, alignItems: 'center', textAlign: 'center' }}>
          <div>
            <a href={WEDIFY_URL} target="_blank" rel="noopener noreferrer" style={{ fontFamily: 'Comfortaa, Cormorant Garamond, cursive', fontSize: 22, color: '#fff', fontWeight: 300, textDecoration: 'none' }}>Wedify</a>
            <p style={{ color: 'rgba(255,255,255,.24)', fontSize: 12, marginTop: 4 }}>Конструктор свадебных сайтов</p>
          </div>

          <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', justifyContent: 'center' }}>
            {[
              { href: '/blog', label: 'Полезные советы' },
              { href: '/pricing', label: 'Тарифы' },
              { href: '/#reviews', label: 'Отзывы' },
              { href: '/privacy', label: 'Конфиденциальность' },
              { href: '/terms', label: 'Условия' },
            ].map((l) => (
              <a key={l.label} href={l.href} style={{ color: 'rgba(255,255,255,.42)', fontSize: 13, textDecoration: 'none' }}>{l.label}</a>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <p style={{ color: 'rgba(255,255,255,.24)', fontSize: 12, marginRight: 4 }}>Нужна помощь?</p>
            <a href="https://t.me/sanyamaster200" target="_blank" rel="noopener noreferrer" style={{ width: 40, height: 40, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.08)' }}>
              <svg width="18" height="18" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8l-1.68 7.92c-.12.56-.44.7-.9.44l-2.5-1.84-1.2 1.16c-.13.13-.24.24-.5.24l.18-2.56 4.62-4.17c.2-.18-.04-.28-.31-.1L7.86 13.8l-2.46-.76c-.53-.17-.54-.53.11-.78l9.62-3.71c.44-.16.83.11.51.25z" fill="#C4A97D"/></svg>
            </a>
            <a href="https://api.whatsapp.com/send/?phone=77780824759&text&type=phone_number&app_absent=0" target="_blank" rel="noopener noreferrer" style={{ width: 40, height: 40, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.08)' }}>
              <svg width="18" height="18" viewBox="0 0 24 24"><path d="M17.47 6.53A7.87 7.87 0 0 0 12 4.25C7.73 4.25 4.25 7.73 4.25 12c0 1.37.36 2.7 1.03 3.87L4.25 19.75l3.98-.98A7.87 7.87 0 0 0 12 19.75c4.27 0 7.75-3.48 7.75-7.75 0-2.07-.8-4.01-2.28-5.47zm-5.47 11.94c-1.16 0-2.3-.31-3.3-.9l-.24-.14-2.36.58.6-2.3-.16-.25a6.55 6.55 0 0 1-1-3.46c0-3.62 2.95-6.57 6.57-6.57 1.75 0 3.4.68 4.64 1.93a6.52 6.52 0 0 1 1.93 4.64c-.01 3.62-2.96 6.57-6.58 6.57zm3.6-4.92c-.2-.1-1.17-.57-1.35-.64-.18-.07-.32-.1-.45.1-.13.2-.52.64-.63.77-.12.13-.23.14-.43.05-.2-.1-.84-.31-1.6-.99-.59-.52-.99-1.17-1.1-1.37-.12-.2-.01-.31.09-.4l.39-.45c.13-.15.17-.25.25-.42.08-.17.04-.32-.02-.45-.06-.13-.45-1.09-.62-1.49-.16-.39-.33-.33-.45-.34H8.8c-.13 0-.35.05-.53.25-.18.2-.7.68-.7 1.67s.72 1.93.82 2.07c.1.13 1.42 2.17 3.44 3.04.48.21.85.33 1.14.42.48.15.92.13 1.26.08.38-.06 1.17-.48 1.34-.94.16-.46.16-.86.11-.94-.05-.09-.18-.14-.38-.23z" fill="#C4A97D"/></svg>
            </a>
            <a href="https://www.instagram.com/alexweb.studio/" target="_blank" rel="noopener noreferrer" style={{ width: 40, height: 40, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.08)' }}>
              <svg width="18" height="18" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" fill="#C4A97D"/></svg>
            </a>
          </div>

          <p style={{ color: 'rgba(255,255,255,.2)', fontSize: 11 }}>
            © 2026{' '}
            <a href={WEDIFY_URL} target="_blank" rel="noopener noreferrer" style={{ color: 'rgba(255,255,255,.38)', textDecoration: 'none' }}>Wedify</a>
            {' '}· Разработано веб-студией{' '}
            <a href={STUDIO_URL} target="_blank" rel="noopener noreferrer" style={{ color: 'rgba(196,169,125,.65)', textDecoration: 'none' }}>AlexWebStudio</a>
          </p>
        </div>
      </div>
    </footer>
  )
}
