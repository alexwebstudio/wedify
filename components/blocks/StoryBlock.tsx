'use client'
import { useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { EditableText } from '@/components/editor/EditableText'
import { ImagePicker } from '@/components/ui/ImagePicker'
import { fontFamilyValue } from '@/lib/editorPresets'
import { Camera } from 'lucide-react'
import type { BlockData, ProjectColors, ProjectFonts } from '@/types'

interface StoryBlockProps {
  block: BlockData
  colors: ProjectColors
  fonts: ProjectFonts
  isEditing: boolean
  onChange: (content: BlockData['content']) => void
  userId?: string
  projectId?: string
}

export function StoryBlock({ block, colors, fonts, isEditing, onChange, userId, projectId }: StoryBlockProps) {
  const [showPicker, setShowPicker] = useState(false)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  const content = block.content as {
    variant?: string; title: string; text: string; image: string; meetDate: string; proposeDate: string
  }
  const v = content.variant || '1'
  const update = (key: string, val: string) => onChange({ ...content, [key]: val })
  const ff = fontFamilyValue(fonts.heading)
  const bodyFf = `'${fonts.body}', sans-serif`

  const heading = (align: 'center' | 'left' = 'center') => (
    <div style={{ textAlign: align, marginBottom: align === 'center' ? 40 : 20 }}>
      <p style={{ color: colors.primary, fontFamily: bodyFf, letterSpacing: '.34em', textTransform: 'uppercase', fontSize: 12, marginBottom: 10 }}>История любви</p>
      <EditableText value={content.title} onChange={(x) => update('title', x)} isEditing={isEditing} tag="h2"
        style={{ color: colors.text, fontFamily: ff, fontSize: 'clamp(1.9rem,4.5vw,3rem)', fontWeight: 300 }} />
    </div>
  )

  const photo = (ratio = '3/4') => (
    <div className="relative">
      <div className="relative overflow-hidden shadow-xl" style={{ aspectRatio: ratio, borderRadius: 'var(--wd-img-radius,1rem)' }}>
        {content.image
          ? <img src={content.image} alt="" loading="lazy" className="w-full h-full object-cover" />
          : <div className="w-full h-full flex items-center justify-center" style={{ background: colors.accent }}><span style={{ color: colors.secondary }}>Фото пары</span></div>}
      </div>
      {isEditing && (
        <button onClick={() => setShowPicker(true)} className="absolute top-3 left-3 flex items-center gap-2 px-3 py-2 rounded-xl text-white text-xs" style={{ background: 'rgba(0,0,0,.45)', backdropFilter: 'blur(6px)' }}>
          <Camera size={12} /> Сменить фото
        </button>
      )}
    </div>
  )

  const textCol = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <EditableText value={content.text} onChange={(x) => update('text', x)} isEditing={isEditing} multiline tag="p"
        style={{ color: colors.text + 'CC', fontFamily: bodyFf, fontStyle: 'italic', fontSize: 17, lineHeight: 1.75 }} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, paddingTop: 6 }}>
        {[{ label: 'Наша встреча', key: 'meetDate', icon: '💫' }, { label: 'Предложение', key: 'proposeDate', icon: '💍' }, { label: 'Свадьба', key: '', icon: '💒' }].map((it, i) => (
          <div key={i} className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg flex-shrink-0" style={{ background: colors.accent }}>{it.icon}</div>
            <div>
              <p style={{ color: colors.text, fontFamily: bodyFf, fontSize: 10, letterSpacing: '.16em', textTransform: 'uppercase', opacity: .6 }}>{it.label}</p>
              {it.key
                ? (isEditing
                    ? <input type="text" value={content[it.key as 'meetDate' | 'proposeDate']} onChange={(e) => update(it.key, e.target.value)} className="input-luxury text-sm py-1 px-2" style={{ color: colors.text }} placeholder="Дата" />
                    : <p style={{ color: colors.text, fontFamily: ff, fontWeight: 500 }}>{content[it.key as 'meetDate' | 'proposeDate']}</p>)
                : <p style={{ color: colors.primary, fontFamily: ff, fontWeight: 500 }}>Скоро ✨</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  // editorial — журнальная вёрстка
  if (v === 'editorial') {
    return (
      <section ref={ref} className="py-16 px-5 md:py-24" style={{ backgroundColor: colors.background }}>
        <div className="max-w-5xl mx-auto grid md:grid-cols-12 gap-8 items-start">
          <div className="md:col-span-5">
            <p style={{ color: colors.primary, fontFamily: bodyFf, letterSpacing: '.34em', textTransform: 'uppercase', fontSize: 12, marginBottom: 12 }}>История любви</p>
            <EditableText value={content.title} onChange={(x) => update('title', x)} isEditing={isEditing} tag="h2"
              style={{ color: colors.text, fontFamily: ff, fontSize: 'clamp(2.2rem,5vw,3.6rem)', fontWeight: 300, lineHeight: 1.05 }} />
            <div className="mt-6 max-w-[240px]">{photo('4/5')}</div>
          </div>
          <div className="md:col-span-7 md:pt-10">
            <EditableText value={content.text} onChange={(x) => update('text', x)} isEditing={isEditing} multiline tag="p"
              style={{ color: colors.text + 'CC', fontFamily: bodyFf, fontSize: 18, lineHeight: 1.85, columnCount: 1 }} />
            <div className="mt-6 flex gap-8">
              {[{ l: 'Встреча', k: 'meetDate' }, { l: 'Предложение', k: 'proposeDate' }].map((it) => (
                <div key={it.k}>
                  <p style={{ color: colors.text, opacity: .5, fontSize: 10, letterSpacing: '.16em', textTransform: 'uppercase', fontFamily: bodyFf }}>{it.l}</p>
                  {isEditing
                    ? <input value={content[it.k as 'meetDate' | 'proposeDate']} onChange={(e) => update(it.k, e.target.value)} className="input-luxury text-sm py-1 px-2" style={{ color: colors.text }} placeholder="Дата" />
                    : <p style={{ color: colors.primary, fontFamily: ff, fontSize: 18 }}>{content[it.k as 'meetDate' | 'proposeDate'] || '—'}</p>}
                </div>
              ))}
            </div>
          </div>
        </div>
        {showPicker && <ImagePicker onSelect={(url) => { update('image', url); setShowPicker(false) }} onClose={() => setShowPicker(false)} userId={userId} projectId={projectId} />}
      </section>
    )
  }

  // cards — рассказ + карточки-вехи
  if (v === 'cards') {
    return (
      <section ref={ref} className="py-16 px-5 md:py-24" style={{ background: `linear-gradient(180deg,${colors.background},${colors.accent}30)` }}>
        <div className="max-w-3xl mx-auto text-center">
          {heading('center')}
          <EditableText value={content.text} onChange={(x) => update('text', x)} isEditing={isEditing} multiline tag="p"
            className="max-w-xl mx-auto" style={{ color: colors.text + 'CC', fontFamily: bodyFf, fontStyle: 'italic', fontSize: 17, lineHeight: 1.75 }} />
          <div className="grid sm:grid-cols-3 gap-4 mt-10">
            {[{ l: 'Встреча', k: 'meetDate', icon: '💫' }, { l: 'Предложение', k: 'proposeDate', icon: '💍' }, { l: 'Свадьба', k: '', icon: '💒' }].map((it, i) => (
              <div key={i} className="rounded-2xl p-5" style={{ background: colors.background, border: `1px solid ${colors.primary}18`, boxShadow: '0 10px 30px rgba(0,0,0,.05)' }}>
                <div className="text-2xl mb-2">{it.icon}</div>
                <p style={{ color: colors.text, opacity: .55, fontSize: 10, letterSpacing: '.16em', textTransform: 'uppercase', fontFamily: bodyFf, marginBottom: 4 }}>{it.l}</p>
                {it.k
                  ? (isEditing
                    ? <input value={content[it.k as 'meetDate' | 'proposeDate']} onChange={(e) => update(it.k, e.target.value)} className="input-luxury text-sm py-1 px-2 text-center" style={{ color: colors.text }} placeholder="Дата" />
                    : <p style={{ color: colors.text, fontFamily: ff, fontWeight: 500 }}>{content[it.k as 'meetDate' | 'proposeDate']}</p>)
                  : <p style={{ color: colors.primary, fontFamily: ff, fontWeight: 500 }}>Скоро ✨</p>}
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  // stacked (по центру)
  const stacked = v === '3'

  return (
    <section ref={ref} className="py-14 px-5 md:py-24" style={{ backgroundColor: colors.background }}>
      <div className="max-w-5xl mx-auto">
        {heading(stacked ? 'center' : 'center')}
        {stacked ? (
          <motion.div initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: .7 }}
            className="max-w-xl mx-auto flex flex-col items-center gap-8 text-center">
            <div className="w-full max-w-sm">{photo('4/3')}</div>
            <div className="w-full">{textCol()}</div>
          </motion.div>
        ) : (
          <div className="grid md:grid-cols-2 gap-10 md:gap-14 items-center">
            <motion.div initial={{ opacity: 0, x: v === '1' ? 30 : -30 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: .7 }}
              className={v === '1' ? 'md:order-2' : ''}>
              {photo()}
            </motion.div>
            <motion.div initial={{ opacity: 0, x: v === '1' ? -30 : 30 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: .7, delay: .1 }}
              className={v === '1' ? 'md:order-1' : ''}>
              {textCol()}
            </motion.div>
          </div>
        )}
      </div>
      {showPicker && (
        <ImagePicker onSelect={(url) => { update('image', url); setShowPicker(false) }} onClose={() => setShowPicker(false)} userId={userId} projectId={projectId} />
      )}
    </section>
  )
}
