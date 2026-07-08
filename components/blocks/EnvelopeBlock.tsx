'use client'
import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { EditableText } from '@/components/editor/EditableText'
import { fontFamilyValue } from '@/lib/editorPresets'
import { displayDate } from '@/lib/siteVariables'
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
 * Premium «Открывающийся конверт» — полноэкранный блок с видео (envelope.mp4).
 * Имена/дата поверх, по нажатию запускается видео открытия, затем плавный
 * переход к сайту.
 */
export function EnvelopeBlock({ block, colors, fonts, isEditing, onChange, intro, onDone }: Props) {
  const content = block.content as { names?: string; date?: string; note?: string; hint?: string; video?: string }
  const update = (k: string, v: string) => onChange({ ...content, [k]: v })
  const ff = fontFamilyValue(fonts.heading)
  const bodyFf = fontFamilyValue(fonts.body)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [opening, setOpening] = useState(false)
  const [flash, setFlash] = useState(false)
  const done = useRef(false)
  const src = content.video || '/premium/envelope.mp4'

  const open = () => {
    if (isEditing || done.current) return
    done.current = true
    setOpening(true)
    const v = videoRef.current
    if (v) { try { v.currentTime = 0 } catch {} v.play().catch(() => {}) }
    const finish = () => {
      setFlash(true)
      setTimeout(() => { onDone?.() }, 650)
    }
    if (v) v.addEventListener('ended', finish, { once: true })
    setTimeout(finish, 3300)
  }

  const dateStr = content.date ? displayDate(content.date) : ''

  return (
    <section onClick={open} className="relative overflow-hidden flex items-center justify-center"
      style={{ minHeight: intro ? '100dvh' : '100vh', background: '#0d0b08', cursor: isEditing ? 'default' : 'pointer' }}>
      <video ref={videoRef} playsInline muted preload="auto" className="absolute inset-0 w-full h-full object-cover"
        style={{ opacity: .9 }}>
        <source src={src} type="video/mp4" />
      </video>
      <div className="absolute inset-0" style={{ background: opening ? 'rgba(0,0,0,.15)' : 'linear-gradient(to bottom, rgba(0,0,0,.35), rgba(0,0,0,.55))' }} />

      {!opening && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .8 }}
          className="relative z-10 text-center px-6">
          <p style={{ color: '#fff', opacity: .7, fontFamily: bodyFf, letterSpacing: '.4em', textTransform: 'uppercase', fontSize: 11, marginBottom: 18 }}>Вы приглашены</p>
          <EditableText tag="h1" value={content.names || 'Алия & Тимур'} onChange={(x) => update('names', x)} isEditing={isEditing}
            style={{ color: '#fff', fontFamily: ff, fontSize: 'clamp(2.6rem,8vw,5rem)', fontWeight: 300, letterSpacing: '.03em', lineHeight: 1.1, textShadow: '0 4px 30px rgba(0,0,0,.4)' }} />
          {(dateStr || isEditing) && (
            isEditing
              ? <input type="date" value={content.date || ''} onChange={(e) => update('date', e.target.value)} onClick={(e) => e.stopPropagation()} className="mt-3 bg-white/15 text-white rounded-lg px-3 py-1.5 text-center outline-none" />
              : <p style={{ color: '#fff', fontFamily: bodyFf, letterSpacing: '.3em', textTransform: 'uppercase', fontSize: 13, marginTop: 14 }}>{dateStr}</p>
          )}
          {(content.note || isEditing) && (
            <EditableText tag="p" value={content.note || ''} onChange={(x) => update('note', x)} isEditing={isEditing} placeholder="Доп. информация (необязательно)"
              className="mt-2" style={{ color: 'rgba(255,255,255,.75)', fontFamily: bodyFf, fontSize: 14 }} />
          )}
          {!isEditing && (
            <motion.div animate={{ y: [0, -6, 0] }} transition={{ repeat: Infinity, duration: 1.8 }}
              className="mt-10 inline-flex items-center gap-2 px-6 py-3 rounded-full"
              style={{ background: 'rgba(255,255,255,.14)', border: '1px solid rgba(255,255,255,.3)', color: '#fff', fontFamily: bodyFf, fontSize: 13, letterSpacing: '.1em', backdropFilter: 'blur(6px)' }}>
              ✉️ Нажмите, чтобы открыть
            </motion.div>
          )}
          {isEditing && <p className="mt-8 text-xs" style={{ color: 'rgba(255,255,255,.6)' }}>На опубликованном сайте по нажатию проигрывается видео открытия конверта</p>}
        </motion.div>
      )}

      <motion.div className="absolute inset-0 z-20 pointer-events-none bg-white" initial={{ opacity: 0 }} animate={{ opacity: flash ? 1 : 0 }} transition={{ duration: .5 }} />
    </section>
  )
}
