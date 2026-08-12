import { createClient } from './supabase/client'
import type { Project, SiteContent, TemplateId } from '@/types'
import { generateSlug, getBlankBlocks, getDefaultBlocks, getDefaultMusic, getTemplateDefaults } from './utils'
import { getTemplate } from './templateCatalog'

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
  language: 'ru' | 'kz' = 'ru',
  vars: Partial<import('@/types').SiteVariables> = {},
  options: { blank?: boolean } = {}
): Promise<Project> {
  const baseSlug = generateSlug(title) || generateSlug(`${templateId}-wedding`)
  const slug = await ensureUniqueSlug(baseSlug)

  const defaults = getTemplateDefaults(templateId)
  // Композиция первого экрана задаётся шаблоном — именно она делает шаблоны
  // по-настоящему разными, а не только цветом и шрифтом.
  const blocks = options.blank
    ? getBlankBlocks(vars, getTemplate(templateId))
    : getDefaultBlocks(vars, getTemplate(templateId))

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

/**
 * Удаление проекта вместе с его фотографиями.
 *
 * Файлы в хранилище не связаны с таблицей внешним ключом, поэтому раньше
 * оставались висеть после удаления сайта и занимали место навсегда.
 * Сначала убираем файлы, затем запись: если файлы удалить не вышло, проект
 * всё равно удаляется — терять его из-за мусора в бакете неправильно.
 */
export async function deleteProject(id: string): Promise<void> {
  const project = await getProjectById(id)

  if (project) {
    try {
      const folder = `${project.user_id}/${project.id}`
      const { data: files } = await supabase.storage.from('media').list(folder, { limit: 1000 })
      if (files?.length) {
        await supabase.storage.from('media').remove(files.map((f) => `${folder}/${f.name}`))
      }
    } catch {
      // Уборка файлов не должна мешать удалению проекта
    }
  }

  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id)

  if (error) throw error
}

/** Черновая часть проекта — то, что редактируется и потом публикуется. */
export function draftContent(project: Project): SiteContent {
  return {
    blocks: project.blocks,
    colors: project.colors,
    fonts: project.fonts,
    music: project.music,
  }
}

/**
 * Содержимое, которое видят гости.
 *
 * Совместимость: у сайтов, опубликованных до появления снимка, он может быть
 * пустым — тогда показываем черновик, как это и работало раньше. Ни один
 * уже опубликованный сайт не «исчезнет».
 */
export function publishedContent(project: Project): SiteContent {
  return project.published_snapshot ?? draftContent(project)
}

/**
 * Публикация — единственное действие, которое меняет то, что видят гости.
 * Копирует текущий черновик в снимок и проставляет время публикации.
 * Повторная публикация обновляет ту же строку и не создаёт дубликатов.
 */
export async function publishProject(id: string): Promise<Project> {
  const project = await getProjectById(id)
  if (!project) throw new Error('Проект не найден')

  const now = new Date().toISOString()

  const { data, error } = await supabase
    .from('projects')
    .update({
      published: true,
      published_snapshot: draftContent(project),
      published_at: now,
      archived_at: null,
      updated_at: now,
    })
    .eq('id', id)
    .select()
    .single()

  if (!error) return data

  // Колонок снимка ещё нет — миграция 20260804_publish_snapshot.sql не применена.
  // Публикация не должна из-за этого падать: сайт выкладываем по-старому,
  // из черновика. Разделение черновика и публикации включится само,
  // как только миграцию выполнят.
  if (/published_snapshot|published_at|archived_at|column/i.test(error.message)) {
    const { data: legacy, error: legacyError } = await supabase
      .from('projects')
      .update({ published: true, updated_at: now })
      .eq('id', id)
      .select()
      .single()

    if (legacyError) throw legacyError

    console.warn(
      '[maruno] Публикация выполнена без снимка: примените ' +
      'supabase/migrations/20260804_publish_snapshot.sql, чтобы правки в редакторе ' +
      'перестали сразу попадать на опубликованный сайт.',
    )
    return legacy
  }

  throw error
}

/** Снять сайт с публикации. Черновик и снимок сохраняются. */
export async function unpublishProject(id: string): Promise<void> {
  const { error } = await supabase
    .from('projects')
    .update({ published: false, updated_at: new Date().toISOString() })
    .eq('id', id)

  if (error) throw error
}

/**
 * Вернуть черновик к последней опубликованной версии.
 * Нужна, когда правки завели не туда, а на сайте всё было хорошо.
 */
export async function restorePublishedVersion(id: string): Promise<Project> {
  const project = await getProjectById(id)
  if (!project) throw new Error('Проект не найден')
  if (!project.published_snapshot) throw new Error('Сайт ещё ни разу не публиковался')

  const snap = project.published_snapshot
  const { data, error } = await supabase
    .from('projects')
    .update({
      blocks: snap.blocks,
      colors: snap.colors,
      fonts: snap.fonts,
      music: snap.music,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

/** Архивация и возврат из архива. Проект и его данные остаются на месте. */
export async function setProjectArchived(id: string, archived: boolean): Promise<void> {
  const { error } = await supabase
    .from('projects')
    .update({
      archived_at: archived ? new Date().toISOString() : null,
      // Архивный сайт не должен оставаться доступным гостям
      ...(archived ? { published: false } : {}),
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)

  if (!error) return

  // Без колонки archived_at архивация невозможна физически — говорим об этом
  // понятной фразой вместо сообщения PostgREST про отсутствующую колонку.
  if (/archived_at|column/i.test(error.message)) {
    throw new Error('Архив недоступен: не применена миграция supabase/migrations/20260804_publish_snapshot.sql')
  }

  throw error
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
