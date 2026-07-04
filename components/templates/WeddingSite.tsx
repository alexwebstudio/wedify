'use client'
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
import { BlockWrapper } from '@/components/editor/BlockWrapper'
import { MusicPlayer } from '@/components/ui/MusicPlayer'
import type { BlockData } from '@/types'

interface WeddingSiteProps {
  project: Project
  isEditing?: boolean
  onBlockChange?: (blockId: string, content: BlockData['content']) => void
  onBlockToggle?: (blockId: string) => void
  onBlockMoveUp?: (blockId: string) => void
  onBlockMoveDown?: (blockId: string) => void
  userId?: string
}

export function WeddingSite({
  project,
  isEditing = false,
  onBlockChange,
  onBlockToggle,
  onBlockMoveUp,
  onBlockMoveDown,
  userId,
}: WeddingSiteProps) {
  const { colors, fonts, music, blocks } = project
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
        canMoveUp={idx > 0}
        canMoveDown={idx < sorted.length - 1}
      >
        {inner}
      </BlockWrapper>
    )
  }

  return (
    <div style={{ backgroundColor: colors.background }}>
      {sorted.map((block, idx) => renderBlock(block, idx))}
      <MusicPlayer music={music} accentColor={colors.primary} />
    </div>
  )
}
