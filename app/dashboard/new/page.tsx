'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ArrowRight, Check, Heart } from 'lucide-react'
import Link from 'next/link'
import { Navbar } from '@/components/ui/Navbar'
import { useAuth } from '@/lib/hooks/useAuth'
import { useAppStore } from '@/lib/store'
import { createProject } from '@/lib/projects'
import type { TemplateId, Language } from '@/types'
import toast from 'react-hot-toast'

const TEMPLATES: { id: TemplateId; name: string; desc: string; bg: string; bg2: string; accent: string; text: string }[] = [
  {
    id: 'classic-luxury',
    name: 'Classic Luxury',
    desc: 'Золото, кремовые тона, изысканная типографика',
    bg: '#FAF8F5', bg2: '#F5EDD6', accent: '#C4A97D', text: '#2C2017',
  },
  {
    id: 'minimal-white',
    name: 'Minimal White',
    desc: 'Чистота, лаконичность, современный стиль',
    bg: '#FFFFFF', bg2: '#F5F5F5', accent: '#1A1A1A', text: '#1A1A1A',
  },
  {
    id: 'dark-elegant',
    name: 'Dark Elegant',
    desc: 'Тёмный фон, золотые акценты, кинематографичность',
    bg: '#1C1812', bg2: '#3D3025', accent: '#D4AF7A', text: '#F0E8D8',
  },
  {
    id: 'sage-garden',
    name: 'Sage Garden',
    desc: 'Природные тона, шалфей, тепло',
    bg: '#F5F7F0', bg2: '#DDE4D2', accent: '#7E8E6A', text: '#2D3520',
  },
  {
    id: 'rose-blush',
    name: 'Rose Blush',
    desc: 'Нежные розовые тона, романтика',
    bg: '#FFF8FA', bg2: '#FCF0F4', accent: '#D4829A', text: '#2A1520',
  },
]

