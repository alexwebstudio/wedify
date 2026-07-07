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
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h3 className="font-semibold text-[#2C2017]" style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 20 }}>
            Выбрать изображение
          </h3>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
            <X size={18} className="text-gray-500" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-100">
          {[
            { key: 'preset', label: '✨ Готовые' },
            { key: 'upload', label: '📸 Загрузить своё' },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key as 'preset' | 'upload')}
              className={`flex-1 py-3 text-sm font-medium transition-colors ${
                tab === t.key
                  ? 'text-[#C4A97D] border-b-2 border-[#C4A97D]'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="p-4">
          {tab === 'preset' ? (
            <>
              <p className="text-xs text-gray-400 mb-3">Нажмите на фото чтобы выбрать</p>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-64 overflow-y-auto">
                {PRESET_IMAGES.map((img) => (
                  <button
                    key={img.url}
                    onClick={() => setSelected(img.url)}
                    className={`relative aspect-square rounded-xl overflow-hidden group ring-2 transition-all ${
                      selected === img.url ? 'ring-[#C4A97D] scale-95' : 'ring-transparent hover:ring-[#C4A97D]/50'
                    }`}
                  >
                    <img
                      src={img.url}
                      alt={img.label}
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                      loading="lazy"
                    />
                    {selected === img.url && (
                      <div className="absolute inset-0 bg-[#C4A97D]/40 flex items-center justify-center">
                        <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center">
                          <Check size={14} className="text-[#C4A97D]" />
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
                onDragOver={(e) => { e.preventDefault(); e.currentTarget.classList.add('border-[#C4A97D]', 'bg-[#C4A97D]/5') }}
                onDragLeave={(e) => { e.currentTarget.classList.remove('border-[#C4A97D]', 'bg-[#C4A97D]/5') }}
                onDrop={(e) => {
                  e.preventDefault()
                  e.currentTarget.classList.remove('border-[#C4A97D]', 'bg-[#C4A97D]/5')
                  const file = e.dataTransfer.files[0]
                  if (file && file.type.startsWith('image/')) {
                    const fakeEvent = { target: { files: [file] } } as unknown as React.ChangeEvent<HTMLInputElement>
                    handleUpload(fakeEvent)
                  }
                }}
                className="border-2 border-dashed border-[#C4A97D]/30 rounded-xl p-10 text-center cursor-pointer hover:border-[#C4A97D] hover:bg-[#C4A97D]/5 transition-all"
              >
                {uploading ? (
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-2 border-[#C4A97D] border-t-transparent rounded-full animate-spin" />
                    <p className="text-sm text-gray-500">Загружаем...</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-[#C4A97D]/10 flex items-center justify-center">
                      <Upload size={20} className="text-[#C4A97D]" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#2C2017]">Нажмите или перетащите</p>
                      <p className="text-xs text-gray-400 mt-1">JPG, PNG, WebP до 10MB</p>
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
            <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
              Отмена
            </button>
            <button
              onClick={() => { if (selected) { onSelect(selected); onClose() } }}
              disabled={!selected}
              className="flex-1 py-2.5 rounded-xl text-sm font-medium text-white transition-all disabled:opacity-40"
              style={{ background: selected ? 'linear-gradient(135deg, #C4A97D, #8B6F47)' : '#ccc' }}
            >
              Выбрать
            </button>
          </div>
        )}
      </motion.div>
    </div>
  )
}
