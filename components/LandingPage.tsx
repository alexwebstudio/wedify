'use client'

import { Navbar } from '@/components/ui/Navbar'
import { useAuth } from '@/lib/hooks/useAuth'
import { Hero } from '@/components/landing/Hero'
import { TemplateShowcase } from '@/components/landing/TemplateShowcase'
import { HowItWorks } from '@/components/landing/HowItWorks'
import { QuoteBand } from '@/components/landing/QuoteBand'
import { Capabilities } from '@/components/landing/Capabilities'
import { FinalCta } from '@/components/landing/FinalCta'
import ExclusiveTemplatesPlate from '@/components/landing/ExclusiveTemplates'
import Reviews from '@/components/landing/Reviews'
import UpdatesSubscribe from '@/components/landing/UpdatesSubscribe'
import { SiteFooter } from '@/components/landing/SiteFooter'

export const BRAND = 'Maruno'

/**
 * Главная страница — композиция секций из components/landing.
 *
 * Порядок: сначала показываем, что получится (шаблоны и эксклюзивная
 * линейка), и только потом объясняем, как это собрать. Человек решает
 * по картинке, а не по описанию процесса.
 *
 * Тона чередуются, иначе страница читается как одно белое полотно, и
 * держатся на трёх цветах — белый, бордовый, почти чёрный:
 *   бордовый → белый → молочный → бордовый → графит → белый →
 *   молочный → бордовый → графитовый футер.
 */
export default function LandingPage() {
  const { user } = useAuth()

  // Вошедшего ведём в кабинет, гостя — на регистрацию.
  const startHref = user ? '/dashboard' : '/auth/register'
  const templateHref = (id: string) => (user ? `/dashboard/new?template=${id}` : '/auth/register')

  return (
    <>
      <a href="#content" className="mrn-skip">К содержимому</a>
      <Navbar />

      <main id="content">
        <Hero startHref={startHref} />

        {/* Четыре карточки: ведущая на всю ширину, остальные три закрывают ряд */}
        <TemplateShowcase templateHref={templateHref} limit={4} showAllLink />

        <section className="mrn-section--tight mrn-tone-milk mrn-seam">
          <div className="mrn-container">
            <ExclusiveTemplatesPlate />
          </div>
        </section>

        <HowItWorks startHref={startHref} />

        <QuoteBand />

        <Capabilities />

        <Reviews />

        <UpdatesSubscribe />

        <FinalCta startHref={startHref} />
      </main>

      <SiteFooter />
    </>
  )
}
