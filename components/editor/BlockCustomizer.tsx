'use client'
import { X, RotateCcw } from 'lucide-react'
import type { ProjectColors } from '@/types'

export interface BlockSettings {
  align?: 'left' | 'center' | 'right'
  titlePx?: number
  textPx?: number
  padY?: number
}

interface Props {
  blockId: string
  settings: BlockSettings
  onChange: (s: BlockSettings) => void
  isEditing: boolean
  colors: ProjectColors
  open?: boolean
  onClose?: () => void
  children: React.ReactNode
}

/**
 * Настройки блока (#3/#7). Стили применяются ТОЧЕЧНО только к содержимому
 * конкретного блока (.mrn-<id>), а панель настроек вынесена ЗА пределы контента.
 * Панель открывается штатной кнопкой настроек в панели контролов блока.
 */
export function BlockCustomizer({ blockId, settings, onChange, isEditing, colors, open = false, onClose, children }: Props) {
  const scope = `mrn-${String(blockId).replace(/[^a-zA-Z0-9_-]/g, '')}`
  const set = (k: keyof BlockSettings, v: number | string | undefined) => onChange({ ...settings, [k]: v })

  const css = [
    settings.titlePx ? `.${scope} :is(h1,h2,h3),.${scope} .mrn-title{font-size:${settings.titlePx}px !important;line-height:1.12 !important}` : '',
    settings.textPx ? `.${scope} :is(p,li),.${scope} .mrn-text{font-size:${settings.textPx}px !important}` : '',
    settings.padY !== undefined ? `.${scope} > section,.${scope} > div{padding-top:${settings.padY}px !important;padding-bottom:${settings.padY}px !important}` : '',
  ].filter(Boolean).join('\n')

  const contentStyle: React.CSSProperties = settings.align ? { textAlign: settings.align } : {}

  const content = (
    <>
      {css && <style dangerouslySetInnerHTML={{ __html: css }} />}
      <div className={scope} style={contentStyle}>{children}</div>
    </>
  )

  if (!isEditing) return content

  return (
    <div style={{ position: 'relative' }}>
      {content}

      {open && (
        <div className="absolute top-3 right-3 z-40 w-64 p-4 rounded-2xl space-y-3.5" style={{ background: '#2C2017', boxShadow: '0 20px 60px rgba(0,0,0,.45)' }}>
          <div className="flex items-center justify-between">
            <p className="font-medium text-white" style={{ fontSize: 12 }}>Настройки блока</p>
            <button onClick={onClose} className="text-white/50 hover:text-white"><X size={15} /></button>
          </div>

          <div>
            <p className="uppercase tracking-widest text-white/50 mb-1.5" style={{ fontSize: 10 }}>Выравнивание текста</p>
            <div className="flex gap-1">
              {(['left', 'center', 'right'] as const).map((a) => (
                <button key={a} onClick={() => set('align', settings.align === a ? undefined : a)}
                  className="flex-1 py-1.5 rounded text-white" style={{ fontSize: 11, background: settings.align === a ? colors.primary : 'rgba(255,255,255,.12)' }}>
                  {a === 'left' ? 'Слева' : a === 'center' ? 'Центр' : 'Справа'}
                </button>
              ))}
            </div>
          </div>

          <Range label="Размер заголовка" value={settings.titlePx} min={20} max={80} def={40} onChange={(v) => set('titlePx', v)} colors={colors} />
          <Range label="Размер текста" value={settings.textPx} min={12} max={30} def={16} onChange={(v) => set('textPx', v)} colors={colors} />
          <Range label="Отступы сверху/снизу" value={settings.padY} min={0} max={160} def={64} onChange={(v) => set('padY', v)} colors={colors} />
        </div>
      )}
    </div>
  )
}

function Range({ label, value, min, max, def, onChange, colors }: { label: string; value?: number; min: number; max: number; def: number; onChange: (v: number | undefined) => void; colors: ProjectColors }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <p className="uppercase tracking-widest text-white/50" style={{ fontSize: 10 }}>{label}</p>
        <span className="flex items-center gap-1.5">
          <span className="text-white/70" style={{ fontSize: 11 }}>{value ? `${value}px` : 'авто'}</span>
          {value !== undefined && <button onClick={() => onChange(undefined)} className="text-white/40 hover:text-white" title="Сбросить"><RotateCcw size={11} /></button>}
        </span>
      </div>
      <input type="range" min={min} max={max} value={value ?? def} onChange={(e) => onChange(Number(e.target.value))} className="w-full" style={{ accentColor: colors.primary }} />
    </div>
  )
}
