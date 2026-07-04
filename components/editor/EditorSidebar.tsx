'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence, Reorder, useDragControls } from 'framer-motion'
import {
  Palette, Type, Music, Layers, Upload, Check, X,
  Sparkles, Plus, Copy, Trash2, GripVertical, Eye, EyeOff,
} from 'lucide-react'
import type { Project, ProjectColors, BlockData, BlockType } from '@/types'
import {
  WEDDING_FONTS, fontFamilyValue, STYLE_PRESETS, COLOR_PRESETS,
  hexToRgb, rgbToHex, normalizeHex,
} from '@/lib/editorPresets'

interface EditorSidebarProps {
  project: Project
  onUpdate: (updates: Partial<Project>) => void
  onBlockToggle: (id: string) => void
  onBlockDuplicate: (id: string) => void
  onBlockDelete: (id: string) => void
  onBlockReorder: (blocks: BlockData[]) => void
  onAddBlock: () => void
  userId?: string
  projectId?: string
}

const TYPE_META: Record<BlockType, { icon: string; label: string }> = {
  hero: { icon: '✨', label: 'Главный экран' },
  story: { icon: '💫', label: 'История' },
  gallery: { icon: '📸', label: 'Галерея' },
  timer: { icon: '⏱', label: 'Таймер' },
  location: { icon: '📍', label: 'Локация' },
  rsvp: { icon: '💌', label: 'Подтверждение' },
  final: { icon: '🌹', label: 'Финал' },
  schedule: { icon: '🗓', label: 'Тайминг' },
  infocard: { icon: 'ℹ️', label: 'Инфо-блок' },
  video: { icon: '🎬', label: 'Видео' },
  footer: { icon: '🥂', label: 'Footer' },
}

function blockTitle(block: BlockData): string {
  const t = block.content?.title
  if (typeof t === 'string' && t.trim()) return t
  return TYPE_META[block.type]?.label ?? block.type
}

type Tab = 'blocks' | 'style' | 'colors' | 'fonts' | 'music'

