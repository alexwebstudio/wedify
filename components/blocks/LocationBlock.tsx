'use client'
import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { EditableText } from '@/components/editor/EditableText'
import { MapPin, Clock, Shirt, Info, ExternalLink } from 'lucide-react'
import type { BlockData, ProjectColors, ProjectFonts } from '@/types'


function resolveFontFamily(font: string): string {
  const cursive = ['Great Vibes', 'Marck Script']
  if (cursive.some(f => font.includes(f))) return `'${font}', cursive`
  return `'${font}', serif`
}

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
    title: string; venue: string; address: string
    mapUrl: string; dresscode: string; note: string
  }
  const update = (k: string, v: string) => onChange({ ...content, [k]: v })

  return (
    <section ref={ref} className="py-12 px-4 md:py-20 md:px-6" style={{ backgroundColor: colors.background }}>
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-12"
        >
          <p className="text-sm tracking-[0.4em] uppercase mb-3" style={{ color: colors.primary, fontFamily: fonts.body }}>
            Где и когда
          </p>
          <EditableText
            value={content.title}
            onChange={(v) => update('title', v)}
            isEditing={isEditing}
            tag="h2"
            className="text-4xl md:text-5xl font-light"
            style={{ color: colors.text, fontFamily: resolveFontFamily(fonts.heading) } as React.CSSProperties}
          />
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Map placeholder */}
          <motion.div
            initial={{ opacity: 0, x: -20 }} animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.2 }}
            className="rounded-2xl overflow-hidden h-64 md:h-full min-h-[280px] relative group"
            style={{ background: colors.accent }}
          >
            {/* Decorative map-like pattern */}
            <div className="absolute inset-0 opacity-10"
              style={{ backgroundImage: `linear-gradient(${colors.primary} 1px, transparent 1px), linear-gradient(90deg, ${colors.primary} 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
              <div className="w-16 h-16 rounded-full flex items-center justify-center shadow-lg"
                style={{ background: colors.primary }}>
                <MapPin size={28} className="text-white" />
              </div>
              <a
                href={isEditing ? '#' : content.mapUrl}
                target="_blank" rel="noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all hover:scale-105"
                style={{ background: colors.background, color: colors.text, border: `1px solid ${colors.primary}30` }}
              >
                <ExternalLink size={14} /> Открыть в картах
              </a>
              {isEditing && (
                <input
                  type="text"
                  value={content.mapUrl}
                  onChange={(e) => update('mapUrl', e.target.value)}
                  placeholder="Ссылка на карты"
                  className="input-luxury max-w-xs"
                  style={{ color: colors.text }}
                />
              )}
            </div>
          </motion.div>

          {/* Info cards */}
          <motion.div
            initial={{ opacity: 0, x: 20 }} animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.3 }}
            className="space-y-4"
          >
            {[
              {
                icon: <MapPin size={18} />,
                label: 'Место',
                keyVenue: 'venue',
                keyAddr: 'address',
              },
            ].map((_, i) => (
              <div key={i} className="p-5 rounded-2xl" style={{ background: colors.accent + '40', border: `1px solid ${colors.primary}15` }}>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: colors.primary + '20', color: colors.primary }}>
                    <MapPin size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs uppercase tracking-widest opacity-60 mb-1" style={{ color: colors.text, fontFamily: fonts.body }}>
                      Место проведения
                    </p>
                    <EditableText value={content.venue} onChange={(v) => update('venue', v)} isEditing={isEditing}
                      tag="p" className="font-semibold" style={{ color: colors.text, fontFamily: fonts.heading } as React.CSSProperties} />
                    <EditableText value={content.address} onChange={(v) => update('address', v)} isEditing={isEditing}
                      tag="p" className="text-sm opacity-70 mt-1" style={{ color: colors.text } as React.CSSProperties} />
                  </div>
                </div>
              </div>
            ))}

            <div className="p-5 rounded-2xl" style={{ background: colors.accent + '40', border: `1px solid ${colors.primary}15` }}>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: colors.primary + '20', color: colors.primary }}>
                  <Shirt size={18} />
                </div>
                <div className="flex-1">
                  <p className="text-xs uppercase tracking-widest opacity-60 mb-1" style={{ color: colors.text, fontFamily: fonts.body }}>
                    Дресс-код
                  </p>
                  <EditableText value={content.dresscode} onChange={(v) => update('dresscode', v)} isEditing={isEditing}
                    tag="p" className="font-semibold" style={{ color: colors.text, fontFamily: fonts.heading } as React.CSSProperties} />
                </div>
              </div>
            </div>

            <div className="p-5 rounded-2xl" style={{ background: colors.primary + '10', border: `1px solid ${colors.primary}20` }}>
              <div className="flex items-start gap-3">
                <div style={{ color: colors.primary }} className="mt-0.5 flex-shrink-0">
                  <Info size={18} />
                </div>
                <EditableText value={content.note} onChange={(v) => update('note', v)} isEditing={isEditing}
                  multiline tag="p" className="text-sm leading-relaxed" style={{ color: colors.text + 'CC' } as React.CSSProperties} />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
