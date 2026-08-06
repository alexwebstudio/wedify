'use client'
import { Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ArrowRight, Check, Eye, Plus } from 'lucide-react'
import Link from 'next/link'
import { Navbar } from '@/components/ui/Navbar'
import { useAuth } from '@/lib/hooks/useAuth'
import { useAppStore } from '@/lib/store'
import { usePlan, PLAN_META } from '@/lib/subscription'
import { createProject, getProjects } from '@/lib/projects'
import { ACTIVE_TEMPLATES, CATALOG_FONT_FAMILIES, DEFAULT_TEMPLATE_ID, getTemplate, type TemplateEntry } from '@/lib/templateCatalog'
import { TemplatePreview } from '@/components/templates/TemplatePreview'
import { TemplateDemoModal } from '@/components/templates/TemplateDemoModal'
import { SiteFonts } from '@/components/providers/SiteFonts'
import type { TemplateId, Language } from '@/types'
import toast from 'react-hot-toast'

function NewProjectForm() {
  const searchParams = useSearchParams()
  // Шаблон, выбранный в каталоге (?template=...), — иначе выбор пользователя терялся
  const preselected = searchParams.get('template')
  const initialTemplate = ACTIVE_TEMPLATES.some((t) => t.id === preselected)
    ? (preselected as TemplateId)
    : DEFAULT_TEMPLATE_ID

  const [step, setStep] = useState<1 | 2>(1)
  const [template, setTemplate] = useState<TemplateId>(initialTemplate)
  // «Собрать самостоятельно»: сайт создаётся только с главным экраном и подвалом
  const [blank, setBlank] = useState(false)
  const [demo, setDemo] = useState<TemplateEntry | null>(null)
  const [title, setTitle] = useState('')
  const [language, setLanguage] = useState<Language>('ru')
  const [loading, setLoading] = useState(false)

  // Основные данные молодожёнов (подставятся во все блоки)
  const [bride, setBride] = useState('')
  const [groom, setGroom] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('16:00')
  const [showMore, setShowMore] = useState(false)
  const [venue, setVenue] = useState('')
  const [address, setAddress] = useState('')
  const [mapUrl, setMapUrl] = useState('')
  const [dresscode, setDresscode] = useState('')
  const [contactName, setContactName] = useState('')
  const [contactPhone, setContactPhone] = useState('')
  const [gifts, setGifts] = useState('')
  const [instagram, setInstagram] = useState('')
  const [telegram, setTelegram] = useState('')
  const [whatsapp, setWhatsapp] = useState('')

  const { user } = useAuth()
  const { plan } = usePlan()
  const { t } = useAppStore()
  const router = useRouter()

  const SITE_LIMIT = plan === 'premium' ? 3 : plan === 'standard' ? 2 : 1

  const autoTitle = title.trim() || [bride.trim(), groom.trim()].filter(Boolean).join(' и ')

  const handleCreate = async () => {
    if (!user) { router.push('/auth/login'); return }
    if (!bride.trim() || !groom.trim()) { toast.error('Укажите имена молодожёнов'); return }
    if (!date) { toast.error('Укажите дату свадьбы'); return }
    const finalTitle = autoTitle
    if (!finalTitle) { toast.error('Введите название'); return }
    setLoading(true)
    try {
      const existing = await getProjects(user.id)
      if (existing.length >= SITE_LIMIT) {
        toast.error(`На тарифе «${PLAN_META[plan].label}» доступно сайтов: ${SITE_LIMIT}. ${plan !== 'premium' ? 'Оформите тариф выше или удалите один сайт.' : 'Удалите один, чтобы создать новый.'}`)
        setLoading(false)
        return
      }
      const project = await createProject(user.id, finalTitle, template, language, {
        bride: bride.trim(), groom: groom.trim(), date, time,
        venue: venue.trim(), address: address.trim(), mapUrl: mapUrl.trim(), coords: mapUrl.trim(),
        dresscode: dresscode.trim(), contactName: contactName.trim(), contactPhone: contactPhone.trim(),
        gifts: gifts.trim(), instagram: instagram.trim(), telegram: telegram.trim(), whatsapp: whatsapp.trim(),
      }, { blank })
      toast.success('Приглашение создано! 🎉')
      router.push(`/dashboard/edit/${project.id}`)
    } catch (err: unknown) {
      toast.error((err as Error).message || 'Ошибка')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--color-paper-2)' }}>
      <SiteFonts families={CATALOG_FONT_FAMILIES} />
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-24 pb-20">
        {/* Back */}
        <Link href="/dashboard" className="mrn-link inline-flex items-center gap-2 text-sm mb-8" style={{ color: 'var(--color-ink-600)' }}>
          <ArrowLeft size={14} /> Назад
        </Link>

        {/* Steps indicator */}
        <div className="flex items-center gap-3 mb-10">
          {[1, 2].map((s) => (
            <div key={s} className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                step > s ? 'bg-wine text-paper' :
                step === s ? 'bg-ink text-paper' :
                'bg-paper-3 text-ink-400'
              }`}>
                {step > s ? <Check size={14} /> : s}
              </div>
              <span className={`text-sm ${step === s ? 'text-ink font-medium' : 'text-ink-400'}`}>
                {s === 1 ? 'Шаблон' : 'Детали'}
              </span>
              {s < 2 && <div className="w-8 h-px" style={{ background: 'var(--mrn-line-strong)' }} />}
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
              <h1 className="mrn-h2">Выберите шаблон</h1>
              <p className="mrn-lead" style={{ marginTop: 10, marginBottom: 32, fontSize: 15 }}>
                Оформление можно изменить позже в редакторе — выбор ни к чему не обязывает.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {ACTIVE_TEMPLATES.map((tpl) => {
                  const selected = template === tpl.id && !blank
                  return (
                    <div
                      key={tpl.id}
                      className={`template-card mrn-tpl flex flex-col ${selected ? 'selected' : ''}`}
                      style={{ background: 'var(--color-paper)' }}
                    >
                      <div className="relative">
                        <TemplatePreview template={tpl} ratio="3 / 4" />
                        {selected && (
                          <span
                            className="absolute top-3 right-3 flex items-center justify-center"
                            style={{ width: 28, height: 28, borderRadius: 999, background: 'var(--color-wine)', zIndex: 3 }}
                          >
                            <Check size={15} color="#fff" aria-hidden="true" />
                          </span>
                        )}
                      </div>

                      <div className="flex-1 flex flex-col" style={{ padding: '16px 18px 18px', textAlign: 'left' }}>
                        <div className="flex items-start justify-between gap-2">
                          <h2 className="mrn-h3" style={{ fontSize: 17 }}>{tpl.name}</h2>
                          <span className="mrn-tag" style={{ flexShrink: 0 }}>{tpl.formality}</span>
                        </div>
                        <p className="mrn-meta" style={{ marginTop: 6 }}>{tpl.tagline}</p>

                        <ul className="flex flex-wrap gap-1.5" style={{ marginTop: 12, listStyle: 'none', padding: 0 }}>
                          {tpl.tags.map((tag) => (
                            <li key={tag} className="mrn-tag" style={{ borderColor: 'transparent', background: 'var(--color-paper-2)' }}>
                              {tag}
                            </li>
                          ))}
                        </ul>

                        <div
                          className="flex items-center justify-between gap-2"
                          style={{ marginTop: 'auto', paddingTop: 16 }}
                        >
                          <button
                            type="button"
                            onClick={() => setDemo(tpl)}
                            className="mrn-btn mrn-btn--sm mrn-btn--ghost mrn-above"
                          >
                            <Eye size={15} aria-hidden="true" /> Посмотреть демо
                          </button>
                          {/* Растянутая кнопка: выбрать можно кликом по всей карточке */}
                          <button
                            type="button"
                            onClick={() => { setTemplate(tpl.id); setBlank(false) }}
                            aria-pressed={selected}
                            className="mrn-stretch mrn-btn mrn-btn--sm mrn-btn--ghost"
                            style={{ color: 'var(--color-wine)' }}
                          >
                            {selected ? 'Выбран' : 'Выбрать'}
                            <span className="mrn-sr">— дизайн «{tpl.name}»</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Старт без шаблона */}
              <button
                type="button"
                onClick={() => setBlank(true)}
                aria-pressed={blank}
                className={`template-card w-full ${blank ? 'selected' : ''}`}
                style={{
                  marginTop: 16,
                  padding: 'clamp(20px, 3vw, 26px)',
                  background: 'var(--color-paper)',
                  textAlign: 'left',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                  flexWrap: 'wrap',
                }}
              >
                <span
                  aria-hidden="true"
                  style={{
                    width: 44, height: 44, borderRadius: 'var(--radius-sm)',
                    border: '1px dashed var(--mrn-line-strong)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'var(--color-ink-400)', flexShrink: 0,
                  }}
                >
                  <Plus size={20} />
                </span>
                <span style={{ flex: '1 1 220px' }}>
                  <span className="mrn-h3 block" style={{ fontSize: 17 }}>Собрать самостоятельно</span>
                  <span className="mrn-meta block" style={{ marginTop: 4 }}>
                    Главный экран и подвал — остальные блоки добавите в редакторе
                  </span>
                </span>
                {blank && (
                  <span
                    className="flex items-center justify-center"
                    style={{ width: 28, height: 28, borderRadius: 999, background: 'var(--color-wine)' }}
                  >
                    <Check size={15} color="#fff" aria-hidden="true" />
                  </span>
                )}
              </button>

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
              <h1 className="text-3xl md:text-4xl font-light text-[#16130F] mb-2"
                style={{ fontFamily: 'var(--font-display)' }}>
                Последний шаг
              </h1>
              <p className="text-[#16130F]/40 text-sm mb-8">Заполните основные данные</p>

              <div className="space-y-6">
                {/* Имена молодожёнов */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-[#16130F]/40 mb-2">Имя невесты *</label>
                    <input type="text" value={bride} onChange={(e) => setBride(e.target.value)} placeholder="Айгерім" className="input-luxury text-[#16130F]" autoFocus />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-[#16130F]/40 mb-2">Имя жениха *</label>
                    <input type="text" value={groom} onChange={(e) => setGroom(e.target.value)} placeholder="Дамир" className="input-luxury text-[#16130F]" />
                  </div>
                </div>

                {/* Дата и время */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-[#16130F]/40 mb-2">Дата свадьбы *</label>
                    <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="input-luxury text-[#16130F]" />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-[#16130F]/40 mb-2">Время начала *</label>
                    <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="input-luxury text-[#16130F]" />
                  </div>
                </div>

                {/* Название (необязательно) */}
                <div>
                  <label className="block text-xs uppercase tracking-widest text-[#16130F]/40 mb-2">Название приглашения</label>
                  <input type="text" value={title} onChange={(e) => setTitle(e.target.value)}
                    placeholder={autoTitle || 'Например: Айгерім и Дамир'} className="input-luxury text-[#16130F]"
                    onKeyDown={(e) => e.key === 'Enter' && handleCreate()} />
                  {autoTitle && (
                    <p className="text-xs text-[#16130F]/40 mt-2">Ссылка: <span className="font-mono text-[#6E2B34]">site.com/{autoTitle.toLowerCase().replace(/[^a-zA-Zа-яА-Я0-9\s]/g, '').replace(/\s+/g, '-').substring(0, 30)}</span></p>
                  )}
                </div>

                {/* Доп. данные (глобальные переменные сайта) */}
                <div className="rounded-xl border border-paper-3 overflow-hidden">
                  <button type="button" onClick={() => setShowMore((s) => !s)}
                    className="w-full flex items-center justify-between px-4 py-3 text-sm text-[#16130F] hover:bg-paper-2 transition-colors">
                    <span className="font-medium">Детали свадьбы <span className="text-[#16130F]/40 font-normal">— можно заполнить позже</span></span>
                    <span className={`transition-transform ${showMore ? 'rotate-180' : ''}`}>⌄</span>
                  </button>
                  {showMore && (
                    <div className="p-4 pt-0 space-y-3">
                      <p className="text-xs text-[#16130F]/40 leading-relaxed pt-1">Эти данные автоматически подставятся в блоки локации, контактов, подарков и футер.</p>
                      <div className="grid grid-cols-2 gap-3">
                        <input value={venue} onChange={(e) => setVenue(e.target.value)} placeholder="Место (ресторан)" className="input-luxury text-[#16130F] text-sm" />
                        <input value={dresscode} onChange={(e) => setDresscode(e.target.value)} placeholder="Дресс-код" className="input-luxury text-[#16130F] text-sm" />
                      </div>
                      <input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Адрес" className="input-luxury text-[#16130F] text-sm" />
                      <input value={mapUrl} onChange={(e) => setMapUrl(e.target.value)} placeholder="Ссылка на карты / координаты" className="input-luxury text-[#16130F] text-sm" />
                      <div className="grid grid-cols-2 gap-3">
                        <input value={contactName} onChange={(e) => setContactName(e.target.value)} placeholder="Контакт (имя)" className="input-luxury text-[#16130F] text-sm" />
                        <input value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} placeholder="Телефон" className="input-luxury text-[#16130F] text-sm" />
                      </div>
                      <input value={gifts} onChange={(e) => setGifts(e.target.value)} placeholder="Пожелания по подаркам" className="input-luxury text-[#16130F] text-sm" />
                      <div className="grid grid-cols-3 gap-3">
                        <input value={instagram} onChange={(e) => setInstagram(e.target.value)} placeholder="Instagram" className="input-luxury text-[#16130F] text-sm" />
                        <input value={telegram} onChange={(e) => setTelegram(e.target.value)} placeholder="Telegram" className="input-luxury text-[#16130F] text-sm" />
                        <input value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} placeholder="WhatsApp" className="input-luxury text-[#16130F] text-sm" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Language */}
                <div>
                  <label className="block text-xs uppercase tracking-widest text-[#16130F]/40 mb-3">
                    Язык сайта
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {([['ru', '🇷🇺', 'Русский'], ['kz', '🇰🇿', 'Қазақша']] as const).map(([code, flag, name]) => (
                      <button
                        key={code}
                        onClick={() => {
                          if (code === 'kz') { toast('Казахская версия платформы находится в разработке и станет доступна в одном из ближайших обновлений.', { icon: '🇰🇿', duration: 5000 }); return }
                          setLanguage(code)
                        }}
                        className={`relative flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                          language === code
                            ? 'border-[#6E2B34] bg-[#6E2B34]/5'
                            : 'border-paper-3 hover:border-[#6E2B34]/30'
                        } ${code === 'kz' ? 'opacity-70' : ''}`}
                      >
                        <span className="text-2xl">{flag}</span>
                        <div className="text-left">
                          <p className="text-sm font-medium text-[#16130F]">{name}</p>
                          {code === 'kz' && <p className="text-[10px] text-[#6E2B34]">Скоро</p>}
                        </div>
                        {language === code && code === 'ru' && (
                          <Check size={14} className="text-[#6E2B34] ml-auto" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Выбранный шаблон */}
                <div
                  className="flex items-center gap-3"
                  style={{
                    padding: 14,
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--color-paper-2)',
                    border: '1px solid var(--mrn-line)',
                  }}
                >
                  {blank ? (
                    <span
                      aria-hidden="true"
                      className="flex-shrink-0 flex items-center justify-center"
                      style={{
                        width: 44, height: 56, borderRadius: 'var(--radius-xs)',
                        border: '1px dashed var(--mrn-line-strong)', color: 'var(--color-ink-400)',
                      }}
                    >
                      <Plus size={18} />
                    </span>
                  ) : (
                    <div
                      className="flex-shrink-0 overflow-hidden"
                      style={{ width: 44, height: 56, borderRadius: 'var(--radius-xs)' }}
                    >
                      <TemplatePreview template={getTemplate(template)} ratio="44 / 56" eager />
                    </div>
                  )}
                  <div>
                    <p className="mrn-eyebrow">{blank ? 'Старт' : 'Выбранный шаблон'}</p>
                    <p style={{ fontSize: 15, fontWeight: 500, marginTop: 4 }}>
                      {blank ? 'Собрать самостоятельно' : getTemplate(template).name}
                    </p>
                  </div>
                  <button
                    onClick={() => setStep(1)}
                    className="mrn-btn mrn-btn--sm mrn-btn--ghost"
                    style={{ marginLeft: 'auto' }}
                  >
                    Изменить
                  </button>
                </div>
              </div>

              <div className="mt-8 flex items-center justify-between">
                <button onClick={() => setStep(1)}
                  className="flex items-center gap-2 text-sm text-[#16130F]/50 hover:text-[#16130F] transition-colors">
                  <ArrowLeft size={14} /> Назад
                </button>
                <button
                  onClick={handleCreate}
                  disabled={loading || !bride.trim() || !groom.trim() || !date}
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

      <TemplateDemoModal
        template={demo}
        onClose={() => setDemo(null)}
        onChoose={(tpl) => { setTemplate(tpl.id); setBlank(false) }}
      />
    </div>
  )
}

/**
 * useSearchParams требует границы Suspense — иначе страница не проходит
 * пререндер при сборке. Шаблон приходит из каталога параметром ?template=.
 */
export default function NewProjectPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen" style={{ background: 'var(--color-paper-2)' }}>
          <Navbar />
        </div>
      }
    >
      <NewProjectForm />
    </Suspense>
  )
}
