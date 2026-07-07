'use client'
import { SiteFooter } from '@/components/landing/SiteFooter'

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
  { id: 'soft-romantic',    name: 'Soft Romantic',    desc: 'Нежность · Пастель',  bride: 'Алина',     groom: 'Нурлан',  bg: '#FFF8F6', bg2: '#FDE8E0', acc: '#C0706A', text: '#2A1815', hf: 'Caveat, cursive' },
  { id: 'dark-elegant',     name: 'Dark Elegant',     desc: 'Cinematic · Золото',  bride: 'Виктория',  groom: 'Марат',   bg: '#0F0D0A', bg2: '#1E1A14', acc: '#C8A96E', text: '#F0E8D8', hf: 'Playfair Display, serif' },
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
          <h1 style={{ maxWidth: 1040, margin: '0 auto', fontFamily: 'Comfortaa, sans-serif', fontSize: 'clamp(2.4rem,5.4vw,4rem)', fontWeight: 400, color: '#fff', lineHeight: 1.12, letterSpacing: '-.01em' }}>
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

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(150px,1fr))', gap: 14, alignItems: 'stretch' }}>
            {TEMPLATES.map((tpl) => (
              <div key={tpl.id} data-anim="card" className="wf-tpl" onClick={() => (window.location.href = templateHref)}
                style={{ cursor: 'pointer', borderRadius: 18, overflow: 'hidden', background: '#fff', boxShadow: '0 12px 30px -18px rgba(0,0,0,.25)', display: 'flex', flexDirection: 'column', height: '100%' }}>
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
                <div style={{ padding: '14px 16px', background: 'white', flex: 1 }}>
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
      <SiteFooter />
    </div>
  )
}

export default function LandingPage() {
  return <LandingInner />
}
