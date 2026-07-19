'use client'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import type { BlockData, ProjectColors, ProjectFonts } from '@/types'

type DividerVariant = '1' | '2' | '3' | '4'

/**
 * Красивый декоративный разделитель. Используется и как отдельный блок (#9),
 * и как надзаголовок вместо текста вроде «Где и когда» (#8).
 */
export function DecorDivider({ variant = '1', color, width = 220 }: { variant?: DividerVariant; color: string; width?: number }) {
  const line = (w: number, o = 1) => <span style={{ display: 'inline-block', width: w, height: 1, background: color, opacity: o }} />

  if (variant === '2') {
    // Ботанический росток
    return (
      <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color }}>
        <svg width={width} height="20" viewBox="0 0 220 20" fill="none">
          <path d="M10 10 H92" stroke={color} strokeWidth="1" />
          <path d="M128 10 H210" stroke={color} strokeWidth="1" />
          <path d="M110 3 C104 8 104 12 110 17 C116 12 116 8 110 3 Z" fill={color} />
          <path d="M100 10 C104 6 108 6 110 8 M120 10 C116 6 112 6 110 8" stroke={color} strokeWidth="1" fill="none" />
        </svg>
      </span>
    )
  }

  if (variant === '3') {
    // Двойная тонкая линия с ромбом
    return (
      <span style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {line(width * 0.4)}
          <span style={{ width: 6, height: 6, background: color, transform: 'rotate(45deg)' }} />
          {line(width * 0.4)}
        </span>
        {line(width * 0.62, 0.4)}
      </span>
    )
  }

  if (variant === '4') {
    // Волнистый флориш
    return (
      <span style={{ display: 'inline-flex', color }}>
        <svg width={width} height="16" viewBox="0 0 220 16" fill="none">
          <path d="M4 8 Q 30 -2 55 8 T 106 8" stroke={color} strokeWidth="1.2" fill="none" />
          <circle cx="110" cy="8" r="3" fill={color} />
          <path d="M114 8 Q 140 18 165 8 T 216 8" stroke={color} strokeWidth="1.2" fill="none" />
        </svg>
      </span>
    )
  }

  // Вариант 1 — линия с ромбом по центру (по умолчанию)
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 12, color }}>
      {line(width * 0.42)}
      <span style={{ width: 7, height: 7, border: `1px solid ${color}`, transform: 'rotate(45deg)' }} />
      {line(width * 0.42)}
    </span>
  )
}

interface Props {
  block: BlockData
  colors: ProjectColors
  fonts: ProjectFonts
  isEditing: boolean
  onChange: (content: BlockData['content']) => void
}

export function DividerBlock({ block, colors }: Props) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const content = block.content as { variant?: DividerVariant; useAccent?: boolean; padY?: number }
  const color = content.useAccent ? colors.primary : colors.secondary
  const padY = content.padY ?? 44
  return (
    <section ref={ref} className="flex items-center justify-center px-6" style={{ background: colors.background, paddingTop: padY, paddingBottom: padY }}>
      <motion.div initial={{ opacity: 0, scale: .9 }} animate={inView ? { opacity: 1, scale: 1 } : {}} transition={{ duration: .6 }}>
        <DecorDivider variant={content.variant || '1'} color={color} />
      </motion.div>
    </section>
  )
}
