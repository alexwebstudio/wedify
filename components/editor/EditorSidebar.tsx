'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Palette, Type, Music, Layers, Upload, Check, X } from 'lucide-react'
import { useAppStore } from '@/lib/store'
import type { Project, ProjectColors } from '@/types'

interface EditorSidebarProps {
  project: Project
  onUpdate: (updates: Partial<Project>) => void
  onBlockToggle: (id: string) => void
  userId?: string
  projectId?: string
}

const FONT_PAIRS = [
  { heading: 'Cormorant Garamond', body: 'Lato', label: 'Cormorant', sample: 'Айгерим & Дамир' },
  { heading: 'Great Vibes', body: 'Lato', label: 'Great Vibes', sample: 'Айгерим & Дамир' },
  { heading: 'Playfair Display', body: 'Lato', label: 'Playfair', sample: 'Айгерим & Дамир' },
  { heading: 'Cinzel', body: 'Raleway', label: 'Cinzel', sample: 'Айгерим & Дамир' },
  { heading: 'Marck Script', body: 'Lato', label: 'Marck Script', sample: 'Айгерим & Дамир' },
  { heading: 'Comfortaa', body: 'Inter', label: 'Comfortaa', sample: 'Айгерим & Дамир' },
  { heading: 'Montserrat', body: 'Inter', label: 'Montserrat', sample: 'Айгерим & Дамир' },
  { heading: 'Tenor Sans', body: 'Manrope', label: 'Tenor Sans', sample: 'Айгерим & Дамир' },
  { heading: 'Forum', body: 'Manrope', label: 'Forum', sample: 'Айгерим & Дамир' },
  { heading: 'Manrope', body: 'Inter', label: 'Manrope', sample: 'Айгерим & Дамир' },
]

const COLOR_PRESETS = [
  { name: 'Gold & Cream', primary: '#C4A97D', secondary: '#8B6F47', accent: '#F5EDD6', background: '#FAF8F5', text: '#2C2017' },
  { name: 'Rose & Blush', primary: '#D4829A', secondary: '#A85C72', accent: '#FCF0F4', background: '#FFF8FA', text: '#2A1520' },
  { name: 'Sage & White', primary: '#7C9E7E', secondary: '#5A7A5C', accent: '#EBF2EB', background: '#F8FBF8', text: '#1A261A' },
  { name: 'Dark Gold', primary: '#D4AF7A', secondary: '#A0896A', accent: '#3D3025', background: '#1C1812', text: '#F0E8D8' },
  { name: 'Navy & Silver', primary: '#8090A8', secondary: '#5A6880', accent: '#E8EDF5', background: '#F5F7FA', text: '#1A2233' },
  { name: 'Terracotta', primary: '#C4714A', secondary: '#9A5535', accent: '#F5E8E0', background: '#FBF5F0', text: '#2C1810' },
]

const BLOCK_LABELS: Record<string, string> = {
  hero: '✨ Главный экран',
  story: '💫 История',
  gallery: '📸 Галерея',
  timer: '⏱ Таймер',
  location: '📍 Место',
  rsvp: '💌 Подтверждение',
  final: '🌹 Финал',
}

type Tab = 'blocks' | 'colors' | 'fonts' | 'music'

