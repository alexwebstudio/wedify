'use client'

import { Navbar } from '@/components/ui/Navbar'
import Pricing from '@/components/landing/Pricing'
import Link from 'next/link'

export default function PricingPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#F7F5F2' }}>
      <Navbar dark={false} />

      <section style={{ padding: '120px 20px 20px', textAlign: 'center' }}>
        <p style={{ color: '#B8956A', fontSize: 11, letterSpacing: '.4em', textTransform: 'uppercase', marginBottom: 12 }}>Тарифы</p>
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(2.4rem,6vw,3.6rem)', fontWeight: 300, color: '#1A1410', marginBottom: 12 }}>
          Простые и честные цены
        </h1>
        <p style={{ color: '#8A7F74', fontSize: 15, fontWeight: 300, maxWidth: 520, margin: '0 auto' }}>
          Сейчас сервис бесплатный. Платные тарифы — разовая покупка навсегда, без подписок.
        </p>
      </section>

      <Pricing />

      <div style={{ textAlign: 'center', padding: '10px 20px 70px' }}>
        <Link href="/" style={{ color: '#8B6F47', fontSize: 14, textDecoration: 'none' }}>← На главную</Link>
      </div>
    </div>
  )
}