export default function NewProjectPage() {
  const [step, setStep] = useState<1 | 2>(1)
  const [template, setTemplate] = useState<TemplateId>('classic-luxury')
  const [title, setTitle] = useState('')
  const [language, setLanguage] = useState<Language>('ru')
  const [loading, setLoading] = useState(false)

  const { user } = useAuth()
  const { t } = useAppStore()
  const router = useRouter()

  const handleCreate = async () => {
    if (!user) { router.push('/auth/login'); return }
    if (!title.trim()) { toast.error('Введите название'); return }
    setLoading(true)
    try {
      const project = await createProject(user.id, title.trim(), template, language)
      toast.success('Приглашение создано! 🎉')
      router.push(`/dashboard/edit/${project.id}`)
    } catch (err: unknown) {
      toast.error((err as Error).message || 'Ошибка')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      <Navbar dark={false} />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-24 pb-20">
        {/* Back */}
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm text-[#2C2017]/50 hover:text-[#2C2017] mb-8 transition-colors">
          <ArrowLeft size={14} /> Назад
        </Link>

        {/* Steps indicator */}
        <div className="flex items-center gap-3 mb-10">
          {[1, 2].map((s) => (
            <div key={s} className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                step > s ? 'bg-[#C4A97D] text-white' :
                step === s ? 'bg-[#2C2017] text-white' :
                'bg-gray-100 text-gray-400'
              }`}>
                {step > s ? <Check size={14} /> : s}
              </div>
              <span className={`text-sm ${step === s ? 'text-[#2C2017] font-medium' : 'text-gray-400'}`}>
                {s === 1 ? 'Шаблон' : 'Детали'}
              </span>
              {s < 2 && <div className="w-8 h-px bg-gray-200 ml-0" />}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* Step 1: Choose template */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
            >
              <h1 className="text-3xl md:text-4xl font-light text-[#2C2017] mb-2"
                style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                Выберите шаблон
              </h1>
              <p className="text-[#2C2017]/40 text-sm mb-8">Всё можно изменить позже в редакторе</p>

              <div className="grid md:grid-cols-3 gap-5">
                {TEMPLATES.map((tpl) => (
                  <button
                    key={tpl.id}
                    onClick={() => setTemplate(tpl.id)}
                    className={`template-card text-left transition-all ${template === tpl.id ? 'selected' : ''}`}
                  >
                    {/* Preview */}
                    <div className="aspect-[3/4] relative flex items-center justify-center overflow-hidden"
                      style={{ background: `linear-gradient(135deg, ${tpl.bg}, ${tpl.bg2})` }}>
                      <div className="text-center px-4">
                        <div className="w-6 h-px mx-auto mb-4" style={{ background: tpl.accent }} />
                        <p className="text-2xl font-light mb-0.5" style={{ color: tpl.text, fontFamily: 'Cormorant Garamond, serif' }}>
                          Камила
                        </p>
                        <p className="text-sm mb-0.5" style={{ color: tpl.accent }}>✦</p>
                        <p className="text-2xl font-light" style={{ color: tpl.text, fontFamily: 'Cormorant Garamond, serif' }}>
                          Арман
                        </p>
                        <div className="w-6 h-px mx-auto mt-4" style={{ background: tpl.accent }} />
                        <p className="text-xs mt-3 tracking-widest uppercase opacity-40" style={{ color: tpl.text }}>
                          15.08.2026
                        </p>
                      </div>
                      {/* Selected overlay */}
                      {template === tpl.id && (
                        <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-[#C4A97D] flex items-center justify-center shadow-lg">
                          <Check size={14} className="text-white" />
                        </div>
                      )}
                    </div>
                    <div className="p-4 bg-white">
                      <p className="font-semibold text-[#2C2017]" style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 17 }}>
                        {tpl.name}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">{tpl.desc}</p>
                    </div>
                  </button>
                ))}
              </div>

              <div className="mt-8 flex justify-end">
                <button
                  onClick={() => setStep(2)}
                  className="btn-luxury px-8 py-3 rounded-xl font-medium inline-flex items-center gap-2 group"
                >
                  <span className="flex items-center gap-2">
                    Далее <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </span>
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 2: Title & language */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
              className="max-w-lg"
            >
              <h1 className="text-3xl md:text-4xl font-light text-[#2C2017] mb-2"
                style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                Последний шаг
              </h1>
              <p className="text-[#2C2017]/40 text-sm mb-8">Заполните основные данные</p>

              <div className="space-y-6">
                {/* Title */}
                <div>
                  <label className="block text-xs uppercase tracking-widest text-[#2C2017]/40 mb-2">
                    Название приглашения
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Например: Айгерим и Дамир"
                    className="input-luxury text-[#2C2017] text-lg"
                    autoFocus
                    onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
                  />
                  {title && (
                    <p className="text-xs text-[#2C2017]/40 mt-2">
                      Ссылка будет: <span className="font-mono text-[#C4A97D]">
                        site.com/{title.toLowerCase().replace(/[^a-zA-Zа-яА-Я0-9\s]/g, '').replace(/\s+/g, '-').substring(0, 30)}
                      </span>
                    </p>
                  )}
                </div>

                {/* Language */}
                <div>
                  <label className="block text-xs uppercase tracking-widest text-[#2C2017]/40 mb-3">
                    Язык сайта
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {([['ru', '🇷🇺', 'Русский'], ['kz', '🇰🇿', 'Қазақша']] as const).map(([code, flag, name]) => (
                      <button
                        key={code}
                        onClick={() => setLanguage(code)}
                        className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                          language === code
                            ? 'border-[#C4A97D] bg-[#C4A97D]/5'
                            : 'border-gray-100 hover:border-[#C4A97D]/30'
                        }`}
                      >
                        <span className="text-2xl">{flag}</span>
                        <div className="text-left">
                          <p className="text-sm font-medium text-[#2C2017]">{name}</p>
                        </div>
                        {language === code && (
                          <Check size={14} className="text-[#C4A97D] ml-auto" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Selected template preview */}
                <div className="p-4 rounded-xl bg-[#C4A97D]/5 border border-[#C4A97D]/15 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0"
                    style={{ background: `linear-gradient(135deg, ${TEMPLATES.find(t => t.id === template)?.bg}, ${TEMPLATES.find(t => t.id === template)?.bg2})` }}>
                    <div className="w-full h-full flex items-center justify-center">
                      <Heart size={16} style={{ color: TEMPLATES.find(t => t.id === template)?.accent }} />
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-[#2C2017]/40 uppercase tracking-widest">Выбранный шаблон</p>
                    <p className="text-sm font-medium text-[#2C2017]">{TEMPLATES.find(t => t.id === template)?.name}</p>
                  </div>
                  <button onClick={() => setStep(1)} className="ml-auto text-xs text-[#C4A97D] hover:underline">
                    Изменить
                  </button>
                </div>
              </div>

              <div className="mt-8 flex items-center justify-between">
                <button onClick={() => setStep(1)}
                  className="flex items-center gap-2 text-sm text-[#2C2017]/50 hover:text-[#2C2017] transition-colors">
                  <ArrowLeft size={14} /> Назад
                </button>
                <button
                  onClick={handleCreate}
                  disabled={loading || !title.trim()}
                  className="btn-luxury px-8 py-3 rounded-xl font-medium inline-flex items-center gap-2 disabled:opacity-50 group"
                >
                  <span className="flex items-center gap-2">
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                        Создаём...
                      </>
                    ) : (
                      <>
                        Создать сайт
                        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}