export function EditorSidebar({ project, onUpdate, onBlockToggle }: EditorSidebarProps) {
  const [tab, setTab] = useState<Tab>('blocks')

  const sorted = [...project.blocks].sort((a, b) => a.order - b.order)

  const tabs: { key: Tab; icon: React.ReactNode; label: string }[] = [
    { key: 'blocks', icon: <Layers size={16} />, label: 'Блоки' },
    { key: 'colors', icon: <Palette size={16} />, label: 'Цвета' },
    { key: 'fonts', icon: <Type size={16} />, label: 'Шрифты' },
    { key: 'music', icon: <Music size={16} />, label: 'Музыка' },
  ]

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Tab bar */}
      <div className="flex border-b border-gray-100 shrink-0">
        {tabs.map((tb) => (
          <button
            key={tb.key}
            onClick={() => setTab(tb.key)}
            className={`flex-1 flex flex-col items-center gap-1 py-2.5 text-[10px] font-medium transition-colors ${
              tab === tb.key
                ? 'text-[#C4A97D] border-b-2 border-[#C4A97D] bg-[#C4A97D]/5'
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            {tb.icon}
            {tb.label}
          </button>
        ))}
      </div>

      {/* Content — scrollable */}
      <div className="flex-1 overflow-y-auto overscroll-contain">
        <AnimatePresence mode="wait">

          {/* ── BLOCKS ── */}
          {tab === 'blocks' && (
            <motion.div
              key="blocks"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="p-3 space-y-1.5"
            >
              <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-2 px-1">
                Нажмите переключатель чтобы скрыть/показать блок
              </p>
              {sorted.map((block) => (
                <div
                  key={block.id}
                  className="flex items-center gap-3 p-3 rounded-xl border transition-all"
                  style={{
                    borderColor: block.enabled ? 'rgba(196,169,125,0.25)' : '#f0f0f0',
                    background: block.enabled ? '#FAF8F5' : '#fafafa',
                  }}
                >
                  <span className="text-base shrink-0">{BLOCK_LABELS[block.type]?.split(' ')[0] || '📦'}</span>
                  <span className="text-sm font-medium text-[#2C2017] flex-1 min-w-0 truncate">
                    {BLOCK_LABELS[block.type]?.replace(/^[^\s]+\s/, '') || block.type}
                  </span>
                  <button
                    onClick={() => onBlockToggle(block.id)}
                    className="toggle-fix"
                    data-state={block.enabled ? 'on' : 'off'}
                    title={block.enabled ? 'Скрыть блок' : 'Показать блок'}
                  />
                </div>
              ))}
            </motion.div>
          )}

          {/* ── COLORS ── */}
          {tab === 'colors' && (
            <motion.div
              key="colors"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="p-3 space-y-4"
            >
              <div>
                <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-2 px-1">Готовые палитры</p>
                <div className="grid grid-cols-2 gap-2">
                  {COLOR_PRESETS.map((preset) => {
                    const isActive = project.colors.primary === preset.primary
                    return (
                      <button
                        key={preset.name}
                        onClick={() => onUpdate({ colors: preset })}
                        className={`p-2.5 rounded-xl border text-left transition-all ${
                          isActive ? 'ring-2 ring-[#C4A97D]' : 'hover:border-[#C4A97D]/50'
                        }`}
                        style={{ background: preset.background, borderColor: preset.primary + '30' }}
                      >
                        <div className="flex gap-1 mb-1.5">
                          {[preset.primary, preset.secondary, preset.accent, preset.text].map((c, i) => (
                            <div key={i} className="w-4 h-4 rounded-full" style={{ background: c, border: '1.5px solid white', boxShadow: '0 1px 2px rgba(0,0,0,.1)' }} />
                          ))}
                          {isActive && <Check size={12} className="ml-auto text-[#C4A97D]" />}
                        </div>
                        <p className="text-[11px] font-medium truncate" style={{ color: preset.text }}>{preset.name}</p>
                      </button>
                    )
                  })}
                </div>
              </div>

              <div>
                <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-2 px-1">Свои цвета</p>
                <div className="space-y-2">
                  {[
                    { key: 'primary', label: 'Акцент' },
                    { key: 'secondary', label: 'Вторичный' },
                    { key: 'background', label: 'Фон' },
                    { key: 'text', label: 'Текст' },
                  ].map(({ key, label }) => (
                    <div key={key} className="flex items-center justify-between px-1">
                      <span className="text-sm text-gray-600">{label}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400 font-mono">{project.colors[key as keyof ProjectColors]}</span>
                        <input
                          type="color"
                          value={project.colors[key as keyof ProjectColors]}
                          onChange={(e) => onUpdate({ colors: { ...project.colors, [key]: e.target.value } })}
                          className="w-8 h-8 rounded-lg cursor-pointer border border-gray-200 p-0.5"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* ── FONTS ── */}
          {tab === 'fonts' && (
            <motion.div
              key="fonts"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="p-3 space-y-2"
            >
              <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-2 px-1">Выберите стиль шрифта</p>
              {FONT_PAIRS.map((pair) => {
                const active = project.fonts.heading === pair.heading
                return (
                  <button
                    key={pair.label}
                    onClick={() => onUpdate({ fonts: { heading: pair.heading, body: pair.body } })}
                    className={`w-full p-3 rounded-xl border text-left transition-all ${
                      active ? 'border-[#C4A97D] bg-[#C4A97D]/5 ring-1 ring-[#C4A97D]/30' : 'border-gray-100 hover:border-[#C4A97D]/40'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[11px] text-gray-400">{pair.label}</span>
                      {active && <Check size={12} className="text-[#C4A97D]" />}
                    </div>
                    <p
                      className="text-2xl text-[#2C2017] leading-tight"
                      style={{ fontFamily: `'${pair.heading}', serif`, fontWeight: 300 }}
                    >
                      {pair.sample}
                    </p>
                  </button>
                )
              })}
            </motion.div>
          )}

          {/* ── MUSIC ── */}
          {tab === 'music' && (
            <motion.div
              key="music"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="p-3 space-y-3"
            >
              <p className="text-[10px] uppercase tracking-widest text-gray-400 px-1">Фоновая музыка</p>

              {project.music.url ? (
                <div className="p-3 rounded-xl bg-[#C4A97D]/10 border border-[#C4A97D]/20">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-[#2C2017] truncate max-w-[80%]">
                      {project.music.title || 'Музыка'}
                    </span>
                    <button
                      onClick={() => onUpdate({ music: { url: null, autoplay: false, title: '' } })}
                      className="p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      <X size={13} className="text-red-400" />
                    </button>
                  </div>
                  <audio controls src={project.music.url} className="w-full" style={{ height: 32 }} />
                </div>
              ) : (
                <label className="block border-2 border-dashed border-[#C4A97D]/30 rounded-xl p-6 text-center cursor-pointer hover:border-[#C4A97D] hover:bg-[#C4A97D]/5 transition-all">
                  <Upload size={22} className="text-[#C4A97D] mx-auto mb-2" />
                  <p className="text-sm font-medium text-[#2C2017]">Загрузить музыку</p>
                  <p className="text-xs text-gray-400 mt-1">MP3, AAC до 20MB</p>
                  <input
                    type="file"
                    accept="audio/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (!file) return
                      const url = URL.createObjectURL(file)
                      onUpdate({ music: { url, autoplay: false, title: file.name.replace(/\.[^.]+$/, '') } })
                    }}
                  />
                </label>
              )}

              <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50">
                <div>
                  <p className="text-sm font-medium text-[#2C2017]">Автовоспроизведение</p>
                  <p className="text-xs text-gray-400">После первого нажатия</p>
                </div>
                <button
                  onClick={() => onUpdate({ music: { ...project.music, autoplay: !project.music.autoplay } })}
                  className="toggle-fix"
                  data-state={project.music.autoplay ? 'on' : 'off'}
                />
              </div>

              <p className="text-xs text-gray-400 px-1">
                💡 Музыка воспроизводится на опубликованном сайте гостей
              </p>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  )
}
