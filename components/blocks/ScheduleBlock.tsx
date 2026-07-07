'use client'
import { EditableText } from '@/components/editor/EditableText'
import { fontFamilyValue } from '@/lib/editorPresets'
import type { BlockData, ProjectColors, ProjectFonts } from '@/types'

interface Props {
  block: BlockData
  colors: ProjectColors
  fonts: ProjectFonts
  isEditing: boolean
  onChange: (content: BlockData['content']) => void
}

type Item = { time: string; title: string; desc: string }

function parseItems(raw: unknown): Item[] {
  if (Array.isArray(raw)) return raw as Item[]
  if (typeof raw === 'string') { try { const p = JSON.parse(raw); return Array.isArray(p) ? p : [] } catch { return [] } }
  return []
}

export function ScheduleBlock({ block, colors, fonts, isEditing, onChange }: Props) {
  const content = block.content as { variant?: string; title?: string; subtitle?: string; items?: string }
  const v = content.variant || 'vertical'
  const items = parseItems(content.items)
  const ff = fontFamilyValue(fonts.heading)
  const bodyFf = fontFamilyValue(fonts.body)

  const update = (key: string, val: string) => onChange({ ...content, [key]: val })
  const updateItem = (idx: number, key: keyof Item, val: string) => {
    const next = items.map((it, i) => (i === idx ? { ...it, [key]: val } : it))
    onChange({ ...content, items: JSON.stringify(next) })
  }

  const timeEl = (it: Item, i: number, style?: React.CSSProperties) => (
    <EditableText tag="div" value={it.time} onChange={(x) => updateItem(i, 'time', x)} isEditing={isEditing}
      style={{ fontFamily: bodyFf, fontSize: 13, letterSpacing: '.12em', textTransform: 'uppercase', color: colors.primary, fontWeight: 600, ...style }} />
  )
  const titleEl = (it: Item, i: number, size = 22) => (
    <EditableText tag="h3" value={it.title} onChange={(x) => updateItem(i, 'title', x)} isEditing={isEditing}
      style={{ fontFamily: ff, fontSize: size, fontWeight: 500, color: colors.text }} />
  )
  const descEl = (it: Item, i: number) => (it.desc || isEditing) && (
    <EditableText tag="p" value={it.desc} onChange={(x) => updateItem(i, 'desc', x)} isEditing={isEditing} placeholder="Описание" multiline
      className="mt-1 opacity-70" style={{ fontFamily: bodyFf, fontSize: 14, lineHeight: 1.6, color: colors.text }} />
  )

  const heading = (
    <>
      <div className="text-center mb-3" style={{ color: colors.primary }}><span className="inline-block w-10 h-px align-middle" style={{ background: colors.primary }} /></div>
      <EditableText tag="h2" value={content.title || 'Расписание дня'} onChange={(x) => update('title', x)} isEditing={isEditing} className="text-center mb-2"
        style={{ fontFamily: ff, fontSize: 'clamp(1.9rem,5vw,2.8rem)', fontWeight: 400, color: colors.text }} />
      {(content.subtitle || isEditing) && (
        <EditableText tag="p" value={content.subtitle || ''} onChange={(x) => update('subtitle', x)} isEditing={isEditing} placeholder="Подзаголовок (необязательно)"
          className="text-center opacity-60" style={{ fontFamily: bodyFf, fontSize: 15, color: colors.text }} />
      )}
    </>
  )

  const section = (maxW: string, body: React.ReactNode) => (
    <section className="py-20 px-6" style={{ backgroundColor: colors.background }}>
      <div className="mx-auto" style={{ maxWidth: maxW }}>{heading}<div className="mt-12">{body}</div></div>
    </section>
  )

  // ── horizontal ──
  if (v === 'horizontal') {
    return section('900px', (
      <div className="flex gap-4 overflow-x-auto pb-3" data-lenis-prevent>
        {items.map((it, i) => (
          <div key={i} className="flex-shrink-0 rounded-2xl p-5 text-center" style={{ width: 190, background: colors.accent + '33', border: `1px solid ${colors.primary}18` }}>
            <div className="w-10 h-10 rounded-full mx-auto mb-3 flex items-center justify-center" style={{ background: colors.primary, color: '#fff', fontSize: 13, fontWeight: 600 }}>{i + 1}</div>
            {timeEl(it, i, { textAlign: 'center' })}
            <div className="mt-1">{titleEl(it, i, 18)}</div>
            {descEl(it, i)}
          </div>
        ))}
      </div>
    ))
  }

  // ── cards ──
  if (v === 'cards') {
    return section('820px', (
      <div className="grid sm:grid-cols-2 gap-4">
        {items.map((it, i) => (
          <div key={i} className="rounded-2xl p-5 flex gap-4" style={{ background: colors.accent + '2E', border: `1px solid ${colors.primary}15` }}>
            <div className="flex-shrink-0 w-14 h-14 rounded-xl flex items-center justify-center" style={{ background: colors.primary + '18' }}>{timeEl(it, i, { fontSize: 12, textAlign: 'center' })}</div>
            <div>{titleEl(it, i, 20)}{descEl(it, i)}</div>
          </div>
        ))}
      </div>
    ))
  }

  // ── circular ──
  if (v === 'circular') {
    return section('900px', (
      <div className="flex flex-wrap justify-center gap-x-6 gap-y-8">
        {items.map((it, i) => (
          <div key={i} className="flex flex-col items-center text-center" style={{ width: 150 }}>
            <div className="w-20 h-20 rounded-full flex flex-col items-center justify-center mb-3" style={{ border: `2px solid ${colors.primary}`, color: colors.primary }}>
              {timeEl(it, i, { fontSize: 13, textAlign: 'center', color: colors.primary })}
            </div>
            {titleEl(it, i, 17)}
            {descEl(it, i)}
          </div>
        ))}
      </div>
    ))
  }

  // ── connected (зигзаг) ──
  if (v === 'connected') {
    return section('720px', (
      <div className="relative">
        <div className="absolute top-0 bottom-0 left-1/2 w-px -translate-x-1/2 hidden sm:block" style={{ background: `${colors.primary}33` }} />
        <div className="flex flex-col gap-8">
          {items.map((it, i) => {
            const right = i % 2 === 1
            return (
              <div key={i} className={`sm:w-1/2 ${right ? 'sm:ml-auto sm:pl-8 sm:text-left' : 'sm:pr-8 sm:text-right'}`}>
                <div className="rounded-2xl p-4" style={{ background: colors.accent + '2E', border: `1px solid ${colors.primary}15` }}>
                  {timeEl(it, i)}<div className="mt-0.5">{titleEl(it, i, 19)}</div>{descEl(it, i)}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    ))
  }

  // ── minimal ──
  if (v === 'minimal') {
    return section('560px', (
      <div className="flex flex-col divide-y" style={{ borderColor: `${colors.primary}20` }}>
        {items.map((it, i) => (
          <div key={i} className="flex items-baseline gap-5 py-4" style={{ borderColor: `${colors.primary}1E` }}>
            <div className="w-20 flex-shrink-0">{timeEl(it, i)}</div>
            <div className="flex-1">{titleEl(it, i, 20)}{descEl(it, i)}</div>
          </div>
        ))}
      </div>
    ))
  }

  // ── vertical (default) ──
  return section('640px', (
    <div className="relative" style={{ paddingLeft: 4 }}>
      <div className="absolute top-2 bottom-2 w-px" style={{ left: 7, background: `${colors.primary}40` }} />
      <div className="flex flex-col gap-9">
        {items.map((it, i) => (
          <div key={i} className="relative pl-10">
            <span className="absolute rounded-full" style={{ left: 0, top: 6, width: 15, height: 15, background: colors.background, border: `2px solid ${colors.primary}` }} />
            <span className="absolute rounded-full" style={{ left: 4, top: 10, width: 7, height: 7, background: colors.primary }} />
            {timeEl(it, i, { marginBottom: 2 })}
            {titleEl(it, i)}
            {descEl(it, i)}
          </div>
        ))}
      </div>
    </div>
  ))
}
