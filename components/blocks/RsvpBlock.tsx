'use client'
import { useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { EditableText } from '@/components/editor/EditableText'
import { fontFamilyValue } from '@/lib/editorPresets'
import { Phone, Check, Send, Minus, Plus, Heart } from 'lucide-react'
import toast from 'react-hot-toast'
import type { BlockData, ProjectColors, ProjectFonts } from '@/types'

interface RsvpBlockProps {
  block: BlockData
  colors: ProjectColors
  fonts: ProjectFonts
  isEditing: boolean
  onChange: (content: BlockData['content']) => void
  projectTitle?: string
  projectSlug?: string
  projectId?: string
}

export function RsvpBlock({ block, colors, fonts, isEditing, onChange, projectTitle = '', projectSlug = '', projectId = '' }: RsvpBlockProps) {
  const [name, setName] = useState('')
  const [attending, setAttending] = useState<'yes' | 'no' | null>(null)
  const [guestCount, setGuestCount] = useState(1)
  const [submitted, setSubmitted] = useState(false)
  const [sending, setSending] = useState(false)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  const content = block.content as { variant?: string; title: string; subtitle: string; phone: string }
  const v = content.variant || '1'
  const update = (k: string, val: string) => onChange({ ...content, [k]: val })
  const ff = fontFamilyValue(fonts.heading)
  const bodyFf = `'${fonts.body}', sans-serif`

  const handleSubmit = async () => {
    if (!name.trim() || attending === null) { toast.error('Заполните все поля'); return }
    setSending(true)
    try {
      const { sendRSVPToTelegram, saveRSVPToDatabase, sendRSVPEmail } = await import('@/app/actions/rsvp')
      await Promise.all([
        sendRSVPToTelegram({ name, attending, guestCount, projectTitle, projectSlug }),
        saveRSVPToDatabase({ name, attending, guestCount, projectTitle, projectSlug, projectId }),
        sendRSVPEmail({ name, attending, guestCount, projectTitle, projectSlug }),
      ])
    } catch {}
    setSubmitted(true); setSending(false)
    toast.success(attending === 'yes' ? '🎉 Ждём вас на торжестве!' : 'Спасибо за ответ!')
  }

  const fieldBg = colors.background
  const label = (t: string) => <label className="block text-xs uppercase tracking-widest mb-2" style={{ color: colors.text, opacity: .5, fontFamily: bodyFf }}>{t}</label>

  const formInner = (accentInputs = false) => submitted ? (
    <div className="text-center py-8">
      <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: colors.primary }}><Check size={24} className="text-white" /></div>
      <p className="text-xl font-light mb-2" style={{ color: colors.text, fontFamily: ff }}>{attending === 'yes' ? 'Ждём вас! 🎉' : 'Спасибо!'}</p>
      <p className="text-sm opacity-40" style={{ color: colors.text }}>{attending === 'yes' ? `Будем рады видеть вас${guestCount > 1 ? ` (${guestCount} чел.)` : ''}` : 'Ваш ответ получен'}</p>
    </div>
  ) : (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div>{label('Ваше имя')}
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Введите ваше имя" className="input-luxury" style={{ color: colors.text, background: accentInputs ? fieldBg + 'CC' : fieldBg }} />
      </div>
      <div>{label('Вы придёте?')}
        <div className="grid grid-cols-2 gap-2">
          {([['yes', '✅ Да, буду!'], ['no', '❌ Не смогу']] as const).map(([val, lb]) => (
            <button key={val} onClick={() => setAttending(val)} className="py-3 text-sm font-medium transition-all active:scale-95"
              style={{ borderRadius: 'var(--wd-btn-radius,12px)', ...(attending === val ? { background: colors.primary, color: '#fff' } : { background: fieldBg, color: colors.text, border: `1px solid ${colors.primary}28` }) }}>{lb}</button>
          ))}
        </div>
      </div>
      {attending === 'yes' && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} transition={{ duration: .2 }}>
          {label('Количество гостей')}
          <div className="flex items-center gap-5 justify-center">
            <button onClick={() => setGuestCount(Math.max(1, guestCount - 1))} className="w-10 h-10 rounded-xl flex items-center justify-center active:scale-90 transition-all" style={{ background: fieldBg, border: `1px solid ${colors.primary}28`, color: colors.text }}><Minus size={14} /></button>
            <span className="text-2xl font-light w-8 text-center" style={{ color: colors.text, fontFamily: ff }}>{guestCount}</span>
            <button onClick={() => setGuestCount(Math.min(20, guestCount + 1))} className="w-10 h-10 rounded-xl flex items-center justify-center active:scale-90 transition-all" style={{ background: fieldBg, border: `1px solid ${colors.primary}28`, color: colors.text }}><Plus size={14} /></button>
          </div>
        </motion.div>
      )}
      <button onClick={handleSubmit} disabled={sending || !name.trim() || attending === null} className="w-full py-3.5 font-medium text-white transition-all flex items-center justify-center gap-2"
        style={{ borderRadius: 'var(--wd-btn-radius,12px)', background: `linear-gradient(135deg,${colors.primary},${colors.secondary})`, opacity: (sending || !name.trim() || attending === null) ? .5 : 1 }}>
        {sending ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Send size={14} />Отправить ответ</>}
      </button>
      {!isEditing && <p className="text-center text-xs opacity-30" style={{ color: colors.text }}>Ответ придёт организатору в Telegram</p>}
    </div>
  )

  const heading = (align: 'center' | 'left' = 'center', onDark = false) => (
    <div className={align === 'center' ? 'text-center mb-8' : 'mb-6'}>
      <p className="text-xs tracking-[0.4em] uppercase mb-3" style={{ color: colors.primary, fontFamily: bodyFf }}>RSVP</p>
      <EditableText value={content.title} onChange={(x) => update('title', x)} isEditing={isEditing} tag="h2" className="font-light mb-2"
        style={{ color: onDark ? '#fff' : colors.text, fontFamily: ff, fontSize: 'clamp(1.6rem,4vw,2.4rem)' } as React.CSSProperties} />
      <EditableText value={content.subtitle} onChange={(x) => update('subtitle', x)} isEditing={isEditing} tag="p" className="text-sm"
        style={{ color: onDark ? '#fff' : colors.text, opacity: .55 } as React.CSSProperties} />
    </div>
  )

  const phoneBlock = (
    isEditing ? (
      <div className="text-center mt-6"><p className="text-xs opacity-40 mb-2" style={{ color: colors.text }}>Телефон для связи</p>
        <input type="tel" value={content.phone} onChange={(e) => update('phone', e.target.value)} className="input-luxury max-w-xs mx-auto block text-center text-sm" style={{ color: colors.text }} /></div>
    ) : content.phone ? (
      <div className="text-center mt-6"><p className="text-xs mb-2 opacity-35" style={{ color: colors.text }}>или напишите напрямую</p>
        <a href={`tel:${content.phone}`} className="inline-flex items-center gap-2 text-sm font-medium hover:opacity-70 transition-opacity" style={{ color: colors.primary }}><Phone size={14} /> {content.phone}</a></div>
    ) : null
  )

  const card = (style: React.CSSProperties) => (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: .15 }} className="rounded-2xl p-6" style={style}>{formInner(true)}</motion.div>
  )

  // ── Варианты ──
  if (v === 'split') {
    return (
      <section ref={ref} className="py-16 px-5" style={{ backgroundColor: colors.background }}>
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8 items-center">
          <div>
            {heading('left')}
            <p className="text-sm leading-relaxed mb-5" style={{ color: colors.text, opacity: .6, fontFamily: bodyFf }}>Будем счастливы разделить с вами этот день. Пожалуйста, подтвердите участие через форму.</p>
            {phoneBlock}
          </div>
          {card({ background: colors.accent + '25', border: `1px solid ${colors.primary}18` })}
        </div>
      </section>
    )
  }
  if (v === 'glass') {
    return (
      <section ref={ref} className="py-20 px-5 relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})` }}>
        <div className="max-w-md mx-auto relative">
          {heading('center', true)}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: .15 }}
            className="rounded-2xl p-6" style={{ background: 'rgba(255,255,255,.85)', backdropFilter: 'blur(14px)', border: '1px solid rgba(255,255,255,.5)', boxShadow: '0 20px 60px rgba(0,0,0,.25)' }}>{formInner(false)}</motion.div>
        </div>
      </section>
    )
  }
  if (v === 'fullscreen') {
    return (
      <section ref={ref} className="min-h-screen flex items-center justify-center py-16 px-5" style={{ background: `linear-gradient(160deg, ${colors.background}, ${colors.accent})` }}>
        <div className="max-w-md w-full mx-auto">
          <div className="text-center mb-6"><Heart size={26} style={{ color: colors.primary, margin: '0 auto 10px' }} /></div>
          {heading('center')}
          {card({ background: colors.background, boxShadow: '0 30px 80px rgba(0,0,0,.12)', border: `1px solid ${colors.primary}12` })}
          {phoneBlock}
        </div>
      </section>
    )
  }
  if (v === 'minimal') {
    return (
      <section ref={ref} className="py-20 px-5" style={{ backgroundColor: colors.background }}>
        <div className="max-w-sm mx-auto">
          {heading('center')}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: .15 }}>{formInner(false)}</motion.div>
          {phoneBlock}
        </div>
      </section>
    )
  }
  if (v === 'card') {
    return (
      <section ref={ref} className="py-20 px-5" style={{ background: colors.accent + '30' }}>
        <div className="max-w-md mx-auto">
          {heading('center')}
          {card({ background: colors.background, boxShadow: '0 24px 70px rgba(0,0,0,.14)', border: 'none' })}
          {phoneBlock}
        </div>
      </section>
    )
  }
  // '1' — классический
  return (
    <section ref={ref} className="py-16 px-5" style={{ backgroundColor: colors.background }}>
      <div className="max-w-md mx-auto">
        {heading('center')}
        {card({ background: colors.accent + '25', border: `1px solid ${colors.primary}18` })}
        {phoneBlock}
      </div>
    </section>
  )
}
