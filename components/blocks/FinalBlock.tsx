'use client'
import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { EditableText } from '@/components/editor/EditableText'
import { Heart } from 'lucide-react'
import type { BlockData, ProjectColors, ProjectFonts } from '@/types'


function resolveFontFamily(font: string): string {
  const cursive = ['Great Vibes', 'Marck Script']
  if (cursive.some(f => font.includes(f))) return `'${font}', cursive`
  return `'${font}', serif`
}

interface FinalBlockProps {
  block: BlockData
  colors: ProjectColors
  fonts: ProjectFonts
  isEditing: boolean
  onChange: (content: BlockData['content']) => void
}

export function FinalBlock({ block, colors, fonts, isEditing, onChange }: FinalBlockProps) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })
  const content = block.content as { title: string; message: string; date: string }
  const update = (k: string, v: string) => onChange({ ...content, [k]: v })

  return (
    <section
      ref={ref}
      className="py-32 px-6 relative overflow-hidden"
      style={{ background: `linear-gradient(135deg, ${colors.background} 0%, ${colors.accent}40 50%, ${colors.background} 100%)` }}
    >
      {/* Background ornaments */}
      <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
        <Heart size={400} style={{ color: colors.primary }} className="fill-current" />
      </div>

      <div className="max-w-2xl mx-auto text-center relative">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <Heart
            size={32}
            style={{ color: colors.primary }}
            className="fill-current mx-auto"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          <EditableText
            value={content.title}
            onChange={(v) => update('title', v)}
            isEditing={isEditing}
            tag="h2"
            className="font-light mb-8"
            style={{
              color: colors.text,
              fontFamily: resolveFontFamily(fonts.heading),
              fontSize: 'clamp(2rem, 6vw, 4rem)',
            } as React.CSSProperties}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.4 }}
          className="ornament mb-8 max-w-xs mx-auto"
        />

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5 }}
        >
          <EditableText
            value={content.message}
            onChange={(v) => update('message', v)}
            isEditing={isEditing}
            multiline
            tag="p"
            className="text-lg leading-relaxed mb-8"
            style={{
              color: colors.text + 'AA',
              fontFamily: fonts.body + ', sans-serif',
              fontStyle: 'italic',
            } as React.CSSProperties}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.7 }}
        >
          <p
            className="text-sm tracking-[0.4em] uppercase"
            style={{ color: colors.primary, fontFamily: fonts.body }}
          >
            ✦ {content.date} ✦
          </p>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 1 }}
          className="mt-16 pt-8 border-t"
          style={{ borderColor: colors.primary + '20' }}
        >
          <p className="text-xs opacity-30" style={{ color: colors.text, fontFamily: fonts.body }}>
            Создано на Wedify · Разработано Alex Web Studio
          </p>
        </motion.div>
      </div>
    </section>
  )
}
