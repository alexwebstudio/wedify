import { createClient } from './supabase/client'
import type { Project, TemplateId } from '@/types'
import { generateSlug, getDefaultBlocks, getDefaultMusic, getTemplateDefaults } from './utils'

const supabase = createClient()

export async function getProjects(userId: string): Promise<Project[]> {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .single()

  if (error) return null
  return data
}

export async function getProjectById(id: string): Promise<Project | null> {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .single()

  if (error) return null
  return data
}

export async function createProject(
  userId: string,
  title: string,
  templateId: TemplateId,
  language: 'ru' | 'kz' = 'ru'
): Promise<Project> {
  const baseSlug = generateSlug(title) || generateSlug(`${templateId}-wedding`)
  const slug = await ensureUniqueSlug(baseSlug)

  const defaults = getTemplateDefaults(templateId)
  const blocks = getDefaultBlocks()

  const { data, error } = await supabase
    .from('projects')
    .insert({
      user_id: userId,
      title,
      slug,
      template: templateId,
      language,
      colors: defaults.colors,
      fonts: defaults.fonts,
      music: getDefaultMusic(),
      blocks,
      published: false,
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateProject(
  id: string,
  updates: Partial<Project>
): Promise<Project> {
  const { data, error } = await supabase
    .from('projects')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteProject(id: string): Promise<void> {
  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id)

  if (error) throw error
}

export async function publishProject(id: string, publish: boolean): Promise<void> {
  const { error } = await supabase
    .from('projects')
    .update({ published: publish, updated_at: new Date().toISOString() })
    .eq('id', id)

  if (error) throw error
}

async function ensureUniqueSlug(baseSlug: string): Promise<string> {
  let slug = baseSlug
  let counter = 1

  while (true) {
    const { data } = await supabase
      .from('projects')
      .select('id')
      .eq('slug', slug)
      .single()

    if (!data) return slug
    slug = `${baseSlug}-${counter++}`
  }
}

export async function uploadMedia(
  file: File,
  userId: string,
  projectId: string
): Promise<string> {
  const ext = file.name.split('.').pop()
  const path = `${userId}/${projectId}/${Date.now()}.${ext}`

  const { error } = await supabase.storage
    .from('media')
    .upload(path, file, { upsert: true })

  if (error) throw error

  const { data } = supabase.storage.from('media').getPublicUrl(path)
  return data.publicUrl
}