export function EditorSidebar({
  project, onUpdate, onBlockToggle, onBlockDuplicate, onBlockDelete, onBlockReorder, onAddBlock,
}: EditorSidebarProps) {
  const [tab, setTab] = useState<Tab>('blocks')
  const sorted = [...project.blocks].sort((a, b) => a.order - b.order)

  const tabs: { key: Tab; icon: React.ReactNode; label: string }[] = [
    { key: 'blocks', icon: <Layers size={15} />, label: 'Блоки' },
    { key: 'style', icon: <Sparkles size={15} />, label: 'Стиль' },
    { key: 'colors', icon: <Palette size={15} />, label: 'Цвета' },
    { key: 'fonts', icon: <Type size={15} />, label: 'Шрифты' },
    { key: 'music', icon: <Music size={15} />, label: 'Музыка' },
  ]

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Tab bar */}
      <div className="flex border-b border-gray-100 shrink-0">
        {tabs.map((tb) => (
          <button
            key={tb.key}
            onClick={() => setTab(tb.key)}
            className={`flex-1 flex flex-col items-center gap-1 py-2.5 text-[9.5px] font-medium transition-colors ${
              tab === tb.key ? 'text-[#C4A97D] border-b-2 border-[#C4A97D] bg-[#C4A97D]/5' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            {tb.icon}
            {tb.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto overscroll-contain" data-lenis-prevent>
        <AnimatePresence mode="wait">

          {/* BLOCKS */}
          {tab === 'blocks' && (
            <motion.div key="blocks" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-3">
              <button
                onClick={onAddBlock}
                className="w-full mb-3 py-2.5 rounded-xl text-sm font-medium text-white flex items-center justify-center gap-2 transition-transform active:scale-[0.98]"
                style={{ background: 'linear-gradient(135deg,#C4A97D,#8B6F47)' }}
              >
                <Plus size={16} /> Добавить блок
              </button>

              <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-2 px-1">
                Перетащите за ручку, чтобы изменить порядок
              </p>

              <Reorder.Group axis="y" values={sorted} onReorder={onBlockReorder} className="space-y-1.5">
                {sorted.map((block) => (
                  <BlockRow
                    key={block.id}
                    block={block}
                    onToggle={() => onBlockToggle(block.id)}
                    onDuplicate={() => onBlockDuplicate(block.id)}
                    onDelete={() => onBlockDelete(block.id)}
                  />
                ))}
              </Reorder.Group>

              {sorted.length === 0 && (
                <div className="text-center py-10 text-gray-400">
                  <Layers size={26} className="mx-auto mb-2 opacity-40" />
                  <p className="text-sm">Пока нет блоков</p>
                  <p className="text-xs mt-1">Нажмите «Добавить блок»</p>
                </div>
              )}
            </motion.div>
          )}

          {/* STYLE PRESETS */}
          {tab === 'style' && (
            <motion.div key="style" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-3 space-y-2">
              <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-1 px-1">Готовые стили</p>
              <p className="text-[11px] text-gray-400 mb-2 px-1 leading-snug">Задаёт палитру и шрифты сразу</p>
              {STYLE_PRESETS.map((s) => {
                const active = project.colors.primary.toLowerCase() === s.colors.primary.toLowerCase()
                  && project.fonts.heading === s.fonts.heading
                return (
                  <button
                    key={s.id}
                    onClick={() => onUpdate({ colors: s.colors, fonts: s.fonts })}
                    className={`w-full p-3 rounded-xl border text-left transition-all ${
                      active ? 'border-[#C4A97D] ring-1 ring-[#C4A97D]/30' : 'border-gray-100 hover:border-[#C4A97D]/40'
                    }`}
                    style={{ background: s.colors.background }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span style={{ fontFamily: fontFamilyValue(s.fonts.heading), fontSize: 20, color: s.colors.text, lineHeight: 1 }}>{s.name}</span>
                      {active && <Check size={14} className="text-[#C4A97D]" />}
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        {[s.colors.primary, s.colors.secondary, s.colors.accent, s.colors.text].map((c, i) => (
                          <span key={i} className="w-4 h-4 rounded-full" style={{ background: c, border: '1.5px solid rgba(255,255,255,.7)', boxShadow: '0 1px 2px rgba(0,0,0,.12)' }} />
                        ))}
                      </div>
                      <span className="text-[11px] opacity-60" style={{ color: s.colors.text }}>{s.desc}</span>
                    </div>
                  </button>
                )
              })}
            </motion.div>
          )}

          {/* COLORS */}
          {tab === 'colors' && (
            <motion.div key="colors" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-3 space-y-4">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-2 px-1">Готовые палитры</p>
                <div className="grid grid-cols-2 gap-2">
                  {COLOR_PRESETS.map((preset) => {
                    const isActive = project.colors.primary.toLowerCase() === preset.colors.primary.toLowerCase()
                    return (
                      <button
                        key={preset.name}
                        onClick={() => onUpdate({ colors: preset.colors })}
                        className={`p-2.5 rounded-xl border text-left transition-all ${isActive ? 'ring-2 ring-[#C4A97D]' : 'hover:border-[#C4A97D]/50'}`}
                        style={{ background: preset.colors.background, borderColor: preset.colors.primary + '30' }}
                      >
                        <div className="flex gap-1 mb-1.5">
                          {[preset.colors.primary, preset.colors.secondary, preset.colors.accent, preset.colors.text].map((c, i) => (
                            <div key={i} className="w-4 h-4 rounded-full" style={{ background: c, border: '1.5px solid white', boxShadow: '0 1px 2px rgba(0,0,0,.1)' }} />
                          ))}
                          {isActive && <Check size={12} className="ml-auto text-[#C4A97D]" />}
                        </div>
                        <p className="text-[11px] font-medium truncate" style={{ color: preset.colors.text }}>{preset.name}</p>
                      </button>
                    )
                  })}
                </div>
              </div>

              <div>
                <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-2 px-1">Точная настройка (HEX / RGB)</p>
                <div className="space-y-2.5">
                  {([
                    { key: 'primary', label: 'Акцент' },
                    { key: 'secondary', label: 'Вторичный' },
                    { key: 'accent', label: 'Подложка' },
                    { key: 'background', label: 'Фон' },
                    { key: 'text', label: 'Текст' },
                  ] as { key: keyof ProjectColors; label: string }[]).map(({ key, label }) => (
                    <ColorControl
                      key={key}
                      label={label}
                      value={project.colors[key]}
                      onChange={(hex) => onUpdate({ colors: { ...project.colors, [key]: hex } })}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* FONTS */}
          {tab === 'fonts' && (
            <motion.div key="fonts" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-3 space-y-2">
              <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-2 px-1">{WEDDING_FONTS.length} свадебных шрифтов</p>
              {WEDDING_FONTS.map((f) => {
                const active = project.fonts.heading === f.heading
                const sample = f.cyrillic ? 'Айгерим & Дамир' : 'Adele & David'
                return (
                  <button
                    key={f.label}
                    onClick={() => onUpdate({ fonts: { heading: f.heading, body: f.body } })}
                    className={`w-full p-3 rounded-xl border text-left transition-all ${
                      active ? 'border-[#C4A97D] bg-[#C4A97D]/5 ring-1 ring-[#C4A97D]/30' : 'border-gray-100 hover:border-[#C4A97D]/40'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[11px] text-gray-400">{f.label}{!f.cyrillic && <span className="ml-1 opacity-60">· латиница</span>}</span>
                      {active && <Check size={12} className="text-[#C4A97D]" />}
                    </div>
                    <p className="text-[#2C2017] leading-tight truncate" style={{ fontFamily: fontFamilyValue(f.heading), fontSize: f.kind === 'cursive' ? 26 : 22, fontWeight: 400 }}>
                      {sample}
                    </p>
                  </button>
                )
              })}
            </motion.div>
          )}

          {/* MUSIC */}
          {tab === 'music' && (
            <motion.div key="music" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-3 space-y-3">
              <p className="text-[10px] uppercase tracking-widest text-gray-400 px-1">Фоновая музыка</p>
              {project.music.url ? (
                <div className="p-3 rounded-xl bg-[#C4A97D]/10 border border-[#C4A97D]/20">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-[#2C2017] truncate max-w-[80%]">{project.music.title || 'Музыка'}</span>
                    <button onClick={() => onUpdate({ music: { url: null, autoplay: false, title: '' } })} className="p-1.5 rounded-lg hover:bg-red-50 transition-colors">
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
                  <input type="file" accept="audio/*" className="hidden"
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
                <button onClick={() => onUpdate({ music: { ...project.music, autoplay: !project.music.autoplay } })} className="toggle-fix" data-state={project.music.autoplay ? 'on' : 'off'} />
              </div>
              <p className="text-xs text-gray-400 px-1">💡 Музыка воспроизводится на опубликованном сайте гостей</p>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  )
}

// Одна строка блока с drag-ручкой и действиями
function BlockRow({ block, onToggle, onDuplicate, onDelete }: {
  block: BlockData
  onToggle: () => void
  onDuplicate: () => void
  onDelete: () => void
}) {
  const controls = useDragControls()
  const meta = TYPE_META[block.type]
  return (
    <Reorder.Item
      value={block}
      dragListener={false}
      dragControls={controls}
      className="flex items-center gap-2 p-2.5 rounded-xl border bg-white select-none"
      style={{ borderColor: block.enabled ? 'rgba(196,169,125,0.25)' : '#f0f0f0', background: block.enabled ? '#FAF8F5' : '#fafafa' }}
      whileDrag={{ scale: 1.03, boxShadow: '0 8px 24px rgba(0,0,0,.12)', zIndex: 5 }}
    >
      <span
        onPointerDown={(e) => controls.start(e)}
        className="cursor-grab active:cursor-grabbing text-gray-300 hover:text-gray-500 touch-none flex-shrink-0"
        title="Перетащить"
      >
        <GripVertical size={15} />
      </span>
      <span className="text-sm flex-shrink-0">{meta?.icon ?? '📦'}</span>
      <span className={`text-[13px] font-medium flex-1 min-w-0 truncate ${block.enabled ? 'text-[#2C2017]' : 'text-gray-400'}`}>
        {blockTitle(block)}
      </span>
      <div className="flex items-center gap-0.5 flex-shrink-0">
        <button onClick={onToggle} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors" title={block.enabled ? 'Скрыть' : 'Показать'}>
          {block.enabled ? <Eye size={13} className="text-gray-500" /> : <EyeOff size={13} className="text-gray-300" />}
        </button>
        <button onClick={onDuplicate} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors" title="Дублировать">
          <Copy size={13} className="text-gray-500" />
        </button>
        <button onClick={onDelete} className="p-1.5 rounded-lg hover:bg-red-50 transition-colors" title="Удалить">
          <Trash2 size={13} className="text-red-400" />
        </button>
      </div>
    </Reorder.Item>
  )
}

// HEX + RGB + пипетка для одного цвета
function ColorControl({ label, value, onChange }: { label: string; value: string; onChange: (hex: string) => void }) {
  const [draft, setDraft] = useState(value)
  useEffect(() => { setDraft(value) }, [value])
  const rgb = hexToRgb(value) || { r: 0, g: 0, b: 0 }

  const commitHex = (raw: string) => {
    const norm = normalizeHex(raw)
    if (norm) onChange(norm)
    else setDraft(value)
  }
  const setChannel = (ch: 'r' | 'g' | 'b', v: string) => {
    const n = Math.max(0, Math.min(255, parseInt(v || '0', 10) || 0))
    const next = { ...rgb, [ch]: n }
    onChange(rgbToHex(next.r, next.g, next.b))
  }

  return (
    <div className="p-2.5 rounded-xl border border-gray-100">
      <div className="flex items-center gap-2 mb-2">
        <label className="relative flex-shrink-0" style={{ width: 30, height: 30 }}>
          <input type="color" value={value} onChange={(e) => onChange(e.target.value.toUpperCase())}
            className="absolute inset-0 opacity-0 cursor-pointer" />
          <span className="block w-full h-full rounded-lg border border-gray-200" style={{ background: value }} />
        </label>
        <span className="text-[13px] text-gray-600 flex-1">{label}</span>
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={(e) => commitHex(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') (e.target as HTMLInputElement).blur() }}
          className="w-[74px] px-2 py-1 rounded-lg bg-gray-50 text-[12px] font-mono text-gray-600 outline-none focus:ring-2 focus:ring-[#C4A97D]/30 uppercase"
        />
      </div>
      <div className="grid grid-cols-3 gap-1.5">
        {(['r', 'g', 'b'] as const).map((ch) => (
          <div key={ch} className="flex items-center gap-1 bg-gray-50 rounded-lg px-1.5">
            <span className="text-[10px] text-gray-400 uppercase">{ch}</span>
            <input
              type="number" min={0} max={255} value={rgb[ch]}
              onChange={(e) => setChannel(ch, e.target.value)}
              className="w-full py-1 bg-transparent text-[12px] text-gray-600 outline-none"
            />
          </div>
        ))}
      </div>
    </div>
  )
}
