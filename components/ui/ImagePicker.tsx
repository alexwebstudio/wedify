'use client'
import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { X, Upload, Check, RotateCcw, Trash2 } from 'lucide-react'
import { uploadMedia } from '@/lib/projects'
import { logError, reportError } from '@/lib/errors'
import { PLACEHOLDER_PRESETS } from '@/lib/placeholders'
import {
  ImageValidationError,
  formatBytes,
  prepareImage,
  type PreparedImage,
} from '@/lib/imageProcessing'
import toast from 'react-hot-toast'

// Нейтральные свадебные подложки по категориям — без случайных стоковых фото.
const PRESET_IMAGES = PLACEHOLDER_PRESETS

interface ImagePickerProps {
  onSelect: (url: string) => void
  onClose: () => void
  userId?: string
  projectId?: string
  /** Текущее изображение блока — чтобы его можно было заменить или убрать. */
  currentUrl?: string
}

type UploadState = 'idle' | 'preparing' | 'uploading' | 'error'

export function ImagePicker({ onSelect, onClose, userId, projectId, currentUrl }: ImagePickerProps) {
  const [selected, setSelected] = useState<string | null>(null)
  const [tab, setTab] = useState<'preset' | 'upload'>('preset')
  const [state, setState] = useState<UploadState>('idle')
  const [error, setError] = useState('')
  /** Подготовленный файл и его превью — показываем до отправки на сервер. */
  const [prepared, setPrepared] = useState<PreparedImage | null>(null)
  const [previewUrl, setPreviewUrl] = useState('')

  const fileRef = useRef<HTMLInputElement>(null)

  // Модальное окно закрывается по Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  // Объектные ссылки нужно освобождать, иначе браузер держит файл в памяти
  useEffect(() => () => { if (previewUrl) URL.revokeObjectURL(previewUrl) }, [previewUrl])

  const fileToDataUrl = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })

  /** Шаг 1: проверка и сжатие. Ничего никуда не отправляем — сначала показываем результат. */
  const handleFile = async (file: File | undefined) => {
    if (!file) return
    setError('')
    setState('preparing')
    try {
      const result = await prepareImage(file)
      if (previewUrl) URL.revokeObjectURL(previewUrl)
      setPrepared(result)
      setPreviewUrl(URL.createObjectURL(result.file))
      setState('idle')
    } catch (err) {
      setState('error')
      setError(
        err instanceof ImageValidationError
          ? err.message
          : 'Не удалось прочитать файл. Попробуйте другой снимок',
      )
      if (!(err instanceof ImageValidationError)) {
        logError(err, { action: 'media.prepare', meta: { size: file.size, type: file.type } })
      }
    }
  }

  /** Шаг 2: отправка. Вызывается кнопкой — и ею же повторяется после ошибки. */
  const handleUpload = async () => {
    if (!prepared) return
    setError('')
    setState('uploading')

    const hasSupabase =
      !!userId && !!projectId &&
      !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
      !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder')

    try {
      if (hasSupabase) {
        const url = await uploadMedia(prepared.file, userId!, projectId!)
        onSelect(url)
        onClose()
        return
      }
      // Без хранилища сохраняем как data-URL: он тоже постоянный и открывается
      // по опубликованной ссылке, в отличие от blob:
      onSelect(await fileToDataUrl(prepared.file))
      onClose()
    } catch (err) {
      logError(err, { action: 'media.upload', meta: { bytes: prepared.bytes } })
      try {
        onSelect(await fileToDataUrl(prepared.file))
        onClose()
      } catch (fallbackErr) {
        setState('error')
        setError('Не удалось загрузить фото. Проверьте соединение и попробуйте ещё раз')
        reportError(fallbackErr, { action: 'media.upload.fallback' }, 'Не удалось загрузить фото')
      }
    }
  }

  const resetFile = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setPrepared(null)
    setPreviewUrl('')
    setState('idle')
    setError('')
    if (fileRef.current) fileRef.current.value = ''
  }

  const busy = state === 'preparing' || state === 'uploading'

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-4 bg-black/60"
      role="dialog"
      aria-modal="true"
      aria-label="Выбор изображения"
      data-lenis-prevent
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="mrn-card w-full max-w-lg overflow-hidden"
        style={{ boxShadow: 'var(--mrn-shadow-lift)', paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid var(--mrn-line)' }}>
          <h3 className="mrn-h3" style={{ fontSize: 19 }}>Изображение</h3>
          <button onClick={onClose} className="mrn-icon-btn" aria-label="Закрыть">
            <X size={18} />
          </button>
        </div>

        <div className="flex" style={{ borderBottom: '1px solid var(--mrn-line)' }} role="tablist">
          {[
            { key: 'preset', label: 'Готовые подложки' },
            { key: 'upload', label: 'Своё фото' },
          ].map((t) => (
            <button
              key={t.key}
              role="tab"
              aria-selected={tab === t.key}
              onClick={() => setTab(t.key as 'preset' | 'upload')}
              className="flex-1 text-sm font-medium transition-colors"
              style={{
                minHeight: 48,
                color: tab === t.key ? 'var(--color-wine)' : 'var(--color-ink-400)',
                boxShadow: tab === t.key ? 'inset 0 -2px 0 var(--color-wine)' : 'none',
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="p-4">
          {tab === 'preset' ? (
            <>
              <p className="mrn-meta" style={{ fontSize: 12.5, marginBottom: 12 }}>
                Тональные подложки в палитре шаблона. Пригодятся, пока нет своих снимков.
              </p>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-64 overflow-y-auto">
                {PRESET_IMAGES.map((img) => (
                  <button
                    key={img.url}
                    onClick={() => setSelected(img.url)}
                    aria-pressed={selected === img.url}
                    className="relative aspect-square rounded-xl overflow-hidden group transition-all"
                    style={{
                      outline: selected === img.url ? '2px solid var(--color-wine)' : '1px solid var(--mrn-line)',
                      outlineOffset: selected === img.url ? -2 : -1,
                    }}
                  >
                    <img src={img.url} alt={img.label} className="w-full h-full object-cover" loading="lazy" />
                    {selected === img.url && (
                      <span
                        className="absolute top-1.5 right-1.5 flex items-center justify-center"
                        style={{ width: 22, height: 22, borderRadius: 999, background: 'var(--color-wine)' }}
                      >
                        <Check size={12} color="#fff" aria-hidden="true" />
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </>
          ) : prepared ? (
            /* Подготовленный снимок: видно, что именно уйдёт на сайт */
            <div>
              <div
                className="relative overflow-hidden"
                style={{ borderRadius: 'var(--radius-sm)', border: '1px solid var(--mrn-line)', aspectRatio: '16 / 10' }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={previewUrl} alt="Загружаемое фото" className="w-full h-full object-cover" />
              </div>

              <p className="mrn-meta" style={{ fontSize: 12.5, marginTop: 10 }}>
                {prepared.bytes < prepared.originalBytes ? (
                  <>
                    Подготовлено: {formatBytes(prepared.originalBytes)} → <strong>{formatBytes(prepared.bytes)}</strong>
                    {prepared.width > 0 && <> · {prepared.width}×{prepared.height} px</>}
                    . Сайт будет открываться быстрее.
                  </>
                ) : (
                  <>Размер {formatBytes(prepared.bytes)} — сжимать не потребовалось.</>
                )}
              </p>

              {error && (
                <p
                  role="alert"
                  style={{
                    marginTop: 12, fontSize: 13.5, lineHeight: 1.5, color: 'var(--color-wine)',
                    background: 'var(--color-blush-soft)', border: '1px solid rgba(110, 43, 52, 0.2)',
                    borderRadius: 'var(--radius-sm)', padding: '11px 13px',
                  }}
                >
                  {error}
                </p>
              )}

              <div className="flex flex-wrap gap-2" style={{ marginTop: 14 }}>
                <button onClick={handleUpload} disabled={busy} className="mrn-btn mrn-btn--sm mrn-btn--primary">
                  {state === 'uploading'
                    ? 'Загружаем…'
                    : state === 'error'
                      ? <><RotateCcw size={15} aria-hidden="true" /> Попробовать снова</>
                      : 'Поставить это фото'}
                </button>
                <button onClick={resetFile} disabled={busy} className="mrn-btn mrn-btn--sm mrn-btn--secondary">
                  Выбрать другое
                </button>
              </div>
            </div>
          ) : (
            <div>
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                onDragOver={(e) => { e.preventDefault() }}
                onDrop={(e) => { e.preventDefault(); handleFile(e.dataTransfer.files?.[0]) }}
                className="w-full text-center transition-all"
                style={{
                  border: '1px dashed var(--mrn-line-strong)',
                  borderRadius: 'var(--radius-sm)',
                  padding: 'clamp(28px, 8vw, 40px) 20px',
                  background: 'var(--color-paper-2)',
                  cursor: 'pointer',
                }}
              >
                {state === 'preparing' ? (
                  <span className="flex flex-col items-center gap-3">
                    <span
                      className="animate-spin"
                      style={{ width: 28, height: 28, border: '2px solid var(--color-wine)', borderTopColor: 'transparent', borderRadius: 999 }}
                    />
                    <span className="mrn-meta">Готовим снимок…</span>
                  </span>
                ) : (
                  <span className="flex flex-col items-center gap-3">
                    <span
                      className="flex items-center justify-center"
                      style={{ width: 48, height: 48, borderRadius: 999, background: 'var(--color-blush-soft)', color: 'var(--color-wine)' }}
                    >
                      <Upload size={20} aria-hidden="true" />
                    </span>
                    <span>
                      <span className="block" style={{ fontSize: 15, fontWeight: 500 }}>
                        Выбрать фото
                      </span>
                      <span className="mrn-meta block" style={{ fontSize: 12.5, marginTop: 4 }}>
                        JPG, PNG или WebP до 12 МБ. Крупные снимки уменьшим автоматически
                      </span>
                    </span>
                  </span>
                )}
              </button>

              {error && (
                <p
                  role="alert"
                  style={{
                    marginTop: 12, fontSize: 13.5, lineHeight: 1.5, color: 'var(--color-wine)',
                    background: 'var(--color-blush-soft)', border: '1px solid rgba(110, 43, 52, 0.2)',
                    borderRadius: 'var(--radius-sm)', padding: '11px 13px',
                  }}
                >
                  {error}
                </p>
              )}

              {/* Убрать текущее фото блока: раньше поставленный снимок нельзя было снять */}
              {currentUrl && (
                <button
                  onClick={() => { onSelect(''); onClose() }}
                  className="mrn-btn mrn-btn--sm mrn-btn--ghost"
                  style={{ marginTop: 12, color: 'var(--color-wine)', paddingInline: 0 }}
                >
                  <Trash2 size={15} aria-hidden="true" /> Убрать фото из блока
                </button>
              )}

              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFile(e.target.files?.[0])}
              />
            </div>
          )}
        </div>

        {tab === 'preset' && (
          <div className="px-4 pb-4 flex gap-2">
            <button onClick={onClose} className="mrn-btn mrn-btn--sm mrn-btn--secondary" style={{ flex: 1 }}>
              Отмена
            </button>
            <button
              onClick={() => { if (selected) { onSelect(selected); onClose() } }}
              disabled={!selected}
              className="mrn-btn mrn-btn--sm mrn-btn--primary"
              style={{ flex: 1 }}
            >
              Выбрать
            </button>
          </div>
        )}
      </motion.div>
    </div>
  )
}
