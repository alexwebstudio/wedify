'use client'
import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Plus, Edit2, Trash2, Eye, EyeOff, ExternalLink, Copy, Globe, Settings2, ChevronRight } from 'lucide-react'
import { Navbar } from '@/components/ui/Navbar'
import { useAuth } from '@/lib/hooks/useAuth'
import { useAppStore } from '@/lib/store'
import { getProjects, deleteProject, publishProject, unpublishProject } from '@/lib/projects'
import { getProjectStatus, STATUS_META, formatMoment } from '@/lib/projectStatus'
import { reportError } from '@/lib/errors'
import { usePlan, PLAN_META } from '@/lib/subscription'
import { useOnboarding } from '@/lib/hooks/useOnboarding'
import { pickActiveProject } from '@/lib/onboarding'
import { OnboardingChecklist } from '@/components/onboarding/OnboardingChecklist'
import { Assistant } from '@/components/onboarding/Assistant'
import { EmptyState } from '@/components/dashboard/EmptyState'
import type { Project } from '@/types'
import toast from 'react-hot-toast'

function PlanCard() {
  const { plan, setPlan, meta } = usePlan()
  const priceLabel = plan === 'standard' ? 'Бесплатно' : plan === 'start' ? 'Бесплатно' : meta.price
  return (
    <div className="mb-6 bg-white rounded-2xl border p-4 sm:p-5" style={{ borderColor: meta.color + '40' }}>
      <div className="flex items-start gap-3">
        <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 text-white text-lg" style={{ background: meta.color }}>
          {plan === 'standard' ? '⭐' : '✦'}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-sm font-semibold text-[#16130F]">Тариф: {meta.label}</p>
            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full text-white whitespace-nowrap" style={{ background: meta.color }}>{priceLabel}</span>
          </div>
          <p className="text-xs text-[#6F655B] mt-0.5 leading-snug">{meta.desc}</p>
        </div>
      </div>

      <div className="mt-3.5">
        {plan === 'start' && (
          <button onClick={() => { setPlan('standard'); toast.success('Тариф «Стандарт» активирован 🎉') }}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-sm font-medium text-white transition-transform active:scale-95"
            style={{ background: `linear-gradient(135deg, ${PLAN_META.standard.color}, ${PLAN_META.standard.color}CC)` }}>
            Получить Стандарт · Бесплатно
          </button>
        )}
        {plan === 'standard' && (
          <button onClick={() => { setPlan('start'); toast('Возвращён базовый тариф', { icon: 'ℹ️' }) }}
            className="text-xs text-ink-400 hover:text-ink-600 underline">Вернуться на базовый</button>
        )}
      </div>
      <p className="text-[10px] text-ink-300 mt-2.5">Премиум-тариф скоро — блоки Premium пока в разработке.</p>
    </div>
  )
}

export default function DashboardPage() {
  const { user, loading } = useAuth()
  const { t } = useAppStore()
  const router = useRouter()
  const [projects, setProjects] = useState<Project[]>([])
  const [fetching, setFetching] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  // Загрузка может не удаться — тогда показываем состояние с повтором,
  // а не пустой экран «сайтов нет»
  const [loadFailed, setLoadFailed] = useState(false)

  useEffect(() => {
    if (!loading && !user) router.push('/auth/login')
  }, [user, loading, router])

  const fetchProjects = useCallback(async (userId: string) => {
    try {
      const rows = await getProjects(userId)
      setProjects(rows)
      setLoadFailed(false)
    } catch {
      setLoadFailed(true)
    } finally {
      setFetching(false)
    }
  }, [])

  useEffect(() => {
    if (!user) return
    // Промис-цепочка, а не прямой вызов async-функции: так состояние
    // не обновляется синхронно в теле эффекта
    getProjects(user.id)
      .then((rows) => { setProjects(rows); setLoadFailed(false) })
      .catch(() => setLoadFailed(true))
      .finally(() => setFetching(false))
  }, [user])

  // Обучение показывается по конкретному сайту — тому, с которым работали
  // последним. Это же состояние читает и пишет редактор того же сайта,
  // поэтому пройденный шаг сразу виден в обоих местах.
  const activeProject = pickActiveProject(projects)
  const onboarding = useOnboarding(user, activeProject)
  const { progress } = onboarding
  const showOnboarding = onboarding.visible

  const handleDelete = async (id: string) => {
    if (!confirm('Вы уверены, что хотите удалить сайт? Данные будут удалены без возможности восстановления.')) return
    setDeletingId(id)
    try {
      await deleteProject(id)
      setProjects((p) => p.filter((pr) => pr.id !== id))
      toast.success('Сайт удалён')
    } catch {
      toast.error('Ошибка')
    } finally {
      setDeletingId(null)
    }
  }

  // Публикация обновляет опубликованный снимок. Раньше эта же кнопка
  // на живом сайте снимала его с публикации — отсюда путаница.
  const handlePublish = async (project: Project) => {
    try {
      const updated = await publishProject(project.id)
      setProjects((p) => p.map((pr) => (pr.id === project.id ? { ...pr, ...updated } : pr)))
      toast.success(project.published ? 'Изменения опубликованы' : 'Приглашение опубликовано')
    } catch (err) {
      reportError(err, { action: 'project.publish', meta: { projectId: project.id } },
        'Публикация не удалась. Попробуйте ещё раз')
    }
  }

  const handleUnpublish = async (project: Project) => {
    try {
      await unpublishProject(project.id)
      setProjects((p) => p.map((pr) => (pr.id === project.id ? { ...pr, published: false } : pr)))
      toast.success('Сайт снят с публикации — гости его больше не увидят')
    } catch (err) {
      reportError(err, { action: 'project.unpublish', meta: { projectId: project.id } },
        'Не удалось снять с публикации')
    }
  }

  const copyLink = (slug: string) => {
    const url = `${window.location.origin}/${slug}`
    navigator.clipboard.writeText(url)
    toast.success('Ссылка скопирована! 🔗')
  }


  const handleDuplicate = async (project: Project) => {
    if (!user) return
    try {
      const newTitle = project.title + ' (копия)'
      const newSlug = project.slug + '-copy-' + Date.now().toString().slice(-4)
      const { error } = await (await import('@/lib/supabase/client')).createClient()
        .from('projects')
        .insert({
          user_id: user.id,
          title: newTitle,
          slug: newSlug,
          template: project.template,
          language: project.language,
          colors: project.colors,
          fonts: project.fonts,
          music: project.music,
          blocks: project.blocks,
          published: false,
        })
      if (error) throw error
      // Reload projects
      const updated = await getProjects(user.id)
      setProjects(updated)
      toast.success('Скопировано 📋')
    } catch {
      toast.error('Ошибка копирования')
    }
  }

  if (loading || fetching) {
    return (
      <div className="min-h-screen bg-[#FBF8F4] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-[#6E2B34] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-[#16130F]/40 text-sm">Загружаем...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FBF8F4]">
      <Navbar dark={false} />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-24 pb-20">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="mrn-h1" style={{ fontSize: 'clamp(1.9rem, 4vw, 2.6rem)' }}>
              {t('dashboard_title')}
            </h1>
            <p className="text-[#16130F]/40 text-sm mt-1">
              {projects.length === 0 ? 'Начните создавать' : `${projects.length} приглашени${projects.length === 1 ? 'е' : 'й'}`}
            </p>
          </div>
        </div>

        {/* Текущий тариф */}
        <PlanCard />

        {/* Единая кнопка настроек сайта */}
        <div className="mb-10">
          <Link href="/dashboard/settings"
            className="group bg-white rounded-2xl border border-[#6E2B34]/15 p-4 flex items-center gap-4 hover:border-[#6E2B34]/40 hover:shadow-sm transition-all">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: 'rgba(110, 43, 52,.14)', color: '#4A1A22' }}>
              <Settings2 size={20} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-[#16130F]">Настройки сайта</p>
              <p className="text-xs text-[#6F655B]">Шрифты и палитра, безопасность и доступ, сообщения с форм, помощь</p>
            </div>
            <ChevronRight size={18} className="text-[#6E2B34] opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
          </Link>
        </div>

        {/* Чек-лист первого сайта. Скрывается, когда обучение пройдено или отключено */}
        {showOnboarding && projects.length > 0 && (
          <OnboardingChecklist progress={progress} onSkip={onboarding.skip} />
        )}

        {loadFailed ? (
          <EmptyState
            kind={typeof navigator !== 'undefined' && !navigator.onLine ? 'offline' : 'load-error'}
            onRetry={() => { if (user) { setFetching(true); fetchProjects(user.id) } }}
          />
        ) : projects.length === 0 ? (
          <EmptyState
            kind="no-projects"
            onStartTour={() => onboarding.setHintsEnabled(true)}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {projects.map((project, i) => {
              // Миниатюра берёт оформление самого проекта: после правок в редакторе
              // палитра могла уйти далеко от исходного шаблона
              const colors = project.colors
              const headingFont = project.fonts?.heading || 'Prata'
              return (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm border border-[#6E2B34]/10 proj-card-hover"
                >
                  {/* Preview thumbnail */}
                  <div
                    className="h-40 relative flex items-center justify-center overflow-hidden"
                    style={{ background: `linear-gradient(145deg, ${colors.background}, ${colors.accent})` }}
                  >
                    <div className="text-center px-4">
                      <p className="text-xl font-light leading-tight" style={{ color: colors.primary, fontFamily: `'${headingFont}', serif` }}>
                        {project.title}
                      </p>
                      <div className="w-8 h-px mx-auto mt-2 opacity-60" style={{ background: colors.primary }} />
                      <p className="text-xs mt-2 tracking-widest uppercase opacity-40" style={{ color: colors.text }}>
                        {project.template?.replace('-', ' ')}
                      </p>
                    </div>

                    {/* Статус считается из данных: черновик / опубликован /
                        есть неопубликованные изменения / архив */}
                    {(() => {
                      const meta = STATUS_META[getProjectStatus(project)]
                      return (
                        <span
                          className="absolute top-3 left-3"
                          title={meta.hint}
                          style={{
                            display: 'inline-flex', alignItems: 'center', gap: 6,
                            padding: '4px 10px', borderRadius: 999,
                            fontSize: 11.5, fontWeight: 500, lineHeight: 1.3,
                            color: meta.color, background: meta.background,
                            maxWidth: 'calc(100% - 24px)',
                          }}
                        >
                          <span
                            aria-hidden="true"
                            style={{ width: 6, height: 6, borderRadius: 999, background: 'currentColor', flexShrink: 0 }}
                          />
                          {meta.label}
                        </span>
                      )
                    })()}

                    {/* Quick edit overlay on hover */}
                    <div className="absolute inset-0 bg-black/0 hover:bg-black/30 transition-all flex items-center justify-center opacity-0 hover:opacity-100">
                      <Link
                        href={`/dashboard/edit/${project.id}`}
                        className="px-4 py-2 bg-white rounded-xl text-sm font-medium text-[#16130F] shadow-lg"
                      >
                        ✏️ Редактировать
                      </Link>
                    </div>
                  </div>

                  {/* Card body */}
                  <div className="px-4 pt-3 pb-1">
                    <h3 className="font-semibold text-[#16130F] truncate text-sm">{project.title}</h3>
                    <p className="text-xs mt-0.5 font-mono truncate" style={{ color: 'var(--color-wine)' }}>
                      /{project.slug}
                    </p>
                    <p className="mrn-meta" style={{ fontSize: 11.5, marginTop: 6 }}>
                      Изменён: {formatMoment(project.updated_at) ?? '—'}
                      {project.published_at && (
                        <> · Опубликован: {formatMoment(project.published_at)}</>
                      )}
                    </p>
                  </div>

                  {/* Actions row */}
                  <div className="px-4 pb-3 pt-2 flex items-center gap-1.5 flex-wrap">
                    <Link
                      href={`/dashboard/edit/${project.id}`}
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#FBF8F4] text-[#16130F] text-xs font-medium hover:bg-[#6E2B34]/10 transition-colors"
                    >
                      <Edit2 size={11} /> Редактировать
                    </Link>

                    <Link
                      href={`/dashboard/edit/${project.id}?preview=1`}
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#FBF8F4] text-[#16130F] text-xs font-medium hover:bg-[#6E2B34]/10 transition-colors"
                    >
                      <Eye size={11} /> Предпросмотр
                    </Link>

                    <button
                      onClick={() => handlePublish(project)}
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors"
                      style={{ background: 'var(--color-ink)', color: 'var(--color-paper)' }}
                    >
                      <Globe size={11} />
                      {project.published ? 'Опубликовать изменения' : 'Опубликовать'}
                    </button>

                    {project.published ? (
                      <>
                        <Link
                          href={`/${project.slug}`}
                          target="_blank"
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#FBF8F4] text-[#16130F] text-xs font-medium hover:bg-[#6E2B34]/10 transition-colors"
                        >
                          <ExternalLink size={11} /> Открыть
                        </Link>
                        <button
                          onClick={() => copyLink(project.slug)}
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#FBF8F4] text-[#16130F] text-xs font-medium hover:bg-[#6E2B34]/10 transition-colors"
                        >
                          <Copy size={11} /> Ссылка
                        </button>
                      </>
                    ) : null}

                    {/* Right-side actions */}
                    <div className="ml-auto flex items-center gap-1.5">
                      {project.published ? (
                        <button
                          onClick={() => handleUnpublish(project)}
                          aria-label="Снять сайт с публикации"
                          title="Снять с публикации — гости перестанут видеть сайт"
                          className="p-2.5 rounded-xl bg-paper-2 text-ink-400 hover:bg-paper-2 hover:text-ink-600 transition-colors"
                        >
                          <EyeOff size={16} />
                        </button>
                      ) : null}

                      <button
                        onClick={() => handleDuplicate(project)}
                        aria-label="Дублировать"
                        className="p-2.5 rounded-xl bg-paper-2 text-ink-400 hover:bg-blue-50 hover:text-blue-500 transition-colors"
                        title="Дублировать"
                      >
                        <Copy size={16} />
                      </button>

                      <button
                        onClick={() => handleDelete(project.id)}
                        disabled={deletingId === project.id}
                        aria-label="Удалить"
                        className="p-2.5 rounded-xl bg-paper-2 text-ink-400 hover:bg-red-50 hover:text-red-400 transition-colors disabled:opacity-40"
                        title="Удалить"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              )
            })}

            {/* Add new project card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: projects.length * 0.06 }}
            >
              <Link
                href="/dashboard/new"
                className="h-full min-h-[220px] rounded-2xl border-2 border-dashed border-[#6E2B34]/25 flex flex-col items-center justify-center gap-3 hover:border-[#6E2B34] hover:bg-[#6E2B34]/5 transition-all group block"
              >
                <div className="w-12 h-12 rounded-full bg-[#6E2B34]/10 flex items-center justify-center group-hover:scale-110 transition-transform group-hover:bg-[#6E2B34]/20">
                  <Plus size={22} className="text-[#6E2B34]" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-[#16130F]">Новое приглашение</p>
                  <p className="text-xs text-ink-400 mt-0.5">Нажмите для создания</p>
                </div>
              </Link>
            </motion.div>
          </div>
        )}
      </main>

      {/* Помощник: свёрнут в кнопку, раскрывается только по нажатию */}
      {showOnboarding && (
        <Assistant
          progress={progress}
          onSkip={onboarding.skip}
          onDisable={onboarding.disable}
          onFinish={onboarding.markCongratulated}
        />
      )}
    </div>
  )
}
