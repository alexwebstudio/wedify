'use client'
import { useState, useEffect, useCallback, use, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft, Eye, EyeOff, Save, Globe, Check,
  Monitor, Smartphone, PanelLeft, X, Undo2, Redo2,
} from 'lucide-react'
import { useAuth } from '@/lib/hooks/useAuth'
import { loadUserSettings, saveUserSettings, type ButtonStyle, type ImageStyle } from '@/lib/userSettings'
import { getProjectById, updateProject, publishProject } from '@/lib/projects'
import { hasUnpublishedChanges, formatMoment } from '@/lib/projectStatus'
import { PublishPanel } from '@/components/editor/PublishPanel'
import { reportError } from '@/lib/errors'
import { WeddingSite } from '@/components/templates/WeddingSite'
import { EditorSidebar } from '@/components/editor/EditorSidebar'
import dynamic from 'next/dynamic'
const BlockLibraryModal = dynamic(
  () => import('@/components/editor/BlockLibraryModal').then((m) => ({ default: m.BlockLibraryModal })),
  { ssr: false },
)
import { DeleteConfirm } from '@/components/editor/DeleteConfirm'
import { SiteFonts } from '@/components/providers/SiteFonts'
import { makeBlockFromCatalog } from '@/lib/blockLibrary'
import { deriveVariables, applyVariables } from '@/lib/siteVariables'
import { usePlan, canAddBlocks } from '@/lib/subscription'
import type { CatalogItem } from '@/lib/blockLibrary'
import type { Project, BlockData } from '@/types'
import toast from 'react-hot-toast'
import Link from 'next/link'

type ViewMode = 'desktop' | 'mobile'
type Snap = Pick<Project, 'blocks' | 'colors' | 'fonts' | 'music'>

const snap = (p: Project): Snap =>
  structuredClone({ blocks: p.blocks, colors: p.colors, fonts: p.fonts, music: p.music })

const reseq = (blocks: BlockData[]): BlockData[] =>
  [...blocks].sort((a, b) => a.order - b.order).map((b, i) => ({ ...b, order: i }))

function uid(type: string): string {
  const r = typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
  return `${type}-${r}`
}

