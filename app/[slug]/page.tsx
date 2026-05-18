import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { WeddingSiteClient } from './WeddingSiteClient'
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

  return <WeddingSiteClient project={project} />
}
