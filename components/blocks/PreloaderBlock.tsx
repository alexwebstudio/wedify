'use client'
import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { EditableText } from '@/components/editor/EditableText'
import { fontFamilyValue } from '@/lib/editorPresets'
import type { BlockData, ProjectColors, ProjectFonts } from '@/types'

interface Props {
  block: BlockData
  colors: ProjectColors
  fonts: ProjectFonts
  isEditing: boolean
  onChange: (content: BlockData['content']) => void
  intro?: boolean
  onDone?: () => void
}

/**
 * Premium Preloader — полноэкранное вступление 0→100 (~3.5с),
 * плавная анимация счётчика + прогресс-бар, затем автозапуск следующего этапа.
 */
export function PreloaderBlock({ block, colors, fonts, isEditing, onChange, intro, onDone }: Props) {
  const content = block.content as { names?: string; subtitle?: string }
  const update = (k: string, v: string) => onChange({ ...content, [k]: v })
  const ff = fontFamilyValue(fonts.heading)
  const bodyFf = fontFamilyValue(fonts.body)
  const [pct, setPct] = useState(isEditing ? 100 : 0)
  const raf = useRef<number | undefined>(undefined)

  useEffect(() => {
    if (isEditing || !intro) return
    const s1 = 1500, s1To = 60, s2 = 2000, total = s1 + s2
    let start: number | null = null
    const ease = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2)
    const frame = (ts: number) => {
      if (start === null) start = ts
      const e = ts - start
      let v: number
      if (e <= s1) v = ease(e / s1) * s1To
      else if (e <= total) v = s1To + ease((e - s1) / s2) * (100 - s1To)
      else v = 100
      setPct(Math.floor(v))
      if (e < total) raf.current = requestAnimationFrame(frame)
      else { setPct(100); setTimeout(() => onDone?.(), 500) }
    }
    raf.current = requestAnimationFrame(frame)
    return () => { if (raf.current) cancelAnimationFrame(raf.current) }
  }, [isEditing, intro, onDone])

  return (
    <section className="relative flex items-center justify-center px-6 text-center overflow-hidden"
      style={{ minHeight: intro ? '100dvh' : '100vh', background: `radial-gradient(circle at 50% 38%, ${colors.accent}, ${colors.background})` }}>
      <div style={{ maxWidth: 560 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, marginBottom: 22 }}>
          <span style={{ width: 44, height: 1, background: colors.primary, opacity: .5 }} />
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: colors.primary }} />
          <span style={{ width: 44, height: 1, background: colors.primary, opacity: .5 }} />
        </div>
        <EditableText tag="h2" value={content.names || 'Алия & Тимур'} onChange={(x) => update('names', x)} isEditing={isEditing}
          style={{ color: colors.text, fontFamily: ff, fontSize: 'clamp(2.4rem,7vw,4.4rem)', fontWeight: 300, letterSpacing: '.03em', lineHeight: 1.1 }} />
        <EditableText tag="p" value={content.subtitle || 'Приглашение на свадьбу'} onChange={(x) => update('subtitle', x)} isEditing={isEditing}
          className="mt-3 opacity-60" style={{ color: colors.text, fontFamily: bodyFf, fontSize: 13, letterSpacing: '.34em', textTransform: 'uppercase' }} />
        <div style={{ fontFamily: ff, fontSize: 54, color: colors.primary, marginTop: 34, lineHeight: 1 }}>{pct}</div>
        <div style={{ width: 220, height: 2, background: colors.primary + '25', borderRadius: 2, margin: '14px auto 0', overflow: 'hidden' }}>
          <motion.div style={{ height: '100%', background: colors.primary }} animate={{ width: `${pct}%` }} transition={{ ease: 'linear', duration: .1 }} />
        </div>
        {isEditing && <p className="mt-6 text-xs opacity-40" style={{ color: colors.text }}>Прелоадер: на опубликованном сайте идёт ~3,5с и сам открывает следующий блок</p>}
      </div>
    </section>
  )
}
