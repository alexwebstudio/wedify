'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Plus, Edit2, Trash2, Eye, EyeOff, ExternalLink, Copy, Heart, Settings2, ChevronRight } from 'lucide-react'
import { Navbar } from '@/components/ui/Navbar'
import { useAuth } from '@/lib/hooks/useAuth'
import { useAppStore } from '@/lib/store'
import { getProjects, deleteProject, publishProject } from '@/lib/projects'
import { usePlan, PLAN_META } from '@/lib/subscription'
import type { Project } from '@/types'
import toast from 'react-hot-toast'

function PlanCard() {
  const { plan, setPlan, meta } = usePlan()
  const priceLabel = plan === 'standard' ? 'Бесплатно' : meta.price
  return (
    <div className="mb-6 bg-white rounded-2xl border p-4 sm:p-5" style={{ borderColor: meta.color + '40' }}>
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 text-white text-lg" style={{ background: meta.color }}>
            {plan === 'standard' ? '⭐' : '✦'}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-[#2C2017] flex items-center gap-2 flex-wrap">
              Тариф: {meta.label}
              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full text-white" style={{ background: meta.color }}>{priceLabel}</span>
            </p>
            <p className="text-xs text-[#9A8B76] mt-0.5">{meta.desc}</p>
          </div>
        </div>

        {plan === 'start' && (
          <button onClick={() => { setPlan('standard'); toast.success('Тариф «Стандарт» активирован 🎉') }}
            className="px-4 py-2 rounded-xl text-xs font-medium text-white transition-transform active:scale-95 whitespace-nowrap"
            style={{ background: `linear-gradient(135deg, ${PLAN_META.standard.color}, ${PLAN_META.standard.color}CC)` }}>
            Получить Стандарт · БЕСПЛАТНО
          </button>
        )}
        {plan === 'standard' && (
          <button onClick={() => { setPlan('start'); toast('Возвращён базовый тариф', { icon: 'ℹ️' }) }} className="text-xs text-gray-400 hover:text-gray-600 underline self-start sm:self-auto">Вернуться на базовый</button>
        )}
      </div>
      <p className="text-[10px] text-gray-300 mt-2">Премиум-тариф скоро — блоки Premium пока в разработке.</p>
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
        </div>

        {/* Текущий тариф */}
        <PlanCard />

        {/* Единая кнопка настроек сайта */}
        <div className="mb-10">
          <Link href="/dashboard/settings"
            className="group bg-white rounded-2xl border border-[#C4A97D]/15 p-4 flex items-center gap-4 hover:border-[#C4A97D]/40 hover:shadow-sm transition-all">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: 'rgba(196,169,125,.14)', color: '#8B6F47' }}>
              <Settings2 size={20} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-[#2C2017]">Настройки сайта</p>
              <p className="text-xs text-[#9A8B76]">Шрифты и палитра, безопасность и доступ, сообщения с форм, помощь</p>
            </div>
            <ChevronRight size={18} className="text-[#C4A97D] opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
          </Link>
        </div>

        {projects.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            {/* иллюстрация: мини-приглашение */}
            <div className="mx-auto mb-8" style={{ width: 150 }}>
              <div className="relative mx-auto rounded-2xl" style={{ width: 150, height: 196, background: 'linear-gradient(170deg,#FBF8F3,#F1E7D6)', boxShadow: '0 24px 50px -24px rgba(196,169,125,.6), 0 0 0 1px rgba(196,169,125,.25)', transform: 'rotate(-4deg)' }}>
                <div className="absolute inset-0 flex flex-col items-center justify-center px-4">
                  <Heart size={20} className="text-[#C4A97D] mb-3" fill="#C4A97D" />
                  <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 20, color: '#1E1610', lineHeight: 1 }}>Имена</div>
                  <div style={{ color: '#C4A97D', fontSize: 12, margin: '4px 0' }}>♥</div>
                  <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 20, color: '#1E1610', lineHeight: 1 }}>пары</div>
                  <div style={{ width: 34, height: 1, background: 'rgba(184,149,106,.5)', margin: '10px 0 8px' }} />
                  <div style={{ color: '#9A8B76', fontSize: 10, letterSpacing: '.15em' }}>ДД · ММ · 2026</div>
                </div>
              </div>
            </div>
            <h2 className="text-2xl font-light text-[#2C2017] mb-2" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              Здесь появятся ваши приглашения
            </h2>
            <p className="text-[#2C2017]/40 text-sm mb-8">Создайте первое — это займёт пару минут</p>
            <Link href="/dashboard/new"
              className="btn-luxury px-8 py-3.5 rounded-xl font-medium inline-flex items-center gap-2">
              <span className="flex items-center gap-2">
                <Plus size={16} />
                Создать первый свадебный сайт
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
                    <div className="ml-auto flex items-center gap-1.5">
                      <button
                        onClick={() => handlePublish(project)}
                        aria-label={project.published ? 'Скрыть сайт' : 'Опубликовать сайт'}
                        className={`p-2.5 rounded-xl transition-colors ${
                          project.published
                            ? 'bg-green-50 text-green-600 hover:bg-green-100'
                            : 'bg-gray-50 text-gray-400 hover:bg-[#C4A97D]/10 hover:text-[#C4A97D]'
                        }`}
                        title={project.published ? 'Скрыть сайт' : 'Опубликовать сайт'}
                      >
                        {project.published ? <Eye size={16} /> : <EyeOff size={16} />}
                      </button>

                      <button
                        onClick={() => handleDuplicate(project)}
                        aria-label="Дублировать"
                        className="p-2.5 rounded-xl bg-gray-50 text-gray-400 hover:bg-blue-50 hover:text-blue-500 transition-colors"
                        title="Дублировать"
                      >
                        <Copy size={16} />
                      </button>

                      <button
                        onClick={() => handleDelete(project.id)}
                        disabled={deletingId === project.id}
                        aria-label="Удалить"
                        className="p-2.5 rounded-xl bg-gray-50 text-gray-400 hover:bg-red-50 hover:text-red-400 transition-colors disabled:opacity-40"
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
