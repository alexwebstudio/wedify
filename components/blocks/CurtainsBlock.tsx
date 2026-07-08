'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { EditableText } from '@/components/editor/EditableText'
import { ImagePicker } from '@/components/ui/ImagePicker'
import { fontFamilyValue } from '@/lib/editorPresets'
import { displayDate } from '@/lib/siteVariables'
import { Camera } from 'lucide-react'
import type { BlockData, ProjectColors, ProjectFonts } from '@/types'

interface Props {
  block: BlockData
  colors: ProjectColors
  fonts: ProjectFonts
  isEditing: boolean
  onChange: (content: BlockData['content']) => void
  userId?: string
  projectId?: string
  intro?: boolean
  onDone?: () => void
}

/**
 * Premium «Шторки» — полноэкранный Hero. Занавес закрыт, по нажатию кнопки
 * красиво раскрывается, открывая фото/приветствие, затем — переход к сайту.
 */
export function CurtainsBlock({ block, colors, fonts, isEditing, onChange, userId, projectId, intro, onDone }: Props) {
  const content = block.content as { label?: string; names?: string; date?: string; message?: string; backgroundImage?: string }
  const update = (k: string, v: string) => onChange({ ...content, [k]: v })
  const ff = fontFamilyValue(fonts.heading)
  const bodyFf = fontFamilyValue(fonts.body)
  const [open, setOpen] = useState(isEditing)
  const [picker, setPicker] = useState(false)
  const dateStr = content.date ? displayDate(content.date) : ''

  const handleOpen = () => {
    if (isEditing) return
    setOpen(true)
    if (intro) setTimeout(() => onDone?.(), 1900)
  }

  const fabric = (side: 'left' | 'right') => (
    <motion.div initial={false} animate={{ x: open ? (side === 'left' ? '-101%' : '101%') : '0%' }}
      transition={{ duration: 1.5, ease: [0.76, 0, 0.24, 1] }}
      className="absolute top-0 bottom-0 z-20" style={{
        [side]: 0, width: '51%',
        background: `repeating-linear-gradient(90deg, ${colors.primary} 0, ${colors.primary} 18px, ${colors.secondary} 18px, ${colors.secondary} 40px)`,
        boxShadow: 'inset -30px 0 60px rgba(0,0,0,.3), inset 30px 0 60px rgba(0,0,0,.3)',
      } as React.CSSProperties} />
  )

  return (
    <section className="relative overflow-hidden" style={{ minHeight: intro ? '100dvh' : '100vh', background: colors.background }}>
      {/* фон/приветствие под шторами */}
      <div className="absolute inset-0 flex items-center justify-center text-center px-6">
        {content.backgroundImage
          ? <img src={content.backgroundImage} alt="" className="absolute inset-0 w-full h-full object-cover" />
          : <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${colors.accent}, ${colors.background})` }} />}
        <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,.28)' }} />
        <motion.div className="relative z-10" initial={{ opacity: 0, y: 24 }} animate={open ? { opacity: 1, y: 0 } : {}} transition={{ delay: open ? 1 : 0, duration: .8 }}>
          <p style={{ color: '#fff', opacity: .8, fontFamily: bodyFf, letterSpacing: '.4em', textTransform: 'uppercase', fontSize: 11, marginBottom: 16 }}>
            <EditableText tag="span" value={content.label || 'Добро пожаловать'} onChange={(x) => update('label', x)} isEditing={isEditing} />
          </p>
          <EditableText tag="h1" value={content.names || 'Алия & Тимур'} onChange={(x) => update('names', x)} isEditing={isEditing}
            style={{ color: '#fff', fontFamily: ff, fontSize: 'clamp(2.6rem,8vw,5rem)', fontWeight: 300, letterSpacing: '.03em', textShadow: '0 4px 30px rgba(0,0,0,.4)' }} />
          {dateStr && !isEditing && <p style={{ color: '#fff', fontFamily: bodyFf, letterSpacing: '.3em', textTransform: 'uppercase', fontSize: 13, marginTop: 14 }}>{dateStr}</p>}
        </motion.div>
        {isEditing && (
          <button onClick={() => setPicker(true)} className="absolute top-4 left-4 z-30 flex items-center gap-2 px-3 py-2 rounded-xl text-white text-xs" style={{ background: 'rgba(0,0,0,.5)' }}><Camera size={13} /> Фон</button>
        )}
      </div>

      {/* ламбрекен */}
      <div className="absolute top-0 left-0 right-0 z-30" style={{ height: 54, background: `linear-gradient(${colors.secondary},${colors.primary})`, boxShadow: '0 8px 20px rgba(0,0,0,.25)' }} />
      {fabric('left')}
      {fabric('right')}

      {/* кнопка открытия */}
      {!open && !isEditing && (
        <div className="absolute inset-0 z-40 flex flex-col items-center justify-center gap-6">
          <EditableText tag="h1" value={content.names || 'Алия & Тимур'} onChange={() => {}} isEditing={false}
            style={{ color: '#fff', fontFamily: ff, fontSize: 'clamp(2rem,6vw,3.4rem)', fontWeight: 300, textShadow: '0 4px 30px rgba(0,0,0,.5)' }} />
          <motion.button onClick={handleOpen} whileHover={{ scale: 1.05 }} whileTap={{ scale: .96 }}
            className="px-8 py-3.5 rounded-full text-sm font-medium" style={{ background: '#fff', color: colors.text, boxShadow: '0 10px 40px rgba(0,0,0,.3)' }}>
            Открыть приглашение
          </motion.button>
        </div>
      )}
      {isEditing && <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-40 text-xs px-3 py-1.5 rounded-full" style={{ background: 'rgba(0,0,0,.5)', color: '#fff' }}>Шторы: на сайте открываются по кнопке и ведут к содержимому</div>}

      {picker && <ImagePicker onSelect={(url) => { update('backgroundImage', url); setPicker(false) }} onClose={() => setPicker(false)} userId={userId} projectId={projectId} />}
    </section>
  )
}
