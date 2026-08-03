'use client'
import { SiteFooter } from '@/components/landing/SiteFooter'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Navbar } from '@/components/ui/Navbar'
import { Reveal } from '@/components/landing/Reveal'
import { Sparkles, HelpCircle, Rocket, X, Clock, ArrowRight } from 'lucide-react'

type Article = {
  id: string
  icon: typeof Rocket
  tag: string
  title: string
  desc: string
  read: string
  body: { h?: string; p?: string; list?: string[] }[]
}

const ARTICLES: Article[] = [
  {
    id: 'guide',
    icon: Rocket,
    tag: 'Гайд',
    read: '4 мин',
    title: 'Как создать свадебный сайт за 10 минут',
    desc: 'Пошагово: от выбора шаблона до готовой ссылки, которую можно скинуть гостям.',
    body: [
      { p: 'Свадебный сайт-приглашение выглядит дорого, но собирается быстрее, чем кажется. Ниже — весь путь от нуля до готовой ссылки, которую можно разослать гостям в мессенджерах.' },
      { h: '1. Создайте проект' },
      { p: 'Нажмите «Создать сайт», выберите один из шаблонов и задайте название — например, имена пары. Название превращается в аккуратную ссылку вида wedify.site/aigerim-damir. Всё оформление можно поменять позже, поэтому не переживайте о деталях на старте.' },
      { h: '2. Соберите структуру из блоков' },
      { p: 'Редактор устроен как конструктор: сайт складывается из готовых блоков. Откройте библиотеку и добавьте нужное — экран с именами, историю знакомства, таймлайн дня, карту площадки, галерею и форму подтверждения.' },
      { list: [
        'Главный экран — имена, дата и приглашающая фраза',
        'История — как вы познакомились и пришли к свадьбе',
        'Тайминг — расписание церемонии и банкета',
        'Локация — адрес площадки и кнопка на карту',
        'RSVP — форма, через которую гости подтверждают участие',
      ] },
      { h: '3. Замените тексты и фото' },
      { p: 'Кликайте прямо по тексту на превью и печатайте своё — правки видны сразу. Загрузите свои фотографии вместо демонстрационных, чтобы сайт стал по-настоящему вашим.' },
      { h: '4. Настройте стиль' },
      { p: 'На вкладках «Стиль», «Цвета» и «Шрифты» можно за пару кликов сменить всю палитру и типографику. Готовые стили (Luxury, Minimal, Romantic и другие) задают согласованное оформление целиком — удобно, если не хочется подбирать цвета вручную.' },
      { h: '5. Опубликуйте и поделитесь' },
      { p: 'Нажмите «Опубликовать» — сайт становится доступен по вашей ссылке. Скопируйте её и отправьте гостям. Любые правки после публикации подхватываются автоматически, отдельно ничего пересобирать не нужно.' },
      { p: 'Готово. Обычно на всё уходит около десяти минут, а результат выглядит так, будто над ним работал дизайнер.' },
    ],
  },
  {
    id: 'updates',
    icon: Sparkles,
    tag: 'Обновления',
    read: '3 мин',
    title: 'Что нового в Maruno',
    desc: 'Свежие блоки, шаблоны и улучшения. Обновляется с каждым релизом.',
    body: [
      { p: 'Мы регулярно докручиваем редактор, чтобы собирать сайт было ещё приятнее. Вот главное из последних обновлений.' },
      { h: 'Полностью новый редактор' },
      { p: 'Редактор переработан под уровень Framer и Tilda: библиотека блоков с категориями, поиском и избранным, живой предпросмотр, перетаскивание блоков, дублирование и аккуратное подтверждение удаления.' },
      { h: 'Большая библиотека блоков' },
      { p: 'Больше 25 готовых блоков по категориям — от нескольких вариантов главного экрана до таймлайна дня, дресс-кода, списка подарков, трансфера и футеров. Каждый блок оформлен как красивая карточка с предпросмотром.' },
      { h: 'Отмена и повтор действий' },
      { p: 'Ошиблись — просто нажмите отмену. Undo/Redo работают и по горячим клавишам, так что экспериментировать со структурой стало безопасно.' },
      { h: 'Типографика и цвет' },
      { p: 'Более 20 свадебных и каллиграфических шрифтов, готовые палитры и точная настройка цвета через HEX, RGB и палитру. Плюс шесть цельных стилей, которые задают оформление одним нажатием.' },
      { p: 'Дальше в планах — ещё шаблоны, анимации появления блоков и расширенная аналитика ответов гостей. Следите за разделом.' },
    ],
  },
  {
    id: 'rsvp',
    icon: HelpCircle,
    tag: 'Помощь',
    read: '3 мин',
    title: 'RSVP: как получать ответы гостей',
    desc: 'Настраиваем приём ответов, чтобы заранее понимать, кто придёт на торжество.',
    body: [
      { p: 'RSVP — это форма на сайте, через которую гости сообщают, придут ли они. Так вы заранее знаете число гостей и не гадаете с рассадкой и меню.' },
      { h: 'Добавьте блок подтверждения' },
      { p: 'В библиотеке откройте категорию «RSVP» и добавьте блок подтверждения участия. При желании можно включить дополнительные поля — количество гостей, комментарий и пожелания к меню.' },
      { h: 'Куда приходят ответы' },
      { p: 'Ответы гостей приходят вам в уведомления — их удобно получать в Telegram. Каждый заполнивший форму гость попадает в список, который вы видите целиком, без ручного сведения таблиц.' },
      { h: 'Поставьте срок ответа' },
      { p: 'Укажите дату, до которой просите ответить — например, за две недели до торжества. Мягкий дедлайн заметно повышает долю гостей, которые действительно заполняют форму.' },
      { h: 'Советы, чтобы отвечали чаще' },
      { list: [
        'Держите форму короткой — чем меньше полей, тем выше отклик',
        'Добавьте понятную приглашающую фразу над формой',
        'Разошлите ссылку заранее и напомните ближе к дедлайну',
        'Разместите RSVP ближе к концу сайта — после истории и деталей',
      ] },
      { p: 'Настройка занимает пару минут, а на выходе вы получаете живой список гостей вместо переписки в десятке чатов.' },
    ],
  },
]

