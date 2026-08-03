'use client'

import Link from 'next/link'
import { ArrowRight, Eye } from 'lucide-react'
import { TemplatePreview } from '@/components/templates/TemplatePreview'
import type { TemplateEntry } from '@/lib/templateCatalog'

interface TemplateCardProps {
  template: TemplateEntry
  href: string
  /** «Ведущая» карточка занимает всю ширину ряда и раскладывается горизонтально. */
  lead?: boolean
  ratio?: string
  /** Открыть демо шаблона. Если не передан — кнопка не показывается. */
  onDemo?: (template: TemplateEntry) => void
  eager?: boolean
}

/** Точки палитры — по ним виден характер шаблона до открытия. */
function Palette({ template }: { template: TemplateEntry }) {
  const { background, accent, primary, text } = template.colors
  return (
    <span className="flex items-center gap-1.5" aria-hidden="true">
      {[background, accent, primary, text].map((c, i) => (
        <span key={i} className="mrn-swatch" style={{ background: c }} />
      ))}
    </span>
  )
}

/**
 * Карточка шаблона.
 *
 * Всё содержимое выровнено по левому краю — название, описание, теги, палитра
 * и действия. Чередования центрирования и левого края больше нет.
 */
export function TemplateCard({ template, href, lead = false, ratio, onDemo, eager }: TemplateCardProps) {
  const meta = (
    <div style={{ textAlign: 'left' }}>
      <div className="flex items-start justify-between gap-3">
        <h3 className="mrn-h3">{template.name}</h3>
        <span className="mrn-tag" style={{ flexShrink: 0 }}>{template.formality}</span>
      </div>

      <p className="mrn-lead" style={{ marginTop: 10, fontSize: 15, maxWidth: '46ch' }}>
        {lead ? template.description : template.tagline}
      </p>

      <ul
        className="flex flex-wrap gap-1.5"
        style={{ marginTop: 14, listStyle: 'none', padding: 0 }}
      >
        {template.tags.map((tag) => (
          <li
            key={tag}
            className="mrn-tag"
            style={{ borderColor: 'transparent', background: 'var(--color-paper-2)' }}
          >
            {tag}
          </li>
        ))}
      </ul>

      {lead && (
        <p className="mrn-meta" style={{ marginTop: 14 }}>
          Входит: {template.includes.join(' · ')}
        </p>
      )}

      <div
        className="flex flex-wrap items-center justify-between gap-3"
        style={{ marginTop: 18, paddingTop: 16, borderTop: '1px solid var(--mrn-line)' }}
      >
        <div>
          <Palette template={template} />
          <p className="mrn-meta" style={{ fontSize: 12, marginTop: 6 }}>
            {template.fonts.heading} · {template.fonts.body}
          </p>
        </div>

        <div className="flex items-center gap-1">
          {onDemo && (
            <button
              type="button"
              onClick={() => onDemo(template)}
              className="mrn-btn mrn-btn--sm mrn-btn--ghost mrn-above"
            >
              <Eye size={15} aria-hidden="true" /> Демо
            </button>
          )}
          {/* Растянутая ссылка делает кликабельной всю карточку */}
          <Link
            href={href}
            className="mrn-stretch inline-flex items-center gap-1.5"
            style={{ color: 'var(--color-wine)', fontSize: 14, fontWeight: 500, padding: '0 6px' }}
          >
            Выбрать <ArrowRight size={15} aria-hidden="true" />
            <span className="mrn-sr">— шаблон «{template.name}»</span>
          </Link>
        </div>
      </div>
    </div>
  )

  if (lead) {
    return (
      <div className="mrn-card mrn-tpl sm:col-span-2 lg:col-span-3">
        <div className="grid sm:grid-cols-2 h-full">
          {/* До sm карточка складывается в колонку: там нужна пропорция, а не растяжение */}
          <TemplatePreview
            template={template}
            ratio={ratio ?? '4 / 5'}
            className="mrn-preview--lead"
            eager={eager}
          />
          <div className="flex flex-col justify-center" style={{ padding: 'clamp(22px, 3vw, 34px)' }}>
            {meta}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="mrn-card mrn-tpl flex flex-col">
      <TemplatePreview template={template} ratio={ratio ?? '3 / 4'} eager={eager} />
      <div className="flex flex-col flex-1" style={{ padding: '18px 20px 20px' }}>
        {meta}
      </div>
    </div>
  )
}
