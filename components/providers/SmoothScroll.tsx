'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Плавный скролл на моб + десктоп, синхронизированный с ScrollTrigger.
// ВАЖНО: Lenis перехватывает колесо мыши глобально и ломает вложенные
// скролл-контейнеры (редактор, попапы). Поэтому на /dashboard он НЕ запускается —
// там нужен обычный нативный скролл панелей и превью.
export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isApp = pathname?.startsWith('/dashboard')

  useEffect(() => {
    // В личном кабинете / редакторе — только нативный скролл.
    if (isApp) return

    // Уважаем системную настройку «уменьшить движение»
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) return

    gsap.registerPlugin(ScrollTrigger)

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.4, // приятный инерционный скролл на телефоне
      // Не смузим элементы, помеченные data-lenis-prevent (внутренние скроллы)
      prevent: (node) => node.hasAttribute?.('data-lenis-prevent'),
    })

    lenis.on('scroll', ScrollTrigger.update)

    const raf = (time: number) => {
      lenis.raf(time * 1000)
    }
    gsap.ticker.add(raf)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(raf)
      lenis.destroy()
    }
  }, [isApp])

  return <>{children}</>
}
