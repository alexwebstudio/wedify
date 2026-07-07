'use client'
import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/lib/hooks/useAuth'
import type { BlockType } from '@/types'

export type Plan = 'start' | 'standard' | 'premium'

// ПУБЛИЧНЫЙ БИЛД: премиум-подписка недоступна (блоки Premium видны, но заблокированы).
// Тестовые премиум-подписки остаются только в приватном dev-файле.
const PREMIUM_EMAILS: string[] = []
// Максимально доступный тариф в открытом доступе.
const MAX_PUBLIC_PLAN: Plan = 'standard'

export const PLAN_RANK: Record<Plan, number> = { start: 0, standard: 1, premium: 2 }

export const PLAN_META: Record<Plan, { label: string; short: string; color: string; desc: string; price: string }> = {
  start:    { label: 'Стартовая', short: 'Start',   color: '#7E8E6A', price: '0 ₸',      desc: 'Базовые блоки для простого приглашения' },
  standard: { label: 'Стандарт',  short: 'Standard', color: '#C4A97D', price: '3 590 ₸', desc: 'Библиотека блоков и полный редактор' },
  premium:  { label: 'Премиум',   short: 'Premium',  color: '#B8860B', price: '7 990 ₸', desc: 'Эксклюзивные премиум-блоки и анимации' },
}

// Базовые блоки, доступные на стартовом тарифе.
export const BASE_BLOCK_TYPES: BlockType[] = ['hero', 'story', 'gallery', 'timer', 'location', 'rsvp', 'footer', 'final']

export function isBaseBlockType(t: BlockType): boolean {
  return BASE_BLOCK_TYPES.includes(t)
}

// На стартовом тарифе нельзя добавлять новые блоки.
export function canAddBlocks(plan: Plan): boolean {
  return PLAN_RANK[plan] >= PLAN_RANK.standard
}

// Премиум-блоки доступны только на премиуме.
export function canUsePremium(plan: Plan): boolean {
  return PLAN_RANK[plan] >= PLAN_RANK.premium
}

const keyFor = (id?: string) => `wedify.plan.${id || 'anon'}`

export function resolvePlan(email?: string | null, override?: Plan | null): Plan {
  if (email && PREMIUM_EMAILS.includes(email.toLowerCase())) return 'premium'
  return override ?? 'start'
}

/**
 * Тариф текущего пользователя. Работает в тестовом режиме:
 * demo-почта → Премиум; остальные → Стартовая (с возможностью «демо-оплаты»,
 * которая меняет статус мгновенно, без повторного входа).
 */
export function usePlan() {
  const { user } = useAuth()
  const email = user?.email || null
  const forced = !!(email && PREMIUM_EMAILS.includes(email.toLowerCase()))
  const [override, setOverride] = useState<Plan | null>(null)

  const clamp = (p: Plan): Plan => (PLAN_RANK[p] > PLAN_RANK[MAX_PUBLIC_PLAN] ? MAX_PUBLIC_PLAN : p)

  useEffect(() => {
    if (!user) { setOverride(null); return }
    try {
      const v = localStorage.getItem(keyFor(user.id)) as Plan | null
      setOverride(v && ['start', 'standard', 'premium'].includes(v) ? clamp(v) : null)
    } catch { setOverride(null) }
  }, [user])

  // премиум в открытом доступе недоступен — жёстко ограничиваем
  const plan = clamp(resolvePlan(email, override))

  const setPlan = useCallback((next: Plan) => {
    if (!user) return
    const capped = PLAN_RANK[next] > PLAN_RANK[MAX_PUBLIC_PLAN] ? MAX_PUBLIC_PLAN : next
    try { localStorage.setItem(keyFor(user.id), capped) } catch {}
    setOverride(capped)
  }, [user])

  return { plan, setPlan, forced, meta: PLAN_META[plan] }
}
