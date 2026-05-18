'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { EditableText } from '@/components/editor/EditableText'
import { ImagePicker } from '@/components/ui/ImagePicker'
import { Camera, Heart } from 'lucide-react'
import type { BlockData, ProjectColors, ProjectFonts } from '@/types'


function resolveFontFamily(font: string): string {
  const cursive = ['Great Vibes', 'Marck Script']
  if (cursive.some(f => font.includes(f))) return `'${font}', cursive`
  return `'${font}', serif`
}

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
    title: string; text: string; image: string
    meetDate: string; proposeDate: string
  }
  const update = (key: string, val: string) => onChange({ ...content, [key]: val })

  return (
    <section ref={ref} className="py-12 px-4 md:py-20 md:px-6" style={{ backgroundColor: colors.background }}>
      <div className="max-w-5xl mx-auto px-0">
        {/* Section title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <p className="text-sm tracking-[0.4em] uppercase mb-3" style={{ color: colors.primary, fontFamily: fonts.body }}>
            История любви
          </p>
          <EditableText
            value={content.title}
            onChange={(v) => update('title', v)}
            isEditing={isEditing}
            tag="h2"
            className="text-4xl md:text-5xl font-light"
            style={{ color: colors.text, fontFamily: resolveFontFamily(fonts.heading) } as React.CSSProperties}
          />
          <div className="ornament mt-6 max-w-xs mx-auto">
            <Heart size={14} style={{ color: colors.primary }} className="fill-current" />
          </div>
        </motion.div>

        {/* Content grid */}
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }} animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl">
              {content.image ? (
                <img src={content.image} alt="Our story" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center" style={{ background: colors.accent }}>
                  <p style={{ color: colors.secondary }}>Фото пары</p>
                </div>
              )}
              {/* Decorative frame */}
              <div className="absolute inset-0 rounded-2xl"
                style={{ border: `1px solid ${colors.primary}30` }} />
            </div>
            {/* Floating date badge */}
            <div className="absolute -bottom-4 -right-4 glass-white rounded-xl p-4 shadow-lg"
              style={{ border: `1px solid ${colors.primary}30` }}>
              <p className="text-xs uppercase tracking-widest mb-1" style={{ color: colors.primary, fontFamily: fonts.body }}>вместе с</p>
              <p className="font-semibold" style={{ color: colors.text, fontFamily: fonts.heading }}>
                {content.meetDate}
              </p>
            </div>

            {isEditing && (
              <button
                onClick={() => setShowPicker(true)}
                className="absolute top-3 left-3 glass flex items-center gap-2 px-3 py-2 rounded-xl text-white text-xs hover:bg-white/20 transition-all"
              >
                <Camera size={12} /> Сменить фото
              </button>
            )}
          </motion.div>

          {/* Text */}
          <motion.div
            initial={{ opacity: 0, x: 30 }} animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="space-y-6"
          >
            <EditableText
              value={content.text}
              onChange={(v) => update('text', v)}
              isEditing={isEditing}
              multiline
              className="text-lg leading-relaxed"
              style={{ color: colors.text + 'CC', fontFamily: fonts.body + ', sans-serif', fontStyle: 'italic' } as React.CSSProperties}
            />

            {/* Timeline */}
            <div className="space-y-4 pt-4">
              {[
                { label: 'Наша встреча', key: 'meetDate', icon: '💫' },
                { label: 'Предложение', key: 'proposeDate', icon: '💍' },
                { label: 'Свадьба', key: '', icon: '💒' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg flex-shrink-0"
                    style={{ background: colors.accent }}>
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-widest opacity-60" style={{ color: colors.text, fontFamily: fonts.body }}>
                      {item.label}
                    </p>
                    {item.key ? (
                      isEditing ? (
                        <input
                          type="text"
                          value={content[item.key as keyof typeof content]}
                          onChange={(e) => update(item.key, e.target.value)}
                          className="input-luxury text-sm py-1 px-2"
                          style={{ color: colors.text }}
                          placeholder="Дата"
                        />
                      ) : (
                        <p className="font-medium" style={{ color: colors.text, fontFamily: fonts.heading }}>
                          {content[item.key as keyof typeof content]}
                        </p>
                      )
                    ) : (
                      <p className="font-medium" style={{ color: colors.primary, fontFamily: fonts.heading }}>
                        Скоро ✨
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {showPicker && (
        <ImagePicker
          onSelect={(url) => { update('image', url); setShowPicker(false) }}
          onClose={() => setShowPicker(false)}
          userId={userId}
          projectId={projectId}
        />
      )}
    </section>
  )
}
