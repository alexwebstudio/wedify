'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Check, X } from 'lucide-react'
import type { OnboardingProgress } from '@/lib/onboarding'

interface AssistantProps {
  progress: OnboardingProgress
  /** Пропустить обучение — вернуться можно из настроек. */
  onSkip: () => void
  /** Больше не показывать подсказки совсем. */
  onDisable: () => void
}

/**
 * Помощник по созданию сайта.
 *
 * Свёрнут в небольшую кнопку в углу и раскрывается только по нажатию —
 * сам ничего не перекрывает и не открывается без причины. Никакого чата
 * и никакой языковой модели: подсказка выбирается по первому незакрытому
 * шагу, который посчитан из данных сайта.
 */
export function Assistant({ progress, onSkip, onDisable }: AssistantProps) {
  const [open, setOpen] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setOpen(false); buttonRef.current?.focus() }
    }
    const onClickOutside = (e: MouseEvent) => {
      const target = e.target as Node
      if (panelRef.current?.contains(target) || buttonRef.current?.contains(target)) return
      setOpen(false)
    }

    document.addEventListener('keydown', onKey)
    document.addEventListener('mousedown', onClickOutside)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('mousedown', onClickOutside)
    }
  }, [open])

  const { next, doneCount, total, percent, project, complete } = progress
  const projectId = project?.id

  return (
    <div className="mrn-assistant">
      {open && (
        <div
          ref={panelRef}
          className="mrn-card mrn-assistant-panel"
          role="dialog"
          aria-label="Помощник по созданию сайта"
        >
          <div
            className="flex items-start justify-between gap-3"
            style={{ padding: '18px 18px 0' }}
          >
            <div style={{ textAlign: 'left' }}>
              <p className="mrn-eyebrow">Шаг {Math.min(doneCount + 1, total)} из {total}</p>
              <p className="mrn-h3" style={{ fontSize: 17, marginTop: 6 }}>
                {complete ? 'Всё готово' : next?.title}
              </p>
            </div>
            <button
              onClick={() => { setOpen(false); buttonRef.current?.focus() }}
              className="mrn-icon-btn"
              aria-label="Свернуть помощника"
              style={{ width: 34, height: 34, flexShrink: 0 }}
            >
              <X size={16} />
            </button>
          </div>

          <div style={{ padding: '12px 18px 18px' }}>
            <p className="mrn-lead" style={{ fontSize: 14.5, textAlign: 'left' }}>
              {complete
                ? 'Приглашение опубликовано и открывается по вашей ссылке. Правки после публикации попадают на сайт только после нажатия «Опубликовать изменения».'
                : next?.hint}
            </p>

            {/* Прогресс: полоса + шаги */}
            <div
              aria-hidden="true"
              style={{
                height: 4, borderRadius: 999, marginTop: 16,
                background: 'var(--color-paper-3)', overflow: 'hidden',
              }}
            >
              <span
                style={{
                  display: 'block', height: '100%', width: `${percent}%`,
                  background: 'var(--color-wine)',
                  transition: 'width var(--mrn-t-slow) var(--mrn-ease)',
                }}
              />
            </div>
            <p className="mrn-meta" style={{ fontSize: 12, marginTop: 8, textAlign: 'left' }}>
              Выполнено {doneCount} из {total}
            </p>

            {!complete && next && (
              <Link
                href={next.href(projectId)}
                onClick={() => setOpen(false)}
                className="mrn-btn mrn-btn--sm mrn-btn--primary mrn-btn--block"
                style={{ marginTop: 16 }}
              >
                {next.action} <ArrowRight size={15} />
              </Link>
            )}

            <div
              className="flex flex-wrap items-center justify-between gap-2"
              style={{ marginTop: 14, paddingTop: 12, borderTop: '1px solid var(--mrn-line)' }}
            >
              <button onClick={onSkip} className="mrn-btn mrn-btn--sm mrn-btn--ghost" style={{ paddingInline: 0 }}>
                Пропустить обучение
              </button>
              <button onClick={onDisable} className="mrn-btn mrn-btn--sm mrn-btn--ghost" style={{ paddingInline: 0 }}>
                Больше не показывать
              </button>
            </div>
            <p className="mrn-meta" style={{ fontSize: 11.5, marginTop: 8, textAlign: 'left' }}>
              Вернуть подсказки можно в настройках кабинета.
            </p>
          </div>
        </div>
      )}

      <button
        ref={buttonRef}
        onClick={() => setOpen((v) => !v)}
        className="mrn-assistant-toggle"
        aria-expanded={open}
        aria-label={
          complete
            ? 'Помощник: обучение завершено'
            : `Помощник: шаг ${Math.min(doneCount + 1, total)} из ${total} — ${next?.title ?? ''}`
        }
      >
        <span className="mrn-assistant-mark" aria-hidden="true">
          {complete ? <Check size={16} /> : `${doneCount}/${total}`}
        </span>
        <span className="mrn-assistant-label">
          {complete ? 'Готово' : 'Что дальше'}
        </span>
      </button>
    </div>
  )
}
