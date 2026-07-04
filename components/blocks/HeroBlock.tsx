'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { EditableText } from '@/components/editor/EditableText'
import { ImagePicker } from '@/components/ui/ImagePicker'
import { Camera } from 'lucide-react'
import type { BlockData, ProjectColors, ProjectFonts } from '@/types'

function getFontFamily(font: string): string {
  // Cursive fonts shouldn't have 'serif' appended
  const cursiveFonts = ['Great Vibes', 'Marck Script']
  if (cursiveFonts.some(f => font.includes(f))) return `'${font}', cursive`
  return `'${font}', serif`
}


function resolveFontFamily(font: string): string {
  const cursive = ['Great Vibes', 'Marck Script', 'Comfortaa']
  const sansSerif = ['Manrope', 'Montserrat', 'Inter', 'Tenor Sans', 'Forum']
  if (cursive.some(f => font.includes(f))) return `'${font}', cursive`
  if (sansSerif.some(f => font.includes(f))) return `'${font}', sans-serif`
  return `'${font}', serif`
}

interface HeroBlockProps {
  block: BlockData
  colors: ProjectColors
  fonts: ProjectFonts
  isEditing: boolean
  onChange: (content: BlockData['content']) => void
  userId?: string
  projectId?: string
}

export function HeroBlock({ block, colors, fonts, isEditing, onChange, userId, projectId }: HeroBlockProps) {
  const [showImagePicker, setShowImagePicker] = useState(false)
  const content = block.content as {
    bride: string; groom: string; date: string; time: string
    tagline: string; backgroundImage: string
  }

  const update = (key: string, val: string) => onChange({ ...content, [key]: val })

  const formatDate = (dateStr: string) => {
    if (!dateStr) return ''
    try {
      const d = new Date(dateStr)
      return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })
    } catch { return dateStr }
  }

  return (
    <section
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{ backgroundColor: colors.background }}
    >
      {/* Background */}
      <div className="absolute inset-0">
        {content.backgroundImage ? (
          <img
            src={content.backgroundImage}
            alt="Wedding background"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full"
            style={{ background: `linear-gradient(135deg, ${colors.background}, ${colors.accent})` }} />
        )}
        <div className="absolute inset-0"
          style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.7) 100%)' }} />
      </div>

      {/* Change background button in edit mode */}
      {isEditing && (
        <button
          onClick={() => setShowImagePicker(true)}
          className="absolute top-4 left-4 z-10 glass flex items-center gap-2 px-3 py-2 rounded-xl text-white text-sm hover:bg-white/20 transition-all"
        >
          <Camera size={14} />
          Сменить фото
        </button>
      )}

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-2xl mx-auto">
        {/* Decorative line */}
        <motion.div
          initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="w-16 h-px mx-auto mb-8"
          style={{ background: colors.primary }}
        />

        {/* Names */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <EditableText
            value={content.bride}
            onChange={(v) => update('bride', v)}
            isEditing={isEditing}
            className="text-white block"
            tag="span"
            style={{ fontFamily: getFontFamily(fonts.heading), fontSize: 'clamp(2.5rem, 8vw, 5rem)', fontWeight: 300, letterSpacing: '0.05em', display: 'block' } as React.CSSProperties}
          />
          <div className="my-3" style={{ fontFamily: getFontFamily(fonts.heading), color: colors.primary, fontSize: 'clamp(1rem, 3vw, 1.5rem)', fontStyle: 'italic' }}>
            &amp;
          </div>
          <EditableText
            value={content.groom}
            onChange={(v) => update('groom', v)}
            isEditing={isEditing}
            className="text-white block"
            tag="span"
            style={{ fontFamily: getFontFamily(fonts.heading), fontSize: 'clamp(2.5rem, 8vw, 5rem)', fontWeight: 300, letterSpacing: '0.05em', display: 'block' } as React.CSSProperties}
          />
        </motion.div>

        {/* Decorative ornament */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="my-8 flex items-center justify-center gap-4"
        >
          <div className="w-12 h-px" style={{ background: colors.primary }} />
          <div style={{ color: colors.primary, fontSize: 18 }}>♥</div>
          <div className="w-12 h-px" style={{ background: colors.primary }} />
        </motion.div>

        {/* Date */}
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
        >
          {isEditing ? (
            <input
              type="date"
              value={content.date}
              onChange={(e) => update('date', e.target.value)}
              className="bg-white/10 border border-white/30 rounded-lg px-4 py-2 text-white text-center outline-none focus:border-[#C4A97D] mx-auto block"
            />
          ) : (
            <p className="text-white/80 tracking-[0.3em] uppercase text-sm" style={{ fontFamily: fonts.body + ', sans-serif' }}>
              {formatDate(content.date)}
            </p>
          )}
        </motion.div>

        {isEditing && (
          <div className="mt-2">
            <input
              type="time"
              value={content.time}
              onChange={(e) => update('time', e.target.value)}
              className="bg-white/10 border border-white/30 rounded-lg px-4 py-2 text-white text-center outline-none focus:border-[#C4A97D] mx-auto block"
            />
          </div>
        )}

        {!isEditing && content.time && (
          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.3 }}
            className="text-white/60 text-sm mt-2 tracking-widest"
            style={{ fontFamily: fonts.body }}
          >
            {content.time}
          </motion.p>
        )}

        {/* Tagline */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
          className="mt-8"
        >
          <EditableText
            value={content.tagline}
            onChange={(v) => update('tagline', v)}
            isEditing={isEditing}
            multiline
            className="text-white/70 text-sm leading-relaxed max-w-md mx-auto"
            style={{ fontFamily: fonts.body + ', sans-serif', fontStyle: 'italic' } as React.CSSProperties}
          />
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="mt-16 flex flex-col items-center gap-2"
        >
          <span className="text-white/30 text-xs tracking-widest uppercase">прокрутите вниз</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-px h-8"
            style={{ background: `linear-gradient(to bottom, ${colors.primary}, transparent)` }}
          />
        </motion.div>
      </div>

      {/* Image picker modal */}
      {showImagePicker && (
        <ImagePicker
          onSelect={(url) => update('backgroundImage', url)}
          onClose={() => setShowImagePicker(false)}
          userId={userId}
          projectId={projectId}
        />
      )}
    </section>
  )
}
