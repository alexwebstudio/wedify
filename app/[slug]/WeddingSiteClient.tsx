'use client'
import { WeddingSite } from '@/components/templates/WeddingSite'
import type { Project } from '@/types'

export function WeddingSiteClient({ project }: { project: Project }) {
  return <WeddingSite project={project} isEditing={false} />
}
