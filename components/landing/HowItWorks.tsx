'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Reveal } from './Reveal'

const STEPS = [
  {
    n: '01',
    title: 'Выберите сценарий',
    text: 'Восемь готовых направлений — от камерного торжества до вечернего приёма. Оформление можно поменять в любой момент, поэтому выбор ни к чему не обязывает.',
  },
  {
    n: '02',
    title: 'Впишите свои данные',
    text: 'Имена, дата, площадка, дресс-код и контакты подставляются сразу во все блоки. Тексты правятся прямо на странице — кликом по нужной строке.',
  },
  {
    n: '03',
    title: 'Отправьте ссылку гостям',
    text: 'Сайт публикуется по вашему адресу и открывается с любого телефона. Ответы на приглашение приходят вам, а правки попадают гостям только после нажатия «Опубликовать».',
  },
]

export function HowItWorks({ startHref }: { startHref: string }) {
  return (
    <section className="mrn-section mrn-tone-paper">
      <div className="mrn-container">
        <Reveal className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div>
            <p className="mrn-eyebrow">Как это работает</p>
            <h2 className="mrn-h2" style={{ marginTop: 14, maxWidth: '17ch' }}>
              Как собрать приглашение за один вечер
            </h2>
            <p className="mrn-lead" style={{ marginTop: 20, maxWidth: '40ch' }}>
              Три шага, ничего не нужно верстать и настраивать. Достаточно того,
              что вы и так знаете о своей свадьбе.
            </p>
            <Link href={startHref} className="mrn-btn mrn-btn--primary" style={{ marginTop: 28 }}>
              Начать <ArrowRight size={16} />
            </Link>
          </div>

          <ol style={{ listStyle: 'none', margin: 0, padding: 0 }}>
            {STEPS.map((step, i) => (
              <li
                key={step.n}
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'auto 1fr',
                  gap: 'clamp(18px, 3vw, 32px)',
                  paddingBlock: 'clamp(22px, 3vw, 30px)',
                  borderTop: i === 0 ? 'none' : '1px solid var(--mrn-line)',
                }}
              >
                <span
                  className="mrn-h3"
                  aria-hidden="true"
                  style={{ color: 'var(--color-wine)', fontSize: 15, letterSpacing: '0.08em', paddingTop: 4 }}
                >
                  {step.n}
                </span>
                <div>
                  <h3 className="mrn-h3">{step.title}</h3>
                  <p className="mrn-lead" style={{ marginTop: 8, fontSize: 15.5, maxWidth: '52ch' }}>
                    {step.text}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </Reveal>
      </div>
    </section>
  )
}
