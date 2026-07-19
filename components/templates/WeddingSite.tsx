'use client'
import { useState } from 'react'
import type { Project } from '@/types'
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
import { DividerBlock } from '@/components/blocks/DividerBlock'
import { BlockWrapper } from '@/components/editor/BlockWrapper'
import { BlockCustomizer, type BlockSettings } from '@/components/editor/BlockCustomizer'
import { MusicPlayer } from '@/components/ui/MusicPlayer'
import { buttonRadius, imageRadius, type ButtonShape, type ImageShape } from '@/lib/editorPresets'
import type { BlockData } from '@/types'

interface WeddingSiteProps {
  project: Project
  isEditing?: boolean
  onBlockChange?: (blockId: string, content: BlockData['content']) => void
  onBlockToggle?: (blockId: string) => void
  onBlockMoveUp?: (blockId: string) => void
  onBlockMoveDown?: (blockId: string) => void
  userId?: string
  buttonStyleFallback?: ButtonShape
  imageStyleFallback?: ImageShape
}

export function WeddingSite({
  project,
  isEditing = false,
  onBlockChange,
  onBlockToggle,
  onBlockMoveUp,
  onBlockMoveDown,
  userId,
  buttonStyleFallback,
  imageStyleFallback,
}: WeddingSiteProps) {
  const { colors, fonts, music, blocks } = project
  const [settingsFor, setSettingsFor] = useState<string | null>(null)
  const sorted = [...blocks].sort((a, b) => a.order - b.order)

  const renderBlock = (block: BlockData, idx: number) => {
    const sharedProps = {
      block,
      colors,
      fonts,
      isEditing,
      onChange: (content: BlockData['content']) => onBlockChange?.(block.id, content),
      userId,
      projectId: project.id,
    }

    const inner = (() => {
      switch (block.type) {
        case 'hero': return <HeroBlock {...sharedProps} />
        case 'story': return <StoryBlock {...sharedProps} />
        case 'gallery': return <GalleryBlock {...sharedProps} />
        case 'timer': return <TimerBlock {...sharedProps} />
        case 'location': return <LocationBlock {...sharedProps} />
        case 'rsvp': return <RsvpBlock {...sharedProps} projectTitle={project.title} projectSlug={project.slug} projectId={project.id} />
        case 'final': return <FinalBlock {...sharedProps} />
        case 'schedule': return <ScheduleBlock {...sharedProps} />
        case 'infocard': return <InfoCardBlock {...sharedProps} />
        case 'video': return <VideoBlock {...sharedProps} />
        case 'footer': return <FooterBlock {...sharedProps} />
        case 'curtains': return <CurtainsBlock {...sharedProps} />
        case 'preloader': return <PreloaderBlock {...sharedProps} />
        case 'envelope': return <EnvelopeBlock {...sharedProps} />
        case 'dresscode': return <DressCodeBlock {...sharedProps} />
        case 'custom': return <CustomBlock {...sharedProps} />
        case 'divider': return <DividerBlock {...sharedProps} />
        default: return null
      }
    })()

    if (!inner) return null

    return (
      <BlockWrapper
        key={block.id}
        block={block}
        isEditing={isEditing}
        onToggle={() => onBlockToggle?.(block.id)}
        onMoveUp={() => onBlockMoveUp?.(block.id)}
        onMoveDown={() => onBlockMoveDown?.(block.id)}
        onSettings={() => setSettingsFor((cur) => (cur === block.id ? null : block.id))}
        canMoveUp={idx > 0}
        canMoveDown={idx < sorted.length - 1}
      >
        <BlockCustomizer
          blockId={block.id}
          settings={(() => { try { return JSON.parse(String(block.content.settings || '{}')) as BlockSettings } catch { return {} as BlockSettings } })()}
          isEditing={isEditing}
          colors={colors}
          open={settingsFor === block.id}
          onClose={() => setSettingsFor(null)}
          onChange={(s) => onBlockChange?.(block.id, { ...block.content, settings: JSON.stringify(s) })}
        >
          {inner}
        </BlockCustomizer>
      </BlockWrapper>
    )
  }

  return (
    <div
      style={{
        backgroundColor: colors.background,
        ['--wd-btn-radius' as string]: buttonRadius(fonts.buttonStyle ?? buttonStyleFallback),
        ['--wd-img-radius' as string]: imageRadius(fonts.imageStyle ?? imageStyleFallback),
      } as React.CSSProperties}
    >
      {sorted.map((block, idx) => renderBlock(block, idx))}
      <MusicPlayer music={music} accentColor={colors.primary} />
    </div>
  )
}
