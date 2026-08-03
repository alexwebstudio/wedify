'use client'

import Link from 'next/link'
import type { ReactNode } from 'react'

interface AuthShellProps {
  eyebrow: string
  title: ReactNode
  lead?: ReactNode
  children: ReactNode
  /** Ссылка внизу: «Вспомнили пароль?» и подобное. */
  footer?: ReactNode
}

/**
 * Общая рамка экранов доступа: вход, регистрация, восстановление пароля.
 *
 * Тёмная бордовая колонка слева задаёт ту же атмосферу, что и первый экран
 * сайта, форма справа остаётся спокойной и читаемой.
 */
export function AuthShell({ eyebrow, title, lead, children, footer }: AuthShellProps) {
  return (
    <main className="min-h-screen flex flex-col lg:flex-row">
      {/* Смысловая колонка — на мобильном сворачивается в компактную шапку */}
      <section
        className="mrn-tone-wine mrn-dark relative overflow-hidden lg:w-[42%] flex items-center"
        style={{ paddingBlock: 'clamp(28px, 6vh, 72px)' }}
      >
        <span className="mrn-hero-grain" aria-hidden="true" />
        <div className="mrn-container relative">
          <Link href="/" className="mrn-logo" aria-label="Maruno Wedding — на главную">
            <span className="mrn-logo-name">Maruno</span>
            <span className="mrn-logo-sub">wedding</span>
          </Link>

          <p className="mrn-eyebrow" style={{ marginTop: 'clamp(24px, 6vh, 64px)', color: 'var(--color-champagne)' }}>
            {eyebrow}
          </p>
          <h1
            className="mrn-h1 hidden lg:block"
            style={{ marginTop: 18, maxWidth: '14ch', fontSize: 'clamp(1.9rem, 3vw, 2.8rem)' }}
          >
            {title}
          </h1>
          {lead && (
            <p className="mrn-lead hidden lg:block" style={{ marginTop: 18, maxWidth: '34ch' }}>
              {lead}
            </p>
          )}
        </div>
      </section>

      {/* Форма */}
      {/* На телефоне форма прижата к верху: центрирование оставляло пустое поле */}
      <section
        className="flex-1 flex items-start lg:items-center"
        style={{ background: 'var(--color-paper)', paddingBlock: 'clamp(28px, 5vh, 80px)' }}
      >
        <div className="mrn-container" style={{ maxWidth: 460 }}>
          <h2 className="mrn-h2 lg:hidden" style={{ fontSize: 'clamp(1.7rem, 6vw, 2.2rem)', marginBottom: 20 }}>
            {title}
          </h2>

          {children}

          {footer && (
            <div style={{ marginTop: 26, paddingTop: 20, borderTop: '1px solid var(--mrn-line)' }}>
              {footer}
            </div>
          )}

          <p className="mrn-meta" style={{ marginTop: 24, fontSize: 12 }}>
            Продолжая, вы принимаете{' '}
            <Link href="/terms" className="mrn-link" style={{ color: 'var(--color-wine)' }}>
              условия использования
            </Link>{' '}
            и{' '}
            <Link href="/privacy" className="mrn-link" style={{ color: 'var(--color-wine)' }}>
              политику конфиденциальности
            </Link>
            .
          </p>
        </div>
      </section>
    </main>
  )
}
