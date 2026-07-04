'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Navbar } from '@/components/ui/Navbar'
import { useAuth } from '@/lib/hooks/useAuth'
import ExclusiveTemplatesPlate from '@/components/landing/ExclusiveTemplates'
import Reviews from '@/components/landing/Reviews'
import UpdatesSubscribe from '@/components/landing/UpdatesSubscribe'
import { ArrowRight, Smartphone, Link2, MessageCircle, Heart, Layers, Sparkles } from 'lucide-react'

export const BRAND = 'Wedify'

const WEDIFY_URL = 'https://wedify-kz.vercel.app'
const STUDIO_URL = 'https://alexwebstudio.netlify.app'

const TEMPLATES = [
  { id: 'classic-luxury',   name: 'Classic Luxury',   desc: 'Золото · Минимализм', bride: 'Александр', groom: 'Мария',   bg: '#FAF8F5', bg2: '#F0E8DC', acc: '#B8956A', text: '#1E1610', hf: 'Cormorant Garamond, serif' },
  { id: 'modern-editorial', name: 'Modern Editorial', desc: 'Журнальный стиль',    bride: 'Sofia',     groom: 'Arsen',   bg: '#FAFAFA', bg2: '#EFEFEF', acc: '#1A1A1A', text: '#1A1A1A', hf: 'Playfair Display, serif' },
  { id: 'soft-romantic',    name: 'Soft Romantic',    desc: 'Нежность · Пастель',  bride: 'Алина',     groom: 'Нурлан',  bg: '#FFF8F6', bg2: '#FDE8E0', acc: '#C0706A', text: '#2A1815', hf: 'Great Vibes, cursive' },
  { id: 'dark-elegant',     name: 'Dark Elegant',     desc: 'Cinematic · Золото',  bride: 'Виктория',  groom: 'Марат',   bg: '#0F0D0A', bg2: '#1E1A14', acc: '#C8A96E', text: '#F0E8D8', hf: 'Cinzel, serif' },
  { id: 'sage-garden',      name: 'Sage Garden',      desc: 'Природа · Шалфей',    bride: 'Зарина',    groom: 'Алексей', bg: '#F4F6F0', bg2: '#DDE5D4', acc: '#6B8560', text: '#1E2518', hf: 'Cormorant Garamond, serif' },
]

const FEATURES = [
  { icon: <Layers size={18} />,        t: 'Блочный редактор', d: 'Включай блоки одним нажатием' },
  { icon: <Smartphone size={18} />,    t: 'Любое устройство', d: 'Идеально на телефоне и ПК' },
  { icon: <Link2 size={18} />,         t: 'Своя ссылка',      d: 'wedify.kz/ваша-свадьба сразу' },
  { icon: <MessageCircle size={18} />, t: 'RSVP в Telegram',  d: 'Ответы гостей — в бот' },
  { icon: <Sparkles size={18} />,      t: 'Премиум анимации', d: 'Шторки, конвертики, эффекты' },
  { icon: <Heart size={18} />,         t: 'Два языка',        d: 'Русский и Қазақша' },
]

// Магнитная обёртка (desktop)
function Magnetic({ children, strength = 0.4 }: { children: React.ReactNode; strength?: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el || window.matchMedia('(pointer: coarse)').matches) return
    const xTo = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3.out' })
    const yTo = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3.out' })
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect()
      xTo((e.clientX - (r.left + r.width / 2)) * strength)
      yTo((e.clientY - (r.top + r.height / 2)) * strength)
    }
    const onLeave = () => { xTo(0); yTo(0) }
    el.addEventListener('mousemove', onMove)
    el.addEventListener('mouseleave', onLeave)
    return () => { el.removeEventListener('mousemove', onMove); el.removeEventListener('mouseleave', onLeave) }
  }, [strength])
  return <span ref={ref} className="wf-magnetic">{children}</span>
}

