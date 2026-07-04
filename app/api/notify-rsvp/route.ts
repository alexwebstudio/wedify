import { NextRequest, NextResponse } from 'next/server'

/**
 * Отправка e-mail уведомления о новом RSVP.
 *
 * Работает при заданном RESEND_API_KEY (https://resend.com — бесплатный тариф).
 * Env:
 *   RESEND_API_KEY   — ключ Resend
 *   RSVP_FROM_EMAIL  — адрес отправителя (по умолчанию onboarding@resend.dev)
 *
 * Тело запроса (JSON):
 *   { to, siteName, guestName, guests, attending, comment }
 *
 * Если ключа нет — запрос не падает, а возвращает { ok:false, reason:'no_key' },
 * чтобы форма гостя продолжала работать (ответ всё равно сохраняется/уходит в Telegram).
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { to, siteName = 'Ваш сайт', guestName = 'Гость', guests, attending, comment } = body || {}

    if (!to) return NextResponse.json({ ok: false, reason: 'no_recipient' }, { status: 400 })

    const key = process.env.RESEND_API_KEY
    if (!key) {
      // честно: без ключа письмо не уходит
      return NextResponse.json({ ok: false, reason: 'no_key' })
    }

    const from = process.env.RSVP_FROM_EMAIL || 'Wedify <onboarding@resend.dev>'
    const attendText = attending === false ? 'НЕ придёт' : 'придёт'
    const html = `
      <div style="font-family:Arial,sans-serif;max-width:520px;margin:0 auto;color:#2C2017">
        <h2 style="font-weight:400;color:#8B6F47">Новый ответ на приглашение</h2>
        <p><b>Сайт:</b> ${escapeHtml(siteName)}</p>
        <p><b>Гость:</b> ${escapeHtml(guestName)}</p>
        <p><b>Статус:</b> ${attendText}</p>
        ${guests != null ? `<p><b>Количество гостей:</b> ${Number(guests) || 0}</p>` : ''}
        ${comment ? `<p><b>Комментарий:</b> ${escapeHtml(String(comment))}</p>` : ''}
        <hr style="border:none;border-top:1px solid #eee;margin:20px 0" />
        <p style="font-size:12px;color:#9A8B76">Отправлено через Wedify</p>
      </div>`

    const resp = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from, to, subject: `RSVP: ${guestName} — ${siteName}`, html }),
    })

    if (!resp.ok) {
      const detail = await resp.text().catch(() => '')
      return NextResponse.json({ ok: false, reason: 'send_failed', detail }, { status: 502 })
    }
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ ok: false, reason: 'error', detail: String(e) }, { status: 500 })
  }
}

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c] as string))
}
