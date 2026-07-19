'use client'
import { SiteFooter } from '@/components/landing/SiteFooter'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Navbar } from '@/components/ui/Navbar'
import { BookOpen, Sparkles, HelpCircle, Rocket, X, Clock, ArrowRight } from 'lucide-react'

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

export default function BlogPage() {
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
    <div style={{ minHeight: '100vh', background: '#0F0D0A' }}>
      <Navbar dark />

      <section style={{ padding: '120px 20px 40px', textAlign: 'center' }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <div style={{ width: 52, height: 52, borderRadius: 16, margin: '0 auto 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(196,169,125,.12)', color: '#C4A97D' }}>
            <BookOpen size={24} />
          </div>
          <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(2.4rem,6vw,3.6rem)', fontWeight: 300, color: '#fff', marginBottom: 14 }}>
            Полезные советы
          </h1>
          <p style={{ color: 'rgba(255,255,255,.42)', fontSize: 15, fontWeight: 300, lineHeight: 1.7 }}>
            Гайды по созданию сайта, новости сервиса и советы для вашей свадьбы.
            Нажмите на карточку, чтобы открыть статью целиком.
          </p>
        </div>
      </section>

      <section style={{ padding: '20px 20px 100px' }}>
        <div style={{ maxWidth: 980, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 16 }}>
          {ARTICLES.map((a) => {
            const Icon = a.icon
            return (
              <button
                key={a.id}
                onClick={() => setOpen(a)}
                className="blog-card"
                style={{ textAlign: 'left', padding: '26px 24px', borderRadius: 22, background: 'rgba(255,255,255,.035)', border: '1px solid rgba(255,255,255,.07)', cursor: 'pointer', transition: 'transform .35s cubic-bezier(.2,.8,.2,1), background .35s, border-color .35s' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                  <div style={{ width: 42, height: 42, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(196,169,125,.12)', color: '#C4A97D' }}>
                    <Icon size={19} />
                  </div>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 12, color: 'rgba(255,255,255,.32)' }}>
                    <Clock size={12} /> {a.read}
                  </span>
                </div>
                <span style={{ fontSize: 10.5, fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase', color: '#C4A97D' }}>{a.tag}</span>
                <p style={{ color: '#fff', fontSize: 17, fontWeight: 500, margin: '8px 0 10px', lineHeight: 1.35 }}>{a.title}</p>
                <p style={{ color: 'rgba(255,255,255,.38)', fontSize: 13.5, lineHeight: 1.6, marginBottom: 16 }}>{a.desc}</p>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#C4A97D', fontWeight: 500 }}>
                  Читать <ArrowRight size={14} className="blog-card-arrow" />
                </span>
              </button>
            )
          })}
        </div>

        <div style={{ textAlign: 'center', marginTop: 44 }}>
          <Link href="/" style={{ color: '#C4A97D', fontSize: 14, textDecoration: 'none' }}>← На главную</Link>
        </div>
      </section>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setOpen(null)}
              style={{ position: 'fixed', inset: 0, background: 'rgba(8,7,5,.72)', backdropFilter: 'blur(6px)', zIndex: 80 }}
            />
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.98 }}
              transition={{ type: 'spring', damping: 30, stiffness: 320 }}
              style={{ position: 'fixed', inset: 0, zIndex: 90, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '5vh 16px', pointerEvents: 'none' }}
            >
              <div
                data-lenis-prevent
                style={{ pointerEvents: 'auto', width: '100%', maxWidth: 720, maxHeight: '90vh', overflowY: 'auto', background: '#14110C', border: '1px solid rgba(196,169,125,.16)', borderRadius: 26, boxShadow: '0 40px 100px rgba(0,0,0,.6)' }}
              >
                <div style={{ position: 'sticky', top: 0, background: 'linear-gradient(#14110C, #14110Cee)', backdropFilter: 'blur(8px)', padding: '22px 28px 16px', borderBottom: '1px solid rgba(255,255,255,.06)', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, zIndex: 2 }}>
                  <div>
                    <span style={{ fontSize: 10.5, fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase', color: '#C4A97D' }}>{open.tag} · {open.read}</span>
                    <h2 style={{ fontFamily: 'Cormorant Garamond, serif', color: '#fff', fontSize: 'clamp(1.7rem,4vw,2.4rem)', fontWeight: 400, marginTop: 6, lineHeight: 1.2 }}>{open.title}</h2>
                  </div>
                  <button onClick={() => setOpen(null)} style={{ flexShrink: 0, width: 38, height: 38, borderRadius: 12, border: 'none', cursor: 'pointer', background: 'rgba(255,255,255,.06)', color: 'rgba(255,255,255,.6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <X size={18} />
                  </button>
                </div>

                <div style={{ padding: '20px 28px 40px' }}>
                  {open.body.map((b, i) => {
                    if (b.h) return <h3 key={i} style={{ color: '#E8D5B0', fontFamily: 'Cormorant Garamond, serif', fontSize: 22, fontWeight: 500, margin: '26px 0 10px' }}>{b.h}</h3>
                    if (b.list) return (
                      <ul key={i} style={{ margin: '4px 0 8px', paddingLeft: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
                        {b.list.map((li, j) => (
                          <li key={j} style={{ position: 'relative', paddingLeft: 22, color: 'rgba(255,255,255,.6)', fontSize: 15, lineHeight: 1.6 }}>
                            <span style={{ position: 'absolute', left: 0, top: 9, width: 7, height: 7, borderRadius: '50%', background: '#C4A97D' }} />
                            {li}
                          </li>
                        ))}
                      </ul>
                    )
                    return <p key={i} style={{ color: 'rgba(255,255,255,.62)', fontSize: 15.5, lineHeight: 1.75, margin: '0 0 14px' }}>{b.p}</p>
                  })}

                  <div style={{ marginTop: 30, paddingTop: 22, borderTop: '1px solid rgba(255,255,255,.06)', display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ color: 'rgba(255,255,255,.35)', fontSize: 13 }}>Готовы попробовать?</span>
                    <Link href="/dashboard/new" onClick={() => setOpen(null)}
                      style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '11px 20px', borderRadius: 14, background: 'linear-gradient(135deg,#C4A97D,#8B6F47)', color: '#fff', fontSize: 14, fontWeight: 500, textDecoration: 'none' }}>
                      Создать свадебный сайт <ArrowRight size={15} />
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <style>{`
        .blog-card:hover { transform: translateY(-4px); background: rgba(196,169,125,.07) !important; border-color: rgba(196,169,125,.28) !important; }
        .blog-card:hover .blog-card-arrow { transform: translateX(4px); }
        .blog-card-arrow { transition: transform .3s ease; }
      `}</style>
      <SiteFooter />
    </div>
  )
}
