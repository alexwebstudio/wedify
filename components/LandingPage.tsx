'use client'
import { useRef } from 'react'
import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import { Navbar } from '@/components/ui/Navbar'
import { ArrowRight, Sparkles, Smartphone, Link2, MessageCircle, Heart, Layers } from 'lucide-react'

export const BRAND = 'Wedify'

const TEMPLATES = [
  { id:'classic-luxury', name:'Classic Luxury', desc:'Золото · Минимализм', bride:'Айгерим', groom:'Дамир', bg:'#FAF8F5', bg2:'#F0E8DC', acc:'#B8956A', text:'#1E1610', hf:'Cormorant Garamond, serif' },
  { id:'modern-editorial', name:'Modern Editorial', desc:'Журнальный стиль', bride:'Sofia', groom:'Arsen', bg:'#FAFAFA', bg2:'#EFEFEF', acc:'#1A1A1A', text:'#1A1A1A', hf:'Playfair Display, serif' },
  { id:'soft-romantic', name:'Soft Romantic', desc:'Нежность · Пастель', bride:'Алина', groom:'Нурлан', bg:'#FFF8F6', bg2:'#FDE8E0', acc:'#C0706A', text:'#2A1815', hf:'Great Vibes, cursive' },
  { id:'dark-elegant', name:'Dark Elegant', desc:'Cinematic · Золото', bride:'Виктория', groom:'Марат', bg:'#0F0D0A', bg2:'#1E1A14', acc:'#C8A96E', text:'#F0E8D8', hf:'Cinzel, serif' },
  { id:'sage-garden', name:'Sage Garden', desc:'Природа · Шалфей', bride:'Зарина', groom:'Алексей', bg:'#F4F6F0', bg2:'#DDE5D4', acc:'#6B8560', text:'#1E2518', hf:'Cormorant Garamond, serif' },
]

const FEATURES = [
  { icon:<Layers size={18}/>, t:'Блочный редактор', d:'Включай блоки одним нажатием' },
  { icon:<Smartphone size={18}/>, t:'Любое устройство', d:'Идеально на телефоне и ПК' },
  { icon:<Link2 size={18}/>, t:'Своя ссылка', d:'wedify.kz/ваша-свадьба сразу' },
  { icon:<MessageCircle size={18}/>, t:'RSVP в Telegram', d:'Ответы гостей — в бот' },
  { icon:<Sparkles size={18}/>, t:'Премиум анимации', d:'Шторки, конвертики, эффекты' },
  { icon:<Heart size={18}/>, t:'Два языка', d:'Русский и Қазақша' },
]

