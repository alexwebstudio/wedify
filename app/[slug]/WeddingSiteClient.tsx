'use client'
import { useState, useMemo } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { WeddingSite } from '@/components/templates/WeddingSite'
import { PreloaderBlock } from '@/components/blocks/PreloaderBlock'
import { EnvelopeBlock } from '@/components/blocks/EnvelopeBlock'
import { CurtainsBlock } from '@/components/blocks/CurtainsBlock'
import type { Project, BlockData } from '@/types'

const INTRO_TYPES = ['preloader', 'envelope', 'curtains'] as const
type IntroType = (typeof INTRO_TYPES)[number]

export function WeddingSiteClient({ project }: { project: Project }) {
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
      <div style={{ visibility: introActive ? 'hidden' : 'visible' }}>
        <WeddingSite project={mainProject} isEditing={false} />
      </div>
      <AnimatePresence>
        {introActive && (
          <motion.div key={step} exit={{ opacity: 0 }} transition={{ duration: .5 }} className="fixed inset-0 z-[200]">
            {renderIntro(introBlocks[step])}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