export default function BlogPageClient() {
  const [open, setOpen] = useState<Article | null>(null)

  useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      const onEsc = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(null)
      window.addEventListener('keydown', onEsc)
      return () => { document.body.style.overflow = prev; window.removeEventListener('keydown', onEsc) }
    }
  }, [open])

  return (
    <>
      <a href="#content" className="mrn-skip">К содержимому</a>
      <Navbar />

      <main id="content">
        <section
          style={{
            background: 'var(--color-paper)',
            paddingTop: 'clamp(104px, 13vh, 148px)',
            paddingBottom: 'clamp(28px, 4vw, 44px)',
          }}
        >
          <div className="mrn-container">
            <Reveal>
              <p className="mrn-eyebrow">Советы</p>
              <h1 className="mrn-h1" style={{ marginTop: 16, maxWidth: '18ch' }}>
                Как собрать приглашение и ничего не забыть
              </h1>
              <p className="mrn-lead" style={{ marginTop: 20, maxWidth: '52ch' }}>
                Гайды по созданию сайта, новости сервиса и подсказки для организации свадьбы.
              </p>
            </Reveal>
          </div>
        </section>

        <section className="mrn-section--tight" style={{ background: 'var(--color-paper)', paddingTop: 0 }}>
          <div className="mrn-container">
            <Reveal as="ul" style={{ listStyle: 'none', margin: 0, padding: 0 }}>
              {ARTICLES.map((a) => (
                <li key={a.id} style={{ borderTop: '1px solid var(--mrn-line)' }}>
                  <button
                    type="button"
                    onClick={() => setOpen(a)}
                    className="mrn-article-row"
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      background: 'none',
                      border: 0,
                      cursor: 'pointer',
                      display: 'grid',
                      gap: 'clamp(10px, 2vw, 28px)',
                      alignItems: 'baseline',
                      paddingBlock: 'clamp(22px, 3vw, 30px)',
                      paddingInline: 0,
                    }}
                  >
                    <span className="flex items-center gap-3">
                      <span className="mrn-eyebrow" style={{ color: 'var(--color-wine)' }}>{a.tag}</span>
                      <span className="mrn-meta inline-flex items-center gap-1.5">
                        <Clock size={13} aria-hidden="true" /> {a.read}
                      </span>
                    </span>

                    <span className="block">
                      <span className="mrn-h3 block">{a.title}</span>
                      <span className="mrn-lead block" style={{ marginTop: 8, fontSize: 15, maxWidth: '56ch' }}>
                        {a.desc}
                      </span>
                      <span
                        className="inline-flex items-center gap-1.5"
                        style={{ marginTop: 14, color: 'var(--color-wine)', fontSize: 14, fontWeight: 500 }}
                      >
                        Читать <ArrowRight size={15} aria-hidden="true" />
                      </span>
                    </span>
                  </button>
                </li>
              ))}
            </Reveal>
          </div>
        </section>
      </main>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setOpen(null)}
              style={{ position: 'fixed', inset: 0, background: 'rgba(22,19,15,.6)', zIndex: 80 }}
            />
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              transition={{ duration: 0.24, ease: [0.22, 0.61, 0.36, 1] }}
              role="dialog"
              aria-modal="true"
              aria-label={open.title}
              style={{ position: 'fixed', inset: 0, zIndex: 90, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '5vh 16px', pointerEvents: 'none' }}
            >
              <article
                data-lenis-prevent
                className="mrn-card"
                style={{ pointerEvents: 'auto', width: '100%', maxWidth: 720, maxHeight: '90vh', overflowY: 'auto', boxShadow: 'var(--mrn-shadow-lift)' }}
              >
                <div
                  className="flex items-start justify-between gap-4"
                  style={{
                    position: 'sticky', top: 0, zIndex: 2,
                    background: 'var(--color-paper)',
                    padding: 'clamp(20px, 3vw, 28px)',
                    borderBottom: '1px solid var(--mrn-line)',
                  }}
                >
                  <div>
                    <p className="mrn-eyebrow" style={{ color: 'var(--color-wine)' }}>{open.tag} · {open.read}</p>
                    <h2 className="mrn-h2" style={{ marginTop: 8, fontSize: 'clamp(1.5rem, 3.6vw, 2.1rem)' }}>{open.title}</h2>
                  </div>
                  <button onClick={() => setOpen(null)} className="mrn-icon-btn" aria-label="Закрыть статью" style={{ flexShrink: 0 }}>
                    <X size={18} />
                  </button>
                </div>

                <div style={{ padding: 'clamp(20px, 3vw, 28px)' }}>
                  {open.body.map((b, i) => {
                    if (b.h) return <h3 key={i} className="mrn-h3" style={{ margin: '26px 0 10px' }}>{b.h}</h3>
                    if (b.list) return (
                      <ul key={i} style={{ margin: '4px 0 14px', padding: 0, listStyle: 'none', display: 'grid', gap: 10 }}>
                        {b.list.map((li, j) => (
                          <li key={j} style={{ position: 'relative', paddingLeft: 20, color: 'var(--color-ink-600)', fontSize: 15.5, lineHeight: 1.6 }}>
                            <span aria-hidden="true" style={{ position: 'absolute', left: 0, top: 11, width: 10, height: 1, background: 'var(--color-wine)' }} />
                            {li}
                          </li>
                        ))}
                      </ul>
                    )
                    return <p key={i} style={{ color: 'var(--color-ink-600)', fontSize: 16, lineHeight: 1.75, margin: '0 0 14px' }}>{b.p}</p>
                  })}

                  <div
                    className="flex flex-wrap items-center justify-between gap-3"
                    style={{ marginTop: 30, paddingTop: 22, borderTop: '1px solid var(--mrn-line)' }}
                  >
                    <span className="mrn-meta">Готовы попробовать?</span>
                    <Link href="/dashboard/new" onClick={() => setOpen(null)} className="mrn-btn mrn-btn--primary mrn-btn--sm">
                      Создать сайт <ArrowRight size={15} />
                    </Link>
                  </div>
                </div>
              </article>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <SiteFooter />

      <style>{`
        .mrn-article-row { grid-template-columns: 1fr; }
        .mrn-article-row:hover .mrn-h3 { color: var(--color-wine); }
        .mrn-article-row .mrn-h3 { transition: color var(--mrn-t) var(--mrn-ease); }
        @media (min-width: 768px) { .mrn-article-row { grid-template-columns: 220px 1fr; } }
      `}</style>
    </>
  )
}
