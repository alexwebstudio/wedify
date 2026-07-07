'use client'
import { useState, useEffect, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, Star, Plus, Sparkles, Monitor, Smartphone } from 'lucide-react'
import { BLOCK_CATALOG, CATEGORIES, CATALOG_COUNT, makeBlockFromCatalog } from '@/lib/blockLibrary'
import type { CatalogItem, BlockCategory, LayoutKind } from '@/lib/blockLibrary'
import type { ProjectColors, ProjectFonts, BlockData } from '@/types'

import { HeroBlock } from '@/components/blocks/HeroBlock'
import { StoryBlock } from '@/components/blocks/StoryBlock'
import { GalleryBlock } from '@/components/blocks/GalleryBlock'
import { TimerBlock } from '@/components/blocks/TimerBlock'
import { LocationBlock } from '@/components/blocks/LocationBlock'
import { RsvpBlock } from '@/components/blocks/RsvpBlock'
import { FinalBlock } from '@/components/blocks/FinalBlock'
import { ScheduleBlock } from '@/components/blocks/ScheduleBlock'
import { InfoCardBlock } from '@/components/blocks/InfoCardBlock'
import { VideoBlock } from '@/components/blocks/VideoBlock'
import { FooterBlock } from '@/components/blocks/FooterBlock'
import { CurtainsBlock } from '@/components/blocks/CurtainsBlock'
import { PreloaderBlock } from '@/components/blocks/PreloaderBlock'
import { EnvelopeBlock } from '@/components/blocks/EnvelopeBlock'
import { DressCodeBlock } from '@/components/blocks/DressCodeBlock'
import { CustomBlock } from '@/components/blocks/CustomBlock'
import { canUsePremium, type Plan } from '@/lib/subscription'
import { Lock } from 'lucide-react'
import toast from 'react-hot-toast'

interface Props {
  open: boolean
  colors: ProjectColors
  fonts: ProjectFonts
  plan?: Plan
  onClose: () => void
  onAdd: (item: CatalogItem) => void
}

const FAV_KEY = 'wedify.blockFavs'
const loadFavs = (): string[] => { try { return JSON.parse(localStorage.getItem(FAV_KEY) || '[]') } catch { return [] } }
const saveFavs = (f: string[]) => { try { localStorage.setItem(FAV_KEY, JSON.stringify(f)) } catch {} }

