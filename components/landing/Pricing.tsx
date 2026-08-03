'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Check } from 'lucide-react'
import toast from 'react-hot-toast'
import { Reveal } from './Reveal'

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
    price: '3 590 ₸',
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
  const router = useRouter()

  // TODO(payment): здесь подключается платёжка.
  // Когда появится трафик — заменить toast на редирект в Kaspi/Robokassa/Stripe,
  // передавая tier.id и email пользователя. Проверка оплаты → выдача подписки.
  const handleBuy = (tier: Tier) => {
    if (tier.id === 'free') {
      router.push('/auth/register')
      return
    }
    toast('Оплата подключается — скоро можно будет купить')
  }

  return (
    <section id="pricing" className="mrn-section" style={{ background: 'var(--color-paper)' }}>
      {/* Заголовок раздела живёт на странице /pricing — здесь он не дублируется */}
      <div className="mrn-container">
        <Reveal className="grid gap-5 md:grid-cols-3 items-stretch">
          {TIERS.map((tier) => (
            <div
              key={tier.id}
              className={`mrn-card flex flex-col ${tier.featured ? 'mrn-dark' : ''}`}
              style={{
                padding: 'clamp(26px, 3.4vw, 34px)',
                background: tier.featured ? 'var(--color-ink)' : 'var(--color-paper-2)',
                borderColor: tier.featured ? 'transparent' : 'var(--mrn-line)',
              }}
            >
              <div className="flex items-center justify-between gap-3">
                <h3 className="mrn-h3">
                  {tier.name}
                </h3>
                {tier.featured && <span className="mrn-tag">Популярный</span>}
              </div>

              <p
                className="mrn-display"
                style={{
                  fontSize: 'clamp(2.1rem, 4vw, 2.6rem)',
                  marginTop: 18,
                  color: tier.featured ? 'var(--color-champagne)' : 'var(--color-ink)',
                }}
              >
                {tier.price}
              </p>
              <p className="mrn-meta" style={{ marginTop: 6 }}>{tier.period}</p>

              <p className="mrn-lead" style={{ marginTop: 14, fontSize: 14.5 }}>{tier.note}</p>

              <ul style={{ listStyle: 'none', margin: '24px 0 0', padding: 0, display: 'grid', gap: 11, flex: 1 }}>
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5">
                    <Check
                      size={16}
                      aria-hidden="true"
                      style={{
                        flexShrink: 0,
                        marginTop: 3,
                        color: tier.featured ? 'var(--color-champagne)' : 'var(--color-wine)',
                      }}
                    />
                    <span
                      style={{
                        fontSize: 14.5,
                        lineHeight: 1.5,
                        color: tier.featured ? 'rgba(251,248,244,0.78)' : 'var(--color-ink-600)',
                      }}
                    >
                      {f}
                    </span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleBuy(tier)}
                className={`mrn-btn mrn-btn--block ${
                  tier.featured || tier.id === 'free' ? 'mrn-btn--primary' : 'mrn-btn--secondary'
                }`}
                style={{ marginTop: 28 }}
              >
                {tier.paymentReady ? tier.cta : `${tier.cta} · скоро`}
              </button>
            </div>
          ))}
        </Reveal>

        <Reveal style={{ marginTop: 22 }}>
          <p className="mrn-meta">
            Оформляя платный тариф, вы принимаете{' '}
            <Link href="/terms" className="mrn-link" style={{ color: 'var(--color-wine)' }}>
              условия использования
            </Link>
            .
          </p>
        </Reveal>
      </div>
    </section>
  )
}
