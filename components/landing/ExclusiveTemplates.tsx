'use client'

import { useState } from 'react'
import { createPortal } from 'react-dom'
import toast from 'react-hot-toast'
import { Loader, Layers, MailOpen, Sparkles, Wand2, Music4, Clock3, Film, X, Crown, ArrowRight } from 'lucide-react'

const ROADMAP = [
  { icon: Loader,   t: 'Прелоадер',         d: 'Кинематографичная заставка перед открытием приглашения', status: 'В разработке' },
  { icon: Layers,   t: 'Шторки-открытие',   d: 'Эффект раздвигающихся штор при заходе на сайт',          status: 'В разработке' },
  { icon: MailOpen, t: 'Кастомный конверт', d: 'Анимация распечатывания конверта с именами',             status: 'В разработке' },
  { icon: Film,     t: 'Cinematic-сцены',   d: 'Плавные переходы между блоками с параллаксом',            status: 'Планируется' },
  { icon: Wand2,    t: 'Скретч-карта даты', d: 'Дата свадьбы, которую гость «стирает» пальцем',          status: 'Планируется' },
  { icon: Music4,   t: 'Библиотека музыки', d: 'Готовые свадебные треки в один клик',                     status: 'Планируется' },
  { icon: Clock3,   t: 'Премиум-таймеры',   d: 'Богатые обратные отсчёты и анимации цифр',                status: 'Планируется' },
  { icon: Sparkles, t: 'Эффекты частиц',    d: 'Лепестки, конфетти, золотая пыль по скроллу',             status: 'Планируется' },
]

export default function ExclusiveTemplatesPlate() {
  const [open, setOpen] = useState(false)

  const handlePay = () => {
    toast('Оплата эксклюзивных шаблонов пока в разработке — скоро откроем 🤍', {
      icon: '♥',
      style: { background: '#1A1510', color: '#F0E8D8', border: '1px solid rgba(196,169,125,.3)' },
      duration: 4000,
    })
  }

  return (
    <>
      {/* Компактная плашка внутри блока «5 стилей» */}
      <div
        onClick={() => setOpen(true)}
        style={{
          marginTop: 22, cursor: 'pointer', borderRadius: 18, padding: '18px 22px',
          background: 'linear-gradient(120deg,#15100A,#241C13)', border: '1px solid rgba(196,169,125,.28)',
          display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap',
        }}
      >
        <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(196,169,125,.16)', color: '#E8D5B0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Crown size={22} />
        </div>
        <div style={{ flex: 1, minWidth: 180 }}>
          <p style={{ color: '#fff', fontWeight: 500, fontSize: 15, marginBottom: 2, display: 'flex', alignItems: 'center', gap: 8 }}>
            Эксклюзивные шаблоны
            <span style={{ fontSize: 9.5, letterSpacing: '.1em', textTransform: 'uppercase', color: '#E8D5B0', background: 'rgba(196,169,125,.16)', border: '1px solid rgba(196,169,125,.3)', padding: '2px 8px', borderRadius: 100 }}>Скоро</span>
          </p>
          <p style={{ color: 'rgba(255,255,255,.5)', fontSize: 13, lineHeight: 1.5 }}>Премиум-линейка с богатыми анимациями</p>
        </div>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#E8D5B0', fontSize: 13, fontWeight: 500 }}>
          Подробнее <ArrowRight size={14} />
        </span>
      </div>

      {open && typeof document !== 'undefined' && createPortal(
        <div
          onClick={() => setOpen(false)}
          style={{ position: 'fixed', inset: 0, zIndex: 90, overflowY: 'auto', WebkitOverflowScrolling: 'touch', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '5vh 16px', background: 'rgba(0,0,0,.6)', backdropFilter: 'blur(5px)' }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ width: '100%', maxWidth: 620, margin: 'auto', borderRadius: 26, background: 'linear-gradient(160deg,#12100B,#1D160E)', border: '1px solid rgba(196,169,125,.22)', boxShadow: '0 40px 100px rgba(0,0,0,.5)' }}
          >
            {/* header */}
            <div style={{ position: 'sticky', top: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '22px 24px', background: 'rgba(18,16,11,.9)', backdropFilter: 'blur(6px)', borderBottom: '1px solid rgba(255,255,255,.06)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: 11, background: 'rgba(196,169,125,.16)', color: '#E8D5B0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Crown size={20} />
                </div>
                <div>
                  <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 24, color: '#fff', fontWeight: 500, lineHeight: 1 }}>Эксклюзивные шаблоны</h3>
                  <p style={{ color: 'rgba(255,255,255,.4)', fontSize: 12, marginTop: 4 }}>Раздел в разработке · скоро в Maruno</p>
                </div>
              </div>
              <button onClick={() => setOpen(false)} style={{ background: 'rgba(255,255,255,.06)', border: 'none', borderRadius: 10, padding: 8, cursor: 'pointer' }}>
                <X size={16} color="rgba(255,255,255,.6)" />
              </button>
            </div>

            <div style={{ padding: 24 }}>
              <p style={{ color: 'rgba(255,255,255,.5)', fontSize: 14.5, lineHeight: 1.7, marginBottom: 22 }}>
                Отдельная линейка премиум-приглашений с богатыми анимациями: кинематографичные заставки,
                открытие шторками, конверты, скретч-карты и эффекты частиц. Вот что войдёт в неё:
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(240px,1fr))', gap: 12, marginBottom: 24 }}>
                {ROADMAP.map((item) => {
                  const Icon = item.icon
                  const inProgress = item.status === 'В разработке'
                  return (
                    <div key={item.t} style={{ padding: '18px 18px', borderRadius: 16, background: 'rgba(255,255,255,.035)', border: '1px solid rgba(255,255,255,.07)' }}>
                      <div style={{ width: 38, height: 38, borderRadius: 11, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(196,169,125,.12)', color: '#C4A97D', marginBottom: 12 }}>
                        <Icon size={18} />
                      </div>
                      <p style={{ color: '#fff', fontWeight: 500, fontSize: 13.5, marginBottom: 5 }}>{item.t}</p>
                      <p style={{ color: 'rgba(255,255,255,.35)', fontSize: 12, lineHeight: 1.55, marginBottom: 12 }}>{item.d}</p>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 10, fontWeight: 600, letterSpacing: '.06em', textTransform: 'uppercase', padding: '3px 9px', borderRadius: 100, color: inProgress ? '#E8D5B0' : 'rgba(255,255,255,.4)', background: inProgress ? 'rgba(196,169,125,.14)' : 'rgba(255,255,255,.05)', border: `1px solid ${inProgress ? 'rgba(196,169,125,.3)' : 'rgba(255,255,255,.08)'}` }}>
                        <span style={{ width: 5, height: 5, borderRadius: '50%', background: inProgress ? '#C4A97D' : 'rgba(255,255,255,.35)' }} />
                        {item.status}
                      </span>
                    </div>
                  )
                })}
              </div>

              <button
                onClick={handlePay}
                className="btn-luxury"
                style={{ width: '100%', padding: '15px', borderRadius: 16, fontSize: 15, fontWeight: 500, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
              >
                <Crown size={16} /> Оплатить эксклюзив
              </button>
              <p style={{ textAlign: 'center', color: 'rgba(255,255,255,.3)', fontSize: 12, marginTop: 12 }}>
                Оплата откроется вместе с релизом раздела
              </p>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  )
}
