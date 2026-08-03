import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { WeddingSiteClient } from './WeddingSiteClient'
import { SiteFonts } from '@/components/providers/SiteFonts'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()
  const { data } = await supabase
    .from('projects')
    .select('title, blocks')
    .eq('slug', slug)
    .eq('published', true)
    .single()

  if (!data) return { title: 'Свадебное приглашение' }

  return {
    title: `${data.title} — Свадебное приглашение`,
    description: 'Вы приглашены на особенный день',
    openGraph: {
      title: data.title,
      description: 'Свадебное приглашение',
    },
  }
}

export default async function PublicWeddingPage({ params }: Props) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: project } = await supabase
    .from('projects')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .single()

  if (!project) notFound()

  // Гостю грузим ровно те два семейства, которые выбраны в этом приглашении,
  // а не всю библиотеку редактора.
  const usedFonts = [project.fonts?.heading, project.fonts?.body].filter(Boolean) as string[]

  return (
    <>
      <SiteFonts families={usedFonts} />
      <WeddingSiteClient project={project} />
    </>
  )
}
