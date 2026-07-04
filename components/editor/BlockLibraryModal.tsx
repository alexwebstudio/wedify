'use client'
import { useState, useEffect, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, Star, Plus, Sparkles, Eye } from 'lucide-react'
import { BLOCK_CATALOG, CATEGORIES, CATALOG_COUNT, makeBlockFromCatalog } from '@/lib/blockLibrary'
import type { CatalogItem, BlockCategory, PreviewKind } from '@/lib/blockLibrary'
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

interface Props {
  open: boolean
  colors: ProjectColors
  fonts: ProjectFonts
  onClose: () => void
  onAdd: (item: CatalogItem) => void
}

const FAV_KEY = 'wedify.blockFavs'
const loadFavs = (): string[] => {
  try { return JSON.parse(localStorage.getItem(FAV_KEY) || '[]') } catch { return [] }
}
const saveFavs = (f: string[]) => { try { localStorage.setItem(FAV_KEY, JSON.stringify(f)) } catch {} }

// ─── Схематичное превью карточки (быстрое, без картинок) ───
function Schematic({ kind, colors }: { kind: PreviewKind; colors: ProjectColors }) {
  const c = colors
  const bar = (w: string, op = 1, h = 6) => (
    <div style={{ width: w, height: h, borderRadius: 4, background: c.primary, opacity: op }} />
  )
  const wrap: React.CSSProperties = { position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6, padding: 14 }

  if (kind === 'photo') return (
    <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(135deg, ${c.primary}, ${c.secondary})`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 7 }}>
      <div style={{ width: '46%', height: 7, borderRadius: 4, background: '#fff', opacity: 0.95 }} />
      <div style={{ width: '30%', height: 5, borderRadius: 4, background: '#fff', opacity: 0.7 }} />
    </div>
  )
  if (kind === 'text') return (
    <div style={wrap}>
      <div style={{ width: '50%', height: 8, borderRadius: 4, background: c.text, opacity: 0.85 }} />
      <div style={{ width: 26, height: 2, background: c.primary, margin: '2px 0' }} />
      {bar('72%', 0.35, 4)}{bar('64%', 0.35, 4)}{bar('40%', 0.35, 4)}
    </div>
  )
  if (kind === 'timeline') return (
    <div style={{ position: 'absolute', inset: 0, padding: 16, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 9 }}>
      {[0, 1, 2].map((i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 9, height: 9, borderRadius: '50%', border: `2px solid ${c.primary}`, flexShrink: 0 }} />
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 3 }}>
            {bar('40%', 1, 4)}{bar('64%', 0.3, 3)}
          </div>
        </div>
      ))}
    </div>
  )
  if (kind === 'map') return (
    <div style={{ position: 'absolute', inset: 0, background: `${c.accent}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ position: 'absolute', inset: 12, borderRadius: 8, background: `repeating-linear-gradient(0deg, ${c.primary}18 0 10px, transparent 10px 20px), repeating-linear-gradient(90deg, ${c.primary}18 0 10px, transparent 10px 20px)` }} />
      <div style={{ width: 16, height: 16, borderRadius: '50% 50% 50% 0', transform: 'rotate(-45deg)', background: c.primary, zIndex: 1 }} />
    </div>
  )
  if (kind === 'form') return (
    <div style={{ position: 'absolute', inset: 0, padding: 16, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 7 }}>
      {[0, 1].map((i) => <div key={i} style={{ height: 12, borderRadius: 5, border: `1.5px solid ${c.primary}45` }} />)}
      <div style={{ height: 14, borderRadius: 6, background: c.primary, marginTop: 2, width: '55%', alignSelf: 'center' }} />
    </div>
  )
  if (kind === 'grid') return (
    <div style={{ position: 'absolute', inset: 14, display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 5 }}>
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} style={{ borderRadius: 5, background: `linear-gradient(135deg, ${c.primary}, ${c.secondary})`, opacity: 0.35 + (i % 3) * 0.2 }} />
      ))}
    </div>
  )
  if (kind === 'video') return (
    <div style={{ position: 'absolute', inset: 0, background: '#1a1613', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 0, height: 0, borderTop: '9px solid transparent', borderBottom: '9px solid transparent', borderLeft: `15px solid ${c.primary}` }} />
    </div>
  )
  if (kind === 'footer') return (
    <div style={{ ...wrap, background: c.accent }}>
      {bar('44%', 0.85, 8)}
      <div style={{ width: 22, height: 2, background: c.primary }} />
      {bar('28%', 0.4, 4)}
    </div>
  )
  // info
  return (
    <div style={wrap}>
      <div style={{ width: 26, height: 26, borderRadius: 8, background: `${c.primary}22`, marginBottom: 3 }} />
      {bar('46%', 0.8, 6)}{bar('66%', 0.3, 4)}{bar('54%', 0.3, 4)}
    </div>
  )
}

