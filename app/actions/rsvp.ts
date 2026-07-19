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
    `🔗 wedify.kz/${data.projectSlug}`,
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

// Отправка письма-уведомления о RSVP через Resend.
// Архитектура готова: нужно лишь задать RESEND_API_KEY, RSVP_FROM_EMAIL, RSVP_TO_EMAIL.
export async function sendRSVPEmail(data: RSVPData): Promise<{ ok: boolean; reason?: string }> {
  const key = process.env.RESEND_API_KEY
  const to = process.env.RSVP_TO_EMAIL
  if (!key || !to) return { ok: false, reason: 'not_configured' }

  const from = process.env.RSVP_FROM_EMAIL || 'Maruno <onboarding@resend.dev>'
  const status = data.attending === 'yes' ? 'придёт' : 'НЕ придёт'
  const sentAt = new Date().toLocaleString('ru-RU', { timeZone: 'Asia/Almaty' })
  const esc = (s: string) => String(s).replace(/[<>&]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' }[c] || c))
  const row = (label: string, value: string, strong = false) =>
    `<tr><td style="padding:11px 0;border-bottom:1px solid #F0E9DE"><span style="display:inline-block;width:150px;color:#9A8B76;font-size:13px">${label}</span><span style="color:#2C2017;font-size:15px;${strong ? 'font-weight:600' : ''}">${value}</span></td></tr>`
  const html = `
    <div style="margin:0;padding:28px 12px;background:#F3EEE7;font-family:'Segoe UI',Arial,sans-serif">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#fff;border-radius:20px;overflow:hidden;box-shadow:0 12px 40px rgba(120,90,50,.14)">
        <tr><td style="background:linear-gradient(135deg,#C4A97D,#8B6F47);padding:32px 30px;text-align:center">
          <div style="font-size:30px;margin-bottom:8px">💌</div>
          <div style="color:#fff;font-size:20px;font-weight:600">Новая регистрация RSVP</div>
          <div style="color:rgba(255,255,255,.82);font-size:13px;margin-top:6px">${esc(data.projectTitle)}</div>
        </td></tr>
        <tr><td style="padding:26px 30px 6px">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            ${row('Имя', esc(data.name), true)}
            ${row('Статус', status, true)}
            ${data.attending === 'yes' ? row('Количество гостей', String(data.guestCount), true) : ''}
            ${row('Дата отправки', sentAt)}
          </table>
        </td></tr>
        <tr><td style="padding:20px 30px 28px;text-align:center">
          <div style="height:1px;background:#F0E9DE;margin-bottom:16px"></div>
          <div style="color:#B8A48A;font-size:12px">Отправлено через <b style="color:#8B6F47">Maruno</b></div>
        </td></tr>
      </table></td></tr></table>
    </div>`

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from, to, subject: `RSVP: ${data.name} — ${data.projectTitle}`, html }),
    })
    return { ok: res.ok }
  } catch (err) {
    console.error('RSVP email error:', err)
    return { ok: false, reason: 'send_failed' }
  }
}
