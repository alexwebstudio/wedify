'use client'
import { useState } from 'react'
import { EditableText } from '@/components/editor/EditableText'
import { ImagePicker } from '@/components/ui/ImagePicker'
import { fontFamilyValue } from '@/lib/editorPresets'
import { Camera, Settings2 } from 'lucide-react'
import type { BlockData, ProjectColors, ProjectFonts } from '@/types'

interface Props {
  block: BlockData
  colors: ProjectColors
  fonts: ProjectFonts
  isEditing: boolean
  onChange: (content: BlockData['content']) => void
  userId?: string
  projectId?: string
}

type C = {
  title?: string; text?: string; image?: string
  layout?: 'split' | 'text' | 'image' | 'stacked'
  align?: 'left' | 'center' | 'right'
  imageFirst?: boolean
  bg?: string; useAccentBg?: boolean
  paddingY?: 'sm' | 'md' | 'lg'
  maxWidth?: 'narrow' | 'normal' | 'wide' | 'full'
}

const PAD = { sm: '40px', md: '72px', lg: '120px' }
const MAXW = { narrow: 620, normal: 860, wide: 1120, full: 1400 }

// Универсальный блок: пользователь сам управляет расположением, фоном, отступами, шириной и порядком.
export function CustomBlock({ block, colors, fonts, isEditing, onChange, userId, projectId }: Props) {
  const c = block.content as C
  const [picker, setPicker] = useState(false)
  const [panel, setPanel] = useState(false)
  const ff = fontFamilyValue(fonts.heading)
  const bodyFf = fontFamilyValue(fonts.body)
  const set = (k: keyof C, v: unknown) => onChange({ ...c, [k]: v })

  const layout = c.layout || 'split'
  const align = c.align || 'left'
  const bg = c.useAccentBg ? colors.accent + '40' : (c.bg || colors.background)

  const img = (
    <div className="relative overflow-hidden shadow-lg" style={{ aspectRatio: '4/3', borderRadius: 'var(--wd-img-radius,1rem)', width: '100%' }}>
      {c.image ? <img src={c.image} alt="" loading="lazy" className="w-full h-full object-cover" />
        : <div className="w-full h-full flex items-center justify-center" style={{ background: `linear-gradient(135deg,${colors.primary}33,${colors.secondary}33)`, color: colors.secondary }}>Изображение</div>}
      {isEditing && <button onClick={() => setPicker(true)} className="absolute top-3 left-3 flex items-center gap-2 px-3 py-1.5 rounded-lg text-white text-xs" style={{ background: 'rgba(0,0,0,.5)' }}><Camera size={12} /> Фото</button>}
    </div>
  )
  const txt = (
    <div style={{ textAlign: align }}>
      <EditableText tag="h2" value={c.title || 'Заголовок блока'} onChange={(x) => set('title', x)} isEditing={isEditing}
        style={{ color: colors.text, fontFamily: ff, fontSize: 'clamp(1.7rem,4vw,2.6rem)', fontWeight: 300, marginBottom: 14 }} />
      <EditableText tag="p" value={c.text || 'Здесь ваш текст. Настройте расположение, фон, отступы и ширину под свой вкус.'} onChange={(x) => set('text', x)} isEditing={isEditing} multiline
        style={{ color: colors.text + 'CC', fontFamily: bodyFf, fontSize: 16, lineHeight: 1.75 }} />
    </div>
  )

  const body = (() => {
    if (layout === 'text') return <div className={align === 'center' ? 'mx-auto' : ''} style={{ maxWidth: 720 }}>{txt}</div>
    if (layout === 'image') return img
    if (layout === 'stacked') return <div className="flex flex-col gap-8" style={{ alignItems: align === 'center' ? 'center' : 'stretch' }}>{c.imageFirst ? <>{img}{txt}</> : <>{txt}{img}</>}</div>
    // split
    return (
      <div className="grid md:grid-cols-2 gap-10 items-center">
        {c.imageFirst ? <>{img}{txt}</> : <>{txt}{img}</>}
      </div>
    )
  })()

  const Seg = ({ label, k, opts }: { label: string; k: keyof C; opts: [string, string][] }) => (
    <div>
      <p className="text-[10px] uppercase tracking-widest text-white/50 mb-1">{label}</p>
      <div className="flex gap-1 flex-wrap">
        {opts.map(([val, lb]) => (
          <button key={val} onClick={() => set(k, val)} className="px-2 py-1 rounded text-[11px]"
            style={{ background: String(c[k] ?? (k === 'layout' ? 'split' : k === 'align' ? 'left' : k === 'paddingY' ? 'md' : k === 'maxWidth' ? 'normal' : '')) === val ? colors.primary : 'rgba(255,255,255,.12)', color: '#fff' }}>{lb}</button>
        ))}
      </div>
    </div>
  )

  return (
    <section className="relative px-5" style={{ background: bg, paddingTop: PAD[c.paddingY || 'md'], paddingBottom: PAD[c.paddingY || 'md'] }}>
      <div className="mx-auto" style={{ maxWidth: MAXW[c.maxWidth || 'normal'] }}>{body}</div>

      {isEditing && (
        <>
          <button onClick={() => setPanel((p) => !p)} className="absolute top-3 right-3 z-20 flex items-center gap-2 px-3 py-2 rounded-xl text-white text-xs" style={{ background: colors.primary }}><Settings2 size={13} /> Настроить</button>
          {panel && (
            <div className="absolute top-14 right-3 z-20 p-4 rounded-2xl w-64 space-y-3" style={{ background: '#2C2017', boxShadow: '0 20px 60px rgba(0,0,0,.4)' }}>
              <Seg label="Композиция" k="layout" opts={[['split', 'Текст+фото'], ['stacked', 'Стопкой'], ['text', 'Только текст'], ['image', 'Только фото']]} />
              <Seg label="Выравнивание" k="align" opts={[['left', 'Слева'], ['center', 'Центр'], ['right', 'Справа']]} />
              <Seg label="Отступы" k="paddingY" opts={[['sm', 'S'], ['md', 'M'], ['lg', 'L']]} />
              <Seg label="Ширина" k="maxWidth" opts={[['narrow', 'Узкая'], ['normal', 'Обычная'], ['wide', 'Широкая'], ['full', 'Полная']]} />
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-white/70">Фото первым</span>
                <button onClick={() => set('imageFirst', !c.imageFirst)} className="px-2 py-1 rounded text-[11px] text-white" style={{ background: c.imageFirst ? colors.primary : 'rgba(255,255,255,.12)' }}>{c.imageFirst ? 'Да' : 'Нет'}</button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-white/70">Акцентный фон</span>
                <button onClick={() => set('useAccentBg', !c.useAccentBg)} className="px-2 py-1 rounded text-[11px] text-white" style={{ background: c.useAccentBg ? colors.primary : 'rgba(255,255,255,.12)' }}>{c.useAccentBg ? 'Вкл' : 'Выкл'}</button>
              </div>
            </div>
          )}
        </>
      )}
      {picker && <ImagePicker onSelect={(url) => { set('image', url); setPicker(false) }} onClose={() => setPicker(false)} userId={userId} projectId={projectId} />}
    </section>
  )
}
