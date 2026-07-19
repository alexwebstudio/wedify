'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Heart, Eye, EyeOff } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useAppStore } from '@/lib/store'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const { t } = useAppStore()
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
      toast.success('Добро пожаловать! 🎉')
      router.push('/dashboard')
    } catch (err: unknown) {
      toast.error((err as Error).message || 'Ошибка входа')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex" style={{ background: 'linear-gradient(135deg, #1C1812 0%, #2C2018 60%, #3D3025 100%)' }}>
      {/* Left decorative panel - hidden on mobile */}
      <div className="hidden lg:flex lg:w-1/2 flex-col items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: 'radial-gradient(circle, #C4A97D 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full opacity-20 blur-3xl"
          style={{ background: 'radial-gradient(circle, #C4A97D, transparent)' }} />
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="relative text-center max-w-sm"
        >
          <Heart size={48} className="text-[#C4A97D] fill-[#C4A97D] mx-auto mb-6 float" />
          <h2 className="text-4xl font-light text-white mb-4" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
            Ваш особенный день<br />заслуживает<br />
            <span style={{ color: '#C4A97D' }}>особенного сайта</span>
          </h2>
          <p className="text-white/40 text-sm leading-relaxed">
            Создайте красивое свадебное приглашение и поделитесь им с гостями за несколько минут
          </p>
        </motion.div>
      </div>

      {/* Right: form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm"
        >
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 justify-center mb-10">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#C4A97D] to-[#8B6F47] flex items-center justify-center">
              <Heart size={16} className="text-white fill-white" />
            </div>
            <span className="text-white font-bold text-xl" style={{ fontFamily: 'Cormorant Garamond, serif' }}>Maruno</span>
          </Link>

          <h1 className="text-3xl font-light text-white mb-2 text-center" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
            С возвращением
          </h1>
          <p className="text-white/40 text-center text-sm mb-8">Войдите в свой аккаунт</p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-widest text-white/40 mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="your@email.com"
                className="input-luxury text-white placeholder-white/20"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-widest text-white/40 mb-2">Пароль</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="input-luxury text-white placeholder-white/20 pr-12"
                />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors">
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-luxury w-full py-3.5 rounded-xl font-medium text-sm mt-2 disabled:opacity-50"
            >
              <span>{loading ? 'Входим...' : 'Войти'}</span>
            </button>
          </form>

          <p className="text-center text-white/40 text-sm mt-6">
            {t('auth_no_account')}{' '}
            <Link href="/auth/register" className="text-[#C4A97D] hover:text-[#E8D5B0] transition-colors font-medium">
              {t('auth_register')}
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}
