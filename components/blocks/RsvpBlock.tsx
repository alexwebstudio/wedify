'use client'
import { useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { EditableText } from '@/components/editor/EditableText'
import { Phone, Check, Send, Minus, Plus } from 'lucide-react'
import toast from 'react-hot-toast'
import type { BlockData, ProjectColors, ProjectFonts } from '@/types'

function resolveFontFamily(font: string): string {
  const cursive = ['Great Vibes', 'Marck Script', 'Comfortaa']
  if (cursive.some(f => font.includes(f))) return `'${font}', cursive`
  if (['Manrope','Montserrat','Inter','Tenor Sans','Forum'].some(f => font.includes(f))) return `'${font}', sans-serif`
  return `'${font}', serif`
}

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

export function RsvpBlock({ block, colors, fonts, isEditing, onChange, projectTitle='', projectSlug='', projectId='' }: RsvpBlockProps) {
  const [name, setName] = useState('')
  const [attending, setAttending] = useState<'yes'|'no'|null>(null)
  const [guestCount, setGuestCount] = useState(1)
  const [submitted, setSubmitted] = useState(false)
  const [sending, setSending] = useState(false)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  const content = block.content as { title: string; subtitle: string; phone: string }
  const update = (k: string, v: string) => onChange({ ...content, [k]: v })

  const handleSubmit = async () => {
    if (!name.trim() || attending === null) { toast.error('Заполните все поля'); return }
    setSending(true)
    try {
      const { sendRSVPToTelegram, saveRSVPToDatabase } = await import('@/app/actions/rsvp')
      await Promise.all([
        sendRSVPToTelegram({ name, attending, guestCount, projectTitle, projectSlug }),
        saveRSVPToDatabase({ name, attending, guestCount, projectTitle, projectSlug, projectId }),
      ])
    } catch {}
    setSubmitted(true)
    setSending(false)
    toast.success(attending === 'yes' ? '🎉 Ждём вас на торжестве!' : 'Спасибо за ответ!')
  }

  return (
    <section ref={ref} className="py-16 px-5" style={{ backgroundColor: colors.background }}>
      <div className="max-w-md mx-auto">
        <motion.div initial={{ opacity:0, y:16 }} animate={inView?{opacity:1,y:0}:{}} className="text-center mb-8">
          <p className="text-xs tracking-[0.4em] uppercase mb-3" style={{ color: colors.primary, fontFamily: fonts.body }}>RSVP</p>
          <EditableText value={content.title} onChange={v=>update('title',v)} isEditing={isEditing} tag="h2"
            className="font-light mb-2"
            style={{ color: colors.text, fontFamily: resolveFontFamily(fonts.heading), fontSize: 'clamp(1.6rem,4vw,2.4rem)' } as React.CSSProperties} />
          <EditableText value={content.subtitle} onChange={v=>update('subtitle',v)} isEditing={isEditing} tag="p"
            className="text-sm" style={{ color: colors.text, opacity: 0.55 } as React.CSSProperties} />
        </motion.div>

        <motion.div initial={{ opacity:0, y:16 }} animate={inView?{opacity:1,y:0}:{}} transition={{ delay:0.15 }}
          className="rounded-2xl p-6" style={{ background: colors.accent+'25', border:`1px solid ${colors.primary}18` }}>
          {submitted ? (
            <div className="text-center py-8">
              <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: colors.primary }}>
                <Check size={24} className="text-white" />
              </div>
              <p className="text-xl font-light mb-2" style={{ color: colors.text, fontFamily: resolveFontFamily(fonts.heading) }}>
                {attending === 'yes' ? 'Ждём вас! 🎉' : 'Спасибо!'}
              </p>
              <p className="text-sm opacity-40" style={{ color: colors.text }}>
                {attending === 'yes' ? `Будем рады видеть вас${guestCount>1?` (${guestCount} чел.)`:''}` : 'Ваш ответ получен'}
              </p>
            </div>
          ) : (
            <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
              {/* Name */}
              <div>
                <label className="block text-xs uppercase tracking-widest mb-2" style={{ color: colors.text, opacity:0.5, fontFamily: fonts.body }}>Ваше имя</label>
                <input type="text" value={name} onChange={e=>setName(e.target.value)} placeholder="Введите ваше имя"
                  className="input-luxury" style={{ color: colors.text, background: colors.background+'CC' }} />
              </div>

              {/* Yes/No */}
              <div>
                <label className="block text-xs uppercase tracking-widest mb-2" style={{ color: colors.text, opacity:0.5, fontFamily: fonts.body }}>Вы придёте?</label>
                <div className="grid grid-cols-2 gap-2">
                  {([['yes','✅ Да, буду!'],['no','❌ Не смогу']] as const).map(([val,label])=>(
                    <button key={val} onClick={()=>setAttending(val)}
                      className="py-3 rounded-xl text-sm font-medium transition-all active:scale-95"
                      style={attending===val ? { background: colors.primary, color:'#fff' } : { background: colors.background, color: colors.text, border:`1px solid ${colors.primary}28` }}>
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Guest count */}
              {attending === 'yes' && (
                <motion.div initial={{ opacity:0, height:0 }} animate={{ opacity:1, height:'auto' }} transition={{ duration:0.2 }}>
                  <label className="block text-xs uppercase tracking-widest mb-3" style={{ color: colors.text, opacity:0.5, fontFamily: fonts.body }}>Количество гостей</label>
                  <div className="flex items-center gap-5 justify-center">
                    <button onClick={()=>setGuestCount(Math.max(1,guestCount-1))}
                      className="w-10 h-10 rounded-xl flex items-center justify-center active:scale-90 transition-all"
                      style={{ background: colors.background, border:`1px solid ${colors.primary}28`, color: colors.text }}>
                      <Minus size={14} />
                    </button>
                    <span className="text-2xl font-light w-8 text-center" style={{ color: colors.text, fontFamily: resolveFontFamily(fonts.heading) }}>{guestCount}</span>
                    <button onClick={()=>setGuestCount(Math.min(20,guestCount+1))}
                      className="w-10 h-10 rounded-xl flex items-center justify-center active:scale-90 transition-all"
                      style={{ background: colors.background, border:`1px solid ${colors.primary}28`, color: colors.text }}>
                      <Plus size={14} />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Submit */}
              <button onClick={handleSubmit} disabled={sending||!name.trim()||attending===null}
                className="w-full py-3.5 rounded-xl font-medium text-white transition-all flex items-center justify-center gap-2"
                style={{ background:`linear-gradient(135deg,${colors.primary},${colors.secondary})`, opacity:(sending||!name.trim()||attending===null)?0.5:1 }}>
                {sending
                  ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  : <><Send size={14} />Отправить ответ</>}
              </button>

              {!isEditing && <p className="text-center text-xs opacity-30" style={{ color: colors.text }}>Ответ придёт организатору в Telegram</p>}
            </div>
          )}
        </motion.div>

        {/* Phone */}
        <motion.div initial={{ opacity:0 }} animate={inView?{opacity:1}:{}} transition={{ delay:0.3 }} className="text-center mt-6">
          {isEditing ? (
            <div>
              <p className="text-xs opacity-40 mb-2" style={{ color: colors.text }}>Телефон для связи</p>
              <input type="tel" value={content.phone} onChange={e=>update('phone',e.target.value)}
                className="input-luxury max-w-xs mx-auto block text-center text-sm" style={{ color: colors.text }} />
            </div>
          ) : content.phone ? (
            <div>
              <p className="text-xs mb-2 opacity-35" style={{ color: colors.text }}>или напишите напрямую</p>
              <a href={`tel:${content.phone}`} className="inline-flex items-center gap-2 text-sm font-medium hover:opacity-70 transition-opacity" style={{ color: colors.primary }}>
                <Phone size={14} /> {content.phone}
              </a>
            </div>
          ) : null}
        </motion.div>
      </div>
    </section>
  )
}
