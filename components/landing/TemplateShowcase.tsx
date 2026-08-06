'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Reveal } from './Reveal'
import { TemplateCard } from './TemplateCard'
import { TemplateDemoModal } from '@/components/templates/TemplateDemoModal'
import { SiteFonts } from '@/components/providers/SiteFonts'
import { ACTIVE_TEMPLATES, CATALOG_FONT_FAMILIES, type TemplateEntry } from '@/lib/templateCatalog'

interface TemplateShowcaseProps {
  /** Куда ведёт карточка: вошедшего — сразу в мастер с выбранным шаблоном. */
  templateHref: (id: string) => string
  /** На главной показываем часть каталога, на /templates — весь. */
  limit?: number
  showAllLink?: boolean
  background?: string
  eyebrow?: string
  title?: string
  description?: string
}

export function TemplateShowcase({
  templateHref,
  limit,
  showAllLink = false,
  background = 'var(--color-paper)',
  eyebrow = 'Шаблоны',
  title = 'Шесть шаблонов под разные свадьбы',
  description = 'Шаблоны отличаются композицией первого экрана, типографикой, палитрой и формой элементов. В карточке — настоящий экран, который увидят гости.',
}: TemplateShowcaseProps) {
  const [demo, setDemo] = useState<TemplateEntry | null>(null)

  const list = limit ? ACTIVE_TEMPLATES.slice(0, limit)  : ACTIVE_TEMPLATES
  const [lead, ...rest] = list

  return (
    <section id="templates" className="mrn-section" style={{ background }}>
      {/* Живые превью используют типографику пользовательских сайтов */}
      <SiteFonts families={CATALOG_FONT_FAMILIES} />

      <div className="mrn-container">
        <Reveal className="flex flex-wrap items-end justify-between gap-6" style={{ marginBottom: 40 }}>
          <div>
            <p className="mrn-eyebrow">{eyebrow}</p>
            <h2 className="mrn-h2" style={{ marginTop: 14, maxWidth: '18ch' }}>{title}</h2>
          </div>
          <p className="mrn-lead" style={{ maxWidth: '44ch', fontSize: 15.5 }}>{description}</p>
        </Reveal>

        <Reveal className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <TemplateCard template={lead} href={templateHref(lead.id)} lead onDemo={setDemo} eager />

          {rest.map((tpl, i) => (
            <TemplateCard
              key={tpl.id}
              template={tpl}
              href={templateHref(tpl.id)}
              onDemo={setDemo}
              // Разная высота карточек — часть редакционной сетки, а не случайность
              ratio={i % 3 === 1 ? '4 / 5' : '3 / 4'}
            />
          ))}
        </Reveal>

        {/* Фраза, которая объясняет смысл карточек: это не иллюстрации */}
        <Reveal style={{ marginTop: 26, textAlign: 'center' }}>
          <p className="mrn-script" style={{ fontSize: 22, color: 'var(--color-wine)' }}>
            так это увидят ваши гости
          </p>
        </Reveal>

        {showAllLink && (
          <Reveal className="flex justify-center" style={{ marginTop: 30 }}>
            <Link href="/templates" className="mrn-btn mrn-btn--secondary">
              Весь каталог шаблонов <ArrowRight size={16} />
            </Link>
          </Reveal>
        )}
      </div>

      <TemplateDemoModal
        template={demo}
        onClose={() => setDemo(null)}
        href={demo ? templateHref(demo.id) : undefined}
      />
    </section>
  )
}
