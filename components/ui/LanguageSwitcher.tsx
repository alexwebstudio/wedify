'use client'
import { useAppStore } from '@/lib/store'
import toast from 'react-hot-toast'

export function LanguageSwitcher({ dark = false }: { dark?: boolean }) {
  const { language, setLanguage } = useAppStore()

  const pickKz = () => {
    toast('Казахская версия платформы находится в разработке и станет доступна в одном из ближайших обновлений.', {
      icon: '🇰🇿', duration: 5000, style: { maxWidth: 420, textAlign: 'center' },
    })
  }

  return (
    <div className="flex items-center gap-0.5">
      <button
        onClick={() => setLanguage('ru')}
        className={`px-2.5 py-1.5 rounded-l-lg text-xs font-semibold tracking-widest uppercase transition-all ${
          language === 'ru'
            ? dark
              ? 'bg-white/15 text-white'
              : 'bg-[#2C2017]/10 text-[#2C2017]'
            : dark
              ? 'text-white/40 hover:text-white/70'
              : 'text-[#2C2017]/35 hover:text-[#2C2017]/60'
        }`}
      >
        RU
      </button>
      <span className={`text-xs ${dark ? 'text-white/20' : 'text-[#2C2017]/20'}`}>|</span>
      <button
        onClick={pickKz}
        title="Скоро"
        className={`px-2.5 py-1.5 rounded-r-lg text-xs font-semibold tracking-widest uppercase transition-all ${
          dark ? 'text-white/40 hover:text-white/70' : 'text-[#2C2017]/35 hover:text-[#2C2017]/60'
        }`}
      >
        KZ
      </button>
    </div>
  )
}
