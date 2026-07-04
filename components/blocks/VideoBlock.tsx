'use client'
import { EditableText } from '@/components/editor/EditableText'
import { fontFamilyValue } from '@/lib/editorPresets'
import type { BlockData, ProjectColors, ProjectFonts } from '@/types'

interface Props {
  block: BlockData
  colors: ProjectColors
  fonts: ProjectFonts
  isEditing: boolean
  onChange: (content: BlockData['content']) => void
}

function toEmbed(url: string): string | null {
  if (!url) return null
  const yt = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{6,})/)
  if (yt) return `https://www.youtube.com/embed/${yt[1]}`
  const vim = url.match(/vimeo\.com\/(?:video\/)?(\d+)/)
  if (vim) return `https://player.vimeo.com/video/${vim[1]}`
  if (/player\.vimeo\.com|youtube\.com\/embed/.test(url)) return url
  return null
}

export function VideoBlock({ block, colors, fonts, isEditing, onChange }: Props) {
  const content = block.content as { title?: string; url?: string }
  const update = (key: string, val: string) => onChange({ ...content, [key]: val })
  const embed = toEmbed(content.url || '')

  return (
    <section className="py-20 px-6" style={{ backgroundColor: colors.background }}>
      <div className="max-w-3xl mx-auto">
        <EditableText
          tag="h2"
          value={content.title || 'Наше видео'}
          onChange={(v) => update('title', v)}
          isEditing={isEditing}
          className="text-center mb-3"
          style={{ fontFamily: fontFamilyValue(fonts.heading), fontSize: 'clamp(1.8rem,5vw,2.6rem)', fontWeight: 400, color: colors.text }}
        />
        <div className="mx-auto mb-10 w-10 h-px" style={{ background: colors.primary }} />

        <div className="relative w-full overflow-hidden rounded-2xl shadow-lg" style={{ aspectRatio: '16 / 9', background: '#000' }}>
          {embed ? (
            <iframe
              src={embed}
              className="absolute inset-0 w-full h-full"
              style={{ border: 0 }}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title={content.title || 'video'}
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6" style={{ color: '#fff' }}>
              <span style={{ fontSize: 40, marginBottom: 12 }}>▶</span>
              <p style={{ fontSize: 14, opacity: 0.8 }}>Вставьте ссылку на видео YouTube или Vimeo</p>
            </div>
          )}
        </div>

        {isEditing && (
          <div className="mt-5 max-w-md mx-auto">
            <label className="block text-xs uppercase tracking-widest mb-2 text-center opacity-50" style={{ color: colors.text }}>
              Ссылка на видео (YouTube / Vimeo)
            </label>
            <input
              type="text"
              value={content.url || ''}
              onChange={(e) => update('url', e.target.value)}
              placeholder="https://youtu.be/..."
              className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
              style={{ border: `1px solid ${colors.primary}40`, background: '#fff', color: '#2C2017' }}
            />
          </div>
        )}
      </div>
    </section>
  )
}