export default function LandingPage() {
  const featRef = useRef(null)
  const tplRef = useRef(null)
  const inViewFeat = useInView(featRef, { once:true, margin:'-80px' })
  const inViewTpl  = useInView(tplRef,  { once:true, margin:'-80px' })

  return (
    <div style={{ fontFamily:'Inter, sans-serif', overflowX:'hidden' }}>
      <Navbar dark />

      {/* HERO */}
      <section style={{ position:'relative', minHeight:'100svh', display:'flex', alignItems:'center', justifyContent:'center', overflow:'hidden', background:'linear-gradient(155deg,#0F0D0A 0%,#1A1510 50%,#251E14 100%)' }}>
        <div style={{ position:'absolute', top:'25%', left:'25%', width:500, height:500, borderRadius:'50%', background:'radial-gradient(circle,rgba(184,149,106,.12),transparent 70%)', filter:'blur(60px)', pointerEvents:'none' }} />
        <div style={{ position:'absolute', inset:0, backgroundImage:'radial-gradient(circle,#C4A97D 1px,transparent 1px)', backgroundSize:'52px 52px', opacity:.035, pointerEvents:'none' }} />

        <div style={{ position:'relative', zIndex:2, textAlign:'center', padding:'120px 20px 60px', maxWidth:720, margin:'0 auto' }}>
          <motion.div initial={{ opacity:0, y:-12 }} animate={{ opacity:1, y:0 }}
            style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'8px 20px', borderRadius:100, background:'rgba(196,169,125,.1)', border:'1px solid rgba(196,169,125,.25)', marginBottom:28 }}>
            <span style={{ color:'#C4A97D', fontSize:11, letterSpacing:'0.2em', textTransform:'uppercase', fontWeight:500 }}>✦ Конструктор свадебных сайтов</span>
          </motion.div>

          <motion.h1 initial={{ opacity:0, y:24 }} animate={{ opacity:1, y:0 }} transition={{ delay:.1 }}
            style={{ fontFamily:'Comfortaa, Cormorant Garamond, cursive', fontSize:'clamp(2.8rem,8vw,5.5rem)', fontWeight:300, color:'white', lineHeight:1.08, letterSpacing:'-.01em', marginBottom:20 }}>
            Создайте сайт<br />
            <span style={{ background:'linear-gradient(135deg,#C4A97D 0%,#E8D5B0 50%,#8B6F47 100%)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>
              для вашей свадьбы
            </span>
          </motion.h1>

          <motion.p initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:.35 }}
            style={{ color:'rgba(255,255,255,.42)', fontSize:17, fontWeight:300, lineHeight:1.75, maxWidth:460, margin:'0 auto 40px' }}>
            Выберите шаблон, заполните данные и получите красивое приглашение с личной ссылкой — без дизайнера.
          </motion.p>

          <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay:.5 }}
            style={{ display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap' }}>
            <Link href="/auth/register" className="btn-luxury" style={{ padding:'14px 32px', borderRadius:16, fontSize:15, fontWeight:500, display:'inline-flex', alignItems:'center', gap:8 }}>
              Создать бесплатно <ArrowRight size={15} />
            </Link>
            <a href="#templates" style={{ padding:'14px 32px', borderRadius:16, fontSize:15, background:'rgba(255,255,255,.06)', border:'1px solid rgba(255,255,255,.12)', color:'rgba(255,255,255,.75)', cursor:'pointer', textDecoration:'none' }}>
              Смотреть шаблоны
            </a>
          </motion.div>

          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:.9 }}
            style={{ marginTop:56, display:'flex', alignItems:'center', justifyContent:'center', gap:28, flexWrap:'wrap' }}>
            {['Красивый дизайн','Работает на телефоне','Публикация за минуты'].map(item=>(
              <div key={item} style={{ display:'flex', alignItems:'center', gap:7, color:'rgba(255,255,255,.28)', fontSize:13 }}>
                <span style={{ color:'#C4A97D', fontSize:9 }}>✦</span> {item}
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* TEMPLATES */}
      <section id="templates" style={{ padding:'80px 20px', background:'#F7F5F2' }}>
        <div ref={tplRef} style={{ maxWidth:1100, margin:'0 auto' }}>
          <motion.div initial={{ opacity:0, y:16 }} animate={inViewTpl?{ opacity:1, y:0 }:{}} style={{ textAlign:'center', marginBottom:48 }}>
            <p style={{ color:'#B8956A', fontSize:11, letterSpacing:'0.4em', textTransform:'uppercase', marginBottom:10 }}>Шаблоны</p>
            <h2 style={{ fontFamily:'Cormorant Garamond, serif', fontSize:'clamp(2rem,4vw,3rem)', fontWeight:300, color:'#1A1410' }}>Пять стилей на выбор</h2>
            <p style={{ color:'#8A7F74', fontSize:14, marginTop:8, fontWeight:300 }}>Каждый шаблон — уникальная атмосфера</p>
          </motion.div>

          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(180px,1fr))', gap:16 }}>
            {TEMPLATES.map((tpl,i)=>(
              <motion.div key={tpl.id} initial={{ opacity:0, y:20 }} animate={inViewTpl?{ opacity:1, y:0 }:{}} transition={{ delay:i*.08 }}
                className="template-card group" onClick={()=>window.location.href='/auth/register'}>
                <div style={{ aspectRatio:'2/3', position:'relative', display:'flex', alignItems:'center', justifyContent:'center', background:`linear-gradient(165deg,${tpl.bg},${tpl.bg2})` }}>
                  <div style={{ textAlign:'center', padding:'0 12px' }}>
                    <div style={{ width:16, height:1, background:tpl.acc, margin:'0 auto 12px' }} />
                    <p style={{ fontFamily:tpl.hf, fontSize:'clamp(.85rem,2.5vw,1.2rem)', fontWeight:300, color:tpl.text, lineHeight:1.1 }}>{tpl.bride}</p>
                    <p style={{ color:tpl.acc, margin:'4px 0', fontSize:12 }}>✦</p>
                    <p style={{ fontFamily:tpl.hf, fontSize:'clamp(.85rem,2.5vw,1.2rem)', fontWeight:300, color:tpl.text, lineHeight:1.1 }}>{tpl.groom}</p>
                    <div style={{ width:16, height:1, background:tpl.acc, margin:'12px auto 8px' }} />
                    <p style={{ fontSize:8, letterSpacing:'0.2em', textTransform:'uppercase', color:tpl.text, opacity:.3 }}>2026</p>
                  </div>
                  <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', background:'rgba(0,0,0,0)', transition:'background .25s' }}
                    onMouseEnter={e=>(e.currentTarget.style.background='rgba(0,0,0,.5)')}
                    onMouseLeave={e=>(e.currentTarget.style.background='rgba(0,0,0,0)')}>
                    <span style={{ padding:'8px 18px', borderRadius:10, background:'linear-gradient(135deg,#C4A97D,#8B6F47)', color:'white', fontSize:12, fontWeight:500, opacity:0, transition:'opacity .25s' }}
                      onMouseEnter={e=>(e.currentTarget.style.opacity='1')}
                      onMouseLeave={e=>(e.currentTarget.style.opacity='0')}>
                      Выбрать →
                    </span>
                  </div>
                </div>
                <div style={{ padding:'12px 14px', background:'white' }}>
                  <p style={{ fontFamily:'Playfair Display, serif', fontSize:13, fontWeight:500, color:'#1A1410', marginBottom:2 }}>{tpl.name}</p>
                  <p style={{ fontSize:10, color:'#9A9188', lineHeight:1.4 }}>{tpl.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* VIP Teaser */}
          <motion.div initial={{ opacity:0, y:12 }} animate={inViewTpl?{ opacity:1, y:0 }:{}} transition={{ delay:.6 }}
            style={{ marginTop:24, borderRadius:20, padding:'20px 24px', display:'flex', flexDirection:'column', gap:12, background:'linear-gradient(135deg,#1A1410,#2A2018)', border:'1px solid rgba(196,169,125,.2)' }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:12 }}>
              <div>
                <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4 }}>
                  <span style={{ background:'linear-gradient(135deg,#C4A97D,#8B6F47)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', fontSize:11, fontWeight:700, letterSpacing:'.15em', textTransform:'uppercase' }}>VIP</span>
                  <span style={{ color:'rgba(255,255,255,.6)', fontSize:14 }}>Эксклюзивные шаблоны</span>
                </div>
                <p style={{ color:'rgba(255,255,255,.3)', fontSize:13, fontWeight:300 }}>Шторки, конверт, кинематографические эффекты</p>
              </div>
              <Link href="/auth/register" style={{ padding:'10px 20px', borderRadius:12, background:'rgba(196,169,125,.12)', border:'1px solid rgba(196,169,125,.25)', color:'#C4A97D', fontSize:13, fontWeight:500, textDecoration:'none', whiteSpace:'nowrap' }}>
                Узнать подробнее →
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FEATURES */}
      <section ref={featRef} style={{ padding:'80px 20px', background:'linear-gradient(155deg,#0F0D0A,#1A1510)' }}>
        <div style={{ maxWidth:960, margin:'0 auto' }}>
          <motion.h2 initial={{ opacity:0, y:14 }} animate={inViewFeat?{ opacity:1, y:0 }:{}}
            style={{ fontFamily:'Cormorant Garamond, serif', fontSize:'clamp(2rem,4vw,2.8rem)', fontWeight:300, color:'white', textAlign:'center', marginBottom:48 }}>
            Всё что нужно
          </motion.h2>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(150px,1fr))', gap:14 }}>
            {FEATURES.map((f,i)=>(
              <motion.div key={f.t} initial={{ opacity:0, y:16 }} animate={inViewFeat?{ opacity:1, y:0 }:{}} transition={{ delay:i*.07 }}
                style={{ padding:'20px 16px', borderRadius:18, background:'rgba(255,255,255,.04)', border:'1px solid rgba(255,255,255,.06)' }}>
                <div style={{ width:36, height:36, borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center', background:'rgba(196,169,125,.12)', color:'#C4A97D', marginBottom:12 }}>{f.icon}</div>
                <p style={{ fontWeight:500, color:'white', fontSize:13, marginBottom:4 }}>{f.t}</p>
                <p style={{ color:'rgba(255,255,255,.32)', fontSize:12, lineHeight:1.6 }}>{f.d}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding:'80px 20px', background:'#F7F5F2', textAlign:'center' }}>
        <motion.div initial={{ opacity:0, scale:.96 }} whileInView={{ opacity:1, scale:1 }} viewport={{ once:true }}>
          <p style={{ color:'#C4A97D', fontSize:24, marginBottom:12 }}>♥</p>
          <h2 style={{ fontFamily:'Cormorant Garamond, serif', fontSize:'clamp(2rem,4vw,2.6rem)', fontWeight:300, color:'#1A1410', marginBottom:10 }}>Начните прямо сейчас</h2>
          <p style={{ color:'#8A7F74', fontSize:14, marginBottom:28, fontWeight:300 }}>Бесплатно. Без ограничений. Без карты.</p>
          <Link href="/auth/register" className="btn-luxury" style={{ padding:'14px 40px', borderRadius:18, fontSize:15, fontWeight:500, display:'inline-flex', alignItems:'center', gap:8 }}>
            Создать свадебный сайт <ArrowRight size={15} />
          </Link>
        </motion.div>
      </section>

      {/* FOOTER */}
      <footer style={{ padding:'44px 20px 28px', background:'#0F0D0A', borderTop:'1px solid rgba(196,169,125,.08)' }}>
        <div style={{ maxWidth:960, margin:'0 auto' }}>
          <div style={{ display:'flex', flexDirection:'column', gap:24, alignItems:'center', textAlign:'center' }}>
            <div>
              <p style={{ fontFamily:'Comfortaa, Cormorant Garamond, cursive', fontSize:22, color:'white', fontWeight:300, marginBottom:4 }}>Wedify</p>
              <p style={{ color:'rgba(255,255,255,.22)', fontSize:12 }}>Конструктор свадебных сайтов</p>
            </div>
            <div style={{ display:'flex', gap:10, alignItems:'center' }}>
              <p style={{ color:'rgba(255,255,255,.22)', fontSize:12, marginRight:4 }}>Нужна помощь?</p>
              {/* Telegram */}
              <a href="https://t.me/sanyamaster200" style={{ width:40, height:40, borderRadius:12, display:'flex', alignItems:'center', justifyContent:'center', background:'rgba(255,255,255,.06)', border:'1px solid rgba(255,255,255,.08)', transition:'transform .2s' }}>
                <svg width="18" height="18" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8l-1.68 7.92c-.12.56-.44.7-.9.44l-2.5-1.84-1.2 1.16c-.13.13-.24.24-.5.24l.18-2.56 4.62-4.17c.2-.18-.04-.28-.31-.1L7.86 13.8l-2.46-.76c-.53-.17-.54-.53.11-.78l9.62-3.71c.44-.16.83.11.51.25z" fill="#C4A97D"/></svg>
              </a>
              {/* WhatsApp */}
              <a href="https://api.whatsapp.com/send/?phone=77780824759&text&type=phone_number&app_absent=0" style={{ width:40, height:40, borderRadius:12, display:'flex', alignItems:'center', justifyContent:'center', background:'rgba(255,255,255,.06)', border:'1px solid rgba(255,255,255,.08)', transition:'transform .2s' }}>
                <svg width="18" height="18" viewBox="0 0 24 24"><path d="M17.47 6.53A7.87 7.87 0 0 0 12 4.25C7.73 4.25 4.25 7.73 4.25 12c0 1.37.36 2.7 1.03 3.87L4.25 19.75l3.98-.98A7.87 7.87 0 0 0 12 19.75c4.27 0 7.75-3.48 7.75-7.75 0-2.07-.8-4.01-2.28-5.47zm-5.47 11.94c-1.16 0-2.3-.31-3.3-.9l-.24-.14-2.36.58.6-2.3-.16-.25a6.55 6.55 0 0 1-1-3.46c0-3.62 2.95-6.57 6.57-6.57 1.75 0 3.4.68 4.64 1.93a6.52 6.52 0 0 1 1.93 4.64c-.01 3.62-2.96 6.57-6.58 6.57zm3.6-4.92c-.2-.1-1.17-.57-1.35-.64-.18-.07-.32-.1-.45.1-.13.2-.52.64-.63.77-.12.13-.23.14-.43.05-.2-.1-.84-.31-1.6-.99-.59-.52-.99-1.17-1.1-1.37-.12-.2-.01-.31.09-.4l.39-.45c.13-.15.17-.25.25-.42.08-.17.04-.32-.02-.45-.06-.13-.45-1.09-.62-1.49-.16-.39-.33-.33-.45-.34H8.8c-.13 0-.35.05-.53.25-.18.2-.7.68-.7 1.67s.72 1.93.82 2.07c.1.13 1.42 2.17 3.44 3.04.48.21.85.33 1.14.42.48.15.92.13 1.26.08.38-.06 1.17-.48 1.34-.94.16-.46.16-.86.11-.94-.05-.09-.18-.14-.38-.23z" fill="#C4A97D"/></svg>
              </a>
              {/* Instagram */}
              <a href="https://www.instagram.com/alexweb.studio/" style={{ width:40, height:40, borderRadius:12, display:'flex', alignItems:'center', justifyContent:'center', background:'rgba(255,255,255,.06)', border:'1px solid rgba(255,255,255,.08)', transition:'transform .2s' }}>
                <svg width="18" height="18" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" fill="#C4A97D"/></svg>
              </a>
            </div>
            <p style={{ color:'rgba(255,255,255,.18)', fontSize:11 }}>© 2026 Wedify · Разработано веб-студией <span style={{ color:'rgba(196,169,125,.5)' }}>AlexWebStudio</span></p>
          </div>
        </div>
      </footer>
    </div>
  )
}
