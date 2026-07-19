'use client'

import { Navbar } from '@/components/ui/Navbar'
import Pricing from '@/components/landing/Pricing'
import { SiteFooter } from '@/components/landing/SiteFooter'

export default function PricingPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#F7F5F2' }}>
      <Navbar dark={false} />

      <section style={{ padding: '120px 20px 8px', textAlign: 'center' }}>
        <p style={{ color: '#B8956A', fontSize: 11, letterSpacing: '.4em', textTransform: 'uppercase', marginBottom: 12 }}>Тарифы</p>
      </section>

      <Pricing />

      <SiteFooter />
    </div>
  )
}