// ─── Реальный рендер одного блока для Live Preview ───
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
    default: return null
  }
}

export function BlockLibraryModal({ open, colors, fonts, onClose, onAdd }: Props) {
  const [query, setQuery] = useState('')
  const [cat, setCat] = useState<BlockCategory | 'all' | 'fav'>('all')
  const [favs, setFavs] = useState<string[]>(() => (typeof window !== 'undefined' ? loadFavs() : []))
  const [selected, setSelected] = useState<CatalogItem>(BLOCK_CATALOG[0])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', onKey) }
  }, [open, onClose])

  const toggleFav = (id: string) => {
    setFavs((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
      saveFavs(next)
      return next
    })
  }

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
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0" style={{ background: 'rgba(20,15,10,.5)', backdropFilter: 'blur(6px)' }}
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 10 }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="relative bg-white w-full h-full sm:h-[88vh] sm:rounded-3xl overflow-hidden flex flex-col"
            style={{ maxWidth: 1120, boxShadow: '0 40px 100px rgba(0,0,0,.4)' }}
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-5 sm:px-6 h-16 border-b border-gray-100 flex-shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#C4A97D,#8B6F47)' }}>
                  <Sparkles size={16} className="text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#2C2017] leading-none">Библиотека блоков</p>
                  <p className="text-[11px] text-gray-400 mt-0.5">{CATALOG_COUNT} готовых блоков</p>
                </div>
              </div>
              <div className="flex-1 max-w-sm mx-auto relative">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Поиск блока..."
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-gray-50 text-sm outline-none focus:ring-2 focus:ring-[#C4A97D]/30 transition"
                />
              </div>
              <button onClick={onClose} className="w-9 h-9 rounded-xl flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-colors flex-shrink-0">
                <X size={18} />
              </button>
            </div>

            {/* Body */}
            <div className="flex flex-1 min-h-0">
              {/* Category rail */}
              <div className="hidden sm:flex flex-col w-48 border-r border-gray-100 p-3 gap-1 overflow-y-auto flex-shrink-0" data-lenis-prevent>
                {rail.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => setCat(r.id)}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-left transition-colors ${
                      cat === r.id ? 'bg-[#C4A97D]/12 text-[#8B6F47] font-medium' : 'text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    <span className="text-[13px] w-4 text-center">{r.icon}</span>
                    <span className="truncate">{r.label}</span>
                    {r.id === 'fav' && favs.length > 0 && (
                      <span className="ml-auto text-[10px] bg-[#C4A97D]/15 text-[#8B6F47] rounded-full px-1.5 py-0.5">{favs.length}</span>
                    )}
                  </button>
                ))}
              </div>

              {/* Mobile category chips */}
              <div className="sm:hidden absolute top-16 left-0 right-0 z-10 bg-white border-b border-gray-100 px-3 py-2 flex gap-1.5 overflow-x-auto" data-lenis-prevent>
                {rail.map((r) => (
                  <button key={r.id} onClick={() => setCat(r.id)}
                    className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs whitespace-nowrap transition-colors ${cat === r.id ? 'bg-[#C4A97D]/15 text-[#8B6F47] font-medium' : 'bg-gray-50 text-gray-500'}`}>
                    {r.icon} {r.label}
                  </button>
                ))}
              </div>

              {/* Cards grid */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-5 pt-16 sm:pt-5" data-lenis-prevent>
                {items.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center text-gray-400 py-20">
                    <Star size={30} className="mb-3 opacity-40" />
                    <p className="text-sm">{cat === 'fav' ? 'Пока нет избранных блоков' : 'Ничего не найдено'}</p>
                  </div>
                ) : (
                  <div className="grid gap-3.5" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))' }}>
                    {items.map((it) => {
                      const isFav = favs.includes(it.id)
                      const isSel = selected.id === it.id
                      return (
                        <motion.div
                          key={it.id}
                          layout
                          onMouseEnter={() => setSelected(it)}
                          onClick={() => setSelected(it)}
                          className="group relative rounded-2xl border bg-white overflow-hidden cursor-pointer transition-all"
                          style={{ borderColor: isSel ? '#C4A97D' : '#eee', boxShadow: isSel ? '0 8px 24px rgba(196,169,125,.18)' : 'none' }}
                          whileHover={{ y: -3 }}
                        >
                          {/* schematic */}
                          <div className="relative" style={{ height: 116, background: '#faf9f7' }}>
                            <Schematic kind={it.preview} colors={colors} />
                            <button
                              onClick={(e) => { e.stopPropagation(); toggleFav(it.id) }}
                              className="absolute top-2 right-2 w-7 h-7 rounded-lg flex items-center justify-center backdrop-blur-sm transition-colors"
                              style={{ background: 'rgba(255,255,255,.85)' }}
                              title={isFav ? 'Убрать из избранного' : 'В избранное'}
                            >
                              <Star size={13} className={isFav ? 'text-[#C4A97D]' : 'text-gray-300'} fill={isFav ? '#C4A97D' : 'none'} />
                            </button>
                          </div>
                          {/* info */}
                          <div className="p-3">
                            <p className="text-[13px] font-medium text-[#2C2017] truncate">{it.name}</p>
                            <p className="text-[11px] text-gray-400 leading-snug mt-0.5 line-clamp-2" style={{ minHeight: 28 }}>{it.desc}</p>
                            <button
                              onClick={(e) => { e.stopPropagation(); onAdd(it) }}
                              className="mt-2 w-full py-1.5 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-all"
                              style={{ background: '#C4A97D', color: '#fff' }}
                            >
                              <Plus size={13} /> Добавить
                            </button>
                          </div>
                        </motion.div>
                      )
                    })}
                  </div>
                )}
              </div>

              {/* Live preview pane */}
              <div className="hidden lg:flex flex-col w-[360px] border-l border-gray-100 flex-shrink-0">
                <div className="px-4 h-11 flex items-center gap-2 border-b border-gray-100 flex-shrink-0">
                  <Eye size={14} className="text-gray-400" />
                  <span className="text-xs font-medium text-gray-500">Живой предпросмотр</span>
                </div>
                <div className="flex-1 overflow-hidden bg-gray-50 relative">
                  <div className="absolute inset-0 overflow-y-auto" data-lenis-prevent>
                    <div style={{ width: 1000, transform: 'scale(0.36)', transformOrigin: 'top left', pointerEvents: 'none' }}>
                      <PreviewBlock item={selected} colors={colors} fonts={fonts} />
                    </div>
                  </div>
                </div>
                <div className="p-3 border-t border-gray-100 flex-shrink-0">
                  <p className="text-[13px] font-medium text-[#2C2017] mb-0.5">{selected.name}</p>
                  <p className="text-[11px] text-gray-400 mb-2.5 leading-snug">{selected.desc}</p>
                  <button
                    onClick={() => onAdd(selected)}
                    className="w-full py-2.5 rounded-xl text-sm font-medium text-white flex items-center justify-center gap-2"
                    style={{ background: 'linear-gradient(135deg,#C4A97D,#8B6F47)' }}
                  >
                    <Plus size={15} /> Добавить на сайт
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
