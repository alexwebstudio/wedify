'use client'

import { Check } from 'lucide-react'
import toast from 'react-hot-toast'

interface Tier {
  id: 'free' | 'standard' | 'exclusive'
  name: string
  price: string
  period: string
  note: string
  featured?: boolean
  features: string[]
  cta: string
  // placeholder под будущую оплату (Kaspi / Robokassa / Stripe и т.д.)
  paymentReady: boolean
}

const TIERS: Tier[] = [
  {
    id: 'free',
    name: 'Бесплатно',
    price: '0 ₸',
    period: 'сейчас',
    note: 'Пока сервис бесплатный — пользуйтесь без ограничений',
    features: ['Базовые шаблоны', 'Своя ссылка', 'RSVP в Telegram', 'Публикация за минуты'],
    cta: 'Начать бесплатно',
    paymentReady: true,
  },
  {
    id: 'standard',
    name: 'Стандарт',
    price: '4 590 ₸',
    period: 'навсегда',
    note: 'Разовая покупка — доступ навсегда для этой почты',
    featured: true,
    features: [
      'Всё из бесплатного',
      'До 3 сайтов на аккаунт',
      'Расширенный выбор блоков',
      'Больше шрифтов и палитр',
      'Приоритетная поддержка',
    ],
    cta: 'Оформить Стандарт',
    paymentReady: false,
  },
  {
    id: 'exclusive',
    name: 'Эксклюзив',
    price: '7 990 ₸',
    period: 'навсегда',
    note: 'Разовая покупка — доступ навсегда для этой почты',
    features: [
      'Всё из Стандарта',
      'До 5 разных страниц',
      'Улучшенные премиум-блоки',
      'Прелоадер, шторки, конверт',
      'Ранний доступ к новинкам',
    ],
    cta: 'Оформить Эксклюзив',
    paymentReady: false,
  },
]

export default function Pricing() {
  // TODO(payment): здесь подключается платёжка.
  // Когда появится трафик — заменить toast на редирект в Kaspi/Robokassa/Stripe,
  // передавая tier.id и email пользователя. Проверка оплаты → выдача подписки.
  const handleBuy = (tier: Tier) => {
    if (tier.id === 'free') {
      window.location.href = '/auth/register'
      return
    }
    toast('Оплата подключается — скоро можно будет купить ♥', { icon: '⏳' })
  }

  return (
    <section id="pricing" data-anim="section" style={{ padding: '84px 20px', background: '#F7F5F2' }}>
      <div style={{ maxWidth: 1080, margin: '0 auto' }}>
        <div data-anim="fade" style={{ textAlign: 'center', marginBottom: 44 }}>
          <p style={{ color: '#B8956A', fontSize: 11, letterSpacing: '.4em', textTransform: 'uppercase', marginBottom: 10 }}>
            Тарифы
          </p>
          <h2
            style={{
              fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(2rem,4.5vw,3rem)',
              fontWeight: 300, color: '#1A1410', marginBottom: 8,
            }}
          >
            Просто и честно
          </h2>
          <p style={{ color: '#8A7F74', fontSize: 14, fontWeight: 300 }}>
            Сейчас всё бесплатно. Платные тарифы появятся позже — покупка разовая, доступ навсегда.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))',
            gap: 18,
            alignItems: 'stretch',
          }}
        >
          {TIERS.map((tier) => (
            <div
              key={tier.id}
              data-anim="card"
              style={{
                position: 'relative', display: 'flex', flexDirection: 'column', padding: '30px 26px',
                borderRadius: 24,
                background: tier.featured ? 'linear-gradient(160deg,#1A1410,#2A2018)' : '#fff',
                border: tier.featured ? '1px solid rgba(196,169,125,.35)' : '1px solid rgba(0,0,0,.06)',
                boxShadow: tier.featured ? '0 24px 60px rgba(0,0,0,.28)' : '0 8px 30px rgba(0,0,0,.05)',
              }}
            >
              {tier.featured && (
                <span
                  style={{
                    position: 'absolute', top: 18, right: 18, fontSize: 10, fontWeight: 700, letterSpacing: '.14em',
                    textTransform: 'uppercase', padding: '5px 12px', borderRadius: 100,
                    background: 'linear-gradient(135deg,#C4A97D,#8B6F47)', color: '#fff',
                  }}
                >
                  Популярный
                </span>
              )}

              <p style={{ color: tier.featured ? 'rgba(255,255,255,.85)' : '#1A1410', fontSize: 15, fontWeight: 600, marginBottom: 8 }}>
                {tier.name}
              </p>

              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 6 }}>
                <span
                  style={{
                    fontFamily: 'Cormorant Garamond, serif', fontSize: 40, fontWeight: 500, lineHeight: 1,
                    color: tier.featured ? '#E8D5B0' : '#1A1410',
                  }}
                >
                  {tier.price}
                </span>
                <span style={{ fontSize: 13, color: tier.featured ? 'rgba(255,255,255,.4)' : '#9A9188' }}>
                  / {tier.period}
                </span>
              </div>

              <p style={{ fontSize: 12.5, color: tier.featured ? 'rgba(255,255,255,.4)' : '#9A9188', marginBottom: 22, lineHeight: 1.5 }}>
                {tier.note}
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 11, marginBottom: 26, flex: 1 }}>
                {tier.features.map((f) => (
                  <div key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 9 }}>
                    <span
                      style={{
                        width: 18, height: 18, borderRadius: '50%', flexShrink: 0, marginTop: 1,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: tier.featured ? 'rgba(196,169,125,.18)' : 'rgba(196,169,125,.12)',
                      }}
                    >
                      <Check size={11} color="#C4A97D" />
                    </span>
                    <span style={{ fontSize: 13.5, lineHeight: 1.45, color: tier.featured ? 'rgba(255,255,255,.72)' : '#4A4038' }}>
                      {f}
                    </span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => handleBuy(tier)}
                className={tier.featured || tier.id === 'free' ? 'btn-luxury' : ''}
                style={{
                  width: '100%', padding: '13px 20px', borderRadius: 14, fontSize: 14, fontWeight: 500, cursor: 'pointer',
                  border: tier.featured || tier.id === 'free' ? 'none' : '1px solid rgba(196,169,125,.4)',
                  background: tier.featured || tier.id === 'free' ? undefined : 'transparent',
                  color: tier.featured || tier.id === 'free' ? '#fff' : '#8B6F47',
                }}
              >
                {tier.paymentReady ? tier.cta : `${tier.cta} · скоро`}
              </button>
            </div>
          ))}
        </div>

        <p data-anim="fade" style={{ textAlign: 'center', marginTop: 22, fontSize: 12, color: '#9A9188' }}>
          Оформляя платный тариф, вы принимаете{' '}
          <a href="/terms" style={{ color: '#8B6F47', textDecoration: 'underline' }}>условия использования</a>.
        </p>
      </div>
    </section>
  )
}
