'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { useAuth } from '@/lib/hooks/useAuth'
import { useAppStore } from '@/lib/store'
import { LanguageSwitcher } from './LanguageSwitcher'
import { useRouter } from 'next/navigation'

interface NavbarProps {
  dark?: boolean
}

export function Navbar({ dark = false }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { user, signOut } = useAuth()
  const { t } = useAppStore()
  const router = useRouter()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
    setMobileOpen(false)
  }

  const navBg = scrolled
    ? dark
      ? 'bg-[#0F0D0A]/95 backdrop-blur-xl border-b border-white/5'
      : 'bg-white/95 backdrop-blur-xl border-b border-[#B8956A]/10 shadow-sm'
    : 'bg-transparent'

  const textColor = dark ? 'text-white/80' : 'text-[#1E1610]'

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navBg}`} style={{ height: 58 }}>
        <div className="max-w-6xl mx-auto px-5 h-full flex items-center justify-between">
          {/* Logo — Wedify */}
          <Link href="/" className="flex items-center gap-2.5 group" onClick={() => setMobileOpen(false)}>
            <div className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #C4A97D, #8B6F47)' }}>
              <span style={{ color: 'white', fontSize: 14, lineHeight: 1 }}>✦</span>
            </div>
            <span className={`font-medium tracking-wide transition-colors ${textColor}`}
              style={{ fontFamily: 'Comfortaa, cursive', fontSize: 18, letterSpacing: '0.02em' }}>
              Wedify
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-3">
            <LanguageSwitcher dark={dark} />
            {user ? (
              <>
                <Link href="/dashboard"
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    dark ? 'text-white/60 hover:text-white hover:bg-white/8' : 'text-[#1E1610]/60 hover:text-[#1E1610] hover:bg-black/5'
                  }`}>
                  {t('nav_dashboard')}
                </Link>
                <Link href="/dashboard/new"
                  className="btn-luxury px-5 py-2.5 rounded-xl text-sm">
                  + Создать
                </Link>
                <button onClick={handleSignOut}
                  className={`px-3 py-2 rounded-xl text-sm transition-all opacity-50 hover:opacity-80 ${textColor}`}>
                  {t('nav_logout')}
                </button>
              </>
            ) : (
              <>
                <Link href="/auth/login"
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    dark ? 'text-white/60 hover:text-white hover:bg-white/8' : 'text-[#1E1610]/60 hover:text-[#1E1610] hover:bg-black/5'
                  }`}>
                  Войти
                </Link>
                <Link href="/auth/register"
                  className="btn-luxury px-5 py-2.5 rounded-xl text-sm">
                  Начать бесплатно
                </Link>
              </>
            )}
          </div>

          {/* Mobile right */}
          <div className="flex md:hidden items-center gap-2">
            <LanguageSwitcher dark={dark} />
            <button onClick={() => setMobileOpen(true)}
              className={`p-2 rounded-xl transition-colors ${dark ? 'text-white/70 hover:bg-white/10' : 'text-[#1E1610]/70 hover:bg-black/5'}`}>
              <Menu size={20} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu — bottom sheet style */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-50 md:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 32, stiffness: 280 }}
              className="fixed bottom-0 left-0 right-0 z-50 md:hidden rounded-t-3xl overflow-hidden"
              style={{ background: '#0F0D0A', border: '1px solid rgba(196,169,125,0.15)' }}
            >
              {/* Handle */}
              <div className="flex justify-center pt-3 pb-1">
                <div className="w-10 h-1 rounded-full" style={{ background: 'rgba(255,255,255,0.15)' }} />
              </div>

              <div className="px-5 pt-2 pb-8 flex flex-col gap-2">
                {/* Brand */}
                <div className="flex items-center justify-between py-3 mb-2 border-b border-white/8">
                  <span style={{ fontFamily: 'Comfortaa, cursive', fontSize: 18, color: 'white', fontWeight: 300 }}>Wedify</span>
                  <button onClick={() => setMobileOpen(false)} className="p-2 rounded-xl" style={{ background: 'rgba(255,255,255,0.06)' }}>
                    <X size={16} className="text-white/60" />
                  </button>
                </div>

                {user ? (
                  <>
                    <Link href="/dashboard" onClick={() => setMobileOpen(false)}
                      className="py-4 px-4 rounded-2xl text-white/80 text-base font-medium transition-colors hover:bg-white/6 flex items-center gap-3">
                      📋 {t('nav_dashboard')}
                    </Link>
                    <Link href="/dashboard/new" onClick={() => setMobileOpen(false)}
                      className="py-4 px-4 rounded-2xl text-base font-medium text-center"
                      style={{ background: 'linear-gradient(135deg, #C4A97D, #8B6F47)', color: 'white' }}>
                      ✦ Создать сайт
                    </Link>
                    <button onClick={handleSignOut}
                      className="py-3 px-4 rounded-2xl text-white/40 text-sm text-left">
                      Выйти
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/auth/login" onClick={() => setMobileOpen(false)}
                      className="py-4 px-4 rounded-2xl text-white/80 text-base font-medium transition-colors"
                      style={{ border: '1px solid rgba(255,255,255,0.1)' }}>
                      Войти
                    </Link>
                    <Link href="/auth/register" onClick={() => setMobileOpen(false)}
                      className="py-4 px-4 rounded-2xl text-base font-medium text-center"
                      style={{ background: 'linear-gradient(135deg, #C4A97D, #8B6F47)', color: 'white' }}>
                      ✦ Начать бесплатно
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
