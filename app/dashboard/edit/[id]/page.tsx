'use client'
import { useState, useEffect, useCallback, use } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft, Eye, EyeOff, Save, Globe, Check,
  Monitor, Smartphone, PanelLeft, X
} from 'lucide-react'
import { useAuth } from '@/lib/hooks/useAuth'
import { getProjectById, updateProject, publishProject } from '@/lib/projects'
import { WeddingSite } from '@/components/templates/WeddingSite'
import { EditorSidebar } from '@/components/editor/EditorSidebar'
import type { Project, BlockData } from '@/types'
import toast from 'react-hot-toast'
import Link from 'next/link'

type ViewMode = 'desktop' | 'mobile'

export default function EditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()

  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [publishing, setPublishing] = useState(false)
  const [isDirty, setIsDirty] = useState(false)
  const [viewMode, setViewMode] = useState<ViewMode>('desktop')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [previewMode, setPreviewMode] = useState(false)

  useEffect(() => {
    if (!authLoading && !user) router.push('/auth/login')
  }, [user, authLoading, router])

  useEffect(() => {
    if (!id) return
    getProjectById(id)
      .then((p) => {
        if (!p) { router.push('/dashboard'); return }
        setProject(p)
      })
      .finally(() => setLoading(false))
  }, [id, router])

  const handleProjectUpdate = useCallback((updates: Partial<Project>) => {
    setProject((prev) => prev ? { ...prev, ...updates } : null)
    setIsDirty(true)
  }, [])

  const handleBlockChange = useCallback((blockId: string, content: BlockData['content']) => {
    setProject((prev) => {
      if (!prev) return null
      return {
        ...prev,
        blocks: prev.blocks.map((b) => b.id === blockId ? { ...b, content } : b),
      }
    })
    setIsDirty(true)
  }, [])

  const handleBlockToggle = useCallback((blockId: string) => {
    setProject((prev) => {
      if (!prev) return null
      return {
        ...prev,
        blocks: prev.blocks.map((b) => b.id === blockId ? { ...b, enabled: !b.enabled } : b),
      }
    })
    setIsDirty(true)
  }, [])

  const handleBlockMoveUp = useCallback((blockId: string) => {
    setProject((prev) => {
      if (!prev) return null
      const blocks = [...prev.blocks].sort((a, b) => a.order - b.order)
      const idx = blocks.findIndex((b) => b.id === blockId)
      if (idx <= 0) return prev
      const newBlocks = [...blocks]
      ;[newBlocks[idx - 1], newBlocks[idx]] = [newBlocks[idx], newBlocks[idx - 1]]
      return { ...prev, blocks: newBlocks.map((b, i) => ({ ...b, order: i })) }
    })
    setIsDirty(true)
  }, [])

  const handleBlockMoveDown = useCallback((blockId: string) => {
    setProject((prev) => {
      if (!prev) return null
      const blocks = [...prev.blocks].sort((a, b) => a.order - b.order)
      const idx = blocks.findIndex((b) => b.id === blockId)
      if (idx >= blocks.length - 1) return prev
      const newBlocks = [...blocks]
      ;[newBlocks[idx], newBlocks[idx + 1]] = [newBlocks[idx + 1], newBlocks[idx]]
      return { ...prev, blocks: newBlocks.map((b, i) => ({ ...b, order: i })) }
    })
    setIsDirty(true)
  }, [])

  const handleSave = useCallback(async () => {
    if (!project) return
    setSaving(true)
    try {
      await updateProject(project.id, {
        blocks: project.blocks,
        colors: project.colors,
        fonts: project.fonts,
        music: project.music,
      })
      setIsDirty(false)
      toast.success('Сохранено ✓')
    } catch {
      toast.error('Ошибка сохранения')
    } finally {
      setSaving(false)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project])

  // Auto-save after 3s of inactivity
  useEffect(() => {
    if (!isDirty || !project) return
    const timer = setTimeout(() => { handleSave() }, 3000)
    return () => clearTimeout(timer)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDirty, project?.blocks, project?.colors, project?.fonts, project?.music])

  const handlePublish = async () => {
    if (!project) return
    // Save first
    await handleSave()
    setPublishing(true)
    try {
      await publishProject(project.id, !project.published)
      setProject((prev) => prev ? { ...prev, published: !prev.published } : null)
      if (!project.published) {
        const url = `${window.location.origin}/${project.slug}`
        toast.success(
          <span>
            Опубликовано! 🎉{' '}
            <a href={url} target="_blank" className="underline">{project.slug}</a>
          </span>
        )
      } else {
        toast.success('Сайт скрыт')
      }
    } catch {
      toast.error('Ошибка')
    } finally {
      setPublishing(false)
    }
  }

  if (loading || authLoading) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-[#C4A97D] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-[#2C2017]/40 text-sm">Загружаем редактор...</p>
        </div>
      </div>
    )
  }

  if (!project) return null

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-gray-100">
      {/* Top toolbar */}
      <div className="h-14 bg-white border-b border-gray-100 flex items-center px-4 gap-3 z-30 flex-shrink-0">
        {/* Left */}
        <div className="flex items-center gap-3 flex-1">
          <Link href="/dashboard"
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors">
            <ArrowLeft size={14} /> <span className="hidden sm:inline">Назад</span>
          </Link>
          <div className="w-px h-5 bg-gray-100" />
          <button onClick={() => setSidebarOpen(!sidebarOpen)}
            className={`p-1.5 rounded-lg transition-colors ${sidebarOpen ? 'bg-[#C4A97D]/10 text-[#C4A97D]' : 'text-gray-400 hover:text-gray-600'}`}>
            <PanelLeft size={16} />
          </button>
          <div className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gray-50">
            <span className="text-xs text-gray-500 font-medium truncate max-w-[150px]">{project.title}</span>
            {isDirty && <span className="w-1.5 h-1.5 rounded-full bg-[#C4A97D] ml-1 flex-shrink-0" title="Несохранённые изменения" />}
          </div>
        </div>

        {/* Center: view mode */}
        <div className="flex items-center gap-1 bg-gray-50 rounded-xl p-1">
          <button onClick={() => setViewMode('desktop')}
            className={`p-1.5 rounded-lg transition-all ${viewMode === 'desktop' ? 'bg-white shadow-sm text-[#2C2017]' : 'text-gray-400'}`}>
            <Monitor size={15} />
          </button>
          <button onClick={() => setViewMode('mobile')}
            className={`p-1.5 rounded-lg transition-all ${viewMode === 'mobile' ? 'bg-white shadow-sm text-[#2C2017]' : 'text-gray-400'}`}>
            <Smartphone size={15} />
          </button>
        </div>

        {/* Right: actions */}
        <div className="flex items-center gap-2 flex-1 justify-end">
          <button
            onClick={() => setPreviewMode(!previewMode)}
            className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
              previewMode ? 'bg-gray-100 text-gray-600' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
            }`}
          >
            {previewMode ? <EyeOff size={13} /> : <Eye size={13} />}
            <span className="hidden md:inline">{previewMode ? 'Редактор' : 'Просмотр'}</span>
          </button>

          {project.published && (
            <Link href={`/${project.slug}`} target="_blank"
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-all">
              <Globe size={13} />
              Открыть
            </Link>
          )}

          <button
            onClick={handleSave}
            disabled={saving || !isDirty}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all border border-gray-100 hover:border-[#C4A97D]/40 disabled:opacity-40"
          >
            {saving ? (
              <div className="w-3 h-3 border border-gray-400 border-t-transparent rounded-full animate-spin" />
            ) : isDirty ? (
              <Save size={13} className="text-[#C4A97D]" />
            ) : (
              <Check size={13} className="text-green-500" />
            )}
            <span className="hidden sm:inline">{saving ? 'Сохраняем...' : isDirty ? 'Сохранить' : 'Сохранено'}</span>
          </button>

          <button
            onClick={handlePublish}
            disabled={publishing}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-medium transition-all ${
              project.published
                ? 'bg-green-50 text-green-600 border border-green-100 hover:bg-green-100'
                : 'btn-luxury'
            }`}
          >
            {publishing ? (
              <div className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" />
            ) : project.published ? (
              <><Eye size={13} /> <span className="hidden sm:inline">Опубликован</span></>
            ) : (
              <><Globe size={13} /> <span>Опубликовать</span></>
            )}
          </button>
        </div>
      </div>

      {/* Main layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 280, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex-shrink-0 border-r border-gray-100 overflow-hidden"
              style={{ width: 280 }}
            >
              <EditorSidebar
                project={project}
                onUpdate={handleProjectUpdate}
                onBlockToggle={handleBlockToggle}
                userId={user?.id}
                projectId={project.id}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Preview canvas */}
        <div className="flex-1 overflow-auto bg-gray-100 flex items-start justify-center p-4 md:p-8">
          <div
            className={`bg-white shadow-2xl overflow-hidden transition-all duration-300 ${
              viewMode === 'mobile' ? 'rounded-[2rem]' : 'rounded-xl'
            }`}
            style={{
              width: viewMode === 'mobile' ? 390 : '100%',
              maxWidth: viewMode === 'desktop' ? 1200 : 390,
              minHeight: '100vh',
              ...(viewMode === 'mobile' ? {
                boxShadow: '0 0 0 12px #1C1812, 0 40px 80px rgba(0,0,0,0.4)',
              } : {}),
            }}
          >
            <WeddingSite
              project={project}
              isEditing={!previewMode}
              onBlockChange={handleBlockChange}
              onBlockToggle={handleBlockToggle}
              onBlockMoveUp={handleBlockMoveUp}
              onBlockMoveDown={handleBlockMoveDown}
              userId={user?.id}
            />
          </div>
        </div>
      </div>

      {/* Mobile sidebar — bottom sheet */}
      <AnimatePresence>
        {sidebarOpen && (
          <div className="md:hidden fixed inset-0 z-40">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.div
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 32, stiffness: 300 }}
              className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-2xl z-50"
              style={{ maxHeight: '72dvh' }}
            >
              <div className="flex justify-center pt-3 pb-1">
                <div className="w-9 h-1 bg-gray-200 rounded-full" />
              </div>
              <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100">
                <span className="font-medium text-[#2C2017] text-sm">⚙️ Настройки сайта</span>
                <button onClick={() => setSidebarOpen(false)} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
                  <X size={16} className="text-gray-400" />
                </button>
              </div>
              <div className="overflow-y-auto overscroll-contain" style={{ maxHeight: 'calc(72dvh - 72px)' }}>
                <EditorSidebar
                  project={project}
                  onUpdate={handleProjectUpdate}
                  onBlockToggle={handleBlockToggle}
                  userId={user?.id}
                  projectId={project.id}
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Mobile FAB */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="md:hidden fixed bottom-5 right-4 z-30 flex items-center gap-2 px-4 py-3 rounded-2xl text-white text-sm font-medium shadow-xl active:scale-95 transition-transform"
        style={{ background: 'linear-gradient(135deg, #C4A97D, #8B6F47)' }}
      >
        ⚙️ Настройки
      </button>
    </div>
  )
}
