import type { BlockData, SiteVariables } from '@/types'

export const EMPTY_VARS: SiteVariables = {
  bride: '', groom: '', date: '', time: '16:00',
  venue: '', address: '', coords: '', mapUrl: '', dresscode: '',
  contactName: '', contactPhone: '', gifts: '',
  instagram: '', telegram: '', whatsapp: '', musicTitle: '',
}

function str(v: unknown): string {
  return typeof v === 'string' ? v : ''
}

// dd.mm.yyyy для футера / отображения
export function displayDate(iso: string): string {
  if (!iso) return ''
  try {
    const d = new Date(iso)
    if (isNaN(d.getTime())) return iso
    const p = (n: number) => String(n).padStart(2, '0')
    return `${p(d.getDate())}.${p(d.getMonth() + 1)}.${d.getFullYear()}`
  } catch { return iso }
}

// Считывает глобальные значения из блоков (первое совпадение по типу).
export function deriveVariables(blocks: BlockData[]): SiteVariables {
  const byType = (t: string) => blocks.find((b) => b.type === t)?.content ?? {}
  const infoWith = (needle: string) =>
    blocks.find((b) => b.type === 'infocard' && str(b.content.title).toLowerCase().includes(needle))?.content
  const hero = byType('hero'); const loc = byType('location'); const rsvp = byType('rsvp'); const footer = byType('footer')
  const gifts = infoWith('подар'); const contacts = infoWith('контакт')

  return {
    bride: str(hero.bride),
    groom: str(hero.groom),
    date: str(hero.date) || str(byType('timer').date),
    time: str(hero.time) || '16:00',
    venue: str(loc.venue),
    address: str(loc.address),
    coords: str(loc.coords),
    mapUrl: str(loc.mapUrl),
    dresscode: str(loc.dresscode),
    contactName: str(contacts?.note).split('·')[0]?.trim() || '',
    contactPhone: str(rsvp.phone),
    gifts: str(gifts?.text),
    instagram: str(footer.instagram),
    telegram: str(footer.telegram),
    whatsapp: str(footer.whatsapp),
    musicTitle: '',
  }
}

// Раскладывает глобальные значения обратно во все подходящие блоки.
// Меняет только те поля, что относятся к переменным — остальной контент не трогает.
export function applyVariables(blocks: BlockData[], v: SiteVariables): BlockData[] {
  const names = [v.bride, v.groom].filter(Boolean).join(' & ')
  const disp = displayDate(v.date)

  return blocks.map((b) => {
    const c = { ...b.content }
    switch (b.type) {
      case 'hero':
        if (v.bride) c.bride = v.bride
        if (v.groom) c.groom = v.groom
        if (v.date) c.date = v.date
        if (v.time) c.time = v.time
        break
      case 'timer':
        if (v.date) c.date = v.date
        break
      case 'final':
        if (names) c.title = names
        if (v.date) c.date = v.date
        break
      case 'footer':
        if (names) c.names = names
        if (disp) c.date = disp
        if (v.instagram !== undefined) c.instagram = v.instagram
        if (v.telegram !== undefined) c.telegram = v.telegram
        if (v.whatsapp !== undefined) c.whatsapp = v.whatsapp
        break
      case 'location':
        if (v.venue) c.venue = v.venue
        if (v.address) c.address = v.address
        if (v.mapUrl) c.mapUrl = v.mapUrl
        if (v.coords) c.coords = v.coords
        if (v.dresscode) c.dresscode = v.dresscode
        break
      case 'rsvp':
        if (v.contactPhone) c.phone = v.contactPhone
        break
      case 'infocard': {
        const title = str(c.title).toLowerCase()
        if (title.includes('подар') && v.gifts) c.text = v.gifts
        if (title.includes('контакт') && (v.contactName || v.contactPhone)) {
          c.note = [v.contactName, v.contactPhone].filter(Boolean).join(' · ')
        }
        break
      }
    }
    return { ...b, content: c }
  })
}
