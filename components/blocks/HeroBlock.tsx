'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { EditableText } from '@/components/editor/EditableText'
import { ImagePicker } from '@/components/ui/ImagePicker'
import { fontFamilyValue } from '@/lib/editorPresets'
import { Camera } from 'lucide-react'
import type { BlockData, ProjectColors, ProjectFonts } from '@/types'

interface HeroBlockProps {
  block: BlockData
  colors: ProjectColors
  fonts: ProjectFonts
  isEditing: boolean
  onChange: (content: BlockData['content']) => void
  userId?: string
  projectId?: string
}

type HeroContent = {
  variant?: string
  bride: string; groom: string; date: string; time: string
  tagline: string; backgroundImage: string
  image2?: string; image3?: string
}

function formatDate(dateStr: string) {
  if (!dateStr) return ''
  try {
    return new Date(dateStr).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })
  } catch { return dateStr }
}

export function HeroBlock({ block, colors, fonts, isEditing, onChange, userId, projectId }: HeroBlockProps) {
  const [picker, setPicker] = useState<false | 'bg' | 'image2' | 'image3'>(false)
  const content = block.content as HeroContent
  const v = content.variant || '1'
  const update = (key: string, val: string) => onChange({ ...content, [key]: val })
  const ff = fontFamilyValue(fonts.heading)
  const bodyFf = `'${fonts.body}', sans-serif`

  // countdown (для варианта с таймером)
  const [left, setLeft] = useState({ d: 0, h: 0, m: 0 })
  useEffect(() => {
    const calc = () => {
      const t = new Date(content.date).getTime()
      const diff = Math.max(0, t - Date.now())
      setLeft({ d: Math.floor(diff / 86400000), h: Math.floor((diff / 3600000) % 24), m: Math.floor((diff / 60000) % 60) })
    }
    calc(); const id = setInterval(calc, 30000); return () => clearInterval(id)
  }, [content.date])

  // ── общие кусочки ──
  const names = (size: string, color: string, gap = '0.4rem') => (
    <div style={{ display: 'flex', flexDirection: 'column', gap }}>
      <EditableText value={content.bride} onChange={(x) => update('bride', x)} isEditing={isEditing} tag="span" className="mrn-title"
        style={{ fontFamily: ff, fontSize: size, fontWeight: 300, letterSpacing: '.04em', color, lineHeight: 1.05, display: 'block' }} />
      <span style={{ fontFamily: ff, color: colors.primary, fontSize: `calc(${size} * 0.42)`, fontStyle: 'italic' }}>&amp;</span>
      <EditableText value={content.groom} onChange={(x) => update('groom', x)} isEditing={isEditing} tag="span" className="mrn-title"
        style={{ fontFamily: ff, fontSize: size, fontWeight: 300, letterSpacing: '.04em', color, lineHeight: 1.05, display: 'block' }} />
    </div>
  )

  const dateLine = (color: string) => (
    isEditing ? (
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
        <input type="date" value={content.date} onChange={(e) => update('date', e.target.value)}
          className="bg-white/10 border border-current/30 rounded-lg px-3 py-1.5 text-center outline-none" style={{ color, borderColor: color + '55' }} />
        <input type="time" value={content.time} onChange={(e) => update('time', e.target.value)}
          className="bg-white/10 border rounded-lg px-3 py-1.5 text-center outline-none" style={{ color, borderColor: color + '55' }} />
      </div>
    ) : (
      <p style={{ fontFamily: bodyFf, color, letterSpacing: '.28em', textTransform: 'uppercase', fontSize: 13 }}>
        {formatDate(content.date)}{content.time ? ` · ${content.time}` : ''}
      </p>
    )
  )

  const tagline = (color: string, maxW = 460) => (
    <EditableText value={content.tagline} onChange={(x) => update('tagline', x)} isEditing={isEditing} multiline tag="p"
      style={{ fontFamily: bodyFf, color, fontStyle: 'italic', fontSize: 15, lineHeight: 1.7, maxWidth: maxW }} />
  )

  const ornament = (color: string) => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14 }}>
      <span style={{ width: 46, height: 1, background: color, opacity: .5 }} />
      <span style={{ color, fontSize: 15 }}>♥</span>
      <span style={{ width: 46, height: 1, background: color, opacity: .5 }} />
    </div>
  )

  const bgButton = (target: 'bg' | 'image2' | 'image3' = 'bg', label = 'Сменить фото', pos = 'top-4 left-4') => (
    isEditing ? (
      <button onClick={() => setPicker(target)}
        className={`absolute ${pos} z-20 flex items-center gap-2 px-3 py-2 rounded-xl text-white text-xs`}
        style={{ background: 'rgba(0,0,0,.45)', backdropFilter: 'blur(6px)' }}>
        <Camera size={13} /> {label}
      </button>
    ) : null
  )

  const pickerModal = picker ? (
    <ImagePicker
      onSelect={(url) => { update(picker === 'bg' ? 'backgroundImage' : picker, url); setPicker(false) }}
      onClose={() => setPicker(false)} userId={userId} projectId={projectId}
    />
  ) : null

  const fade = { initial: { opacity: 0, y: 18 }, animate: { opacity: 1, y: 0 }, transition: { duration: .7 } }

  // ═══════════════ ВАРИАНТЫ ═══════════════

  // cinematic — премиальный полноэкранный герой
  if (v === 'cinematic') {
    return (
      <section className="relative overflow-hidden flex" style={{ minHeight: '100vh', alignItems: 'flex-end' }}>
        <div className="absolute inset-0">
          {content.backgroundImage
            ? <img src={content.backgroundImage} alt="" className="w-full h-full object-cover" />
            : <div className="w-full h-full" style={{ background: `linear-gradient(135deg,${colors.primary},${colors.secondary})` }} />}
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,.82) 0%, rgba(0,0,0,.15) 55%, rgba(0,0,0,.35) 100%)' }} />
        </div>
        {bgButton('bg')}
        <motion.div {...fade} className="relative z-10 w-full px-8 md:px-16 pb-[12vh]">
          <div style={{ maxWidth: 900 }}>
            <p style={{ fontFamily: bodyFf, color: colors.primary, letterSpacing: '.5em', textTransform: 'uppercase', fontSize: 12, marginBottom: 20 }}>Save the date</p>
            <div style={{ display: 'flex', flexDirection: 'column', lineHeight: .92 }}>
              <EditableText value={content.bride} onChange={(x) => update('bride', x)} isEditing={isEditing} tag="span" className="mrn-title"
                style={{ fontFamily: ff, fontSize: 'clamp(3rem,12vw,9rem)', fontWeight: 300, color: '#fff', letterSpacing: '-.01em' }} />
              <span style={{ fontFamily: ff, fontSize: 'clamp(1.4rem,4vw,2.6rem)', color: colors.primary, fontStyle: 'italic', margin: '0.1em 0 0.1em 0.2em' }}>&amp;</span>
              <EditableText value={content.groom} onChange={(x) => update('groom', x)} isEditing={isEditing} tag="span" className="mrn-title"
                style={{ fontFamily: ff, fontSize: 'clamp(3rem,12vw,9rem)', fontWeight: 300, color: '#fff', letterSpacing: '-.01em' }} />
            </div>
            <div className="mt-8 flex items-center gap-6 flex-wrap">
              {dateLine('#fff')}
              <span style={{ width: 60, height: 1, background: colors.primary }} />
              {tagline('rgba(255,255,255,.8)', 380)}
            </div>
          </div>
        </motion.div>
        {pickerModal}
      </section>
    )
  }

  // 5 — минимализм (без фото)
  if (v === '5') {
    return (
      <section className="relative min-h-screen flex items-center justify-center px-6 text-center"
        style={{ background: `linear-gradient(160deg, ${colors.background}, ${colors.accent}66)` }}>
        <motion.div {...fade} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 26 }}>
          {ornament(colors.primary)}
          {names('clamp(2.6rem,8vw,5rem)', colors.text)}
          {dateLine(colors.text)}
          {tagline(colors.text + 'B0')}
        </motion.div>
        {pickerModal}
      </section>
    )
  }

  // 2 / 3 — сплит (фото сбоку)
  if (v === '2' || v === '3') {
    const photoRight = v === '2'
    const photo = (
      <div className="relative w-full h-[42vh] md:h-auto md:w-1/2 md:min-h-screen overflow-hidden">
        {content.backgroundImage
          ? <img src={content.backgroundImage} alt="" className="w-full h-full object-cover" />
          : <div className="w-full h-full" style={{ background: `linear-gradient(135deg,${colors.primary},${colors.secondary})` }} />}
        {bgButton('bg')}
      </div>
    )
    const text = (
      <div className="w-full md:w-1/2 flex items-center justify-center px-8 py-14 md:py-0" style={{ background: colors.background }}>
        <motion.div {...fade} style={{ display: 'flex', flexDirection: 'column', gap: 22, maxWidth: 420 }}>
          <p style={{ fontFamily: bodyFf, color: colors.primary, letterSpacing: '.32em', textTransform: 'uppercase', fontSize: 12 }}>Мы женимся</p>
          {names('clamp(2.4rem,6vw,4rem)', colors.text)}
          <div style={{ width: 54, height: 1, background: colors.primary }} />
          {dateLine(colors.text)}
          {tagline(colors.text + 'AA', 380)}
        </motion.div>
      </div>
    )
    return (
      <section className="relative min-h-screen flex flex-col md:flex-row" style={{ background: colors.background }}>
        {photoRight ? <>{text}{photo}</> : <>{photo}{text}</>}
        {pickerModal}
      </section>
    )
  }

  // 8 — конверт (карточка по центру)
  if (v === '8') {
    return (
      <section className="relative min-h-screen flex items-center justify-center px-5 py-16 overflow-hidden">
        <div className="absolute inset-0">
          {content.backgroundImage
            ? <img src={content.backgroundImage} alt="" className="w-full h-full object-cover" />
            : <div className="w-full h-full" style={{ background: colors.accent }} />}
          <div className="absolute inset-0" style={{ background: 'rgba(20,15,10,.5)' }} />
        </div>
        {bgButton('bg')}
        <motion.div {...fade} className="relative z-10 w-full text-center"
          style={{ maxWidth: 440, background: colors.background, borderRadius: 20, padding: '48px 30px', boxShadow: '0 40px 90px rgba(0,0,0,.4)', border: `1px solid ${colors.primary}40` }}>
          <div style={{ width: 46, height: 46, borderRadius: '50%', background: colors.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 22px', color: '#fff' }}>♥</div>
          <p style={{ fontFamily: bodyFf, color: colors.primary, letterSpacing: '.3em', textTransform: 'uppercase', fontSize: 11, marginBottom: 18 }}>Вы приглашены</p>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
            {names('clamp(2.2rem,6vw,3.4rem)', colors.text)}
            {ornament(colors.primary)}
            {dateLine(colors.text)}
            {tagline(colors.text + 'AA', 340)}
          </div>
        </motion.div>
        {pickerModal}
      </section>
    )
  }

  // 9 — коллаж
  if (v === '9') {
    const tiles = [content.backgroundImage, content.image2, content.image3]
    return (
      <section className="relative min-h-screen flex items-center justify-center px-5 py-16" style={{ background: colors.background }}>
        <div className="w-full max-w-5xl grid md:grid-cols-3 gap-3 items-stretch">
          {tiles.map((img, i) => (
            <div key={i} className={`relative overflow-hidden rounded-2xl ${i === 1 ? 'md:mt-8' : ''}`} style={{ minHeight: 220, aspectRatio: '3/4' }}>
              {img ? <img src={img} alt="" className="w-full h-full object-cover" />
                : <div className="w-full h-full" style={{ background: `linear-gradient(135deg,${colors.primary}33,${colors.secondary}33)` }} />}
              {bgButton(i === 0 ? 'bg' : i === 1 ? 'image2' : 'image3', 'Фото', 'top-2 left-2')}
            </div>
          ))}
        </div>
        <motion.div {...fade} className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center px-6 py-8 pointer-events-auto" style={{ background: colors.background + 'E6', borderRadius: 22, backdropFilter: 'blur(4px)' }}>
            {names('clamp(2.2rem,6vw,3.6rem)', colors.text)}
            <div className="mt-3">{dateLine(colors.text)}</div>
          </div>
        </motion.div>
        {pickerModal}
      </section>
    )
  }

  // 1 / 4 / 6 / 7 — фото на фоне (различаются подачей)
  const luxury = v === '6'
  const timer = v === '7'
  const full = v === '4'
  const overlay = luxury
    ? 'linear-gradient(to bottom, rgba(0,0,0,.55), rgba(0,0,0,.72))'
    : full
      ? 'linear-gradient(to top, rgba(0,0,0,.7) 0%, rgba(0,0,0,.15) 45%, rgba(0,0,0,.35) 100%)'
      : 'linear-gradient(to bottom, rgba(0,0,0,.35), rgba(0,0,0,.5), rgba(0,0,0,.65))'

  return (
    <section className="relative min-h-screen flex overflow-hidden"
      style={{ alignItems: full ? 'flex-end' : 'center', justifyContent: 'center' }}>
      <div className="absolute inset-0">
        {content.backgroundImage
          ? <img src={content.backgroundImage} alt="" className="w-full h-full object-cover" />
          : <div className="w-full h-full" style={{ background: `linear-gradient(135deg,${colors.background},${colors.accent})` }} />}
        <div className="absolute inset-0" style={{ background: overlay }} />
        {luxury && <div className="absolute inset-5 md:inset-8 pointer-events-none" style={{ border: `1px solid ${colors.primary}66` }} />}
      </div>
      {bgButton('bg')}

      <motion.div {...fade} className="relative z-10 text-center px-6"
        style={{ maxWidth: 640, paddingBottom: full ? '12vh' : 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22 }}>
        {!full && ornament(colors.primary)}
        {names('clamp(2.6rem,8vw,5rem)', '#fff')}
        {!timer && ornament(colors.primary)}
        {timer && (
          <div style={{ display: 'flex', gap: 18 }}>
            {[['дней', left.d], ['часов', left.h], ['минут', left.m]].map(([l, n]) => (
              <div key={l as string} style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: ff, fontSize: 40, color: colors.primary, lineHeight: 1 }}>{String(n).padStart(2, '0')}</div>
                <div style={{ fontFamily: bodyFf, color: 'rgba(255,255,255,.6)', fontSize: 10, textTransform: 'uppercase', letterSpacing: '.2em', marginTop: 4 }}>{l}</div>
              </div>
            ))}
          </div>
        )}
        {dateLine('#fff')}
        {tagline('rgba(255,255,255,.75)')}
      </motion.div>
      {pickerModal}
    </section>
  )
}
