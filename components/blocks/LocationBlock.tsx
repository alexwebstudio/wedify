'use client'
import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { EditableText } from '@/components/editor/EditableText'
import { fontFamilyValue } from '@/lib/editorPresets'
import { MapPin, Shirt, Info, ExternalLink } from 'lucide-react'
import type { BlockData, ProjectColors, ProjectFonts } from '@/types'

interface LocationBlockProps {
  block: BlockData
  colors: ProjectColors
  fonts: ProjectFonts
  isEditing: boolean
  onChange: (content: BlockData['content']) => void
}

export function LocationBlock({ block, colors, fonts, isEditing, onChange }: LocationBlockProps) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })
  const content = block.content as {
    variant?: string; title: string; venue: string; address: string; mapUrl: string; dresscode: string; note: string
  }
  const v = content.variant || '1'
  const update = (k: string, val: string) => onChange({ ...content, [k]: val })
  const ff = fontFamilyValue(fonts.heading)
  const bodyFf = `'${fonts.body}', sans-serif`

  const mapBtn = (
    <a href={isEditing ? '#' : content.mapUrl} target="_blank" rel="noreferrer"
      className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium transition-all hover:scale-105"
      style={{ borderRadius: 'var(--wd-btn-radius,12px)', background: colors.primary, color: '#fff' }}>
      <ExternalLink size={14} /> Открыть в картах
    </a>
  )

  const mapVisual = (h: string) => (
    <div className="relative overflow-hidden" style={{ background: colors.accent, borderRadius: 'var(--wd-img-radius,1rem)', height: h }}>
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `linear-gradient(${colors.primary} 1px, transparent 1px), linear-gradient(90deg, ${colors.primary} 1px, transparent 1px)`, backgroundSize: '38px 38px' }} />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-16 h-16 rounded-full flex items-center justify-center shadow-lg" style={{ background: colors.primary }}><MapPin size={26} className="text-white" /></div>
      </div>
    </div>
  )

  const heading = (
    <div className="text-center mb-10">
      <p style={{ color: colors.primary, fontFamily: bodyFf, letterSpacing: '.34em', textTransform: 'uppercase', fontSize: 12, marginBottom: 10 }}>Где и когда</p>
      <EditableText value={content.title} onChange={(x) => update('title', x)} isEditing={isEditing} tag="h2"
        style={{ color: colors.text, fontFamily: ff, fontSize: 'clamp(1.9rem,4.5vw,3rem)', fontWeight: 300 }} />
    </div>
  )

  const editUrl = isEditing && (
    <input type="text" value={content.mapUrl} onChange={(e) => update('mapUrl', e.target.value)} placeholder="Ссылка на карты" className="input-luxury max-w-xs mt-2" style={{ color: colors.text }} />
  )

  // Вариант 3 — красивая карточка (иллюстрация + адрес + кнопка)
  if (v === '3') {
    return (
      <section ref={ref} className="py-16 px-5 md:py-24" style={{ background: `linear-gradient(180deg, ${colors.background}, ${colors.accent}30)` }}>
        <div className="max-w-md mx-auto">
          {heading}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: .6 }}
            className="overflow-hidden" style={{ borderRadius: 'var(--wd-img-radius,1.25rem)', background: colors.background, boxShadow: '0 24px 60px rgba(0,0,0,.12)', border: `1px solid ${colors.primary}15` }}>
            {/* иллюстрация-карта */}
            <div className="relative" style={{ height: 150, background: colors.accent }}>
              <div className="absolute inset-0 opacity-15" style={{ backgroundImage: `linear-gradient(${colors.primary} 1px, transparent 1px), linear-gradient(90deg, ${colors.primary} 1px, transparent 1px)`, backgroundSize: '32px 32px' }} />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg" style={{ background: colors.primary }}><MapPin size={24} className="text-white" /></div>
              </div>
            </div>
            <div className="p-6 text-center">
              <EditableText value={content.venue} onChange={(x) => update('venue', x)} isEditing={isEditing} tag="p"
                style={{ color: colors.text, fontFamily: ff, fontSize: 22, fontWeight: 500, marginBottom: 6 }} />
              <EditableText value={content.address} onChange={(x) => update('address', x)} isEditing={isEditing} tag="p"
                style={{ color: colors.text + 'AA', fontFamily: bodyFf, fontSize: 14, marginBottom: 18 }} />
              <a href={isEditing ? '#' : content.mapUrl} target="_blank" rel="noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium transition-transform hover:scale-105"
                style={{ borderRadius: 'var(--wd-btn-radius,12px)', background: colors.primary, color: '#fff' }}>
                <ExternalLink size={15} /> Посмотреть на карте
              </a>
              {editUrl}
            </div>
          </motion.div>
        </div>
      </section>
    )
  }

  // Вариант 2 — по центру, крупный адрес
  if (v === '2') {
    return (
      <section ref={ref} className="py-16 px-5 md:py-24" style={{ backgroundColor: colors.background }}>
        <div className="max-w-2xl mx-auto text-center">
          {heading}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: .6 }}
            className="flex flex-col items-center gap-5">
            <EditableText value={content.venue} onChange={(x) => update('venue', x)} isEditing={isEditing} tag="p"
              style={{ color: colors.text, fontFamily: ff, fontSize: 'clamp(1.5rem,4vw,2.2rem)', fontWeight: 400 }} />
            <EditableText value={content.address} onChange={(x) => update('address', x)} isEditing={isEditing} tag="p"
              style={{ color: colors.text + 'AA', fontFamily: bodyFf, fontSize: 15 }} />
            <div className="w-full max-w-lg my-2">{mapVisual('220px')}</div>
            {mapBtn}{editUrl}
            {(content.note || isEditing) && (
              <div className="mt-4 p-4 rounded-2xl w-full max-w-lg" style={{ background: colors.primary + '10', border: `1px solid ${colors.primary}22` }}>
                <div className="flex items-start gap-3 text-left">
                  <Info size={18} style={{ color: colors.primary, marginTop: 2, flexShrink: 0 }} />
                  <EditableText value={content.note} onChange={(x) => update('note', x)} isEditing={isEditing} multiline tag="p"
                    style={{ color: colors.text + 'CC', fontSize: 14, lineHeight: 1.6 }} />
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </section>
    )
  }

  // Вариант 1 — сплит (карта + детали)
  return (
    <section ref={ref} className="py-14 px-4 md:py-24 md:px-6" style={{ backgroundColor: colors.background }}>
      <div className="max-w-4xl mx-auto">
        {heading}
        <div className="grid md:grid-cols-2 gap-8">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ delay: .15 }} className="flex flex-col items-center justify-center gap-4">
            {mapVisual('280px')}
            {mapBtn}{editUrl}
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 20 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ delay: .25 }} className="space-y-4">
            <div className="p-5 rounded-2xl" style={{ background: colors.accent + '40', border: `1px solid ${colors.primary}15` }}>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: colors.primary + '20', color: colors.primary }}><MapPin size={18} /></div>
                <div className="flex-1 min-w-0">
                  <p style={{ color: colors.text, fontFamily: bodyFf, fontSize: 10, letterSpacing: '.16em', textTransform: 'uppercase', opacity: .6, marginBottom: 4 }}>Место проведения</p>
                  <EditableText value={content.venue} onChange={(x) => update('venue', x)} isEditing={isEditing} tag="p" style={{ color: colors.text, fontFamily: ff, fontWeight: 500 }} />
                  <EditableText value={content.address} onChange={(x) => update('address', x)} isEditing={isEditing} tag="p" style={{ color: colors.text + 'B0', fontSize: 14, marginTop: 4 }} />
                </div>
              </div>
            </div>
            {(content.dresscode || isEditing) && (
              <div className="p-5 rounded-2xl" style={{ background: colors.accent + '40', border: `1px solid ${colors.primary}15` }}>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: colors.primary + '20', color: colors.primary }}><Shirt size={18} /></div>
                  <div className="flex-1">
                    <p style={{ color: colors.text, fontFamily: bodyFf, fontSize: 10, letterSpacing: '.16em', textTransform: 'uppercase', opacity: .6, marginBottom: 4 }}>Дресс-код</p>
                    <EditableText value={content.dresscode} onChange={(x) => update('dresscode', x)} isEditing={isEditing} tag="p" style={{ color: colors.text, fontFamily: ff, fontWeight: 500 }} />
                  </div>
                </div>
              </div>
            )}
            {(content.note || isEditing) && (
              <div className="p-5 rounded-2xl" style={{ background: colors.primary + '10', border: `1px solid ${colors.primary}20` }}>
                <div className="flex items-start gap-3">
                  <Info size={18} style={{ color: colors.primary, marginTop: 2, flexShrink: 0 }} />
                  <EditableText value={content.note} onChange={(x) => update('note', x)} isEditing={isEditing} multiline tag="p" style={{ color: colors.text + 'CC', fontSize: 14, lineHeight: 1.6 }} />
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
