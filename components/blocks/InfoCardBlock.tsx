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

export function InfoCardBlock({ block, colors, fonts, isEditing, onChange }: Props) {
  const content = block.content as { icon?: string; title?: string; text?: string; note?: string }
  const update = (key: string, val: string) => onChange({ ...content, [key]: val })

  return (
    <section className="py-20 px-6" style={{ backgroundColor: colors.background }}>
      <div className="max-w-xl mx-auto text-center">
        <div
          className="mx-auto mb-6 flex items-center justify-center rounded-2xl"
          style={{ width: 64, height: 64, background: `${colors.primary}18`, fontSize: 30, lineHeight: 1 }}
        >
          <EditableText
            tag="span"
            value={content.icon || '✦'}
            onChange={(v) => update('icon', v)}
            isEditing={isEditing}
            style={{ fontSize: 30 }}
          />
        </div>

        <EditableText
          tag="h2"
          value={content.title || 'Заголовок'}
          onChange={(v) => update('title', v)}
          isEditing={isEditing}
          className="mb-4"
          style={{ fontFamily: fontFamilyValue(fonts.heading), fontSize: 'clamp(1.8rem,5vw,2.6rem)', fontWeight: 400, color: colors.text }}
        />

        <div className="mx-auto mb-6 w-10 h-px" style={{ background: colors.primary }} />

        <EditableText
          tag="p"
          value={content.text || 'Текст описания. Расскажите гостям детали.'}
          onChange={(v) => update('text', v)}
          isEditing={isEditing}
          multiline
          className="mb-4"
          style={{ fontFamily: fontFamilyValue(fonts.body), fontSize: 16, lineHeight: 1.75, color: colors.text, opacity: 0.8 }}
        />

        {(content.note || isEditing) && (
          <div
            className="inline-block mt-2 px-5 py-3 rounded-xl"
            style={{ background: `${colors.accent}`, border: `1px solid ${colors.primary}30` }}
          >
            <EditableText
              tag="p"
              value={content.note || ''}
              onChange={(v) => update('note', v)}
              isEditing={isEditing}
              placeholder="Дополнительная заметка (необязательно)"
              style={{ fontFamily: fontFamilyValue(fonts.body), fontSize: 14, color: colors.text, opacity: 0.75 }}
            />
          </div>
        )}
      </div>
    </section>
  )
}