function LandingInner() {
  const { user } = useAuth()
  // если пользователь уже вошёл — ведём в кабинет/создание, а не на регистрацию
  const startHref = user ? '/dashboard' : '/auth/register'
  const templateHref = user ? '/dashboard/new' : '/auth/register'
  const rootRef = useRef<HTMLDivElement>(null)
  const heroRef = useRef<HTMLElement>(null)
  const glowRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const coarse = window.matchMedia('(pointer: coarse)').matches
    gsap.registerPlugin(ScrollTrigger)

    const ctx = gsap.context(() => {
      if (!reduce) {
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
        tl.fromTo('[data-hero="badge"]', { autoAlpha: 0, y: -14 }, { autoAlpha: 1, y: 0, duration: 0.6 })
          .fromTo('[data-hero="line"]', { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.12 }, '-=0.2')
          .fromTo('[data-hero="sub"]', { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.7 }, '-=0.45')
          .fromTo('[data-hero="cta"]', { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.6 }, '-=0.4')
          .fromTo('[data-hero="trust"]', { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.8 }, '-=0.3')
          .to('[data-hero="accent"]', { '--draw': 1, duration: 0.9, ease: 'power2.inOut' } as gsap.TweenVars, '-=0.5')

        // Чистое статичное свечение с лёгким параллаксом на скролле.
        // (Убрано «дешёвое» свечение за курсором — минимализм смотрится дороже.)
        gsap.to('[data-hero="glow"]', {
          yPercent: 14, ease: 'none',
          scrollTrigger: { trigger: '[data-hero="section"]', start: 'top top', end: 'bottom top', scrub: true },
        })
        void coarse
      } else {
        gsap.set('[data-hero]', { autoAlpha: 1 })
        gsap.set('[data-hero="accent"]', { '--draw': 1 } as gsap.TweenVars)
      }

      gsap.utils.toArray<HTMLElement>('[data-anim="fade"]').forEach((el) => {
        gsap.fromTo(el, { autoAlpha: 0, y: 30 },
          { autoAlpha: 1, y: 0, duration: 0.85, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 88%' } })
      })
      const groups = new Map<HTMLElement, HTMLElement[]>()
      gsap.utils.toArray<HTMLElement>('[data-anim="card"]').forEach((el) => {
        const p = el.parentElement as HTMLElement
        if (!groups.has(p)) groups.set(p, [])
        groups.get(p)!.push(el)
      })
      groups.forEach((cards, parent) => {
        gsap.fromTo(cards, { autoAlpha: 0, y: 34 },
          { autoAlpha: 1, y: 0, duration: 0.7, ease: 'power3.out', stagger: 0.08, scrollTrigger: { trigger: parent, start: 'top 85%' } })
      })

      ScrollTrigger.refresh()
    }, rootRef)

    return () => {
      const hero = heroRef.current as (HTMLElement & { _wf?: () => void }) | null
      hero?._wf?.()
      ctx.revert()
    }
  }, [])

  return (
    <div ref={rootRef} style={{ fontFamily: 'Comfortaa, Lato, sans-serif', overflowX: 'hidden' }}>
      <Navbar dark />

      {/* ── HERO (центрированный, только текст) ── */}
      <section
        ref={heroRef}
        data-hero="section"
        className="wf-grain"
        style={{
          position: 'relative', minHeight: '100svh', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
          background: 'radial-gradient(120% 90% at 50% 0%,#241C12 0%,#150F0A 45%,#0B0906 100%)',
        }}
      >
        <div ref={glowRef} data-hero="glow" style={{ position: 'absolute', top: '12%', left: 'calc(50% - 340px)', width: 680, height: 680, borderRadius: '50%', background: 'radial-gradient(circle,rgba(196,169,125,.2),transparent 68%)', filter: 'blur(62px)', pointerEvents: 'none', zIndex: 0 }} />

        <div style={{ position: 'relative', zIndex: 2, width: '100%', maxWidth: 1160, margin: '0 auto', padding: '120px 22px 80px', textAlign: 'center' }}>
          {/* badge — минималистично, только текст */}
          <div data-hero="badge" style={{ marginBottom: 30 }}>
            <span style={{ color: '#C4A97D', fontSize: 11.5, letterSpacing: '.34em', textTransform: 'uppercase', fontWeight: 500 }}>Конструктор свадебных сайтов</span>
          </div>

          {/* заголовок — шире по горизонтали, шрифт умеренный */}
          <h1 style={{ maxWidth: 1040, margin: '0 auto', fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(2.4rem,5.4vw,4rem)', fontWeight: 300, color: '#fff', lineHeight: 1.08, letterSpacing: '-.01em' }}>
            <span data-hero="line" style={{ display: 'block' }}>Создайте свой сайт-пригласительный</span>
            <span data-hero="line" style={{ display: 'block' }}>
              за{' '}
              <span data-hero="accent" className="wf-underline" style={{ '--draw': 0, color: '#E0C494', fontWeight: 400 } as React.CSSProperties}>
                10 минут
              </span>
            </span>
          </h1>

          <p data-hero="sub" style={{ color: 'rgba(255,255,255,.5)', fontSize: 17, fontWeight: 300, lineHeight: 1.7, maxWidth: 480, margin: '26px auto 40px' }}>
            Выберите шаблон, впишите имена и дату — получите красивое приглашение с личной ссылкой и ответами гостей. Без дизайнера.
          </p>

          <div data-hero="cta" style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Magnetic>
              <Link href={startHref} className="btn-luxury" style={{ padding: '15px 34px', borderRadius: 16, fontSize: 15, fontWeight: 500, display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                Создать бесплатно <ArrowRight size={15} />
              </Link>
            </Magnetic>
            <Magnetic strength={0.25}>
              <a href="#templates" style={{ padding: '15px 34px', borderRadius: 16, fontSize: 15, background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.14)', color: 'rgba(255,255,255,.8)', textDecoration: 'none', display: 'inline-flex' }}>
                Смотреть шаблоны
              </a>
            </Magnetic>
          </div>

          <div data-hero="trust" style={{ marginTop: 56, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 28, flexWrap: 'wrap' }}>
            {['Бесплатно сейчас', 'RSVP в Telegram', 'Русский и Қазақша'].map((x) => (
              <span key={x} style={{ display: 'flex', alignItems: 'center', gap: 7, color: 'rgba(255,255,255,.34)', fontSize: 13 }}>
                <span style={{ color: '#C4A97D', fontSize: 9 }}>♥</span> {x}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── TEMPLATES (+ эксклюзив-плашка) ── */}
      <section id="templates" data-anim="section" style={{ padding: '90px 20px', background: '#F7F5F2' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div data-anim="fade" style={{ textAlign: 'center', marginBottom: 52 }}>
            <p style={{ color: '#B8956A', fontSize: 11, letterSpacing: '.4em', textTransform: 'uppercase', marginBottom: 10 }}>Шаблоны</p>
            <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(2rem,4.5vw,3rem)', fontWeight: 300, color: '#1A1410' }}>Пять стилей на выбор</h2>
            <p style={{ color: '#8A7F74', fontSize: 14, marginTop: 8, fontWeight: 300 }}>Каждый шаблон — уникальная атмосфера. Наведи и загляни внутрь</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(190px,1fr))', gap: 18 }}>
            {TEMPLATES.map((tpl) => (
              <div key={tpl.id} data-anim="card" className="wf-tpl" onClick={() => (window.location.href = templateHref)}
                style={{ cursor: 'pointer', borderRadius: 18, overflow: 'hidden', background: '#fff', boxShadow: '0 12px 30px -18px rgba(0,0,0,.25)' }}>
                <div style={{ aspectRatio: '2/3', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', background: `linear-gradient(165deg,${tpl.bg},${tpl.bg2})`, overflow: 'hidden' }}>
                  <div style={{ textAlign: 'center', padding: '0 12px' }}>
                    <div className="wf-tpl-line" style={{ width: 18, height: 1, background: tpl.acc, margin: '0 auto 12px' }} />
                    <p style={{ fontFamily: tpl.hf, fontSize: 'clamp(.9rem,2.5vw,1.3rem)', fontWeight: 300, color: tpl.text, lineHeight: 1.1 }}>{tpl.bride}</p>
                    <p style={{ color: tpl.acc, margin: '4px 0', fontSize: 12 }}>♥</p>
                    <p style={{ fontFamily: tpl.hf, fontSize: 'clamp(.9rem,2.5vw,1.3rem)', fontWeight: 300, color: tpl.text, lineHeight: 1.1 }}>{tpl.groom}</p>
                    <div className="wf-tpl-line" style={{ width: 18, height: 1, background: tpl.acc, margin: '12px auto 8px' }} />
                    <p style={{ fontSize: 8, letterSpacing: '.2em', textTransform: 'uppercase', color: tpl.text, opacity: 0.35 }}>2026</p>
                  </div>
                  <div className="wf-tpl-go" style={{ position: 'absolute', bottom: 12, left: '50%', transform: 'translateX(-50%)', display: 'inline-flex', alignItems: 'center', gap: 6, padding: '7px 16px', borderRadius: 100, background: 'rgba(0,0,0,.55)', color: '#fff', fontSize: 11, whiteSpace: 'nowrap', backdropFilter: 'blur(4px)' }}>
                    Выбрать <ArrowRight size={12} />
                  </div>
                </div>
                <div style={{ padding: '14px 16px', background: 'white' }}>
                  <p style={{ fontFamily: 'Playfair Display, serif', fontSize: 14, fontWeight: 500, color: '#1A1410', marginBottom: 2 }}>{tpl.name}</p>
                  <p style={{ fontSize: 11, color: '#9A9188', lineHeight: 1.4 }}>{tpl.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div data-anim="fade">
            <ExclusiveTemplatesPlate />
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section data-anim="section" className="wf-grain" style={{ position: 'relative', padding: '90px 20px', overflow: 'hidden', background: 'radial-gradient(100% 80% at 50% 0%,#1A130C,#0C0A07)' }}>
        <div style={{ position: 'relative', zIndex: 2, maxWidth: 980, margin: '0 auto' }}>
          <div data-anim="fade" style={{ textAlign: 'center', marginBottom: 52 }}>
            <p style={{ color: '#B8956A', fontSize: 11, letterSpacing: '.4em', textTransform: 'uppercase', marginBottom: 10 }}>Возможности</p>
            <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(2rem,4.5vw,2.8rem)', fontWeight: 300, color: '#fff' }}>Всё что нужно</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(160px,1fr))', gap: 14 }}>
            {FEATURES.map((f) => (
              <div key={f.t} data-anim="card" className="wf-feat" style={{ padding: '24px 18px', borderRadius: 18, background: 'rgba(255,255,255,.035)', border: '1px solid rgba(255,255,255,.07)' }}>
                <div style={{ width: 38, height: 38, borderRadius: 11, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(196,169,125,.14)', color: '#C4A97D', marginBottom: 14 }}>{f.icon}</div>
                <p style={{ fontWeight: 500, color: '#fff', fontSize: 13, marginBottom: 4 }}>{f.t}</p>
                <p style={{ color: 'rgba(255,255,255,.36)', fontSize: 12, lineHeight: 1.6 }}>{f.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Reviews />
      <UpdatesSubscribe />

      {/* ── CTA ── */}
      <section data-anim="section" style={{ padding: '96px 20px', background: '#F7F5F2', textAlign: 'center' }}>
        <div data-anim="fade">
          <p style={{ color: '#C4A97D', fontSize: 26, marginBottom: 14 }}>♥</p>
          <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(2rem,4.5vw,2.8rem)', fontWeight: 300, color: '#1A1410', marginBottom: 10 }}>Начните прямо сейчас</h2>
          <p style={{ color: '#8A7F74', fontSize: 14, marginBottom: 30, fontWeight: 300 }}>Бесплатно. Без ограничений. Без карты.</p>
          <Magnetic>
            <Link href={startHref} className="btn-luxury" style={{ padding: '16px 42px', borderRadius: 18, fontSize: 15, fontWeight: 500, display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              Создать свадебный сайт <ArrowRight size={15} />
            </Link>
          </Magnetic>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ padding: '52px 20px 32px', background: '#0C0A07', borderTop: '1px solid rgba(196,169,125,.1)' }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24, alignItems: 'center', textAlign: 'center' }}>
            <div>
              <a href={WEDIFY_URL} target="_blank" rel="noopener noreferrer" style={{ fontFamily: 'Comfortaa, Cormorant Garamond, cursive', fontSize: 22, color: '#fff', fontWeight: 300, textDecoration: 'none' }}>Wedify</a>
              <p style={{ color: 'rgba(255,255,255,.24)', fontSize: 12, marginTop: 4 }}>Конструктор свадебных сайтов</p>
            </div>

            <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', justifyContent: 'center' }}>
              {[
                { href: '/blog', label: 'Полезные советы' },
                { href: '/pricing', label: 'Тарифы' },
                { href: '/#reviews', label: 'Отзывы' },
                { href: '/privacy', label: 'Конфиденциальность' },
                { href: '/terms', label: 'Условия' },
              ].map((l) => (
                <a key={l.label} href={l.href} style={{ color: 'rgba(255,255,255,.42)', fontSize: 13, textDecoration: 'none' }}>{l.label}</a>
              ))}
            </div>

            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <p style={{ color: 'rgba(255,255,255,.24)', fontSize: 12, marginRight: 4 }}>Нужна помощь?</p>
              <a href="https://t.me/sanyamaster200" target="_blank" rel="noopener noreferrer" style={{ width: 40, height: 40, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.08)' }}>
                <svg width="18" height="18" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8l-1.68 7.92c-.12.56-.44.7-.9.44l-2.5-1.84-1.2 1.16c-.13.13-.24.24-.5.24l.18-2.56 4.62-4.17c.2-.18-.04-.28-.31-.1L7.86 13.8l-2.46-.76c-.53-.17-.54-.53.11-.78l9.62-3.71c.44-.16.83.11.51.25z" fill="#C4A97D"/></svg>
              </a>
              <a href="https://api.whatsapp.com/send/?phone=77780824759&text&type=phone_number&app_absent=0" target="_blank" rel="noopener noreferrer" style={{ width: 40, height: 40, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.08)' }}>
                <svg width="18" height="18" viewBox="0 0 24 24"><path d="M17.47 6.53A7.87 7.87 0 0 0 12 4.25C7.73 4.25 4.25 7.73 4.25 12c0 1.37.36 2.7 1.03 3.87L4.25 19.75l3.98-.98A7.87 7.87 0 0 0 12 19.75c4.27 0 7.75-3.48 7.75-7.75 0-2.07-.8-4.01-2.28-5.47zm-5.47 11.94c-1.16 0-2.3-.31-3.3-.9l-.24-.14-2.36.58.6-2.3-.16-.25a6.55 6.55 0 0 1-1-3.46c0-3.62 2.95-6.57 6.57-6.57 1.75 0 3.4.68 4.64 1.93a6.52 6.52 0 0 1 1.93 4.64c-.01 3.62-2.96 6.57-6.58 6.57zm3.6-4.92c-.2-.1-1.17-.57-1.35-.64-.18-.07-.32-.1-.45.1-.13.2-.52.64-.63.77-.12.13-.23.14-.43.05-.2-.1-.84-.31-1.6-.99-.59-.52-.99-1.17-1.1-1.37-.12-.2-.01-.31.09-.4l.39-.45c.13-.15.17-.25.25-.42.08-.17.04-.32-.02-.45-.06-.13-.45-1.09-.62-1.49-.16-.39-.33-.33-.45-.34H8.8c-.13 0-.35.05-.53.25-.18.2-.7.68-.7 1.67s.72 1.93.82 2.07c.1.13 1.42 2.17 3.44 3.04.48.21.85.33 1.14.42.48.15.92.13 1.26.08.38-.06 1.17-.48 1.34-.94.16-.46.16-.86.11-.94-.05-.09-.18-.14-.38-.23z" fill="#C4A97D"/></svg>
              </a>
              <a href="https://www.instagram.com/alexweb.studio/" target="_blank" rel="noopener noreferrer" style={{ width: 40, height: 40, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.08)' }}>
                <svg width="18" height="18" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" fill="#C4A97D"/></svg>
              </a>
            </div>

            <p style={{ color: 'rgba(255,255,255,.2)', fontSize: 11 }}>
              © 2026{' '}
              <a href={WEDIFY_URL} target="_blank" rel="noopener noreferrer" style={{ color: 'rgba(255,255,255,.38)', textDecoration: 'none' }}>Wedify</a>
              {' '}· Разработано веб-студией{' '}
              <a href={STUDIO_URL} target="_blank" rel="noopener noreferrer" style={{ color: 'rgba(196,169,125,.65)', textDecoration: 'none' }}>AlexWebStudio</a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default function LandingPage() {
  return <LandingInner />
}
