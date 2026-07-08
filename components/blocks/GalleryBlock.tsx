'use client'
import { useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { ImagePicker } from '@/components/ui/ImagePicker'
import { EditableText } from '@/components/editor/EditableText'
import { fontFamilyValue } from '@/lib/editorPresets'
import { Plus, X } from 'lucide-react'
import type { BlockData, ProjectColors, ProjectFonts } from '@/types'

interface GalleryBlockProps {
  block: BlockData
  colors: ProjectColors
  fonts: ProjectFonts
  isEditing: boolean
  onChange: (content: BlockData['content']) => void
  userId?: string
  projectId?: string
}

export function GalleryBlock({ block, colors, fonts, isEditing, onChange, userId, projectId }: GalleryBlockProps) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [addingNew, setAddingNew] = useState(false)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  const content = block.content as { variant?: string; title: string; images: string; eyebrow?: string }
  const v = content.variant || 'masonry'
  const [lightbox, setLightbox] = useState<number | null>(null)
  const images: string[] = (() => { try { return JSON.parse(content.images) } catch { return [] } })()

  const setImages = (imgs: string[]) => onChange({ ...content, images: JSON.stringify(imgs) })
  const replaceImage = (idx: number, url: string) => { const c = [...images]; c[idx] = url; setImages(c) }
  const removeImage = (idx: number) => setImages(images.filter((_, i) => i !== idx))
  const addImage = (url: string) => setImages([...images, url])

  const ff = fontFamilyValue(fonts.heading)
  const bodyFf = `'${fonts.body}', sans-serif`
  const rad = 'var(--wd-img-radius,1rem)'

  const overlay = (idx: number) => isEditing && (
    <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/15">
      <button onClick={() => setEditingIndex(idx)} className="bg-white/90 rounded-full px-3 py-1.5 shadow"><span className="text-xs font-medium text-[#2C2017]">Сменить</span></button>
      <button onClick={() => removeImage(idx)} className="bg-red-500/90 rounded-full p-2 shadow"><X size={14} className="text-white" /></button>
    </div>
  )

  const tile = (img: string, idx: number, extra = '', ratio = '3/4') => (
    <motion.div key={idx} initial={{ opacity: 0, scale: .94 }} animate={inView ? { opacity: 1, scale: 1 } : {}} transition={{ duration: .5, delay: idx * .06 }}
      onClick={() => { if (!isEditing) setLightbox(idx) }}
      className={`relative group overflow-hidden ${extra} ${!isEditing ? 'cursor-zoom-in' : ''}`} style={{ aspectRatio: ratio, borderRadius: rad }}>
      <img src={img} alt="" loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
      {!isEditing && <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: 'linear-gradient(to top, rgba(0,0,0,.35), transparent 50%)' }} />}
      {overlay(idx)}
    </motion.div>
  )

  const addBtn = (extra = '', ratio = '3/4') => isEditing && (
    <button onClick={() => setAddingNew(true)} className={`flex flex-col items-center justify-center gap-2 border-2 border-dashed transition-all hover:bg-black/[.02] ${extra}`}
      style={{ aspectRatio: ratio, borderRadius: rad, borderColor: colors.primary + '40' }}>
      <span className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: colors.accent }}><Plus size={18} style={{ color: colors.primary }} /></span>
      <span className="text-xs" style={{ color: colors.primary }}>Фото</span>
    </button>
  )

  return (
    <section ref={ref} className="py-14 px-4 md:py-24 md:px-6" style={{ background: `linear-gradient(180deg, ${colors.background}, ${colors.accent}33, ${colors.background})` }}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          {(content.eyebrow === undefined || content.eyebrow) && (
            <EditableText value={content.eyebrow ?? 'Наши фото'} onChange={(x) => onChange({ ...content, eyebrow: x })} isEditing={isEditing} tag="p" placeholder="(надзаголовок)"
              style={{ color: colors.primary, fontFamily: bodyFf, letterSpacing: '.34em', textTransform: 'uppercase', fontSize: 12, marginBottom: 10 }} />
          )}
          <EditableText value={content.title} onChange={(x) => onChange({ ...content, title: x })} isEditing={isEditing} tag="h2"
            style={{ color: colors.text, fontFamily: ff, fontSize: 'clamp(1.9rem,4.5vw,3rem)', fontWeight: 300 }} />
        </div>

        {v === 'strip' ? (
          <div className="flex gap-3 overflow-x-auto pb-3 -mx-4 px-4 md:mx-0 md:px-0" data-lenis-prevent>
            {images.map((img, i) => (
              <div key={i} className="flex-shrink-0" style={{ width: 240 }}>{tile(img, i, '', '3/4')}</div>
            ))}
            <div className="flex-shrink-0" style={{ width: 240 }}>{addBtn('w-full')}</div>
          </div>
        ) : v === 'grid' ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {images.map((img, i) => tile(img, i, '', '1/1'))}
            {addBtn('', '1/1')}
          </div>
        ) : v === 'premium' ? (
          // premium — разноразмерная «журнальная» сетка
          <div className="grid grid-cols-2 md:grid-cols-6 auto-rows-[120px] md:auto-rows-[150px] gap-3">
            {images.map((img, i) => {
              const pat = [
                'col-span-2 row-span-2', 'col-span-2 row-span-1', 'col-span-2 row-span-2',
                'col-span-3 row-span-2', 'col-span-3 row-span-1', 'col-span-2 row-span-1',
              ]
              return tile(img, i, pat[i % pat.length], 'auto')
            })}
            {addBtn('col-span-2', 'auto')}
          </div>
        ) : (
          // masonry — первый кадр крупный
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {images.map((img, i) => tile(img, i, i === 0 ? 'col-span-2 row-span-2' : '', i === 0 ? '1/1' : '3/4'))}
            {addBtn()}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightbox !== null && images[lightbox] && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4" style={{ background: 'rgba(10,8,6,.92)' }} onClick={() => setLightbox(null)}>
          <button className="absolute top-4 right-4 w-11 h-11 rounded-full flex items-center justify-center text-white" style={{ background: 'rgba(255,255,255,.12)' }}><X size={20} /></button>
          <button onClick={(e) => { e.stopPropagation(); setLightbox((lightbox - 1 + images.length) % images.length) }} className="absolute left-4 md:left-8 w-11 h-11 rounded-full flex items-center justify-center text-white text-xl" style={{ background: 'rgba(255,255,255,.12)' }}>‹</button>
          <motion.img key={lightbox} initial={{ opacity: 0, scale: .96 }} animate={{ opacity: 1, scale: 1 }} src={images[lightbox]} alt="" onClick={(e) => e.stopPropagation()}
            className="max-w-full max-h-[86vh] object-contain rounded-lg" style={{ boxShadow: '0 30px 90px rgba(0,0,0,.5)' }} />
          <button onClick={(e) => { e.stopPropagation(); setLightbox((lightbox + 1) % images.length) }} className="absolute right-4 md:right-8 w-11 h-11 rounded-full flex items-center justify-center text-white text-xl" style={{ background: 'rgba(255,255,255,.12)' }}>›</button>
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 text-white/70 text-sm">{lightbox + 1} / {images.length}</div>
        </div>
      )}

      {editingIndex !== null && (
        <ImagePicker onSelect={(url) => { replaceImage(editingIndex, url); setEditingIndex(null) }} onClose={() => setEditingIndex(null)} userId={userId} projectId={projectId} />
      )}
      {addingNew && (
        <ImagePicker onSelect={(url) => { addImage(url); setAddingNew(false) }} onClose={() => setAddingNew(false)} userId={userId} projectId={projectId} />
      )}
    </section>
  )
}
