/**
 * Подготовка фотографий перед загрузкой.
 *
 * Снимок с телефона весит 4–12 МБ и имеет сторону 4000+ px. Для приглашения
 * это избыточно: гость откроет сайт с мобильного интернета, а браузер всё
 * равно отрисует картинку не крупнее ширины экрана. Раньше файл уходил
 * в хранилище как есть — отсюда долгая загрузка и тяжёлые опубликованные сайты.
 *
 * Уменьшаем разумно: длинная сторона до 2000 px этого достаточно для
 * полноэкранного фона на любом телефоне и для ретины на ноутбуке.
 * Качество 0.85 — заметной потери на фотографии не видно.
 */

export const MAX_UPLOAD_BYTES = 12 * 1024 * 1024
export const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif']

const MAX_EDGE = 2000
const QUALITY = 0.85
/** Ниже этого размера сжимать нечего — вернём оригинал. */
const SKIP_BELOW_BYTES = 400 * 1024

export interface PreparedImage {
  file: File
  width: number
  height: number
  /** Размер до обработки — показываем пользователю, насколько стало легче. */
  originalBytes: number
  bytes: number
}

export class ImageValidationError extends Error {}

/** Проверка до чтения файла: тип и вес. */
export function validateImageFile(file: File): void {
  const typeOk = file.type.startsWith('image/')
  if (!typeOk) {
    throw new ImageValidationError('Это не изображение. Подойдут JPG, PNG или WebP')
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    const mb = Math.round(file.size / 1024 / 1024)
    throw new ImageValidationError(
      `Файл весит ${mb} МБ — это больше допустимых 12 МБ. Выберите снимок поменьше`,
    )
  }
}

function loadBitmap(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => { URL.revokeObjectURL(url); resolve(img) }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new ImageValidationError('Не удалось прочитать изображение — возможно, файл повреждён'))
    }
    img.src = url
  })
}

/**
 * Уменьшает и пережимает снимок.
 * Если браузер не умеет нужный формат (например, HEIC без поддержки),
 * возвращаем оригинал — лучше тяжёлый файл, чем отказ в загрузке.
 */
export async function prepareImage(file: File): Promise<PreparedImage> {
  validateImageFile(file)

  if (file.size <= SKIP_BELOW_BYTES) {
    return { file, width: 0, height: 0, originalBytes: file.size, bytes: file.size }
  }

  let img: HTMLImageElement
  try {
    img = await loadBitmap(file)
  } catch (err) {
    if (err instanceof ImageValidationError) throw err
    return { file, width: 0, height: 0, originalBytes: file.size, bytes: file.size }
  }

  const scale = Math.min(1, MAX_EDGE / Math.max(img.width, img.height))
  const width = Math.round(img.width * scale)
  const height = Math.round(img.height * scale)

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  if (!ctx) return { file, width, height, originalBytes: file.size, bytes: file.size }

  ctx.imageSmoothingQuality = 'high'
  ctx.drawImage(img, 0, 0, width, height)

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, 'image/jpeg', QUALITY),
  )

  // Пережатие не помогло — не портим оригинал ради формальности
  if (!blob || blob.size >= file.size) {
    return { file, width, height, originalBytes: file.size, bytes: file.size }
  }

  const name = file.name.replace(/\.[^.]+$/, '') + '.jpg'
  const prepared = new File([blob], name, { type: 'image/jpeg', lastModified: Date.now() })

  return { file: prepared, width, height, originalBytes: file.size, bytes: prepared.size }
}

/** «3,4 МБ» — для понятного текста об экономии. */
export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} Б`
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} КБ`
  return `${(bytes / 1024 / 1024).toFixed(1).replace('.', ',')} МБ`
}
