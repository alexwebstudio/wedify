'use client'
import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { ImagePicker } from '@/components/ui/ImagePicker'
import { EditableText } from '@/components/editor/EditableText'
import { Plus, X } from 'lucide-react'
import type { BlockData, ProjectColors, ProjectFonts } from '@/types'


function resolveFontFamily(font: string): string {
  const cursive = ['Great Vibes', 'Marck Script']
  if (cursive.some(f => font.includes(f))) return `'${font}', cursive`
  return `'${font}', serif`
}

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

  const content = block.content as { title: string; images: string }
  const images: string[] = (() => {
    try { return JSON.parse(content.images) } catch { return [] }
  })()

  const setImages = (imgs: string[]) => onChange({ ...content, images: JSON.stringify(imgs) })
  const replaceImage = (idx: number, url: string) => {
    const copy = [...images]; copy[idx] = url; setImages(copy)
  }
  const removeImage = (idx: number) => setImages(images.filter((_, i) => i !== idx))
  const addImage = (url: string) => setImages([...images, url])

  return (
    <section ref={ref} className="py-12 px-4 md:py-20 md:px-6" style={{ background: `linear-gradient(180deg, ${colors.background}, ${colors.accent}40, ${colors.background})` }}>
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <p className="text-sm tracking-[0.4em] uppercase mb-3" style={{ color: colors.primary, fontFamily: fonts.body }}>
            Наши фото
          </p>
          <EditableText
            value={content.title}
            onChange={(v) => onChange({ ...content, title: v })}
            isEditing={isEditing}
            tag="h2"
            className="text-4xl md:text-5xl font-light"
            style={{ color: colors.text, fontFamily: resolveFontFamily(fonts.heading) } as React.CSSProperties}
          />
        </motion.div>

        {/* Masonry-ish grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {images.map((img, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
              className={`relative group rounded-2xl overflow-hidden ${
                idx === 0 ? 'col-span-2 row-span-2' : ''
              }`}
              style={{ aspectRatio: idx === 0 ? '1/1' : '3/4' }}
            >
              <img src={img} alt="" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />

              {isEditing && (
                <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => setEditingIndex(idx)}
                    className="bg-white/90 rounded-full p-2 shadow-lg hover:bg-white transition-colors"
                  >
                    <span className="text-xs font-medium text-[#2C2017]">Сменить</span>
                  </button>
                  <button
                    onClick={() => removeImage(idx)}
                    className="bg-red-500/90 rounded-full p-2 shadow-lg hover:bg-red-500 transition-colors"
                  >
                    <X size={14} className="text-white" />
                  </button>
                </div>
              )}
            </motion.div>
          ))}

          {/* Add button */}
          {isEditing && (
            <motion.button
              onClick={() => setAddingNew(true)}
              initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
              className="rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-2 aspect-[3/4] transition-all hover:border-[#C4A97D] hover:bg-[#C4A97D]/5"
              style={{ borderColor: colors.primary + '40' }}
            >
              <div className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ background: colors.accent }}>
                <Plus size={20} style={{ color: colors.primary }} />
              </div>
              <span className="text-xs" style={{ color: colors.primary }}>Добавить фото</span>
            </motion.button>
          )}
        </div>
      </div>

      {editingIndex !== null && (
        <ImagePicker
          onSelect={(url) => { replaceImage(editingIndex, url); setEditingIndex(null) }}
          onClose={() => setEditingIndex(null)}
          userId={userId}
          projectId={projectId}
        />
      )}
      {addingNew && (
        <ImagePicker
          onSelect={(url) => { addImage(url); setAddingNew(false) }}
          onClose={() => setAddingNew(false)}
          userId={userId}
          projectId={projectId}
        />
      )}
    </section>
  )
}
