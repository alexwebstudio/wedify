import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { WeddingSiteClient } from './WeddingSiteClient'
import { SiteFonts } from '@/components/providers/SiteFonts'
import { publishedContent } from '@/lib/projects'
import { SITE_URL } from '@/lib/seo'
import type { Metadata } from 'next'
import type { Project } from '@/types'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()
  const { data } = await supabase
    .from('projects')
    .select('title')
    .eq('slug', slug)
    .eq('published', true)
    .single()

  if (!data) return { title: 'Свадебное приглашение', robots: { index: false, follow: false } }

  const title = `${data.title} — свадебное приглашение`
  const description = 'Вы приглашены. Откройте приглашение, чтобы узнать дату, место и подтвердить участие.'

  return {
    title: { absolute: title },
    description,
    // У каждого приглашения свой канонический адрес — дублей в индексе не будет
    alternates: { canonical: `${SITE_URL}/${slug}` },
    openGraph: { type: 'website', locale: 'ru_RU', url: `${SITE_URL}/${slug}`, title, description },
    twitter: { card: 'summary_large_image', title, description },
  }
}

export default async function PublicWeddingPage({ params }: Props) {
  const { slug } = await params
  const supabase = await createClient()

  const { data } = await supabase
    .from('projects')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .single()

  if (!data) notFound()

  const project = data as Project

  // Гость видит снимок последней публикации, а не текущий черновик редактора.
  // Пока автор правит сайт, на публичной странице остаётся прошлая версия.
  const content = publishedContent(project)
  const publicProject: Project = { ...project, ...content }

  // Грузим ровно те два семейства, которые выбраны в приглашении,
  // а не всю библиотеку редактора.
  const usedFonts = [content.fonts?.heading, content.fonts?.body].filter(Boolean) as string[]

  return (
    <>
      <SiteFonts families={usedFonts} />
      <WeddingSiteClient project={publicProject} />
    </>
  )
}
