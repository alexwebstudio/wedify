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
  if (typeof raw === 'string') {
    try { const p = JSON.parse(raw); return Array.isArray(p) ? p : [] } catch { return [] }
  }
  return []
}

export function ScheduleBlock({ block, colors, fonts, isEditing, onChange }: Props) {
  const content = block.content as { title?: string; subtitle?: string; items?: string }
  const items = parseItems(content.items)

  const update = (key: string, val: string) => onChange({ ...content, [key]: val })
  const updateItem = (idx: number, key: keyof Item, val: string) => {
    const next = items.map((it, i) => (i === idx ? { ...it, [key]: val } : it))
    onChange({ ...content, items: JSON.stringify(next) })
  }

  return (
    <section className="py-20 px-6" style={{ backgroundColor: colors.background }}>
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-3" style={{ color: colors.primary }}>
          <span className="inline-block w-10 h-px align-middle" style={{ background: colors.primary }} />
        </div>
        <EditableText
          tag="h2"
          value={content.title || 'Расписание дня'}
          onChange={(v) => update('title', v)}
          isEditing={isEditing}
          className="text-center mb-2"
          style={{ fontFamily: fontFamilyValue(fonts.heading), fontSize: 'clamp(1.9rem,5vw,2.8rem)', fontWeight: 400, color: colors.text }}
        />
        {(content.subtitle || isEditing) && (
          <EditableText
            tag="p"
            value={content.subtitle || ''}
            onChange={(v) => update('subtitle', v)}
            isEditing={isEditing}
            placeholder="Подзаголовок (необязательно)"
            className="text-center mb-12 opacity-60"
            style={{ fontFamily: fontFamilyValue(fonts.body), fontSize: 15, color: colors.text }}
          />
        )}

        <div className="relative mt-12" style={{ paddingLeft: 4 }}>
          <div className="absolute top-2 bottom-2 w-px" style={{ left: 7, background: `${colors.primary}40` }} />
          <div className="flex flex-col gap-9">
            {items.map((it, i) => (
              <div key={i} className="relative pl-10">
                <span className="absolute rounded-full" style={{ left: 0, top: 6, width: 15, height: 15, background: colors.background, border: `2px solid ${colors.primary}` }} />
                <span className="absolute rounded-full" style={{ left: 4, top: 10, width: 7, height: 7, background: colors.primary }} />
                <EditableText
                  tag="div"
                  value={it.time}
                  onChange={(v) => updateItem(i, 'time', v)}
                  isEditing={isEditing}
                  className="mb-0.5"
                  style={{ fontFamily: fontFamilyValue(fonts.body), fontSize: 13, letterSpacing: '.12em', textTransform: 'uppercase', color: colors.primary, fontWeight: 600 }}
                />
                <EditableText
                  tag="h3"
                  value={it.title}
                  onChange={(v) => updateItem(i, 'title', v)}
                  isEditing={isEditing}
                  style={{ fontFamily: fontFamilyValue(fonts.heading), fontSize: 22, fontWeight: 500, color: colors.text }}
                />
                {(it.desc || isEditing) && (
                  <EditableText
                    tag="p"
                    value={it.desc}
                    onChange={(v) => updateItem(i, 'desc', v)}
                    isEditing={isEditing}
                    placeholder="Описание"
                    multiline
                    className="mt-1 opacity-70"
                    style={{ fontFamily: fontFamilyValue(fonts.body), fontSize: 14.5, lineHeight: 1.6, color: colors.text }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
