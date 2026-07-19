'use client'
import { useRef, useState } from 'react'
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
 * Premium «Открывающийся конверт» — ТОЛЬКО видео конверта, без текста/имён/кнопок.
 * Открывается по нажатию в любое место экрана. Снизу — аккуратная подсказка.
 */
export function EnvelopeBlock({ block, colors, fonts, isEditing, onChange, intro, onDone }: Props) {
  const content = block.content as { hint?: string; video?: string }
  const headFf = fontFamilyValue(fonts.heading)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [opening, setOpening] = useState(false)
  const [flash, setFlash] = useState(false)
  const done = useRef(false)
  const src = content.video || '/premium/envelope.mp4'
  const hint = content.hint ?? 'Нажмите на конвертик'

  const open = () => {
    if (isEditing || done.current) return
    done.current = true
    setOpening(true)
    const v = videoRef.current
    if (v) { try { v.currentTime = 0 } catch {} v.play().catch(() => {}) }
    const finish = () => { setFlash(true); setTimeout(() => { onDone?.() }, 650) }
    if (v) v.addEventListener('ended', finish, { once: true })
    setTimeout(finish, 3300)
  }

  return (
    <section onClick={open} className="relative overflow-hidden flex items-end justify-center"
      style={{ minHeight: intro ? '100dvh' : '100vh', background: '#0d0b08', cursor: isEditing ? 'default' : 'pointer' }}>
      <video ref={videoRef} playsInline muted preload="auto" className="absolute inset-0 w-full h-full object-cover">
        <source src={src} type="video/mp4" />
      </video>
      {/* лёгкое затемнение только у низа, чтобы подсказка читалась */}
      <div className="absolute inset-x-0 bottom-0 h-40 pointer-events-none" style={{ background: opening ? 'transparent' : 'linear-gradient(to top, rgba(0,0,0,.45), transparent)' }} />

      {/* минималистичная подсказка снизу — без имён/дат/кнопок */}
      {!opening && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: .4 }}
          className="relative z-10 pb-[6vh] flex flex-col items-center gap-3">
          <motion.span animate={{ y: [0, -5, 0], opacity: [0.85, 1, 0.85] }} transition={{ repeat: Infinity, duration: 2.2 }}
            style={{ color: colors.primary, fontSize: 24, lineHeight: 1, textShadow: '0 2px 12px rgba(0,0,0,.6)' }}>✦</motion.span>
          <div className="flex items-center gap-3">
            <span style={{ width: 34, height: 1, background: 'rgba(255,255,255,.55)' }} />
            <EditableText tag="p" value={hint} onChange={(x) => onChange({ ...content, hint: x })} isEditing={isEditing} placeholder="Подсказка"
              style={{ color: '#fff', fontFamily: headFf, fontSize: 17, letterSpacing: '.12em', textShadow: '0 2px 14px rgba(0,0,0,.7)' }} />
            <span style={{ width: 34, height: 1, background: 'rgba(255,255,255,.55)' }} />
          </div>
        </motion.div>
      )}

      {isEditing && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 text-[11px] px-3 py-1.5 rounded-full" style={{ background: 'rgba(0,0,0,.55)', color: '#fff' }}>
          Конверт: на сайте открывается нажатием в любое место. Текста и кнопок нет — только видео и подсказка снизу.
        </div>
      )}

      <motion.div className="absolute inset-0 z-20 pointer-events-none bg-white" initial={{ opacity: 0 }} animate={{ opacity: flash ? 1 : 0 }} transition={{ duration: .5 }} />
    </section>
  )
}
