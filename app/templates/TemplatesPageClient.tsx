'use client'

import { Navbar } from '@/components/ui/Navbar'
import { TemplateShowcase } from '@/components/landing/TemplateShowcase'
import { FinalCta } from '@/components/landing/FinalCta'
import { SiteFooter } from '@/components/landing/SiteFooter'
import { Reveal } from '@/components/landing/Reveal'
import { useAuth } from '@/lib/hooks/useAuth'

/**
 * Каталог шаблонов.
 *
 * Клик по карточке передаёт выбранный шаблон в мастер создания параметром
 * ?template= — раньше выбор пользователя терялся по дороге на регистрацию.
 */
export default function TemplatesPageClient() {
  const { user } = useAuth()
  const startHref = user ? '/dashboard/new' : '/auth/register'
  const templateHref = (id: string) => (user ? `/dashboard/new?template=${id}` : '/auth/register')

  return (
    <>
      <a href="#content" className="mrn-skip">К содержимому</a>
      <Navbar />

      <main id="content">
        <section
          className="mrn-tone-milk"
          style={{
            paddingTop: 'clamp(104px, 13vh, 148px)',
            paddingBottom: 'clamp(40px, 6vw, 72px)',
          }}
        >
          <div className="mrn-container">
            <Reveal>
              <p className="mrn-eyebrow">Каталог</p>
              <h1 className="mrn-h1" style={{ marginTop: 16, maxWidth: '20ch' }}>
                Шаблоны свадебных{' '}
                <span className="mrn-h1-script" style={{ color: 'var(--color-wine)' }}>
                  сайтов-приглашений
                </span>
              </h1>
              <p className="mrn-lead" style={{ marginTop: 22, maxWidth: '54ch' }}>
                Шесть направлений — от камерного торжества до вечернего приёма. Каждый шаблон
                отличается композицией первого экрана, типографикой, палитрой и формой элементов.
                Всё оформление меняется в редакторе, поэтому выбор ни к чему не обязывает.
              </p>
            </Reveal>
          </div>
        </section>

        <TemplateShowcase
          templateHref={templateHref}
          background="var(--color-paper)"
          eyebrow="Шесть направлений"
          title="Выберите, с чего начать"
          description="Откройте демо, чтобы посмотреть шаблон на компьютере и на телефоне. Это настоящий первый экран сайта, а не отдельная иллюстрация."
        />

        <FinalCta startHref={startHref} />
      </main>

      <SiteFooter />
    </>
  )
}
