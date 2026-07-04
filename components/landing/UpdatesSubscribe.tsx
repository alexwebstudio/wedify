'use client'

import { useState } from 'react'
import { Bell } from 'lucide-react'
import toast from 'react-hot-toast'
import { subscribeToUpdates } from '@/app/actions/subscribe'

// Пункт 10: получать сообщения о новых апдейтах.
export default function UpdatesSubscribe() {
  const [email, setEmail] = useState('')
  const [sending, setSending] = useState(false)

  const handle = async () => {
    setSending(true)
    const res = await subscribeToUpdates(email)
    setSending(false)
    if (res.ok) { toast.success(res.message); setEmail('') }
    else toast.error(res.message)
  }

  return (
    <section data-anim="section" style={{ padding: '72px 20px', background: 'linear-gradient(160deg,#1A1510,#0F0D0A)' }}>
      <div
        data-anim="fade"
        style={{
          maxWidth: 560, margin: '0 auto', textAlign: 'center',
          padding: '40px 28px', borderRadius: 28,
          background: 'rgba(255,255,255,.035)', border: '1px solid rgba(196,169,125,.16)',
        }}
      >
        <div
          style={{
            width: 48, height: 48, borderRadius: 14, margin: '0 auto 18px', display: 'flex',
            alignItems: 'center', justifyContent: 'center', background: 'rgba(196,169,125,.14)', color: '#C4A97D',
          }}
        >
          <Bell size={22} />
        </div>
        <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(1.6rem,4vw,2.2rem)', fontWeight: 300, color: '#fff', marginBottom: 10 }}>
          Узнавайте о новинках первыми
        </h3>
        <p style={{ color: 'rgba(255,255,255,.4)', fontSize: 14, fontWeight: 300, marginBottom: 24, lineHeight: 1.6 }}>
          Новые шаблоны, эксклюзивные блоки и апдейты сервиса — сообщим на почту.
        </p>

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            type="email"
            style={{
              flex: '1 1 220px', minWidth: 0, padding: '13px 16px', borderRadius: 14, fontSize: 14, outline: 'none',
              background: 'rgba(255,255,255,.05)', border: '1px solid rgba(196,169,125,.25)', color: '#fff',
            }}
          />
          <button
            onClick={handle}
            disabled={sending}
            className="btn-luxury"
            style={{ padding: '13px 26px', borderRadius: 14, fontSize: 14, fontWeight: 500, opacity: sending ? 0.6 : 1, whiteSpace: 'nowrap' }}
          >
            {sending ? '…' : 'Подписаться'}
          </button>
        </div>
      </div>
    </section>
  )
}