export default function EditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()

  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  // Явные состояния автосохранения вместо одного флага
  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const saving = saveState === 'saving'
  const [publishing, setPublishing] = useState(false)
  const [isDirty, setIsDirty] = useState(false)
  const [viewMode, setViewMode] = useState<ViewMode>('desktop')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  // Из кабинета можно открыть сразу предпросмотр: /dashboard/edit/<id>?preview=1
  const [previewMode, setPreviewMode] = useState(
    () => typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('preview') === '1',
  )
  const [publishPanel, setPublishPanel] = useState(false)
  // Публиковали впервые или обновляли уже живой сайт — запоминаем до вызова
  const [publishedFirstTime, setPublishedFirstTime] = useState(false)

  // history
  const [past, setPast] = useState<Snap[]>([])
  const [future, setFuture] = useState<Snap[]>([])
  // modals
  const [libraryOpen, setLibraryOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<BlockData | null>(null)
  const { plan } = usePlan()

  // Настройки аккаунта: форма кнопок/картинок и стартовая версия (моб/деск)
  const [acctBtn, setAcctBtn] = useState<ButtonStyle>('rounded')
  const [acctImg, setAcctImg] = useState<ImageStyle>('rounded')
  const viewInit = useRef(false)

  useEffect(() => {
    if (!user) return
    loadUserSettings(user.id, user.email || '').then((st) => {
      setAcctBtn(st.defaults.buttonStyle)
      setAcctImg(st.defaults.imageStyle)
      // Стартовать редактор в той версии, что выбрана в настройках (моб/деск) — один раз.
      if (!viewInit.current) {
        viewInit.current = true
        setViewMode(st.defaults.buildFirst === 'mobile' ? 'mobile' : 'desktop')
      }
    })
  }, [user])

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

  // Любая правка проходит через applyMutation → пишется в историю
  const applyMutation = useCallback((fn: (p: Project) => Project) => {
    if (!project) return
    setPast((pt) => [...pt.slice(-49), snap(project)])
    setFuture([])
    setProject(fn(project))
    setIsDirty(true)
  }, [project])

  const handleProjectUpdate = useCallback((updates: Partial<Project>) => {
    applyMutation((p) => ({ ...p, ...updates }))
  }, [applyMutation])

  const handleBlockChange = useCallback((blockId: string, content: BlockData['content']) => {
    applyMutation((p) => ({ ...p, blocks: p.blocks.map((b) => b.id === blockId ? { ...b, content } : b) }))
  }, [applyMutation])

  const handleBlockToggle = useCallback((blockId: string) => {
    applyMutation((p) => ({ ...p, blocks: p.blocks.map((b) => b.id === blockId ? { ...b, enabled: !b.enabled } : b) }))
  }, [applyMutation])

  const handleBlockMoveUp = useCallback((blockId: string) => {
    applyMutation((p) => {
      const blocks = [...p.blocks].sort((a, b) => a.order - b.order)
      const idx = blocks.findIndex((b) => b.id === blockId)
      if (idx <= 0) return p
      ;[blocks[idx - 1], blocks[idx]] = [blocks[idx], blocks[idx - 1]]
      return { ...p, blocks: blocks.map((b, i) => ({ ...b, order: i })) }
    })
  }, [applyMutation])

  const handleBlockMoveDown = useCallback((blockId: string) => {
    applyMutation((p) => {
      const blocks = [...p.blocks].sort((a, b) => a.order - b.order)
      const idx = blocks.findIndex((b) => b.id === blockId)
      if (idx < 0 || idx >= blocks.length - 1) return p
      ;[blocks[idx], blocks[idx + 1]] = [blocks[idx + 1], blocks[idx]]
      return { ...p, blocks: blocks.map((b, i) => ({ ...b, order: i })) }
    })
  }, [applyMutation])

  const handleBlockReorder = useCallback((newOrder: BlockData[]) => {
    applyMutation((p) => ({ ...p, blocks: newOrder.map((b, i) => ({ ...b, order: i })) }))
  }, [applyMutation])

  const handleBlockDuplicate = useCallback((blockId: string) => {
    applyMutation((p) => {
      const sorted = [...p.blocks].sort((a, b) => a.order - b.order)
      const sIdx = sorted.findIndex((b) => b.id === blockId)
      if (sIdx < 0) return p
      const src = sorted[sIdx]
      const clone: BlockData = { ...structuredClone(src), id: uid(src.type) }
      sorted.splice(sIdx + 1, 0, clone)
      return { ...p, blocks: sorted.map((b, i) => ({ ...b, order: i })) }
    })
    toast.success('Блок продублирован')
  }, [applyMutation])

  const handleAddFromCatalog = useCallback((item: CatalogItem) => {
    applyMutation((p) => {
      // Наследуем уже введённые данные сайта, чтобы новый блок не сбрасывал их на дефолт (#6)
      const vars = deriveVariables(p.blocks)
      const order = p.blocks.length
      const raw = makeBlockFromCatalog(item, order)
      const seeded = applyVariables([raw], vars)[0]

      // Прелоадер всегда закрепляется сверху (#5)
      if (seeded.type === 'preloader') {
        const rest = p.blocks.map((b) => ({ ...b, order: b.order + 1 }))
        return { ...p, blocks: [{ ...seeded, order: 0 }, ...rest] }
      }
      return { ...p, blocks: [...p.blocks, seeded] }
    })
    toast.success(item.type === 'preloader' ? 'Прелоадер закреплён сверху' : `Добавлен блок: ${item.name}`)
  }, [applyMutation])

  const requestDelete = useCallback((blockId: string) => {
    setProject((prev) => {
      const b = prev?.blocks.find((x) => x.id === blockId) || null
      setDeleteTarget(b)
      return prev
    })
  }, [])

  const confirmDelete = useCallback(() => {
    if (!deleteTarget) return
    const targetId = deleteTarget.id
    applyMutation((p) => ({ ...p, blocks: reseq(p.blocks.filter((b) => b.id !== targetId)) }))
    setDeleteTarget(null)
    toast.success('Блок удалён')
  }, [deleteTarget, applyMutation])

  const canUndo = past.length > 0
  const canRedo = future.length > 0

  const undo = useCallback(() => {
    if (!project || past.length === 0) return
    const prev = past[past.length - 1]
    setFuture((f) => [snap(project), ...f].slice(0, 50))
    setPast((pt) => pt.slice(0, -1))
    setProject({ ...project, ...prev })
    setIsDirty(true)
  }, [project, past])

  const redo = useCallback(() => {
    if (!project || future.length === 0) return
    const next = future[0]
    setPast((pt) => [...pt.slice(-49), snap(project)])
    setFuture((f) => f.slice(1))
    setProject({ ...project, ...next })
    setIsDirty(true)
  }, [project, future])

  // Ctrl/Cmd+Z / Ctrl+Shift+Z / Ctrl+Y — но не мешаем редактированию текста в полях
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const mod = e.metaKey || e.ctrlKey
      if (!mod) return
      const el = document.activeElement as HTMLElement | null
      if (el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.isContentEditable)) return
      const k = e.key.toLowerCase()
      if (k === 'z') { e.preventDefault(); if (e.shiftKey) redo(); else undo() }
      else if (k === 'y') { e.preventDefault(); redo() }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [undo, redo])

  /**
   * Автосохранение пишет ТОЛЬКО в черновик.
   * Гости продолжают видеть последнюю опубликованную версию, пока автор
   * не нажмёт «Опубликовать». Тост здесь не показываем — при автосохранении
   * он всплывал бы каждые несколько секунд; состояние видно в шапке.
   */
  const handleSave = useCallback(async (opts: { silent?: boolean } = {}) => {
    if (!project) return false
    setSaveState('saving')
    try {
      await updateProject(project.id, {
        blocks: project.blocks,
        colors: project.colors,
        fonts: project.fonts,
        music: project.music,
      })
      setIsDirty(false)
      setSaveState('saved')
      if (!opts.silent) toast.success('Сохранено в черновик')
      return true
    } catch (err) {
      setSaveState('error')
      reportError(err, { action: 'draft.save', meta: { projectId: project.id } },
        'Не удалось сохранить черновик')
      return false
    }
  }, [project])

  // Автосохранение с задержкой: правки не летят в базу на каждое нажатие
  useEffect(() => {
    if (!isDirty || !project) return
    const timer = setTimeout(() => { handleSave({ silent: true }) }, 1500)
    return () => clearTimeout(timer)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDirty, project?.blocks, project?.colors, project?.fonts, project?.music])

  // Предупреждение при закрытии вкладки, пока правки не доехали до базы
  useEffect(() => {
    if (!isDirty) return
    const onBeforeUnload = (e: BeforeUnloadEvent) => { e.preventDefault() }
    window.addEventListener('beforeunload', onBeforeUnload)
    return () => window.removeEventListener('beforeunload', onBeforeUnload)
  }, [isDirty])

  /**
   * Публикация — единственное действие, меняющее то, что видят гости.
   * Сначала фиксируем черновик, затем копируем его в опубликованный снимок.
   */
  /**
   * Отмечаем шаг обучения «проверьте сайт»: открытие предпросмотра из данных
   * проекта не видно, поэтому это единственный шаг с флагом в настройках.
   */
  const markPreviewSeen = useCallback(async () => {
    if (!user) return
    const current = await loadUserSettings(user.id, user.email || '')
    if (current.onboarding.seenSteps.includes('preview')) return
    await saveUserSettings(user.id, {
      ...current,
      onboarding: { ...current.onboarding, seenSteps: [...current.onboarding.seenSteps, 'preview'] },
    })
  }, [user])

  const handlePublish = async () => {
    if (!project) return
    if (isDirty) {
      const ok = await handleSave({ silent: true })
      if (!ok) return
    }
    const wasLive = project.published
    setPublishing(true)
    try {
      const updated = await publishProject(project.id)
      setPublishedFirstTime(!wasLive)
      setProject((prev) => (prev ? { ...prev, ...updated } : updated))
      setPublishPanel(true)
    } catch (err) {
      reportError(err, { action: 'project.publish', meta: { projectId: project.id } },
        'Публикация не удалась. Попробуйте ещё раз через минуту')
    } finally {
      setPublishing(false)
    }
  }



  const sidebarProps = {
    onUpdate: handleProjectUpdate,
    onBlockToggle: handleBlockToggle,
    onBlockDuplicate: handleBlockDuplicate,
    onBlockDelete: requestDelete,
    onBlockReorder: handleBlockReorder,
    onAddBlock: () => {
      if (!canAddBlocks(plan)) { toast('Добавление блоков доступно на тарифе Стандарт и выше', { icon: '🔒' }); return }
      setLibraryOpen(true)
    },
    canAddBlocks: canAddBlocks(plan),
    plan,
    userId: user?.id,
  }

  if (loading || authLoading) {
    return (
      <div className="min-h-screen bg-[#FBF8F4] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-[#6E2B34] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-[#16130F]/40 text-sm">Загружаем редактор...</p>
        </div>
      </div>
    )
  }

  if (!project) return null

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-paper-2">
      {/* Библиотека шрифтов пользовательских сайтов — нужна только здесь и в превью */}
      <SiteFonts />

      {/* Top toolbar */}
      <div className="h-14 bg-white border-b border-paper-3 flex items-center px-4 gap-3 z-30 flex-shrink-0">
        {/* Left */}
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <Link href="/dashboard" className="flex items-center gap-1.5 text-sm text-ink-400 hover:text-ink transition-colors">
            <ArrowLeft size={14} /> <span className="hidden sm:inline">Назад</span>
          </Link>
          <div className="w-px h-5 bg-paper-2" />
          <button onClick={() => setSidebarOpen(!sidebarOpen)}
            className={`p-1.5 rounded-lg transition-colors ${sidebarOpen ? 'bg-[#6E2B34]/10 text-[#6E2B34]' : 'text-ink-400 hover:text-ink-600'}`}>
            <PanelLeft size={16} />
          </button>

          {/* Undo / Redo */}
          <div className="flex items-center gap-0.5">
            <button onClick={undo} disabled={!canUndo} title="Отменить (Ctrl+Z)"
              className="p-1.5 rounded-lg transition-colors text-ink-400 enabled:hover:text-ink-700 enabled:hover:bg-paper-2 disabled:opacity-30">
              <Undo2 size={16} />
            </button>
            <button onClick={redo} disabled={!canRedo} title="Повторить (Ctrl+Shift+Z)"
              className="p-1.5 rounded-lg transition-colors text-ink-400 enabled:hover:text-ink-700 enabled:hover:bg-paper-2 disabled:opacity-30">
              <Redo2 size={16} />
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-lg bg-paper-2 min-w-0">
            <span className="text-xs text-ink-400 font-medium truncate max-w-[130px]">{project.title}</span>
            {isDirty && <span className="w-1.5 h-1.5 rounded-full bg-[#6E2B34] ml-1 flex-shrink-0" title="Несохранённые изменения" />}
          </div>
        </div>

        {/* Center: view mode */}
        <div className="flex items-center gap-1 bg-paper-2 rounded-xl p-1">
          <button onClick={() => setViewMode('desktop')}
            className={`p-1.5 rounded-lg transition-all ${viewMode === 'desktop' ? 'bg-white shadow-sm text-[#16130F]' : 'text-ink-400'}`}>
            <Monitor size={15} />
          </button>
          <button onClick={() => setViewMode('mobile')}
            className={`p-1.5 rounded-lg transition-all ${viewMode === 'mobile' ? 'bg-white shadow-sm text-[#16130F]' : 'text-ink-400'}`}>
            <Smartphone size={15} />
          </button>
        </div>

        {/* Right: actions */}
        <div className="flex items-center gap-2 flex-1 justify-end">
          {/* Состояние черновика: пользователь всегда видит, сохранены ли правки */}
          <span
            className="hidden sm:flex items-center gap-1.5 text-xs"
            style={{ color: saveState === 'error' ? 'var(--color-wine)' : 'var(--color-ink-400)' }}
            role="status"
            aria-live="polite"
          >
            {saveState === 'saving' && (
              <><span className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" /> Сохраняем…</>
            )}
            {saveState === 'saved' && !isDirty && (<><Check size={13} /> Сохранено</>)}
            {saveState === 'error' && (<>Ошибка сохранения</>)}
            {saveState === 'idle' && !isDirty && (<>Черновик</>)}
            {isDirty && saveState !== 'saving' && saveState !== 'error' && (<>Есть несохранённые правки</>)}
          </span>

          {/* Предпросмотр черновика — публичную версию не трогает */}
          <button
            onClick={() => { setPreviewMode(!previewMode); if (!previewMode) markPreviewSeen() }}
            className="mrn-btn mrn-btn--sm mrn-btn--ghost"
            aria-pressed={previewMode}
          >
            {previewMode ? <EyeOff size={14} /> : <Eye size={14} />}
            <span className="hidden md:inline">{previewMode ? 'Редактор' : 'Предпросмотр'}</span>
          </button>

          {project.published && (
            <a
              href={`/${project.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mrn-btn mrn-btn--sm mrn-btn--ghost hidden md:inline-flex"
            >
              <Globe size={14} /> Открыть сайт
            </a>
          )}

          <button
            onClick={() => handleSave()}
            disabled={saving || !isDirty}
            className="mrn-btn mrn-btn--sm mrn-btn--secondary"
          >
            <Save size={14} />
            <span className="hidden sm:inline">Сохранить</span>
          </button>

          {/* Публикация — единственное действие, меняющее то, что видят гости */}
          <button
            onClick={handlePublish}
            disabled={publishing}
            className="mrn-btn mrn-btn--sm mrn-btn--primary"
          >
            {publishing ? (
              <span className="w-3.5 h-3.5 border border-current border-t-transparent rounded-full animate-spin" />
            ) : (
              <Globe size={14} />
            )}
            <span>
              {publishing
                ? 'Публикуем…'
                : project.published
                  ? 'Опубликовать изменения'
                  : 'Опубликовать'}
            </span>
          </button>
        </div>
      </div>

      {/* Правки сохранены в черновике, но гости пока видят прошлую версию */}
      {project.published && (hasUnpublishedChanges(project) || isDirty) && (
        <div
          className="flex flex-wrap items-center gap-x-3 gap-y-1"
          style={{
            padding: '10px clamp(12px, 3vw, 20px)',
            background: 'var(--color-blush)',
            borderBottom: '1px solid var(--mrn-line)',
            fontSize: 13,
          }}
          role="status"
        >
          <strong style={{ color: 'var(--color-wine)', fontWeight: 600 }}>
            Есть неопубликованные изменения
          </strong>
          <span style={{ color: 'var(--color-ink-600)' }}>
            Гости видят версию от {formatMoment(project.published_at) ?? 'прошлой публикации'}
          </span>
        </div>
      )}

      <PublishPanel
        open={publishPanel}
        slug={project.slug}
        publishedAt={project.published_at}
        firstTime={publishedFirstTime}
        onClose={() => setPublishPanel(false)}
      />

      {/* Main layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar (desktop) */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 280, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="hidden md:block flex-shrink-0 border-r border-paper-3 overflow-hidden"
              style={{ width: 280 }}
            >
              <EditorSidebar project={project} projectId={project.id} {...sidebarProps} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Preview canvas */}
        <div className="flex-1 overflow-auto bg-paper-2 flex items-start justify-center p-4 md:p-8" data-lenis-prevent>
          <div
            className={`bg-white shadow-2xl overflow-hidden transition-all duration-300 ${viewMode === 'mobile' ? 'rounded-[2rem]' : 'rounded-xl'}`}
            style={{
              width: viewMode === 'mobile' ? 390 : '100%',
              maxWidth: viewMode === 'desktop' ? 1200 : 390,
              minHeight: '100vh',
              ...(viewMode === 'mobile' ? { boxShadow: '0 0 0 12px #16130F, 0 40px 80px rgba(0,0,0,0.4)' } : {}),
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
              buttonStyleFallback={acctBtn}
              imageStyleFallback={acctImg}
            />
          </div>
        </div>
      </div>

      {/* Mobile sidebar — bottom sheet */}
      <AnimatePresence>
        {sidebarOpen && (
          <div className="md:hidden fixed inset-0 z-40">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
            <motion.div
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 32, stiffness: 300 }}
              className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-2xl z-50"
              style={{ maxHeight: '72dvh' }}
            >
              <div className="flex justify-center pt-3 pb-1">
                <div className="w-9 h-1 bg-paper-3 rounded-full" />
              </div>
              <div className="flex items-center justify-between px-4 py-2 border-b border-paper-3">
                <span className="font-medium text-[#16130F] text-sm">⚙️ Настройки сайта</span>
                <button onClick={() => setSidebarOpen(false)} className="p-1.5 rounded-lg hover:bg-paper-2 transition-colors">
                  <X size={16} className="text-ink-400" />
                </button>
              </div>
              <div className="overflow-y-auto overscroll-contain" style={{ maxHeight: 'calc(72dvh - 72px)' }} data-lenis-prevent>
                <EditorSidebar project={project} projectId={project.id} {...sidebarProps} />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Mobile FAB */}
      <button onClick={() => setSidebarOpen(true)}
        className="md:hidden fixed bottom-5 right-4 z-30 flex items-center gap-2 px-4 py-3 rounded-2xl text-white text-sm font-medium shadow-xl active:scale-95 transition-transform"
        style={{ background: 'linear-gradient(135deg, #6E2B34, #4A1A22)' }}>
        ⚙️ Настройки
      </button>

      {/* Block library */}
      <BlockLibraryModal
        open={libraryOpen}
        colors={project.colors}
        fonts={project.fonts}
        plan={plan}
        onClose={() => setLibraryOpen(false)}
        onAdd={handleAddFromCatalog}
      />

      {/* Delete confirm */}
      <DeleteConfirm
        open={!!deleteTarget}
        blockName={deleteTarget ? (typeof deleteTarget.content?.title === 'string' && deleteTarget.content.title.trim() ? deleteTarget.content.title : undefined) : undefined}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  )
}
