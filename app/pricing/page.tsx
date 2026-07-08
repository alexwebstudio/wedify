'use client'

import { Navbar } from '@/components/ui/Navbar'
import Pricing from '@/components/landing/Pricing'
import { SiteFooter } from '@/components/landing/SiteFooter'

export default function PricingPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#F7F5F2' }}>
      <Navbar dark={false} />

      <div style={{ paddingTop: 90 }}>
        <Pricing />
      </div>

      <SiteFooter />
    </div>
  )
}
