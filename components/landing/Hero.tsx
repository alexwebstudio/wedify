'use client'

import { useEffect, useLayoutEffect, useRef } from 'react'
import Link from 'next/link'
import { gsap } from 'gsap'
import { ArrowRight } from 'lucide-react'

interface HeroProps {
  /** Куда ведёт основное действие: гостя — на регистрацию, вошедшего — в кабинет. */
  startHref: string
}

const TRUST = ['Бесплатно на старте', 'Личная ссылка для гостей', 'Ответы приходят в Telegram']

// GSAP выставляет стартовые состояния до первой отрисовки — иначе контент
// успевает мелькнуть. На сервере useLayoutEffect недоступен.
const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect

/**
 * Первый экран.
 *
 * Глубокий бордовый вместо белого поля: страница должна передавать атмосферу
 * события до того, как человек начнёт читать. Карточка шаблона отсюда убрана —
 * она размывала композицию; шаблоны показываются ниже, в своём разделе.
 */
export function Hero({ startHref }: HeroProps) {
  const root = useRef<HTMLElement>(null)

  useIsomorphicLayoutEffect(() => {
    const el = root.current
    if (!el) return

    // Уважаем системную настройку: без анимации контент просто на месте
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const ctx = gsap.context(() => {
      gsap
        .timeline({ defaults: { ease: 'power3.out' } })
        .from('[data-hero="eyebrow"]', { autoAlpha: 0, y: -10, duration: 0.5 })
        // Строки заголовка выезжают из-под маски — это акцент, а не общий fade-up
        .from('[data-hero="line"]', { yPercent: 108, duration: 0.85, stagger: 0.09 }, '-=0.2')
        .from('[data-hero="lead"]', { autoAlpha: 0, y: 12, duration: 0.6 }, '-=0.45')
        .from('[data-hero="cta"]', { autoAlpha: 0, y: 12, duration: 0.55 }, '-=0.4')
        .fromTo(
          '[data-hero="rule"]',
          { scaleX: 0 },
          { scaleX: 1, duration: 0.7, ease: 'power2.inOut' },
          '-=0.5',
        )
        .from('[data-hero="trust"] li', { autoAlpha: 0, y: 8, duration: 0.45, stagger: 0.07 }, '-=0.35')
    }, el)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={root}
      // Пока навигация над этой секцией — она в тёмной теме и без подложки
      data-nav-dark-zone
      className="mrn-hero mrn-tone-wine mrn-dark"
      style={{
        paddingTop: 'clamp(112px, 16vh, 176px)',
        paddingBottom: 'clamp(72px, 12vh, 128px)',
      }}
    >
      <span className="mrn-hero-grain" aria-hidden="true" />

      <div className="mrn-container" style={{ position: 'relative', textAlign: 'center' }}>
        <p
          data-hero="eyebrow"
          className="mrn-eyebrow"
          style={{ color: 'rgba(255,255,255,.72)' }}
        >
          Конструктор свадебных сайтов
        </p>

        {/* Ключевая фраза целиком остаётся доступной для скринридеров и поиска,
            визуально она разбита на две строки — набор и каллиграфия. */}
        <h1
          className="mrn-display"
          style={{
            marginTop: 22,
            marginInline: 'auto',
            maxWidth: '17ch',
            fontSize: 'clamp(2.35rem, 5.8vw, 4.6rem)',
          }}
        >
          <span className="mrn-sr">Создайте свой сайт-приглашение за 10 минут</span>
          <span aria-hidden="true">
            <span className="mrn-line-mask">
              <span data-hero="line" style={{ display: 'block' }}>Создайте свой</span>
            </span>
            <span className="mrn-line-mask">
              <span data-hero="line" style={{ display: 'block' }}>
                сайт-<span className="mrn-h1-script">приглашение</span>
              </span>
            </span>
            <span className="mrn-line-mask">
              <span data-hero="line" style={{ display: 'block' }}>за 10 минут</span>
            </span>
          </span>
        </h1>

        <p
          data-hero="lead"
          className="mrn-lead"
          style={{ marginTop: 26, marginInline: 'auto', maxWidth: '46ch' }}
        >
          Выберите стиль, впишите имена и дату — и отправьте гостям личную ссылку.
          Ответы придут вам, а не потеряются в переписке.
        </p>

        {/* На узких экранах кнопки идут в столбик на всю ширину — так они
            попадают в зону большого пальца и не образуют рваный ряд. */}
        <div
          data-hero="cta"
          className="flex flex-col sm:flex-row sm:flex-wrap sm:justify-center gap-3"
          // Ширины хватает, чтобы на десктопе кнопки стояли в один ряд,
          // а на узком экране — столбиком во всю ширину
          style={{ marginTop: 38, marginInline: 'auto', maxWidth: 480 }}
        >
          <Link href={startHref} className="mrn-btn mrn-btn--lg mrn-btn--primary">
            Создать сайт <ArrowRight size={17} />
          </Link>
          <Link href="/templates" className="mrn-btn mrn-btn--lg mrn-btn--secondary">
            Посмотреть шаблоны
          </Link>
        </div>

        <span
          data-hero="rule"
          aria-hidden="true"
          style={{
            display: 'block',
            width: 'min(420px, 70%)',
            height: 1,
            marginInline: 'auto',
            marginTop: 'clamp(40px, 6vw, 60px)',
            transformOrigin: 'center',
            background:
              'linear-gradient(90deg, transparent, rgba(255,255,255,.45), transparent)',
          }}
        />

        <ul
          data-hero="trust"
          className="flex flex-wrap justify-center gap-x-8 gap-y-2"
          style={{ marginTop: 22, listStyle: 'none', padding: 0 }}
        >
          {TRUST.map((item) => (
            <li key={item} className="mrn-meta flex items-center gap-2">
              <span
                aria-hidden="true"
                style={{ width: 14, height: 1, background: 'rgba(255,255,255,.6)', opacity: 1 }}
              />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
