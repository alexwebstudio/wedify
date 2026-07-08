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

export function FooterBlock({ block, colors, fonts, isEditing, onChange }: Props) {
  const content = block.content as { variant?: string; names?: string; date?: string; thanks?: string; hashtag?: string }
  const variant = content.variant || '1'
  const update = (key: string, val: string) => onChange({ ...content, [key]: val })

  const names = (size: number, color: string) => (
    <EditableText
      tag="h2"
      value={content.names || 'Алия & Тимур'}
      onChange={(v) => update('names', v)}
      isEditing={isEditing}
      style={{ fontFamily: fontFamilyValue(fonts.heading), fontSize: size, fontWeight: 400, color, lineHeight: 1.15 }}
    />
  )
  const dateEl = (color: string) => (
    <EditableText
      tag="p"
      value={content.date || '15.08.2026'}
      onChange={(v) => update('date', v)}
      isEditing={isEditing}
      style={{ fontFamily: fontFamilyValue(fonts.body), fontSize: 13, letterSpacing: '.22em', textTransform: 'uppercase', color }}
    />
  )
  const thanks = (color: string) => (
    <EditableText
      tag="p"
      value={content.thanks || 'Спасибо, что вы с нами'}
      onChange={(v) => update('thanks', v)}
      isEditing={isEditing}
      style={{ fontFamily: fontFamilyValue(fonts.body), fontSize: 14, color, opacity: 0.7 }}
    />
  )

  // Variant 2 — тёмная/акцентная полоса
  if (variant === '2') {
    return (
      <footer className="py-16 px-6 text-center" style={{ background: colors.text }}>
        <div className="max-w-lg mx-auto">
          <span className="inline-block mb-5" style={{ color: colors.primary, fontSize: 20 }}>♥</span>
          {names(40, colors.background)}
          <div className="my-4 mx-auto w-12 h-px" style={{ background: colors.primary }} />
          {dateEl(colors.primary)}
          <div className="mt-4">{thanks(colors.background)}</div>
        </div>
      </footer>
    )
  }

  // Variant 3 — орнаментальный, с хэштегом
  if (variant === '3') {
    return (
      <footer className="py-20 px-6 text-center" style={{ background: colors.background }}>
        <div className="max-w-lg mx-auto">
          <div className="flex items-center gap-4 justify-center mb-6" style={{ color: colors.primary }}>
            <span className="h-px flex-1 max-w-[70px]" style={{ background: `linear-gradient(90deg,transparent,${colors.primary})` }} />
            <span style={{ fontSize: 15 }}>✦</span>
            <span className="h-px flex-1 max-w-[70px]" style={{ background: `linear-gradient(90deg,${colors.primary},transparent)` }} />
          </div>
          {names(44, colors.text)}
          <div className="mt-4">{dateEl(colors.primary)}</div>
          {(content.hashtag || isEditing) && (
            <div className="mt-6 inline-block px-4 py-2 rounded-full" style={{ background: `${colors.primary}18`, color: colors.secondary }}>
              <EditableText
                tag="span"
                value={content.hashtag || '#НашаСвадьба'}
                onChange={(v) => update('hashtag', v)}
                isEditing={isEditing}
                placeholder="#хэштег"
                style={{ fontFamily: fontFamilyValue(fonts.body), fontSize: 14, fontWeight: 500 }}
              />
            </div>
          )}
        </div>
      </footer>
    )
  }

  // Variant 4 — крупная дата, двухцветный
  if (variant === '4') {
    return (
      <footer className="py-20 px-6" style={{ background: colors.accent }}>
        <div className="max-w-3xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
          <div>
            {names(38, colors.text)}
            <div className="mt-3">{thanks(colors.text)}</div>
          </div>
          <div className="text-center">
            <EditableText
              tag="div"
              value={content.date || '15.08.2026'}
              onChange={(v) => update('date', v)}
              isEditing={isEditing}
              style={{ fontFamily: fontFamilyValue(fonts.heading), fontSize: 'clamp(2.4rem,6vw,3.4rem)', fontWeight: 500, color: colors.primary, lineHeight: 1 }}
            />
          </div>
        </div>
      </footer>
    )
  }

  // Variant 1 — центрированный минимализм (по умолчанию)
  return (
    <footer className="py-20 px-6 text-center" style={{ background: colors.background }}>
      <div className="max-w-lg mx-auto">
        {names(46, colors.text)}
        <div className="my-5 mx-auto w-10 h-px" style={{ background: colors.primary }} />
        {dateEl(colors.primary)}
        <div className="mt-5">{thanks(colors.text)}</div>
      </div>
    </footer>
  )
}
