'use client'
import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Upload, Check, Image as ImageIcon } from 'lucide-react'
import { uploadMedia } from '@/lib/projects'
import { PLACEHOLDER_PRESETS } from '@/lib/placeholders'
import toast from 'react-hot-toast'

// Красивые нейтральные свадебные заглушки (по категориям) — без случайных стоковых фото.
const PRESET_IMAGES = PLACEHOLDER_PRESETS

interface ImagePickerProps {
  onSelect: (url: string) => void
  onClose: () => void
  userId?: string
  projectId?: string
}

export function ImagePicker({ onSelect, onClose, userId, projectId }: ImagePickerProps) {
  const [selected, setSelected] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [tab, setTab] = useState<'preset' | 'upload'>('preset')
  const fileRef = useRef<HTMLInputElement>(null)

  // Конвертация файла в base64 data-URL — он сохраняется в БД и
  // открывается по опубликованной ссылке на любом устройстве
  // (в отличие от blob:-ссылки, которая жила только в этом браузере).
  const fileToDataUrl = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      toast.error('Можно загружать только изображения')
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error('Файл больше 10MB — выберите фото поменьше')
      return
    }

    setUploading(true)
    const hasSupabase =
      !!userId && !!projectId &&
      !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
      !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder')

    try {
      if (hasSupabase) {
        // Основной путь: реальная загрузка в Storage → постоянная ссылка
        const url = await uploadMedia(file, userId!, projectId!)
        onSelect(url)
        onClose()
        return
      }
      // Нет Supabase → сохраняем как data-URL (тоже постоянный, работает по ссылке)
      const dataUrl = await fileToDataUrl(file)
      onSelect(dataUrl)
      onClose()
    } catch (err) {
      console.warn('Upload to storage failed, fallback to data-URL:', err)
      try {
        // ВАЖНО: fallback именно в base64, НЕ в blob: — иначе у гостей будет «?»
        const dataUrl = await fileToDataUrl(file)
        onSelect(dataUrl)
        onClose()
      } catch {
        toast.error('Не удалось загрузить фото. Попробуйте другое.')
      }
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 30 }}
        className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-paper-3">
          <h3 className="font-semibold text-[#16130F]" style={{ fontFamily: 'var(--font-display)', fontSize: 20 }}>
            Выбрать изображение
          </h3>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-paper-2 transition-colors">
            <X size={18} className="text-ink-400" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-paper-3">
          {[
            { key: 'preset', label: '✨ Готовые' },
            { key: 'upload', label: '📸 Загрузить своё' },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key as 'preset' | 'upload')}
              className={`flex-1 py-3 text-sm font-medium transition-colors ${
                tab === t.key
                  ? 'text-[#6E2B34] border-b-2 border-[#6E2B34]'
                  : 'text-ink-400 hover:text-ink-700'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="p-4">
          {tab === 'preset' ? (
            <>
              <p className="text-xs text-ink-400 mb-3">Нажмите на фото чтобы выбрать</p>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-64 overflow-y-auto">
                {PRESET_IMAGES.map((img) => (
                  <button
                    key={img.url}
                    onClick={() => setSelected(img.url)}
                    className={`relative aspect-square rounded-xl overflow-hidden group ring-2 transition-all ${
                      selected === img.url ? 'ring-[#6E2B34] scale-95' : 'ring-transparent hover:ring-[#6E2B34]/50'
                    }`}
                  >
                    <img
                      src={img.url}
                      alt={img.label}
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                      loading="lazy"
                    />
                    {selected === img.url && (
                      <div className="absolute inset-0 bg-[#6E2B34]/40 flex items-center justify-center">
                        <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center">
                          <Check size={14} className="text-[#6E2B34]" />
                        </div>
                      </div>
                    )}
                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/50 to-transparent py-1 px-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <p className="text-white text-[9px] font-medium truncate">{img.label}</p>
                    </div>
                  </button>
                ))}
              </div>
            </>
          ) : (
            <div>
              <div
                onClick={() => fileRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); e.currentTarget.classList.add('border-[#6E2B34]', 'bg-[#6E2B34]/5') }}
                onDragLeave={(e) => { e.currentTarget.classList.remove('border-[#6E2B34]', 'bg-[#6E2B34]/5') }}
                onDrop={(e) => {
                  e.preventDefault()
                  e.currentTarget.classList.remove('border-[#6E2B34]', 'bg-[#6E2B34]/5')
                  const file = e.dataTransfer.files[0]
                  if (file && file.type.startsWith('image/')) {
                    const fakeEvent = { target: { files: [file] } } as unknown as React.ChangeEvent<HTMLInputElement>
                    handleUpload(fakeEvent)
                  }
                }}
                className="border-2 border-dashed border-[#6E2B34]/30 rounded-xl p-10 text-center cursor-pointer hover:border-[#6E2B34] hover:bg-[#6E2B34]/5 transition-all"
              >
                {uploading ? (
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-2 border-[#6E2B34] border-t-transparent rounded-full animate-spin" />
                    <p className="text-sm text-ink-400">Загружаем...</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-[#6E2B34]/10 flex items-center justify-center">
                      <Upload size={20} className="text-[#6E2B34]" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#16130F]">Нажмите или перетащите</p>
                      <p className="text-xs text-ink-400 mt-1">JPG, PNG, WebP до 10MB</p>
                    </div>
                  </div>
                )}
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {tab === 'preset' && (
          <div className="px-4 pb-4 flex gap-2">
            <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-paper-3 text-sm font-medium text-ink-600 hover:bg-paper-2 transition-colors">
              Отмена
            </button>
            <button
              onClick={() => { if (selected) { onSelect(selected); onClose() } }}
              disabled={!selected}
              className="flex-1 py-2.5 rounded-xl text-sm font-medium text-white transition-all disabled:opacity-40"
              style={{ background: selected ? 'linear-gradient(135deg, #6E2B34, #4A1A22)' : '#ccc' }}
            >
              Выбрать
            </button>
          </div>
        )}
      </motion.div>
    </div>
  )
}
