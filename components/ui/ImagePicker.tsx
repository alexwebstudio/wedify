'use client'
import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Upload, Check, Image as ImageIcon } from 'lucide-react'
import { uploadMedia } from '@/lib/projects'
import toast from 'react-hot-toast'

const PRESET_IMAGES = [
  { url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600', label: 'Свадьба' },
  { url: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=600', label: 'Цветы' },
  { url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600', label: 'Пара' },
  { url: 'https://images.unsplash.com/photo-1460978812857-470ed1c77af0?w=600', label: 'Кольца' },
  { url: 'https://images.unsplash.com/photo-1470075801209-17f9ec0cada6?w=600', label: 'Ceremony' },
  { url: 'https://images.unsplash.com/photo-1550005809-91ad75fb315f?w=600', label: 'Букет' },
  { url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=600', label: 'Торт' },
  { url: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=600', label: 'Вечер' },
  { url: 'https://images.unsplash.com/photo-1591604021695-0c69b7c05981?w=600', label: 'Поцелуй' },
  { url: 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?w=600', label: 'Платье' },
  { url: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=600', label: 'Детали' },
  { url: 'https://images.unsplash.com/photo-1563195010-3e99c4f2a9a2?w=600', label: 'Танец' },
]

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

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      // If Supabase creds available, upload there; otherwise use local object URL
      if (userId && projectId && process.env.NEXT_PUBLIC_SUPABASE_URL && !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder')) {
        const url = await uploadMedia(file, userId, projectId)
        onSelect(url)
      } else {
        // MVP fallback: use object URL (works locally without Supabase)
        const url = URL.createObjectURL(file)
        onSelect(url)
      }
      onClose()
    } catch {
      // Final fallback
      const url = URL.createObjectURL(file)
      onSelect(url)
      onClose()
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