// ─── Мини-макет карточки: настоящая миниатюра сайта под конкретный layout ───
function MiniMockup({ layout, colors: c }: { layout: LayoutKind; colors: ProjectColors }) {
  const grad = `linear-gradient(135deg, ${c.primary}, ${c.secondary})`
  const soft = `linear-gradient(135deg, ${c.primary}44, ${c.secondary}33)`
  const Bar = ({ w, h = 4, op = 1, cl = c.text }: { w: number | string; h?: number; op?: number; cl?: string }) =>
    <div style={{ width: w, height: h, borderRadius: 3, background: cl, opacity: op }} />
  const Photo = ({ style }: { style?: React.CSSProperties }) => <div style={{ background: grad, ...style }} />
  const Heart = () => <span style={{ color: c.primary, fontSize: 7, lineHeight: 1 }}>♥</span>
  const box: React.CSSProperties = { position: 'absolute', inset: 0, background: c.background, overflow: 'hidden' }
  const center: React.CSSProperties = { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 5 }

  switch (layout) {
    case 'hero-center':
    case 'hero-full':
    case 'hero-luxury': {
      const dark = layout === 'hero-luxury'
      return (
        <div style={box}>
          <Photo style={{ position: 'absolute', inset: 0 }} />
          <div style={{ position: 'absolute', inset: 0, background: dark ? 'rgba(0,0,0,.55)' : layout === 'hero-full' ? 'linear-gradient(to top,rgba(0,0,0,.6),transparent)' : 'rgba(0,0,0,.4)' }} />
          {dark && <div style={{ position: 'absolute', inset: 8, border: `1px solid ${c.primary}88` }} />}
          <div style={{ position: 'absolute', inset: 0, ...center, justifyContent: layout === 'hero-full' ? 'flex-end' : 'center', paddingBottom: layout === 'hero-full' ? 14 : 0 }}>
            <Bar w={54} h={7} cl="#fff" /><span style={{ color: c.primary, fontSize: 8 }}>&amp;</span><Bar w={54} h={7} cl="#fff" />
            <div style={{ display: 'flex', gap: 4, alignItems: 'center', marginTop: 3 }}><Bar w={10} h={1} cl="#fff" op={.6} /><Heart /><Bar w={10} h={1} cl="#fff" op={.6} /></div>
            <Bar w={40} h={3} cl="#fff" op={.5} />
          </div>
        </div>
      )
    }
    case 'hero-minimal':
      return <div style={{ ...box, ...center, background: `linear-gradient(160deg,${c.background},${c.accent})` }}>
        <div style={{ display: 'flex', gap: 4 }}><Bar w={8} h={1} cl={c.primary} /><Heart /><Bar w={8} h={1} cl={c.primary} /></div>
        <Bar w={56} h={7} /><span style={{ color: c.primary, fontSize: 8 }}>&amp;</span><Bar w={56} h={7} /><Bar w={42} h={3} op={.4} />
      </div>
    case 'hero-split-r':
    case 'hero-split-l': {
      const photoRight = layout === 'hero-split-r'
      const P = <Photo style={{ width: '46%', height: '100%' }} />
      const T = <div style={{ width: '54%', height: '100%', ...center, gap: 5, padding: 8 }}><Bar w={20} h={2} cl={c.primary} /><Bar w={'70%'} h={6} /><Bar w={'70%'} h={6} /><Bar w={24} h={1} cl={c.primary} /><Bar w={'55%'} h={3} op={.4} /></div>
      return <div style={{ ...box, display: 'flex' }}>{photoRight ? <>{T}{P}</> : <>{P}{T}</>}</div>
    }
    case 'hero-envelope':
      return <div style={box}>
        <Photo style={{ position: 'absolute', inset: 0 }} /><div style={{ position: 'absolute', inset: 0, background: 'rgba(20,15,10,.5)' }} />
        <div style={{ position: 'absolute', inset: 0, ...center }}>
          <div style={{ width: '64%', background: c.background, borderRadius: 6, padding: '12px 8px', ...center, gap: 4, border: `1px solid ${c.primary}55` }}>
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: c.primary }} />
            <Bar w={44} h={6} /><Bar w={44} h={6} /><Bar w={30} h={2} op={.4} />
          </div>
        </div>
      </div>
    case 'hero-timer':
      return <div style={box}>
        <Photo style={{ position: 'absolute', inset: 0 }} /><div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,.45)' }} />
        <div style={{ position: 'absolute', inset: 0, ...center }}>
          <Bar w={54} h={7} cl="#fff" /><Bar w={54} h={7} cl="#fff" />
          <div style={{ display: 'flex', gap: 4, marginTop: 3 }}>{[0, 1, 2].map(i => <div key={i} style={{ width: 15, height: 16, borderRadius: 3, background: 'rgba(255,255,255,.15)', border: `1px solid ${c.primary}` }} />)}</div>
        </div>
      </div>
    case 'hero-collage':
      return <div style={{ ...box, display: 'flex', gap: 4, padding: 6, alignItems: 'center' }}>
        {[0, 1, 2].map(i => <Photo key={i} style={{ flex: 1, height: i === 1 ? '82%' : '70%', borderRadius: 4 }} />)}
        <div style={{ position: 'absolute', inset: 0, ...center }}><div style={{ background: c.background + 'E6', borderRadius: 6, padding: '6px 12px', ...center }}><Bar w={44} h={6} /><Bar w={30} h={2} op={.4} /></div></div>
      </div>
    case 'story-right':
    case 'story-left': {
      const left = layout === 'story-left'
      const P = <Photo style={{ width: '42%', height: '78%', borderRadius: 6, alignSelf: 'center' }} />
      const T = <div style={{ width: '58%', ...center, alignItems: 'flex-start', gap: 4, padding: 10 }}><Bar w={18} h={2} cl={c.primary} /><Bar w={'85%'} h={3} op={.5} /><Bar w={'80%'} h={3} op={.5} /><Bar w={'60%'} h={3} op={.5} /></div>
      return <div style={{ ...box, display: 'flex', alignItems: 'center', padding: 6 }}>{left ? <>{P}{T}</> : <>{T}{P}</>}</div>
    }
    case 'story-stack':
      return <div style={{ ...box, ...center, padding: 10, gap: 6 }}><Bar w={40} h={4} cl={c.primary} /><Photo style={{ width: '55%', height: '42%', borderRadius: 6 }} /><Bar w={'70%'} h={3} op={.5} /><Bar w={'60%'} h={3} op={.5} /></div>
    case 'story-cards':
      return <div style={{ ...box, ...center, padding: 10, gap: 6 }}><Bar w={40} h={4} cl={c.primary} /><Bar w={'70%'} h={3} op={.4} /><div style={{ display: 'flex', gap: 4, marginTop: 2 }}>{[0, 1, 2].map(i => <div key={i} style={{ width: 34, height: 34, borderRadius: 6, background: c.accent, border: `1px solid ${c.primary}22` }} />)}</div></div>
    case 'story-editorial':
      return <div style={{ ...box, display: 'flex', gap: 8, padding: 12, alignItems: 'flex-start' }}>
        <div style={{ width: '42%', display: 'flex', flexDirection: 'column', gap: 4 }}><Bar w={'90%'} h={9} /><Photo style={{ width: '80%', height: 40, borderRadius: 4, marginTop: 2 }} /></div>
        <div style={{ width: '58%', display: 'flex', flexDirection: 'column', gap: 3, paddingTop: 8 }}>{[0, 1, 2, 3].map(i => <Bar key={i} w={i === 3 ? '55%' : '100%'} h={3} op={.4} />)}</div>
      </div>
    case 'tl-vertical':
      return <div style={{ ...box, padding: 12, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 8 }}>
        {[0, 1, 2].map(i => <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}><div style={{ width: 8, height: 8, borderRadius: '50%', border: `2px solid ${c.primary}`, flexShrink: 0 }} /><div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}><Bar w={'40%'} h={3} /><Bar w={'70%'} h={2} op={.35} /></div></div>)}
      </div>
    case 'tl-connected':
      return <div style={{ ...box, padding: 12, position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 6 }}>
        <div style={{ position: 'absolute', top: 10, bottom: 10, left: '50%', width: 1, background: c.primary + '44' }} />
        {[0, 1, 2].map(i => <div key={i} style={{ width: '46%', alignSelf: i % 2 ? 'flex-end' : 'flex-start', background: c.accent + '66', borderRadius: 4, padding: 4 }}><Bar w={'50%'} h={2} cl={c.primary} /><Bar w={'80%'} h={3} /></div>)}
      </div>
    case 'tl-horizontal':
      return <div style={{ ...box, display: 'flex', alignItems: 'center', gap: 5, padding: '0 10px' }}>{[0, 1, 2].map(i => <div key={i} style={{ flex: 1, background: c.accent + '55', borderRadius: 6, padding: 6, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}><div style={{ width: 14, height: 14, borderRadius: '50%', background: c.primary }} /><Bar w={'70%'} h={2} cl={c.primary} /><Bar w={'85%'} h={3} /></div>)}</div>
    case 'tl-cards':
      return <div style={{ ...box, padding: 10, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 5, alignContent: 'center' }}>{[0, 1, 2, 3].map(i => <div key={i} style={{ background: c.accent + '55', borderRadius: 5, padding: 5, display: 'flex', gap: 4 }}><div style={{ width: 16, height: 16, borderRadius: 4, background: c.primary + '30', flexShrink: 0 }} /><div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}><Bar w={'80%'} h={3} /><Bar w={'60%'} h={2} op={.35} /></div></div>)}</div>
    case 'tl-circular':
      return <div style={{ ...box, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 10 }}>{[0, 1, 2].map(i => <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}><div style={{ width: 30, height: 30, borderRadius: '50%', border: `2px solid ${c.primary}` }} /><Bar w={26} h={2} op={.4} /></div>)}</div>
    case 'tl-minimal':
      return <div style={{ ...box, padding: '14px 16px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 7 }}>{[0, 1, 2, 3].map(i => <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'baseline', borderBottom: `1px solid ${c.primary}15`, paddingBottom: 5 }}><Bar w={26} h={2} cl={c.primary} /><Bar w={'55%'} h={3} /></div>)}</div>
    case 'map-split':
      return <div style={{ ...box, display: 'flex', gap: 6, padding: 8, alignItems: 'stretch' }}>
        <div style={{ width: '48%', background: c.accent, borderRadius: 6, position: 'relative', backgroundImage: `linear-gradient(${c.primary}22 1px,transparent 1px),linear-gradient(90deg,${c.primary}22 1px,transparent 1px)`, backgroundSize: '10px 10px' }}>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><div style={{ width: 14, height: 14, borderRadius: '50%', background: c.primary }} /></div>
        </div>
        <div style={{ width: '52%', display: 'flex', flexDirection: 'column', gap: 5, justifyContent: 'center' }}>{[0, 1, 2].map(i => <div key={i} style={{ background: c.accent + '66', borderRadius: 4, padding: 5, display: 'flex', flexDirection: 'column', gap: 2 }}><Bar w={'40%'} h={2} cl={c.primary} /><Bar w={'75%'} h={3} /></div>)}</div>
      </div>
    case 'map-stack':
      return <div style={{ ...box, ...center, padding: 10, gap: 5 }}><Bar w={50} h={5} /><Bar w={'55%'} h={3} op={.4} /><div style={{ width: '70%', height: '36%', background: c.accent, borderRadius: 6, position: 'relative', backgroundImage: `linear-gradient(${c.primary}22 1px,transparent 1px),linear-gradient(90deg,${c.primary}22 1px,transparent 1px)`, backgroundSize: '9px 9px' }}><div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><div style={{ width: 12, height: 12, borderRadius: '50%', background: c.primary }} /></div></div><div style={{ background: c.primary, borderRadius: 5, padding: '4px 14px' }}><Bar w={30} h={3} cl="#fff" /></div></div>
    case 'info':
      return <div style={{ ...box, ...center, padding: 12, gap: 5 }}><div style={{ width: 26, height: 26, borderRadius: 8, background: c.primary + '22', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Heart /></div><Bar w={44} h={5} /><Bar w={'70%'} h={3} op={.35} /><Bar w={'55%'} h={3} op={.35} /><div style={{ marginTop: 3, background: c.primary + '18', borderRadius: 10, padding: '3px 10px' }}><Bar w={30} h={2} cl={c.primary} /></div></div>
    case 'form':
      return <div style={{ ...box, ...center, padding: 12, gap: 5 }}><Bar w={20} h={2} cl={c.primary} /><Bar w={48} h={5} /><div style={{ width: '78%', height: 11, borderRadius: 5, border: `1.5px solid ${c.primary}44` }} /><div style={{ display: 'flex', gap: 5, width: '78%' }}><div style={{ flex: 1, height: 11, borderRadius: 5, background: c.primary }} /><div style={{ flex: 1, height: 11, borderRadius: 5, border: `1.5px solid ${c.primary}44` }} /></div><div style={{ width: '55%', height: 12, borderRadius: 6, background: grad, marginTop: 2 }} /></div>
    case 'form-card':
      return <div style={{ ...box, ...center, background: c.accent + '55', padding: 14 }}><div style={{ width: '86%', background: c.background, borderRadius: 8, padding: 10, boxShadow: '0 6px 16px rgba(0,0,0,.12)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}><Bar w={42} h={4} /><div style={{ width: '80%', height: 9, borderRadius: 4, border: `1.5px solid ${c.primary}44` }} /><div style={{ width: '55%', height: 10, borderRadius: 5, background: grad }} /></div></div>
    case 'form-split':
      return <div style={{ ...box, display: 'flex', gap: 6, padding: 10, alignItems: 'center' }}><div style={{ width: '46%', display: 'flex', flexDirection: 'column', gap: 3 }}><Bar w={'50%'} h={4} cl={c.primary} /><Bar w={'90%'} h={2} op={.4} /><Bar w={'75%'} h={2} op={.4} /></div><div style={{ width: '54%', background: c.accent + '55', borderRadius: 6, padding: 8, display: 'flex', flexDirection: 'column', gap: 4 }}><div style={{ height: 8, borderRadius: 4, border: `1.5px solid ${c.primary}44` }} /><div style={{ height: 9, borderRadius: 4, background: grad }} /></div></div>
    case 'form-glass':
      return <div style={{ ...box, ...center, background: grad, padding: 14 }}><div style={{ width: '82%', background: 'rgba(255,255,255,.8)', borderRadius: 8, padding: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, backdropFilter: 'blur(4px)' }}><Bar w={40} h={4} /><div style={{ width: '80%', height: 9, borderRadius: 4, border: `1.5px solid ${c.primary}55` }} /><div style={{ width: '55%', height: 10, borderRadius: 5, background: c.primary }} /></div></div>
    case 'form-full':
      return <div style={{ ...box, ...center, background: `linear-gradient(160deg,${c.background},${c.accent})`, padding: 14 }}><span style={{ color: c.primary, fontSize: 10 }}>♥</span><Bar w={44} h={5} /><div style={{ width: '78%', background: c.background, borderRadius: 8, padding: 8, boxShadow: '0 8px 20px rgba(0,0,0,.1)', display: 'flex', flexDirection: 'column', gap: 4, marginTop: 2 }}><div style={{ height: 8, borderRadius: 4, border: `1.5px solid ${c.primary}44` }} /><div style={{ height: 9, borderRadius: 4, background: grad }} /></div></div>
    case 'form-min':
      return <div style={{ ...box, ...center, padding: 14, gap: 6 }}><Bar w={44} h={4} /><div style={{ width: '70%', height: 9, borderBottom: `1.5px solid ${c.primary}55` }} /><div style={{ width: '70%', height: 9, borderBottom: `1.5px solid ${c.primary}55` }} /><div style={{ width: '50%', height: 10, borderRadius: 5, background: grad, marginTop: 2 }} /></div>
    case 'curtains':
      return <div style={{ ...box, display: 'flex' }}><div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 8, background: c.primary }} /><div style={{ width: '30%', height: '100%', background: `repeating-linear-gradient(90deg,${c.primary} 0,${c.primary} 5px,${c.secondary} 5px,${c.secondary} 11px)` }} /><div style={{ flex: 1, ...center }}><Bar w={40} h={5} /><Bar w={28} h={2} op={.4} /></div><div style={{ width: '30%', height: '100%', background: `repeating-linear-gradient(90deg,${c.primary} 0,${c.primary} 5px,${c.secondary} 5px,${c.secondary} 11px)` }} /></div>
    case 'preloader':
      return <div style={{ ...box, ...center, background: `radial-gradient(circle at 50% 40%,${c.accent},${c.background})`, gap: 6 }}><div style={{ width: 30, height: 30, borderRadius: '50%', border: `2px solid ${c.primary}33`, borderTopColor: c.primary }} /><Bar w={46} h={5} /><Bar w={30} h={2} op={.4} /></div>
    case 'envelope':
      return <div style={{ ...box, ...center, background: '#0d0b08' }}><div style={{ position: 'absolute', inset: 0, background: `linear-gradient(135deg,${c.primary}55,${c.secondary}44)` }} /><div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}><Bar w={50} h={6} cl="#fff" /><div style={{ background: 'rgba(255,255,255,.18)', borderRadius: 10, padding: '3px 10px', marginTop: 3 }}><span style={{ fontSize: 8, color: '#fff' }}>✉ открыть</span></div></div></div>
    case 'cinematic':
      return <div style={{ ...box }}><div style={{ position: 'absolute', inset: 0, background: `linear-gradient(135deg,${c.primary},${c.secondary})` }} /><div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top,rgba(0,0,0,.75),transparent 60%)' }} /><div style={{ position: 'absolute', left: 12, bottom: 12, display: 'flex', flexDirection: 'column', gap: 3 }}><Bar w={70} h={9} cl="#fff" /><Bar w={44} h={3} cl="#fff" op={.6} /></div></div>
    case 'dresscode':
      return <div style={{ ...box, display: 'flex', gap: 8, padding: 10, alignItems: 'center' }}><div style={{ width: '42%', height: '80%', borderRadius: 6, background: `linear-gradient(135deg,${c.primary}55,${c.secondary}55)` }} /><div style={{ width: '58%', display: 'flex', flexDirection: 'column', gap: 4 }}><Bar w={'70%'} h={5} /><Bar w={'90%'} h={2} op={.4} /><div style={{ display: 'flex', gap: 3, marginTop: 2 }}>{['#E8DED2', '#C9B79C', '#8B6F47', '#5A4A3A'].map((col, i) => <div key={i} style={{ width: 12, height: 12, borderRadius: '50%', background: col, border: '1px solid #fff' }} />)}</div></div></div>
    case 'custom':
      return <div style={{ ...box, display: 'flex', gap: 8, padding: 10, alignItems: 'center' }}><div style={{ width: '50%', display: 'flex', flexDirection: 'column', gap: 3 }}><Bar w={'70%'} h={5} />{[0, 1, 2].map(i => <Bar key={i} w={i === 2 ? '55%' : '95%'} h={2} op={.4} />)}</div><div style={{ width: '50%', height: '70%', borderRadius: 6, background: `linear-gradient(135deg,${c.primary}33,${c.secondary}33)` }} /><div style={{ position: 'absolute', top: 6, right: 6, width: 14, height: 8, borderRadius: 3, background: c.primary }} /></div>
    case 'loc-card':
      return <div style={{ ...box, ...center, padding: 10 }}><div style={{ width: '82%', background: c.background, borderRadius: 8, overflow: 'hidden', boxShadow: '0 6px 16px rgba(0,0,0,.1)', border: `1px solid ${c.primary}18` }}><div style={{ height: 34, background: `linear-gradient(135deg,${c.primary}44,${c.secondary}44)` }} /><div style={{ padding: 8, display: 'flex', flexDirection: 'column', gap: 3 }}><Bar w={'60%'} h={4} /><Bar w={'85%'} h={2} op={.4} /><div style={{ height: 9, borderRadius: 4, background: c.primary, marginTop: 2 }} /></div></div></div>
    case 'grid':
      return <div style={{ ...box, padding: 10, display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 4, alignContent: 'center' }}>{Array.from({ length: 6 }).map((_, i) => <div key={i} style={{ aspectRatio: '1', borderRadius: 4, background: soft }} />)}</div>
    case 'masonry':
      return <div style={{ ...box, padding: 10, display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gridAutoRows: '1fr', gap: 4, alignContent: 'center' }}><div style={{ gridColumn: 'span 2', gridRow: 'span 2', borderRadius: 4, background: grad }} />{Array.from({ length: 4 }).map((_, i) => <div key={i} style={{ borderRadius: 4, background: soft }} />)}</div>
    case 'strip':
      return <div style={{ ...box, display: 'flex', alignItems: 'center', gap: 5, padding: '0 10px' }}>{Array.from({ length: 4 }).map((_, i) => <div key={i} style={{ flex: 1, height: '62%', borderRadius: 5, background: i % 2 ? soft : grad }} />)}</div>
    case 'video':
      return <div style={{ ...box, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#1a1613' }}><div style={{ width: 0, height: 0, borderTop: '9px solid transparent', borderBottom: '9px solid transparent', borderLeft: `15px solid ${c.primary}` }} /></div>
    case 'footer-dark':
      return <div style={{ ...box, ...center, background: c.text }}><Heart /><Bar w={46} h={6} cl={c.background} /><Bar w={20} h={1} cl={c.primary} /><Bar w={30} h={2} cl={c.background} op={.5} /></div>
    case 'footer-ornament':
      return <div style={{ ...box, ...center, background: c.accent }}><div style={{ display: 'flex', gap: 5, alignItems: 'center' }}><Bar w={16} h={1} cl={c.primary} /><span style={{ color: c.primary, fontSize: 7 }}>✦</span><Bar w={16} h={1} cl={c.primary} /></div><Bar w={48} h={6} /><div style={{ background: c.primary + '22', borderRadius: 8, padding: '2px 8px', marginTop: 2 }}><Bar w={30} h={2} cl={c.secondary} /></div></div>
    case 'footer-date':
      return <div style={{ ...box, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', background: c.accent }}><div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}><Bar w={44} h={5} /><Bar w={30} h={2} op={.4} /></div><Bar w={40} h={12} cl={c.primary} /></div>
    case 'footer-center':
    default:
      return <div style={{ ...box, ...center }}><Bar w={50} h={6} /><Bar w={16} h={1} cl={c.primary} /><Bar w={30} h={3} cl={c.primary} op={.7} /><Bar w={40} h={2} op={.35} /></div>
  }
}

// ─── Реальный рендер одного блока (для живого предпросмотра) ───
function PreviewBlock({ item, colors, fonts }: { item: CatalogItem; colors: ProjectColors; fonts: ProjectFonts }) {
  const block: BlockData = useMemo(() => makeBlockFromCatalog(item, 0), [item])
  const noop = useCallback(() => {}, [])
  const shared = { block, colors, fonts, isEditing: false, onChange: noop }
  switch (item.type) {
    case 'hero': return <HeroBlock {...shared} />
    case 'story': return <StoryBlock {...shared} />
    case 'gallery': return <GalleryBlock {...shared} />
    case 'timer': return <TimerBlock {...shared} />
    case 'location': return <LocationBlock {...shared} />
    case 'rsvp': return <RsvpBlock {...shared} />
    case 'final': return <FinalBlock {...shared} />
    case 'schedule': return <ScheduleBlock {...shared} />
    case 'infocard': return <InfoCardBlock {...shared} />
    case 'video': return <VideoBlock {...shared} />
    case 'footer': return <FooterBlock {...shared} />
    case 'curtains': return <CurtainsBlock {...shared} />
    case 'preloader': return <PreloaderBlock {...shared} />
    case 'envelope': return <EnvelopeBlock {...shared} />
    case 'dresscode': return <DressCodeBlock {...shared} />
    case 'custom': return <CustomBlock {...shared} />
    default: return null
  }
}

export function BlockLibraryModal({ open, colors, fonts, plan = 'standard', onClose, onAdd }: Props) {
  const premiumUnlocked = canUsePremium(plan)
  const tryAdd = (it: CatalogItem) => {
    if (it.premium && !premiumUnlocked) {
      toast('Этот блок доступен на тарифе Премиум 👑', { icon: '🔒' })
      return
    }
    onAdd(it)
  }
  const [query, setQuery] = useState('')
  const [cat, setCat] = useState<BlockCategory | 'all' | 'fav'>('all')
  const [favs, setFavs] = useState<string[]>(() => (typeof window !== 'undefined' ? loadFavs() : []))
  const [selected, setSelected] = useState<CatalogItem>(BLOCK_CATALOG[0])
  const [device, setDevice] = useState<'desktop' | 'mobile'>('desktop')
  const [mobilePreview, setMobilePreview] = useState(false)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', onKey) }
  }, [open, onClose])

  const toggleFav = (id: string) => setFavs((prev) => { const n = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]; saveFavs(n); return n })

  const items = useMemo(() => {
    const q = query.trim().toLowerCase()
    return BLOCK_CATALOG.filter((it) => {
      if (cat === 'fav' && !favs.includes(it.id)) return false
      if (cat !== 'all' && cat !== 'fav' && it.category !== cat) return false
      if (q && !(`${it.name} ${it.desc}`.toLowerCase().includes(q))) return false
      return true
    })
  }, [query, cat, favs])

  const rail: { id: BlockCategory | 'all' | 'fav'; label: string; icon: string }[] = [
    { id: 'all', label: 'Все блоки', icon: '◆' },
    { id: 'fav', label: 'Избранное', icon: '★' },
    ...CATEGORIES.map((c) => ({ id: c.id, label: c.label, icon: c.icon })),
  ]

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-0 sm:p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0" style={{ background: 'rgba(20,15,10,.5)', backdropFilter: 'blur(6px)' }} onClick={onClose} />
          <motion.div initial={{ opacity: 0, scale: 0.97, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.98, y: 10 }} transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="relative bg-white w-full h-full sm:h-[88vh] sm:rounded-3xl overflow-hidden flex flex-col" style={{ maxWidth: 1160, boxShadow: '0 40px 100px rgba(0,0,0,.4)' }}>
            {/* Header */}
            <div className="flex items-center gap-3 px-5 sm:px-6 h-16 border-b border-gray-100 flex-shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#C4A97D,#8B6F47)' }}><Sparkles size={16} className="text-white" /></div>
                <div>
                  <p className="text-sm font-semibold text-[#2C2017] leading-none">Библиотека блоков</p>
                  <p className="text-[11px] text-gray-400 mt-0.5">{CATALOG_COUNT} готовых блоков</p>
                </div>
              </div>
              <div className="flex-1 max-w-sm mx-auto relative">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Поиск блока..." className="w-full pl-9 pr-3 py-2 rounded-xl bg-gray-50 text-sm outline-none focus:ring-2 focus:ring-[#C4A97D]/30 transition" />
              </div>
              <button onClick={onClose} className="w-9 h-9 rounded-xl flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-colors flex-shrink-0"><X size={18} /></button>
            </div>

            <div className="flex flex-1 min-h-0">
              {/* Category rail */}
              <div className="hidden sm:flex flex-col w-48 border-r border-gray-100 p-3 gap-1 overflow-y-auto flex-shrink-0" data-lenis-prevent>
                {rail.map((r) => (
                  <button key={r.id} onClick={() => setCat(r.id)}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-left transition-colors ${cat === r.id ? 'bg-[#C4A97D]/12 text-[#8B6F47] font-medium' : 'text-gray-500 hover:bg-gray-50'}`}>
                    <span className="text-[13px] w-4 text-center">{r.icon}</span>
                    <span className="truncate">{r.label}</span>
                    {r.id === 'fav' && favs.length > 0 && <span className="ml-auto text-[10px] bg-[#C4A97D]/15 text-[#8B6F47] rounded-full px-1.5 py-0.5">{favs.length}</span>}
                  </button>
                ))}
              </div>

              {/* Mobile chips */}
              <div className="sm:hidden absolute top-16 left-0 right-0 z-10 bg-white border-b border-gray-100 px-3 py-2 flex gap-1.5 overflow-x-auto" data-lenis-prevent>
                {rail.map((r) => (
                  <button key={r.id} onClick={() => setCat(r.id)} className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs whitespace-nowrap transition-colors ${cat === r.id ? 'bg-[#C4A97D]/15 text-[#8B6F47] font-medium' : 'bg-gray-50 text-gray-500'}`}>{r.icon} {r.label}</button>
                ))}
              </div>

              {/* Cards grid */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-5 pt-16 sm:pt-5" data-lenis-prevent>
                {items.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center text-gray-400 py-20"><Star size={30} className="mb-3 opacity-40" /><p className="text-sm">{cat === 'fav' ? 'Пока нет избранных блоков' : 'Ничего не найдено'}</p></div>
                ) : (
                  <div className="grid gap-3.5" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))' }}>
                    {items.map((it) => {
                      const isFav = favs.includes(it.id)
                      const isSel = selected.id === it.id
                      const locked = it.premium && !premiumUnlocked
                      return (
                        <motion.div key={it.id} layout onMouseEnter={() => setSelected(it)} onClick={() => setSelected(it)}
                          className="group relative rounded-2xl border bg-white overflow-hidden cursor-pointer transition-all"
                          style={{ borderColor: it.premium ? '#D4AF37' : isSel ? '#C4A97D' : '#eee', boxShadow: isSel ? '0 8px 24px rgba(196,169,125,.18)' : it.premium ? '0 4px 16px rgba(212,175,55,.14)' : 'none' }} whileHover={{ y: -3 }}>
                          {/* mini-mockup */}
                          <div className="relative" style={{ height: 128, background: '#f4f2ef' }}>
                            <div className="absolute inset-2 rounded-lg overflow-hidden shadow-sm" style={{ border: '1px solid rgba(0,0,0,.05)' }}>
                              <MiniMockup layout={it.layout} colors={colors} />
                            </div>
                            {it.premium && (
                              <span className="absolute top-2.5 left-2.5 z-10 flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold text-white" style={{ background: 'linear-gradient(135deg,#E0BC57,#B8860B)', boxShadow: '0 2px 6px rgba(184,134,11,.4)' }}>👑 Premium</span>
                            )}
                            {locked && <div className="absolute inset-2 rounded-lg flex items-center justify-center" style={{ background: 'rgba(28,24,18,.42)' }}><Lock size={20} className="text-white/90" /></div>}
                            <button onClick={(e) => { e.stopPropagation(); toggleFav(it.id) }} className="absolute top-2.5 right-2.5 w-7 h-7 rounded-lg flex items-center justify-center backdrop-blur-sm transition-colors" style={{ background: 'rgba(255,255,255,.85)' }} title={isFav ? 'Убрать из избранного' : 'В избранное'}>
                              <Star size={13} className={isFav ? 'text-[#C4A97D]' : 'text-gray-300'} fill={isFav ? '#C4A97D' : 'none'} />
                            </button>
                          </div>
                          <div className="p-3">
                            <p className="text-[13px] font-medium text-[#2C2017] truncate">{it.name}</p>
                            <p className="text-[11px] text-gray-400 leading-snug mt-0.5 line-clamp-2" style={{ minHeight: 28 }}>{it.desc}</p>
                            <button onClick={(e) => { e.stopPropagation(); tryAdd(it) }} className="mt-2 w-full py-1.5 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-all"
                              style={{ background: locked ? '#EFEAE0' : it.premium ? 'linear-gradient(135deg,#D4AF37,#B8860B)' : '#C4A97D', color: locked ? '#9A8B76' : '#fff' }}>
                              {locked ? <><Lock size={12} /> Премиум</> : <><Plus size={13} /> Добавить</>}
                            </button>
                          </div>
                        </motion.div>
                      )
                    })}
                  </div>
                )}
              </div>

              {/* Live preview pane with device toggle */}
              <div className="hidden lg:flex flex-col w-[380px] border-l border-gray-100 flex-shrink-0">
                <div className="px-4 h-11 flex items-center justify-between border-b border-gray-100 flex-shrink-0">
                  <span className="text-xs font-medium text-gray-500">Живой предпросмотр</span>
                  <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-0.5">
                    <button onClick={() => setDevice('desktop')} className={`p-1.5 rounded-md transition-colors ${device === 'desktop' ? 'bg-white shadow-sm text-[#2C2017]' : 'text-gray-400'}`} title="Desktop"><Monitor size={13} /></button>
                    <button onClick={() => setDevice('mobile')} className={`p-1.5 rounded-md transition-colors ${device === 'mobile' ? 'bg-white shadow-sm text-[#2C2017]' : 'text-gray-400'}`} title="Mobile"><Smartphone size={13} /></button>
                  </div>
                </div>
                <div className="flex-1 overflow-hidden bg-gray-100 relative flex items-start justify-center p-3">
                  <div className="w-full h-full overflow-y-auto rounded-xl" data-lenis-prevent style={device === 'mobile' ? { width: 300, flex: 'none', background: '#fff', boxShadow: '0 0 0 8px #1c1812, 0 20px 40px rgba(0,0,0,.3)', borderRadius: 24 } : { background: '#fff' }}>
                    <div style={{ width: device === 'mobile' ? 390 : 1100, transform: `scale(${device === 'mobile' ? 0.72 : 0.31})`, transformOrigin: 'top left', pointerEvents: 'none' }}>
                      <PreviewBlock item={selected} colors={colors} fonts={fonts} />
                    </div>
                  </div>
                </div>
                <div className="p-3 border-t border-gray-100 flex-shrink-0">
                  <p className="text-[13px] font-medium text-[#2C2017] mb-0.5 flex items-center gap-1.5">{selected.name}{selected.premium && <span className="text-[9px] font-semibold text-white px-1.5 py-0.5 rounded" style={{ background: 'linear-gradient(135deg,#D4AF37,#B8860B)' }}>Premium</span>}</p>
                  <p className="text-[11px] text-gray-400 mb-2.5 leading-snug">{selected.desc}</p>
                  {selected.premium && !premiumUnlocked ? (
                    <button onClick={() => tryAdd(selected)} className="w-full py-2.5 rounded-xl text-sm font-medium flex items-center justify-center gap-2" style={{ background: '#EFEAE0', color: '#9A8B76' }}><Lock size={14} /> Доступно на Премиум</button>
                  ) : (
                    <button onClick={() => tryAdd(selected)} className="w-full py-2.5 rounded-xl text-sm font-medium text-white flex items-center justify-center gap-2" style={{ background: selected.premium ? 'linear-gradient(135deg,#D4AF37,#B8860B)' : 'linear-gradient(135deg,#C4A97D,#8B6F47)' }}><Plus size={15} /> Добавить на сайт</button>
                  )}
                </div>
              </div>
            </div>

            {/* Мобильный предпросмотр: кнопка + полноэкранный лист */}
            <button onClick={() => setMobilePreview(true)}
              className="lg:hidden absolute bottom-4 right-4 z-30 flex items-center gap-2 px-4 py-2.5 rounded-full text-white text-sm font-medium shadow-lg"
              style={{ background: 'linear-gradient(135deg,#C4A97D,#8B6F47)' }}>
              <Smartphone size={15} /> Предпросмотр
            </button>
            <AnimatePresence>
              {mobilePreview && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="lg:hidden absolute inset-0 z-40 bg-white flex flex-col">
                  <div className="flex items-center justify-between px-4 h-14 border-b border-gray-100 flex-shrink-0">
                    <span className="text-sm font-medium text-[#2C2017] flex items-center gap-2">{selected.name}{selected.premium && <span className="text-[9px] font-semibold text-white px-1.5 py-0.5 rounded" style={{ background: 'linear-gradient(135deg,#D4AF37,#B8860B)' }}>Premium</span>}</span>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-0.5">
                        <button onClick={() => setDevice('desktop')} className={`p-1.5 rounded-md ${device === 'desktop' ? 'bg-white shadow-sm text-[#2C2017]' : 'text-gray-400'}`}><Monitor size={13} /></button>
                        <button onClick={() => setDevice('mobile')} className={`p-1.5 rounded-md ${device === 'mobile' ? 'bg-white shadow-sm text-[#2C2017]' : 'text-gray-400'}`}><Smartphone size={13} /></button>
                      </div>
                      <button onClick={() => setMobilePreview(false)} className="w-9 h-9 rounded-xl flex items-center justify-center text-gray-400 hover:bg-gray-100"><X size={18} /></button>
                    </div>
                  </div>
                  <div className="flex-1 overflow-hidden bg-gray-100 flex items-start justify-center p-3">
                    <div className="w-full h-full overflow-y-auto rounded-xl" data-lenis-prevent style={device === 'mobile' ? { maxWidth: 320, background: '#fff', boxShadow: '0 0 0 8px #1c1812', borderRadius: 24 } : { background: '#fff' }}>
                      <div style={{ width: device === 'mobile' ? 390 : 1100, transform: `scale(${device === 'mobile' ? 0.8 : 0.34})`, transformOrigin: 'top left', pointerEvents: 'none' }}>
                        <PreviewBlock item={selected} colors={colors} fonts={fonts} />
                      </div>
                    </div>
                  </div>
                  <div className="p-3 border-t border-gray-100 flex-shrink-0">
                    {selected.premium && !premiumUnlocked ? (
                      <button onClick={() => tryAdd(selected)} className="w-full py-3 rounded-xl text-sm font-medium flex items-center justify-center gap-2" style={{ background: '#EFEAE0', color: '#9A8B76' }}><Lock size={14} /> Доступно на Премиум</button>
                    ) : (
                      <button onClick={() => { tryAdd(selected); setMobilePreview(false) }} className="w-full py-3 rounded-xl text-sm font-medium text-white flex items-center justify-center gap-2" style={{ background: selected.premium ? 'linear-gradient(135deg,#D4AF37,#B8860B)' : 'linear-gradient(135deg,#C4A97D,#8B6F47)' }}><Plus size={15} /> Добавить на сайт</button>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
