'use client'

import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import { Star, Quote, X, Lock, ImagePlus } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '@/lib/hooks/useAuth'
import { uploadMedia } from '@/lib/projects'
import { submitReview, getApprovedReviews, type ReviewRow } from '@/app/actions/reviews'

// запасные отзывы, пока в базе пусто (чтобы блок не был пустым)
const SEED: ReviewRow[] = [
  { id: 's1', name: 'Аружан', rating: 5, text: 'Сделала приглашение за вечер, гости в восторге. Ссылку просто скинула в WhatsApp — все ответили через RSVP.', created_at: '' },
  { id: 's2', name: 'Данияр', rating: 5, text: 'Не разбираюсь в сайтах вообще, но тут реально всё понятно. Красиво получилось, жена довольна.', created_at: '' },
  { id: 's3', name: 'Камила', rating: 5, text: 'Очень нежный дизайн и удобно на телефоне. Особенно понравился таймер до свадьбы и галерея наших фото.', created_at: '' },
]

function Stars({ value, onChange }: { value: number; onChange?: (v: number) => void }) {
  return (
    <div style={{ display: 'flex', gap: 4 }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <button
          key={i}
          type="button"
          onClick={onChange ? () => onChange(i) : undefined}
          style={{
            background: 'none', border: 'none', padding: 0,
            cursor: onChange ? 'pointer' : 'default', lineHeight: 0,
          }}
        >
          <Star
            size={onChange ? 26 : 15}
            color="#C4A97D"
            fill={i <= value ? '#C4A97D' : 'transparent'}
          />
        </button>
      ))}
    </div>
  )
}

