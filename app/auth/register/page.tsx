'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Heart, Eye, EyeOff, Check } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useAppStore } from '@/lib/store'
import toast from 'react-hot-toast'

export default function RegisterPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const { t } = useAppStore()
  const router = useRouter()
  const supabase = createClient()

  const passwordStrength = password.length >= 8 ? (password.match(/[A-Z]/) && password.match(/[0-9]/) ? 'strong' : 'medium') : password.length > 0 ? 'weak' : ''

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password.length < 6) { toast.error('Пароль минимум 6 символов'); return }
    setLoading(true)
    try {
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) throw error
      toast.success('Аккаунт создан! 🎉')
      router.push('/dashboard')
    } catch (err: unknown) {
      toast.error((err as Error).message || 'Ошибка регистрации')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex" style={{ background: 'linear-gradient(135deg, #1C1812 0%, #2C2018 60%, #3D3025 100%)' }}>
      <div className="hidden lg:flex lg:w-1/2 flex-col items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: 'radial-gradient(circle, #C4A97D 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative text-center max-w-sm">
          <div className="text-6xl mb-6 float">💍</div>
          <h2 className="text-4xl font-light text-white mb-4" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
            Начните создавать<br />
            <span style={{ color: '#C4A97D' }}>прямо сейчас</span>
          </h2>
          <div className="space-y-3 mt-8 text-left">
            {['Бесплатная регистрация', 'Готовая ссылка за 5 минут', 'Красивые шаблоны', 'RSVP от гостей онлайн'].map((item) => (
              <div key={item} className="flex items-center gap-3 text-sm text-white/50">
                <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: '#C4A97D20' }}>
                  <Check size={10} className="text-[#C4A97D]" />
                </div>
                {item}
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm">
          <Link href="/" className="flex items-center gap-2 justify-center mb-10">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#C4A97D] to-[#8B6F47] flex items-center justify-center">
              <Heart size={16} className="text-white fill-white" />
            </div>
            <span className="text-white font-bold text-xl" style={{ fontFamily: 'Cormorant Garamond, serif' }}>Wedify</span>
          </Link>

          <h1 className="text-3xl font-light text-white mb-2 text-center" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
            Создать аккаунт
          </h1>
          <p className="text-white/40 text-center text-sm mb-8">Бесплатно. Навсегда.</p>

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-widest text-white/40 mb-2">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                placeholder="your@email.com" className="input-luxury text-white placeholder-white/20" />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-widest text-white/40 mb-2">Пароль</label>
              <div className="relative">
                <input type={showPass ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)}
                  required placeholder="Минимум 6 символов" className="input-luxury text-white placeholder-white/20 pr-14" />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  aria-label={showPass ? 'Скрыть пароль' : 'Показать пароль'}
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 p-2.5 rounded-lg text-white/40 hover:text-white/80 hover:bg-white/5 active:scale-95 transition-all">
                  {showPass ? <EyeOff size={22} /> : <Eye size={22} />}
                </button>
              </div>
              {passwordStrength && (
                <div className="flex gap-1 mt-2">
                  {['weak', 'medium', 'strong'].map((s, i) => (
                    <div key={s} className="flex-1 h-1 rounded-full transition-colors"
                      style={{ background: ['weak', 'medium', 'strong'].indexOf(passwordStrength) >= i ? (passwordStrength === 'weak' ? '#ef4444' : passwordStrength === 'medium' ? '#f59e0b' : '#10b981') : '#ffffff10' }} />
                  ))}
                </div>
              )}
            </div>

            <button type="submit" disabled={loading}
              className="btn-luxury w-full py-3.5 rounded-xl font-medium text-sm mt-2 disabled:opacity-50">
              <span>{loading ? 'Создаём аккаунт...' : 'Зарегистрироваться'}</span>
            </button>
          </form>

          <p className="text-center text-white/40 text-sm mt-6">
            {t('auth_have_account')}{' '}
            <Link href="/auth/login" className="text-[#C4A97D] hover:text-[#E8D5B0] transition-colors font-medium">
              {t('auth_login')}
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}
