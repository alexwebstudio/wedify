'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Plus, Edit2, Trash2, Eye, EyeOff, ExternalLink, Copy, Heart } from 'lucide-react'
import { Navbar } from '@/components/ui/Navbar'
import { useAuth } from '@/lib/hooks/useAuth'
import { useAppStore } from '@/lib/store'
import { getProjects, deleteProject, publishProject } from '@/lib/projects'
import type { Project } from '@/types'
import toast from 'react-hot-toast'

export default function DashboardPage() {
  const { user, loading } = useAuth()
  const { t } = useAppStore()
  const router = useRouter()
  const [projects, setProjects] = useState<Project[]>([])
  const [fetching, setFetching] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    if (!loading && !user) router.push('/auth/login')
  }, [user, loading, router])

  useEffect(() => {
    if (!user) return
    getProjects(user.id)
      .then(setProjects)
      .catch(() => toast.error('Ошибка загрузки'))
      .finally(() => setFetching(false))
  }, [user])

  const handleDelete = async (id: string) => {
    if (!confirm('Удалить это приглашение?')) return
    setDeletingId(id)
    try {
      await deleteProject(id)
      setProjects((p) => p.filter((pr) => pr.id !== id))
      toast.success('Удалено')
    } catch {
      toast.error('Ошибка')
    } finally {
      setDeletingId(null)
    }
  }

  const handlePublish = async (project: Project) => {
    try {
      await publishProject(project.id, !project.published)
      setProjects((p) => p.map((pr) => pr.id === project.id ? { ...pr, published: !pr.published } : pr))
      toast.success(project.published ? 'Скрыто' : 'Опубликовано! 🎉')
    } catch {
      toast.error('Ошибка')
    }
  }

  const copyLink = (slug: string) => {
    const url = `${window.location.origin}/${slug}`
    navigator.clipboard.writeText(url)
    toast.success('Ссылка скопирована! 🔗')
  }

  const TEMPLATE_COLORS: Record<string, { bg: string; bg2: string; accent: string; text: string }> = {
    'classic-luxury':  { bg: '#FAF8F5', bg2: '#F5EDD6', accent: '#C4A97D', text: '#2C2017' },
    'minimal-white':   { bg: '#FFFFFF', bg2: '#F5F5F5', accent: '#1A1A1A', text: '#1A1A1A' },
    'dark-elegant':    { bg: '#1C1812', bg2: '#3D3025', accent: '#D4AF7A', text: '#F0E8D8' },
    'sage-garden':     { bg: '#F5F7F0', bg2: '#DDE4D2', accent: '#7E8E6A', text: '#2D3520' },
    'rose-blush':      { bg: '#FFF8FA', bg2: '#FCF0F4', accent: '#D4829A', text: '#2A1520' },
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
      <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-[#C4A97D] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-[#2C2017]/40 text-sm">Загружаем...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      <Navbar dark={false} />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-24 pb-20">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl md:text-4xl font-light text-[#2C2017]"
              style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              {t('dashboard_title')}
            </h1>
            <p className="text-[#2C2017]/40 text-sm mt-1">
              {projects.length === 0 ? 'Начните создавать' : `${projects.length} приглашени${projects.length === 1 ? 'е' : 'й'}`}
            </p>
          </div>
          <Link href="/dashboard/new"
            className="btn-luxury px-5 py-2.5 rounded-xl font-medium text-sm inline-flex items-center gap-2">
            <span className="flex items-center gap-2">
              <Plus size={16} />
              {t('dashboard_create')}
            </span>
          </Link>
        </div>

        {projects.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="text-center py-24"
          >
            <div className="w-20 h-20 rounded-full bg-[#C4A97D]/10 flex items-center justify-center mx-auto mb-6">
              <Heart size={32} className="text-[#C4A97D]" />
            </div>
            <h2 className="text-2xl font-light text-[#2C2017] mb-2" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              {t('dashboard_empty')}
            </h2>
            <p className="text-[#2C2017]/40 text-sm mb-8">Создайте первое свадебное приглашение</p>
            <Link href="/dashboard/new"
              className="btn-luxury px-8 py-3.5 rounded-xl font-medium inline-flex items-center gap-2">
              <span className="flex items-center gap-2">
                <Plus size={16} />
                Создать приглашение
              </span>
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {projects.map((project, i) => {
              const colors = TEMPLATE_COLORS[project.template] || TEMPLATE_COLORS['classic-luxury']
              return (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm border border-[#C4A97D]/10 proj-card-hover"
                >
                  {/* Preview thumbnail */}
                  <div
                    className="h-40 relative flex items-center justify-center overflow-hidden"
                    style={{ background: `linear-gradient(145deg, ${colors.bg}, ${colors.bg2})` }}
                  >
                    <div className="text-center px-4">
                      <p className="text-xl font-light leading-tight" style={{ color: colors.accent, fontFamily: 'Cormorant Garamond, serif' }}>
                        {project.title}
                      </p>
                      <div className="w-8 h-px mx-auto mt-2 opacity-60" style={{ background: colors.accent }} />
                      <p className="text-xs mt-2 tracking-widest uppercase opacity-40" style={{ color: colors.text }}>
                        {project.template?.replace('-', ' ')}
                      </p>
                    </div>

                    {/* Status badge */}
                    <div className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-medium ${
                      project.published
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-500'
                    }`}>
                      {project.published ? '🟢 Опубликован' : '⚫ Черновик'}
                    </div>

                    {/* Quick edit overlay on hover */}
                    <div className="absolute inset-0 bg-black/0 hover:bg-black/30 transition-all flex items-center justify-center opacity-0 hover:opacity-100">
                      <Link
                        href={`/dashboard/edit/${project.id}`}
                        className="px-4 py-2 bg-white rounded-xl text-sm font-medium text-[#2C2017] shadow-lg"
                      >
                        ✏️ Редактировать
                      </Link>
                    </div>
                  </div>

                  {/* Card body */}
                  <div className="px-4 pt-3 pb-1">
                    <h3 className="font-semibold text-[#2C2017] truncate text-sm">{project.title}</h3>
                    <p className="text-xs text-[#C4A97D] mt-0.5 font-mono truncate">
                      /{project.slug}
                    </p>
                  </div>

                  {/* Actions row */}
                  <div className="px-4 pb-3 pt-2 flex items-center gap-1.5 flex-wrap">
                    <Link
                      href={`/dashboard/edit/${project.id}`}
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#FAF8F5] text-[#2C2017] text-xs font-medium hover:bg-[#C4A97D]/10 transition-colors"
                    >
                      <Edit2 size={11} /> Редактировать
                    </Link>

                    {project.published ? (
                      <>
                        <Link
                          href={`/${project.slug}`}
                          target="_blank"
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#FAF8F5] text-[#2C2017] text-xs font-medium hover:bg-[#C4A97D]/10 transition-colors"
                        >
                          <ExternalLink size={11} /> Открыть
                        </Link>
                        <button
                          onClick={() => copyLink(project.slug)}
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#FAF8F5] text-[#2C2017] text-xs font-medium hover:bg-[#C4A97D]/10 transition-colors"
                        >
                          <Copy size={11} /> Ссылка
                        </button>
                      </>
                    ) : null}

                    {/* Right-side actions */}
                    <div className="ml-auto flex items-center gap-1">
                      <button
                        onClick={() => handlePublish(project)}
                        className={`p-1.5 rounded-lg transition-colors ${
                          project.published
                            ? 'bg-green-50 text-green-600 hover:bg-green-100'
                            : 'bg-gray-50 text-gray-400 hover:bg-[#C4A97D]/10 hover:text-[#C4A97D]'
                        }`}
                        title={project.published ? 'Скрыть сайт' : 'Опубликовать сайт'}
                      >
                        {project.published ? <Eye size={13} /> : <EyeOff size={13} />}
                      </button>

                      <button
                        onClick={() => handleDuplicate(project)}
                        className="p-1.5 rounded-lg bg-gray-50 text-gray-400 hover:bg-blue-50 hover:text-blue-500 transition-colors"
                        title="Дублировать"
                      >
                        <Copy size={13} />
                      </button>

                      <button
                        onClick={() => handleDelete(project.id)}
                        disabled={deletingId === project.id}
                        className="p-1.5 rounded-lg bg-gray-50 text-gray-400 hover:bg-red-50 hover:text-red-400 transition-colors disabled:opacity-40"
                        title="Удалить"
                      >
                        <Trash2 size={13} />
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
                className="h-full min-h-[220px] rounded-2xl border-2 border-dashed border-[#C4A97D]/25 flex flex-col items-center justify-center gap-3 hover:border-[#C4A97D] hover:bg-[#C4A97D]/5 transition-all group block"
              >
                <div className="w-12 h-12 rounded-full bg-[#C4A97D]/10 flex items-center justify-center group-hover:scale-110 transition-transform group-hover:bg-[#C4A97D]/20">
                  <Plus size={22} className="text-[#C4A97D]" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-[#2C2017]">Новое приглашение</p>
                  <p className="text-xs text-gray-400 mt-0.5">Нажмите для создания</p>
                </div>
              </Link>
            </motion.div>
          </div>
        )}
      </main>
    </div>
  )
}
