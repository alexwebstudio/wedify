import Link from 'next/link'
import { Heart } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6"
      style={{ background: 'linear-gradient(135deg, #1C1812, #2C2018)' }}>
      <div className="text-center">
        <Heart size={48} className="text-[#C4A97D] mx-auto mb-6 opacity-50" />
        <h1 className="text-6xl font-light text-white mb-4"
          style={{ fontFamily: 'Cormorant Garamond, serif' }}>404</h1>
        <p className="text-white/40 mb-8">Эта страница не найдена или приглашение ещё не опубликовано</p>
        <Link href="/"
          className="btn-luxury px-6 py-3 rounded-xl font-medium inline-flex items-center gap-2">
          <span>На главную</span>
        </Link>
      </div>
    </div>
  )
}
