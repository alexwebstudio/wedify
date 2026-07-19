'use client'
import { SiteFooter } from '@/components/landing/SiteFooter'

import Link from 'next/link'
import { Navbar } from '@/components/ui/Navbar'

// ВНИМАНИЕ: это рабочий каркас. Финальный юридический текст
// Александр предоставит позже — заменить содержимое SECTIONS.
const SECTIONS = [
  {
    h: '1. Общие положения',
    p: 'Настоящая Политика конфиденциальности описывает, как сервис Maruno собирает, использует и защищает персональные данные пользователей. Используя сервис, вы соглашаетесь с условиями данной Политики.',
  },
  {
    h: '2. Какие данные мы собираем',
    p: 'Мы обрабатываем: email (при регистрации), содержимое созданных вами сайтов (имена, даты, фотографии, тексты), а также технические данные (тип устройства, действия в конструкторе) для улучшения сервиса.',
  },
  {
    h: '3. Как используются данные',
    p: 'Данные используются исключительно для работы сервиса: хранения ваших проектов, публикации сайтов по личной ссылке, отправки ответов гостей (RSVP) и уведомлений об обновлениях, если вы на них подписались.',
  },
  {
    h: '4. Хранение и защита',
    p: 'Данные хранятся на защищённых серверах Supabase. Доступ к вашим проектам есть только у вас через ваш аккаунт. Мы применяем разумные технические меры для защиты информации.',
  },
  {
    h: '5. Передача третьим лицам',
    p: 'Мы не продаём и не передаём ваши персональные данные третьим лицам, за исключением случаев, предусмотренных законодательством.',
  },
  {
    h: '6. Ваши права',
    p: 'Вы можете в любой момент отредактировать или удалить свои проекты и аккаунт. Для полного удаления данных свяжитесь с поддержкой.',
  },
  {
    h: '7. Контакты',
    p: 'По вопросам конфиденциальности пишите в Telegram: @sanyamaster200.',
  },
]

export default function PrivacyPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#FAF8F5' }}>
      <Navbar />
      <section style={{ padding: '110px 20px 80px' }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <p style={{ color: '#B8956A', fontSize: 11, letterSpacing: '.4em', textTransform: 'uppercase', marginBottom: 10 }}>Maruno</p>
          <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(2.2rem,5vw,3.2rem)', fontWeight: 300, color: '#1A1410', marginBottom: 8 }}>
            Политика конфиденциальности
          </h1>
          <p style={{ color: '#9A9188', fontSize: 13, marginBottom: 40 }}>Последнее обновление: черновик · финальная редакция готовится</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 26 }}>
            {SECTIONS.map((s) => (
              <div key={s.h}>
                <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 22, fontWeight: 500, color: '#1A1410', marginBottom: 8 }}>{s.h}</h2>
                <p style={{ color: '#4A4038', fontSize: 15, lineHeight: 1.75 }}>{s.p}</p>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 44 }}>
            <Link href="/" style={{ color: '#8B6F47', fontSize: 14, textDecoration: 'none' }}>← На главную</Link>
          </div>
        </div>
      </section>
      <SiteFooter />
    </div>
  )
}
