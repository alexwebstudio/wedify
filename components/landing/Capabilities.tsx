'use client'

import { Reveal } from './Reveal'

const CAPABILITIES = [
  {
    title: 'Блочный редактор',
    text: 'Больше двадцати готовых блоков: история знакомства, тайминг дня, локация, дресс-код, подарки, галерея. Включаются и переставляются в один клик.',
  },
  {
    title: 'Ответы гостей',
    text: 'Форма подтверждения на сайте, ответы — вам на почту или в Telegram. Никаких таблиц и переписок в мессенджерах.',
  },
  {
    title: 'Личная ссылка',
    text: 'Адрес формируется из ваших имён и открывается сразу после публикации. Правки после неё подхватываются автоматически.',
  },
  {
    title: 'Свой стиль',
    text: 'Больше двадцати шрифтов с поддержкой кириллицы, готовые палитры и точная настройка цвета — если хочется отойти от шаблона.',
  },
  {
    title: 'Сначала телефон',
    text: 'Гости откроют приглашение с телефона, поэтому мобильная версия проектируется первой, а не подгоняется в конце.',
  },
  {
    title: 'Закрытый доступ',
    text: 'Сайт можно спрятать от поисковиков и закрыть кодом — тогда его увидят только те, кому вы отправили ссылку.',
  },
]

export function Capabilities() {
  return (
    <section className="mrn-section mrn-tone-ink mrn-dark">
      <div className="mrn-container">
        <Reveal className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div>
            <p className="mrn-eyebrow">Возможности</p>
            <h2 className="mrn-h2" style={{ marginTop: 14, maxWidth: '14ch' }}>
              Что входит в свадебный сайт
            </h2>
            <p className="mrn-lead" style={{ marginTop: 20, maxWidth: '38ch' }}>
              Блоки, форма для гостей, музыка и настройки доступа — всё уже собрано.
            </p>
          </div>

          <ul style={{ listStyle: 'none', margin: 0, padding: 0 }} className="grid sm:grid-cols-2 gap-x-10">
            {CAPABILITIES.map((item) => (
              <li
                key={item.title}
                style={{
                  paddingBlock: 'clamp(18px, 2.4vw, 24px)',
                  borderTop: '1px solid var(--mrn-line-invert)',
                }}
              >
                <h3 className="mrn-h3" style={{ fontSize: 18 }}>
                  {item.title}
                </h3>
                <p className="mrn-lead" style={{ marginTop: 8, fontSize: 15 }}>{item.text}</p>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  )
}
