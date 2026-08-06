import type { BlockData, Project } from '@/types'
import type { OnboardingState } from '@/lib/userSettings'
import { deriveVariables } from '@/lib/siteVariables'

/**
 * Онбординг и подсказки помощника.
 *
 * Главный принцип: шаги считаются из реальных данных сайта, а не из отдельного
 * счётчика «пользователь нажал далее». Поэтому прогресс не врёт: если человек
 * удалит фотографии, шаг снова станет невыполненным, а если заполнит всё
 * вручную мимо обучения — шаги закроются сами.
 *
 * Исключение — шаг «Проверьте сайт»: открытие предпросмотра из данных не видно,
 * его отмечаем флагом в настройках пользователя.
 */

export type StepId =
  | 'create'
  | 'names'
  | 'date'
  | 'details'
  | 'photos'
  | 'preview'
  | 'publish'

export interface OnboardingStep {
  id: StepId
  title: string
  /** Что именно нужно сделать — короткой фразой, без общих слов. */
  hint: string
  /** Куда ведёт действие. Подставляется id проекта, если он уже есть. */
  href: (projectId?: string) => string
  action: string
}

export const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: 'create',
    title: 'Выберите шаблон',
    hint: 'С него начинается сайт: композиция первого экрана, палитра и шрифты. Всё это меняется позже.',
    href: () => '/dashboard/new',
    action: 'Выбрать шаблон',
  },
  {
    id: 'names',
    title: 'Впишите имена',
    hint: 'Имена подставятся сразу во все блоки — на главный экран, в подвал и в форму для гостей.',
    href: (id) => (id ? `/dashboard/edit/${id}` : '/dashboard/new'),
    action: 'Открыть редактор',
  },
  {
    id: 'date',
    title: 'Укажите дату и время',
    hint: 'Дата нужна таймеру обратного отсчёта и блоку с расписанием дня.',
    href: (id) => (id ? `/dashboard/edit/${id}` : '/dashboard/new'),
    action: 'Указать дату',
  },
  {
    id: 'details',
    title: 'Заполните место проведения',
    hint: 'Площадка и адрес попадут в блок локации и в кнопку «Открыть на карте».',
    href: (id) => (id ? `/dashboard/edit/${id}` : '/dashboard/new'),
    action: 'Добавить площадку',
  },
  {
    id: 'photos',
    title: 'Добавьте свои фотографии',
    hint: 'Пока стоят подложки из палитры шаблона. Свои кадры делают приглашение вашим.',
    href: (id) => (id ? `/dashboard/edit/${id}` : '/dashboard/new'),
    action: 'Загрузить фото',
  },
  {
    id: 'preview',
    title: 'Проверьте, как это увидят гости',
    hint: 'Предпросмотр показывает черновик и не меняет опубликованный сайт.',
    href: (id) => (id ? `/dashboard/edit/${id}?preview=1` : '/dashboard'),
    action: 'Открыть предпросмотр',
  },
  {
    id: 'publish',
    title: 'Опубликуйте приглашение',
    hint: 'Публикация — единственное действие, которое меняет то, что видят гости. Автосохранение этого не делает.',
    href: (id) => (id ? `/dashboard/edit/${id}` : '/dashboard'),
    action: 'Перейти к публикации',
  },
]

/** Загруженные пользователем файлы лежат в Supabase, подложки — это data-URI. */
function isUserPhoto(value: unknown): boolean {
  return typeof value === 'string' && value.length > 0 && !value.startsWith('data:')
}

function blockPhotos(block: BlockData): string[] {
  const out: string[] = []
  for (const [key, value] of Object.entries(block.content)) {
    if (key === 'images' && typeof value === 'string') {
      try {
        const parsed = JSON.parse(value) as unknown
        if (Array.isArray(parsed)) parsed.forEach((v) => { if (isUserPhoto(v)) out.push(v as string) })
      } catch { /* строка не JSON — пропускаем */ }
      continue
    }
    if (/image|photo|background/i.test(key) && isUserPhoto(value)) out.push(value as string)
  }
  return out
}

export interface StepState extends OnboardingStep {
  done: boolean
}

export interface OnboardingProgress {
  steps: StepState[]
  doneCount: number
  total: number
  percent: number
  /** Первый незакрытый шаг — на него и указывает помощник. */
  next: StepState | null
  complete: boolean
  /** Проект, к которому относится прогресс. */
  project: Project | null
}

/**
 * Считает прогресс по первому (самому раннему) проекту пользователя.
 * Обучение привязано к первому сайту: дальше человек уже знает, что делать.
 */
export function getOnboardingProgress(
  projects: Project[],
  state: OnboardingState,
): OnboardingProgress {
  // Самый старый проект — тот, с которого человек начал
  const project = projects.length
    ? [...projects].sort((a, b) => (a.created_at < b.created_at ? -1 : 1))[0]
    : null

  const vars = project ? deriveVariables(project.blocks) : null
  const photos = project ? project.blocks.flatMap(blockPhotos) : []

  const done: Record<StepId, boolean> = {
    create: !!project,
    names: !!vars?.bride?.trim() && !!vars?.groom?.trim(),
    date: !!vars?.date?.trim(),
    details: !!vars?.venue?.trim() || !!vars?.address?.trim(),
    photos: photos.length > 0,
    // Открытие предпросмотра из данных не видно — отмечаем флагом
    preview: state.seenSteps.includes('preview'),
    publish: !!project?.published,
  }

  const steps: StepState[] = ONBOARDING_STEPS.map((s) => ({ ...s, done: done[s.id] }))
  const doneCount = steps.filter((s) => s.done).length
  const total = steps.length

  return {
    steps,
    doneCount,
    total,
    percent: Math.round((doneCount / total) * 100),
    next: steps.find((s) => !s.done) ?? null,
    complete: doneCount === total,
    project,
  }
}

/** Показывать ли обучение: пока не пройдено, не пропущено и подсказки включены. */
export function shouldShowOnboarding(state: OnboardingState, progress: OnboardingProgress): boolean {
  if (!state.hintsEnabled) return false
  if (state.finished) return false
  return !progress.complete
}
