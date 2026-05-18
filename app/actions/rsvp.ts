'use server'

interface RSVPData {
  name: string
  attending: 'yes' | 'no'
  guestCount: number
  projectTitle: string
  projectSlug: string
}

export async function sendRSVPToTelegram(data: RSVPData): Promise<{ ok: boolean }> {
  const botToken = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID

  // If Telegram not configured — just return ok (still save to DB)
  if (!botToken || !chatId) {
    console.log('RSVP received (no Telegram configured):', data)
    return { ok: true }
  }

  const emoji = data.attending === 'yes' ? '✅' : '❌'
  const statusText = data.attending === 'yes' ? 'Придёт' : 'Не сможет'
  const guestText = data.attending === 'yes' ? `👥 Гостей: ${data.guestCount}` : ''

  const text = [
    `💌 *Новый ответ RSVP*`,
    ``,
    `📝 Приглашение: *${data.projectTitle}*`,
    `🔗 zefir.kz/${data.projectSlug}`,
    ``,
    `👤 Имя: *${data.name}*`,
    `${emoji} Статус: *${statusText}*`,
    guestText,
    ``,
    `🕐 ${new Date().toLocaleString('ru-RU', { timeZone: 'Asia/Almaty' })}`,
  ].filter(Boolean).join('\n')

  try {
    const res = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: 'Markdown',
      }),
    })
    const json = await res.json()
    return { ok: json.ok }
  } catch (err) {
    console.error('Telegram RSVP error:', err)
    return { ok: false }
  }
}

export async function saveRSVPToDatabase(data: RSVPData & { projectId: string }) {
  // Save RSVP to Supabase rsvp_responses table
  // Table structure: id, project_id, name, attending, guest_count, created_at
  try {
    const { createClient } = await import('@/lib/supabase/server')
    const supabase = await createClient()

    const { error } = await supabase
      .from('rsvp_responses')
      .insert({
        project_id: data.projectId,
        name: data.name,
        attending: data.attending,
        guest_count: data.attending === 'yes' ? data.guestCount : 0,
      })

    if (error) {
      // Table might not exist yet — non-critical
      console.warn('RSVP DB save skipped:', error.message)
    }
  } catch (err) {
    console.warn('RSVP DB error:', err)
  }
}
