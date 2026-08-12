'use client'

import { Reveal } from './Reveal'

/**
 * Полноширинная цитата на бордовом.
 *
 * Единственная новая секция патча. Задача — пауза между двумя плотными
 * блоками (каталогом и списком возможностей) и место, где голос продукта
 * звучит по-человечески, а не списком преимуществ.
 */
export function QuoteBand() {
  return (
    <section className="mrn-section--tight mrn-tone-wine mrn-dark">
      <div className="mrn-container mrn-container--narrow" style={{ textAlign: 'center' }}>
        <Reveal>
          <p
            className="mrn-h2"
            style={{ fontSize: 'clamp(1.5rem, 3.2vw, 2.3rem)', textWrap: 'balance' }}
          >
            Гости открывают приглашение один раз — и почти всегда с телефона.
            От этого экрана зависит, каким они запомнят{' '}
            {/* На бордовом акцент держит почерк, а не второй цвет */}
            <span className="mrn-script" style={{ fontSize: '1.3em' }}>
              ваш день
            </span>
          </p>
          <p className="mrn-meta" style={{ marginTop: 22 }}>
            Поэтому в Maruno мобильная версия проектируется первой
          </p>
        </Reveal>
      </div>
    </section>
  )
}
