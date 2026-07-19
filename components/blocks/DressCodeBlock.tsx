'use client'
import { useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { EditableText } from '@/components/editor/EditableText'
import { ImagePicker } from '@/components/ui/ImagePicker'
import { fontFamilyValue } from '@/lib/editorPresets'
import { Camera, Plus, X } from 'lucide-react'
import type { BlockData, ProjectColors, ProjectFonts } from '@/types'

interface Props {
  block: BlockData
  colors: ProjectColors
  fonts: ProjectFonts
  isEditing: boolean
  onChange: (content: BlockData['content']) => void
  userId?: string
  projectId?: string
}

// Блок «Дресс-код»: иллюстрация + палитра цветов + описание + рекомендации.
export function DressCodeBlock({ block, colors, fonts, isEditing, onChange, userId, projectId }: Props) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })
  const [picker, setPicker] = useState(false)
  const content = block.content as { title?: string; description?: string; recommendations?: string; image?: string; palette?: string }
  const update = (k: string, v: string) => onChange({ ...content, [k]: v })
  const ff = fontFamilyValue(fonts.heading)
  const bodyFf = fontFamilyValue(fonts.body)

  const palette: string[] = (() => { try { return JSON.parse(content.palette || '[]') } catch { return [] } })()
  const setPalette = (p: string[]) => onChange({ ...content, palette: JSON.stringify(p) })
  const defaultPalette = palette.length ? palette : ['#E8DED2', '#C9B79C', '#8B6F47', '#5A4A3A', '#2C2017']

  return (
    <section ref={ref} className="py-16 px-5 md:py-24" style={{ background: `linear-gradient(180deg, ${colors.background}, ${colors.accent}30)` }}>
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10 items-center">
        {/* иллюстрация */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: .6 }} className="relative">
          <div className="relative overflow-hidden shadow-xl" style={{ aspectRatio: '4/5', borderRadius: 'var(--wd-img-radius,1rem)' }}>
            {content.image
              ? <img src={content.image} alt="" loading="lazy" className="w-full h-full object-cover" />
              : <div className="w-full h-full flex items-center justify-center text-5xl" style={{ background: `linear-gradient(135deg, ${defaultPalette[1]}, ${defaultPalette[3]})` }}>👗🤵</div>}
          </div>
          {isEditing && (
            <button onClick={() => setPicker(true)} className="absolute top-3 left-3 flex items-center gap-2 px-3 py-2 rounded-xl text-white text-xs" style={{ background: 'rgba(0,0,0,.5)' }}><Camera size={12} /> Иллюстрация</button>
          )}
        </motion.div>

        {/* текст + палитра */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: .6, delay: .1 }}>
          <p style={{ color: colors.primary, fontFamily: bodyFf, letterSpacing: '.34em', textTransform: 'uppercase', fontSize: 12, marginBottom: 10 }}>Дресс-код</p>
          <EditableText tag="h2" value={content.title || 'Дресс-код торжества'} onChange={(x) => update('title', x)} isEditing={isEditing}
            style={{ color: colors.text, fontFamily: ff, fontSize: 'clamp(1.9rem,4.5vw,3rem)', fontWeight: 300, marginBottom: 16 }} />
          <EditableText tag="p" value={content.description || 'Будем благодарны, если вы поддержите палитру нашего праздника в своих нарядах.'} onChange={(x) => update('description', x)} isEditing={isEditing} multiline
            style={{ color: colors.text + 'CC', fontFamily: bodyFf, fontSize: 16, lineHeight: 1.7, marginBottom: 20 }} />

          {/* палитра */}
          <div className="flex items-center gap-2.5 mb-5 flex-wrap">
            {defaultPalette.map((c, i) => (
              <div key={i} className="relative group">
                <div className="rounded-full shadow-sm" style={{ width: 40, height: 40, background: c, border: '2px solid #fff', boxShadow: '0 2px 8px rgba(0,0,0,.15)' }} />
                {isEditing && (
                  <>
                    <input type="color" value={c} onChange={(e) => { const p = [...defaultPalette]; p[i] = e.target.value; setPalette(p) }}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
                    <button onClick={() => setPalette(defaultPalette.filter((_, idx) => idx !== i))} className="absolute -top-1 -right-1 bg-red-500 rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"><X size={10} className="text-white" /></button>
                  </>
                )}
              </div>
            ))}
            {isEditing && defaultPalette.length < 8 && (
              <button onClick={() => setPalette([...defaultPalette, '#C9B79C'])} className="w-10 h-10 rounded-full border-2 border-dashed flex items-center justify-center" style={{ borderColor: colors.primary + '55', color: colors.primary }}><Plus size={16} /></button>
            )}
          </div>

          <div className="p-4 rounded-2xl" style={{ background: colors.primary + '10', border: `1px solid ${colors.primary}20` }}>
            <p style={{ color: colors.text, fontFamily: bodyFf, fontSize: 11, letterSpacing: '.14em', textTransform: 'uppercase', opacity: .6, marginBottom: 6 }}>Рекомендации</p>
            <EditableText tag="p" value={content.recommendations || 'Дамы — коктейльные и вечерние платья в тёплых тонах. Господа — костюмы бежевой и коричневой гаммы. Просьба избегать белого и ярко-красного.'} onChange={(x) => update('recommendations', x)} isEditing={isEditing} multiline
              style={{ color: colors.text + 'CC', fontFamily: bodyFf, fontSize: 14.5, lineHeight: 1.65 }} />
          </div>
        </motion.div>
      </div>
      {picker && <ImagePicker onSelect={(url) => { update('image', url); setPicker(false) }} onClose={() => setPicker(false)} userId={userId} projectId={projectId} />}
    </section>
  )
}
