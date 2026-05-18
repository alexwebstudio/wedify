'use client'
import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { EditableText } from '@/components/editor/EditableText'
import type { BlockData, ProjectColors, ProjectFonts } from '@/types'


function resolveFontFamily(font: string): string {
  const cursive = ['Great Vibes', 'Marck Script']
  if (cursive.some(f => font.includes(f))) return `'${font}', cursive`
  return `'${font}', serif`
}

interface TimerBlockProps {
  block: BlockData
  colors: ProjectColors
  fonts: ProjectFonts
  isEditing: boolean
  onChange: (content: BlockData['content']) => void
}

function pad(n: number) { return String(n).padStart(2, '0') }

export function TimerBlock({ block, colors, fonts, isEditing, onChange }: TimerBlockProps) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  const content = block.content as { title: string; date: string }

  useEffect(() => {
    const calc = () => {
      const target = new Date(content.date).getTime()
      const now = Date.now()
      const diff = Math.max(0, target - now)
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      })
    }
    calc()
    const id = setInterval(calc, 1000)
    return () => clearInterval(id)
  }, [content.date])

  const units = [
    { value: timeLeft.days, label: 'дней' },
    { value: timeLeft.hours, label: 'часов' },
    { value: timeLeft.minutes, label: 'минут' },
    { value: timeLeft.seconds, label: 'секунд' },
  ]

  return (
    <section
      ref={ref}
      className="py-24 px-6 relative overflow-hidden"
      style={{ backgroundColor: colors.accent + '40' }}
    >
      {/* Bg pattern */}
      <div className="absolute inset-0 opacity-5"
        style={{ backgroundImage: `radial-gradient(circle, ${colors.primary} 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />

      <div className="max-w-4xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-12"
        >
          <EditableText
            value={content.title}
            onChange={(v) => onChange({ ...content, title: v })}
            isEditing={isEditing}
            tag="h2"
            className="text-3xl md:text-4xl font-light mb-4"
            style={{ color: colors.text, fontFamily: resolveFontFamily(fonts.heading) } as React.CSSProperties}
          />
          {isEditing && (
            <input
              type="date"
              value={content.date}
              onChange={(e) => onChange({ ...content, date: e.target.value })}
              className="input-luxury max-w-xs mx-auto block"
              style={{ color: colors.text }}
            />
          )}
        </motion.div>

        <div className="grid grid-cols-4 gap-3 md:gap-6">
          {units.map(({ value, label }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 * i }}
              className="text-center"
            >
              <div
                className="rounded-2xl py-6 px-2 md:py-8 relative overflow-hidden"
                style={{ background: `linear-gradient(135deg, ${colors.background}, ${colors.accent}60)`, border: `1px solid ${colors.primary}20` }}
              >
                {/* Shine effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
                <motion.p
                  key={value}
                  initial={{ scale: 1.2, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="relative text-3xl md:text-5xl font-light"
                  style={{ color: colors.primary, fontFamily: resolveFontFamily(fonts.heading) }}
                >
                  {pad(value)}
                </motion.p>
              </div>
              <p className="text-xs uppercase tracking-widest mt-3 opacity-60"
                style={{ color: colors.text, fontFamily: fonts.body }}>
                {label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
