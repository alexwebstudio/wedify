'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import toast from 'react-hot-toast'
import { ArrowRight, X } from 'lucide-react'

const ROADMAP = [
  { t: 'Прелоадер', d: 'Кинематографичная заставка перед открытием приглашения', status: 'В разработке' },
  { t: 'Шторки-открытие', d: 'Эффект раздвигающихся штор при заходе на сайт', status: 'В разработке' },
  { t: 'Кастомный конверт', d: 'Анимация распечатывания конверта с именами', status: 'В разработке' },
  { t: 'Cinematic-сцены', d: 'Плавные переходы между блоками с параллаксом', status: 'Планируется' },
  { t: 'Скретч-карта даты', d: 'Дата свадьбы, которую гость «стирает» пальцем', status: 'Планируется' },
  { t: 'Библиотека музыки', d: 'Готовые свадебные треки в один клик', status: 'Планируется' },
  { t: 'Премиум-таймеры', d: 'Богатые обратные отсчёты и анимации цифр', status: 'Планируется' },
  { t: 'Эффекты частиц', d: 'Лепестки, конфетти, золотая пыль по скроллу', status: 'Планируется' },
]

export default function ExclusiveTemplatesPlate() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const handlePay = () => {
    toast('Оплата эксклюзивных шаблонов пока в разработке — скоро откроем')
  }

  return (
    <>
      {/* Компактная плашка — анонс премиум-линейки */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mrn-card mrn-dark w-full text-left"
        style={{
          background: 'var(--color-ink)',
          borderColor: 'transparent',
          padding: 'clamp(22px, 3vw, 28px)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: 20,
          flexWrap: 'wrap',
        }}
      >
        <div style={{ flex: '1 1 240px' }}>
          <div className="flex items-center gap-3" style={{ marginBottom: 8 }}>
            <span className="mrn-eyebrow">Эксклюзивная линейка</span>
            <span className="mrn-tag">Скоро</span>
          </div>
          <p className="mrn-h3">
            Приглашения с кинематографичными сценами
          </p>
          <p className="mrn-lead" style={{ marginTop: 8, fontSize: 15, maxWidth: '52ch' }}>
            Заставка перед открытием, шторки, конверт с именами и эффекты по скроллу.
          </p>
        </div>
        <span
          className="inline-flex items-center gap-2"
          style={{ color: 'var(--color-paper)', fontSize: 15, fontWeight: 500 }}
        >
          Что войдёт <ArrowRight size={16} />
        </span>
      </button>

      {open && typeof document !== 'undefined' && createPortal(
        <div
          onClick={() => setOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Эксклюзивная линейка"
          data-lenis-prevent
          style={{
            position: 'fixed', inset: 0, zIndex: 90, overflowY: 'auto',
            WebkitOverflowScrolling: 'touch', display: 'flex',
            alignItems: 'flex-start', justifyContent: 'center',
            padding: '5vh 16px', background: 'rgba(22,19,15,.6)',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="mrn-card mrn-dark"
            style={{
              width: '100%', maxWidth: 640, margin: 'auto',
              background: 'var(--color-ink)', borderColor: 'var(--mrn-line-invert)',
              boxShadow: 'var(--mrn-shadow-lift)',
            }}
          >
            <div
              className="flex items-center justify-between gap-4"
              style={{
                position: 'sticky', top: 0, zIndex: 1,
                padding: '20px 24px',
                background: 'var(--color-ink)',
                borderBottom: '1px solid var(--mrn-line-invert)',
              }}
            >
              <div>
                <h2 className="mrn-h3">Эксклюзивная линейка</h2>
                <p className="mrn-meta" style={{ marginTop: 4 }}>Раздел в разработке · скоро в Maruno</p>
              </div>
              <button onClick={() => setOpen(false)} className="mrn-icon-btn" aria-label="Закрыть">
                <X size={18} />
              </button>
            </div>

            <div style={{ padding: 24 }}>
              <p className="mrn-lead" style={{ fontSize: 15, marginBottom: 8 }}>
                Отдельная линейка премиум-приглашений с богатыми анимациями. Вот что войдёт в неё:
              </p>

              <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                {ROADMAP.map((item) => {
                  const inProgress = item.status === 'В разработке'
                  return (
                    <li
                      key={item.t}
                      className="flex items-start justify-between gap-4"
                      style={{ paddingBlock: 16, borderBottom: '1px solid var(--mrn-line-invert)' }}
                    >
                      <div>
                        <p style={{ color: 'var(--color-paper)', fontSize: 15, fontWeight: 500 }}>{item.t}</p>
                        <p className="mrn-lead" style={{ marginTop: 4, fontSize: 14 }}>{item.d}</p>
                      </div>
                      <span
                        className="mrn-tag"
                        style={{
                          flexShrink: 0,
                          color: inProgress ? 'var(--color-paper)' : undefined,
                          borderColor: inProgress ? 'rgba(255,255,255,0.32)' : undefined,
                        }}
                      >
                        {item.status}
                      </span>
                    </li>
                  )
                })}
              </ul>

              <button
                onClick={handlePay}
                className="mrn-btn mrn-btn--primary mrn-btn--block"
                style={{ marginTop: 26 }}
              >
                Оплатить эксклюзив
              </button>
              <p className="mrn-meta" style={{ textAlign: 'center', marginTop: 12 }}>
                Оплата откроется вместе с релизом раздела
              </p>
            </div>
          </div>
        </div>,
        document.body,
      )}
    </>
  )
}