export default function Reviews() {
  const { user } = useAuth()
  const [reviews, setReviews] = useState<ReviewRow[]>(SEED)
  const [seeded, setSeeded] = useState(true)
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [rating, setRating] = useState(5)
  const [text, setText] = useState('')
  const [sending, setSending] = useState(false)
  const [images, setImages] = useState<string[]>([])
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const handleFiles = async (files: FileList | null) => {
    if (!files || !user) return
    const room = 4 - images.length
    const list = Array.from(files).slice(0, room)
    if (!list.length) { toast('Можно прикрепить до 4 изображений', { icon: 'ℹ️' }); return }
    setUploading(true)
    try {
      for (const f of list) {
        if (!f.type.startsWith('image/')) continue
        const url = await uploadMedia(f, user.id, 'reviews')
        setImages((prev) => [...prev, url].slice(0, 4))
      }
    } catch {
      toast.error('Не удалось загрузить изображение')
    } finally {
      setUploading(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  useEffect(() => {
    getApprovedReviews(12).then((rows) => {
      if (rows.length > 0) { setReviews(rows); setSeeded(false) }
    })
  }, [])

  // предзаполняем имя из аккаунта
  useEffect(() => {
    if (user && !name) {
      const meta = (user.user_metadata || {}) as { name?: string; full_name?: string }
      setName(meta.name || meta.full_name || user.email?.split('@')[0] || '')
    }
  }, [user]) // eslint-disable-line react-hooks/exhaustive-deps

  const openModal = () => {
    if (!user) {
      toast('Войдите, чтобы оставить отзыв', { icon: '🔒' })
      return
    }
    setOpen(true)
  }

  const handleSubmit = async () => {
    setSending(true)
    const res = await submitReview({ name, rating, text, images })
    setSending(false)
    if (res.ok) {
      toast.success(res.message)
      setOpen(false)
      const fresh: ReviewRow = {
        id: 'new-' + Date.now(), name: name.trim(), rating, text: text.trim(),
        images, created_at: new Date().toISOString(),
      }
      setReviews((prev) => [fresh, ...(seeded ? [] : prev)])
      setSeeded(false)
      setText(''); setRating(5); setImages([])
    } else {
      toast.error(res.message)
    }
  }

  return (
    <section id="reviews" data-anim="section" style={{ padding: '84px 20px', background: '#FFFFFF' }}>
      <div style={{ maxWidth: 1080, margin: '0 auto' }}>
        <div data-anim="fade" style={{ textAlign: 'center', marginBottom: 44 }}>
          <p style={{ color: '#B8956A', fontSize: 11, letterSpacing: '.4em', textTransform: 'uppercase', marginBottom: 10 }}>
            Отзывы
          </p>
          <h2
            style={{
              fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(2rem,4.5vw,3rem)',
              fontWeight: 300, color: '#1A1410', marginBottom: 8,
            }}
          >
            Что говорят пары
          </h2>
          <p style={{ color: '#8A7F74', fontSize: 14, fontWeight: 300 }}>Реальные впечатления тех, кто уже сделал сайт</p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))',
            gap: 16,
          }}
        >
          {reviews.map((r) => (
            <div
              key={r.id}
              data-anim="card"
              style={{
                padding: '26px 24px', borderRadius: 22, background: '#FAF8F5',
                border: '1px solid rgba(196,169,125,.14)', display: 'flex', flexDirection: 'column', gap: 14,
              }}
            >
              <Quote size={22} color="#C4A97D" style={{ opacity: 0.5 }} />
              <p style={{ color: '#3A322A', fontSize: 14.5, lineHeight: 1.65, flex: 1 }}>{r.text}</p>
              {r.images && r.images.length > 0 && (
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {r.images.slice(0, 4).map((url, i) => (
                    <a key={i} href={url} target="_blank" rel="noreferrer" style={{ display: 'block', width: 56, height: 56, borderRadius: 10, overflow: 'hidden', border: '1px solid rgba(196,169,125,.2)' }}>
                      <img src={url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </a>
                  ))}
                </div>
              )}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
                <div
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                  }}
                >
                  <div
                    style={{
                      width: 34, height: 34, borderRadius: '50%', display: 'flex', alignItems: 'center',
                      justifyContent: 'center', fontWeight: 600, color: '#8B6F47', fontSize: 14,
                      background: 'rgba(196,169,125,.14)',
                    }}
                  >
                    {r.name.charAt(0).toUpperCase()}
                  </div>
                  <span style={{ fontSize: 13.5, fontWeight: 500, color: '#1A1410' }}>{r.name}</span>
                </div>
                <Stars value={r.rating} />
              </div>
            </div>
          ))}
        </div>

        <div data-anim="fade" style={{ textAlign: 'center', marginTop: 36 }}>
          {user ? (
            <button
              onClick={openModal}
              style={{
                padding: '13px 30px', borderRadius: 14, fontSize: 14, fontWeight: 500, cursor: 'pointer',
                background: 'transparent', border: '1px solid rgba(196,169,125,.4)', color: '#8B6F47',
              }}
            >
              Оставить отзыв
            </button>
          ) : (
            <Link
              href="/auth/login"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '13px 30px', borderRadius: 14, fontSize: 14, fontWeight: 500,
                background: 'transparent', border: '1px solid rgba(196,169,125,.4)', color: '#8B6F47', textDecoration: 'none',
              }}
            >
              <Lock size={14} /> Войдите, чтобы оставить отзыв
            </Link>
          )}
          <p style={{ fontSize: 12, color: '#b3a89c', marginTop: 12 }}>
            Отзыв публикуется сразу. Мат и оскорбления автоматически не пропускаются.
          </p>
        </div>
      </div>

      {/* Модалка отзыва */}
      {open && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 70, display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 16, background: 'rgba(0,0,0,.55)', backdropFilter: 'blur(4px)',
          }}
          onClick={() => setOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%', maxWidth: 460, background: '#fff', borderRadius: 24, overflow: 'hidden',
              boxShadow: '0 30px 80px rgba(0,0,0,.3)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 22px', borderBottom: '1px solid #f0ece6' }}>
              <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 22, color: '#1A1410', fontWeight: 500 }}>
                Ваш отзыв
              </h3>
              <button onClick={() => setOpen(false)} style={{ background: '#f5f2ee', border: 'none', borderRadius: 10, padding: 8, cursor: 'pointer' }}>
                <X size={16} color="#8A7F74" />
              </button>
            </div>

            <div style={{ padding: 22, display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, textTransform: 'uppercase', letterSpacing: '.1em', color: '#9A9188', marginBottom: 8 }}>
                  Ваше имя
                </label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Как вас зовут"
                  maxLength={60}
                  style={{
                    width: '100%', padding: '11px 14px', borderRadius: 12, border: '1px solid #e5ddd3',
                    fontSize: 14, outline: 'none', color: '#1A1410',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, textTransform: 'uppercase', letterSpacing: '.1em', color: '#9A9188', marginBottom: 8 }}>
                  Оценка
                </label>
                <Stars value={rating} onChange={setRating} />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, textTransform: 'uppercase', letterSpacing: '.1em', color: '#9A9188', marginBottom: 8 }}>
                  Отзыв
                </label>
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Расскажите о вашем опыте — что понравилось, что было удобно"
                  rows={4}
                  maxLength={800}
                  style={{
                    width: '100%', padding: '11px 14px', borderRadius: 12, border: '1px solid #e5ddd3',
                    fontSize: 14, outline: 'none', resize: 'vertical', color: '#1A1410', lineHeight: 1.5,
                  }}
                />
                <p style={{ fontSize: 11, color: '#b3a89c', marginTop: 6 }}>
                  Отзыв появится на сайте сразу. Нецензурная лексика и оскорбления не пропускаются автоматически.
                </p>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, textTransform: 'uppercase', letterSpacing: '.1em', color: '#9A9188', marginBottom: 8 }}>
                  Фото (необязательно)
                </label>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {images.map((url, i) => (
                    <div key={i} style={{ position: 'relative', width: 64, height: 64, borderRadius: 10, overflow: 'hidden', border: '1px solid #e5ddd3' }}>
                      <img src={url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <button onClick={() => setImages((prev) => prev.filter((_, idx) => idx !== i))}
                        style={{ position: 'absolute', top: 2, right: 2, background: 'rgba(0,0,0,.55)', border: 'none', borderRadius: 6, padding: 2, cursor: 'pointer', lineHeight: 0 }}>
                        <X size={12} color="#fff" />
                      </button>
                    </div>
                  ))}
                  {images.length < 4 && (
                    <button onClick={() => fileRef.current?.click()} disabled={uploading}
                      style={{ width: 64, height: 64, borderRadius: 10, border: '1.5px dashed rgba(196,169,125,.5)', background: '#FAF8F5', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2, cursor: 'pointer', color: '#B8956A' }}>
                      {uploading ? <span style={{ fontSize: 10 }}>…</span> : <><ImagePlus size={16} /><span style={{ fontSize: 9 }}>Фото</span></>}
                    </button>
                  )}
                </div>
                <input ref={fileRef} type="file" accept="image/*" multiple hidden onChange={(e) => handleFiles(e.target.files)} />
                <p style={{ fontSize: 11, color: '#b3a89c', marginTop: 6 }}>Скриншоты или фото — до 4 изображений.</p>
              </div>

              <button
                onClick={handleSubmit}
                disabled={sending || uploading}
                className="btn-luxury"
                style={{ width: '100%', padding: '13px', borderRadius: 14, fontSize: 14, fontWeight: 500, opacity: (sending || uploading) ? 0.6 : 1 }}
              >
                {sending ? 'Отправляем…' : 'Опубликовать отзыв'}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
