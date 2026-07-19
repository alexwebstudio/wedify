'use client'
import { useState, useMemo, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { WeddingSite } from '@/components/templates/WeddingSite'
import { PreloaderBlock } from '@/components/blocks/PreloaderBlock'
import { EnvelopeBlock } from '@/components/blocks/EnvelopeBlock'
import { CurtainsBlock } from '@/components/blocks/CurtainsBlock'
import type { Project, BlockData } from '@/types'

const INTRO_TYPES = ['preloader', 'envelope', 'curtains'] as const
type IntroType = (typeof INTRO_TYPES)[number]

export function WeddingSiteClient({ project }: { project: Project }) {
  // PIN-код доступа (#4). Хранится в project.music.accessPin.
  const pin = (project.music?.accessPin || '').trim()
  const [unlocked, setUnlocked] = useState(!pin)
  const [pinInput, setPinInput] = useState('')
  const [pinError, setPinError] = useState(false)

  useEffect(() => {
    if (!pin) { setUnlocked(true); return }
    try { if (sessionStorage.getItem(`maruno.unlock.${project.slug}`) === pin) setUnlocked(true) } catch {}
  }, [pin, project.slug])

  const tryUnlock = () => {
    if (pinInput.trim() === pin) {
      setUnlocked(true)
      try { sessionStorage.setItem(`maruno.unlock.${project.slug}`, pin) } catch {}
    } else { setPinError(true); setTimeout(() => setPinError(false), 800) }
  }

  const sorted = useMemo(() => [...project.blocks].sort((a, b) => a.order - b.order), [project.blocks])

  // Ведущие интро-блоки (прелоадер / конверт / шторы) в начале сайта
  const introBlocks = useMemo(() => {
    const lead: BlockData[] = []
    for (const b of sorted) {
      if (b.enabled !== false && (INTRO_TYPES as readonly string[]).includes(b.type)) lead.push(b)
      else break
    }
    return lead
  }, [sorted])

  const [step, setStep] = useState(0)
  const introActive = introBlocks.length > 0 && step < introBlocks.length

  // Основной сайт — без интро-блоков (они уже сыграли роль вступления)
  const mainProject = useMemo(
    () => ({ ...project, blocks: sorted.slice(introBlocks.length) }),
    [project, sorted, introBlocks.length]
  )

  const renderIntro = (b: BlockData) => {
    const shared = { block: b, colors: project.colors, fonts: project.fonts, isEditing: false, onChange: () => {}, intro: true, onDone: () => setStep((s) => s + 1) }
    switch (b.type as IntroType) {
      case 'preloader': return <PreloaderBlock {...shared} />
      case 'envelope': return <EnvelopeBlock {...shared} />
      case 'curtains': return <CurtainsBlock {...shared} projectId={project.id} />
      default: return null
    }
  }

  return (
    <>
      {!unlocked && (
        <div className="fixed inset-0 z-[400] flex items-center justify-center px-6"
          style={{ background: `linear-gradient(160deg, ${project.colors.background}, ${project.colors.accent})` }}>
          <div className="w-full max-w-xs text-center">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5 text-2xl"
              style={{ background: project.colors.primary, color: '#fff' }}>🔒</div>
            <h1 className="text-2xl font-light mb-2" style={{ color: project.colors.text, fontFamily: `'${project.fonts.heading}', serif` }}>Приглашение защищено</h1>
            <p className="text-sm opacity-60 mb-6" style={{ color: project.colors.text }}>Введите PIN-код из приглашения</p>
            <input
              value={pinInput} onChange={(e) => setPinInput(e.target.value)} autoFocus
              onKeyDown={(e) => { if (e.key === 'Enter') tryUnlock() }}
              inputMode="numeric" maxLength={12} placeholder="••••"
              className="w-full text-center text-2xl tracking-[0.4em] py-3 rounded-xl outline-none mb-3"
              style={{ background: '#fff', border: `2px solid ${pinError ? '#e5484d' : project.colors.primary + '55'}`, color: project.colors.text }}
            />
            <button onClick={tryUnlock} className="w-full py-3 rounded-xl text-white font-medium transition-transform active:scale-95"
              style={{ background: project.colors.primary }}>Открыть приглашение</button>
            {pinError && <p className="text-xs mt-3" style={{ color: '#e5484d' }}>Неверный код, попробуйте ещё раз</p>}
          </div>
        </div>
      )}
      <div style={{ visibility: introActive || !unlocked ? 'hidden' : 'visible' }}>
        <WeddingSite project={mainProject} isEditing={false} />
      </div>
      <AnimatePresence>
        {introActive && unlocked && (
          <motion.div key={step} exit={{ opacity: 0 }} transition={{ duration: .5 }} className="fixed inset-0 z-[200]">
            {renderIntro(introBlocks[step])}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
