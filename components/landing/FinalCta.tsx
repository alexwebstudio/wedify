'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Reveal } from './Reveal'

/**
 * Финальный призыв на бордовой плоскости — рифмуется с первым экраном
 * и закрывает страницу тем же тоном, с которого она началась.
 */
export function FinalCta({ startHref }: { startHref: string }) {
  return (
    <section className="mrn-section mrn-tone-wine mrn-dark" style={{ position: 'relative', overflow: 'hidden' }}>
      <span className="mrn-hero-grain" aria-hidden="true" />

      <div className="mrn-container mrn-container--narrow" style={{ position: 'relative', textAlign: 'center' }}>
        <Reveal>
          <p className="mrn-eyebrow" style={{ color: 'var(--color-champagne)' }}>
            Свободных вечеров до свадьбы меньше, чем кажется
          </p>

          <h2 className="mrn-h2" style={{ marginTop: 16 }}>
            Соберите приглашение{' '}
            <span className="mrn-script" style={{ fontSize: '1.28em', color: 'var(--color-champagne)' }}>
              сегодня
            </span>
          </h2>

          <p className="mrn-lead" style={{ marginTop: 18, marginInline: 'auto', maxWidth: '42ch' }}>
            Начать можно бесплатно и без карты. Если не понравится — просто закройте вкладку.
          </p>

          <Link href={startHref} className="mrn-btn mrn-btn--lg mrn-btn--primary" style={{ marginTop: 32 }}>
            Создать сайт <ArrowRight size={17} />
          </Link>
        </Reveal>
      </div>
    </section>
  )
}
