'use client'
import { SiteFooter } from '@/components/landing/SiteFooter'

import Link from 'next/link'
import { Navbar } from '@/components/ui/Navbar'
import { ShieldAlert } from 'lucide-react'

const SECTIONS = [
  {
    h: '1. Использование сервиса',
    p: 'Wedify предоставляет инструмент для создания свадебных сайтов-приглашений для личного использования. Регистрируясь, вы соглашаетесь с настоящими условиями.',
  },
  {
    h: '2. Личное использование',
    p: 'Сервис предназначен для создания приглашений на ваше собственное торжество. Вы можете создавать сайты, редактировать их и делиться личной ссылкой с гостями.',
  },
  {
    h: '3. Запрет коммерческого использования',
    danger: true,
    p: 'Строго запрещается использование сервиса в коммерческих целях, в том числе: перепродажа созданных на платформе сайтов третьим лицам, оказание платных услуг по созданию приглашений на базе Wedify под видом собственной студии, а также любое иное извлечение прибыли за счёт функциональности сервиса без письменного разрешения.',
  },
  {
    h: '4. Последствия нарушения',
    danger: true,
    p: 'При выявлении нарушения пункта 3 аккаунт блокируется без возможности разблокировки и без возврата средств. Созданные сайты могут быть удалены. Решение о блокировке принимается администрацией сервиса.',
  },
  {
    h: '5. Контент пользователя',
    p: 'Вы несёте ответственность за загружаемый контент (фото, тексты). Запрещено размещать материалы, нарушающие закон, права третьих лиц или содержащие оскорбления.',
  },
  {
    h: '6. Оплата',
    p: 'Платные тарифы приобретаются разово и действуют бессрочно для аккаунта (email), на который оформлена покупка. Передача доступа третьим лицам запрещена.',
  },
  {
    h: '7. Изменения условий',
    p: 'Администрация вправе обновлять настоящие условия. Актуальная версия всегда доступна на этой странице.',
  },
]

export default function TermsPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#FAF8F5' }}>
      <Navbar />
      <section style={{ padding: '110px 20px 80px' }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <p style={{ color: '#B8956A', fontSize: 11, letterSpacing: '.4em', textTransform: 'uppercase', marginBottom: 10 }}>Wedify</p>
          <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(2.2rem,5vw,3.2rem)', fontWeight: 300, color: '#1A1410', marginBottom: 40 }}>
            Условия использования
          </h1>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 26 }}>
            {SECTIONS.map((s) => (
              <div
                key={s.h}
                style={
                  s.danger
                    ? { padding: '20px 22px', borderRadius: 16, background: '#FCEEEA', border: '1px solid rgba(200,80,60,.25)' }
                    : undefined
                }
              >
                <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 22, fontWeight: 500, color: s.danger ? '#9A2E1E' : '#1A1410', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                  {s.danger && <ShieldAlert size={18} />}
                  {s.h}
                </h2>
                <p style={{ color: s.danger ? '#7A2A1E' : '#4A4038', fontSize: 15, lineHeight: 1.75 }}>{s.p}</p>
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
