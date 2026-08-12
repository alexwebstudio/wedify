import type { BlockData, Project } from '@/types'
import type { OnboardingState, SiteOnboardingState } from '@/lib/userSettings'
import { deriveVariables } from '@/lib/siteVariables'

/**
 * Онбординг и подсказки помощника.
 *
 * Два принципа.
 *
 * 1. Шаги считаются из реальных данных сайта, а не из счётчика «нажал далее».
 *    Поэтому прогресс не врёт: удалили фотографии — шаг снова открылся,
 *    заполнили всё мимо обучения — шаги закрылись сами.
 *
 * 2. Прогресс привязан к конкретному сайту, а не к аккаунту. «Мои сайты»
 *    и редактор одного и того же сайта читают одну запись, поэтому шаг,
 *    пройденный в одном месте, сразу считается пройденным в другом.
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
  /** Пояснение для редактора: там человек уже внутри и ждёт конкретики. */
  editorHint: string
  href: (projectId?: string) => string
  action: string
}

export const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: 'create',
    title: 'Выберите шаблон',
    hint: 'С него начинается сайт: композиция первого экрана, палитра и шрифты. Всё это меняется позже.',
    editorHint: 'Шаблон уже выбран. Оформление можно поменять на вкладке «Стиль» слева.',
    href: () => '/dashboard/new',
    action: 'Выбрать шаблон',
  },
  {
    id: 'names',
    title: 'Впишите имена',
    hint: 'Имена подставятся сразу во все блоки — на главный экран, в подвал и в форму для гостей.',
    editorHint: 'Нажмите прямо на имя на главном экране и напечатайте своё. Остальные блоки подхватят его сами.',
    href: (id) => (id ? `/dashboard/edit/${id}` : '/dashboard/new'),
    action: 'Открыть редактор',
  },
  {
    id: 'date',
    title: 'Укажите дату и время',
    hint: 'Дата нужна таймеру обратного отсчёта и блоку с расписанием дня.',
    editorHint: 'Дата на главном экране редактируется прямо на месте — нажмите на неё и выберите день.',
    href: (id) => (id ? `/dashboard/edit/${id}` : '/dashboard/new'),
    action: 'Указать дату',
  },
  {
    id: 'details',
    title: 'Заполните место проведения',
    hint: 'Площадка и адрес попадут в блок локации и в кнопку «Открыть на карте».',
    editorHint: 'Пролистайте до блока «Место проведения» и впишите площадку и адрес — появится кнопка на карту.',
    href: (id) => (id ? `/dashboard/edit/${id}` : '/dashboard/new'),
    action: 'Добавить площадку',
  },
  {
    id: 'photos',
    title: 'Добавьте свои фотографии',
    hint: 'Пока стоят подложки из палитры шаблона. Свои кадры делают приглашение вашим.',
    editorHint: 'Наведите на изображение и нажмите «Сменить фото». Крупные снимки уменьшатся автоматически.',
    href: (id) => (id ? `/dashboard/edit/${id}` : '/dashboard/new'),
    action: 'Загрузить фото',
  },
  {
    id: 'preview',
    title: 'Проверьте, как это увидят гости',
    hint: 'Предпросмотр показывает черновик и не меняет опубликованный сайт.',
    editorHint: 'Кнопка «Предпросмотр» вверху убирает панели редактора. Опубликованный сайт при этом не меняется.',
    href: (id) => (id ? `/dashboard/edit/${id}?preview=1` : '/dashboard'),
    action: 'Открыть предпросмотр',
  },
  {
    id: 'publish',
    title: 'Опубликуйте приглашение',
    hint: 'Публикация — единственное действие, которое меняет то, что видят гости. Автосохранение этого не делает.',
    editorHint: 'Автосохранение пишет только в черновик. Гости увидят правки после кнопки «Опубликовать».',
    href: (id) => (id ? `/dashboard/edit/${id}` : '/dashboard'),
    action: 'Перейти к публикации',
  },
]

/** Пустой прогресс для сайта, по которому обучение ещё не начиналось. */
export const EMPTY_SITE_STATE: SiteOnboardingState = { finished: false, seenSteps: [] }

export function getSiteState(state: OnboardingState, projectId?: string): SiteOnboardingState {
  if (!projectId) return EMPTY_SITE_STATE
  return state.sites[projectId] ?? EMPTY_SITE_STATE
}

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
  project: Project | null
  /** Прогресс именно этого сайта. */
  siteState: SiteOnboardingState
}

/** Прогресс по конкретному сайту. */
export function getProjectProgress(
  project: Project | null,
  state: OnboardingState,
): OnboardingProgress {
  const siteState = getSiteState(state, project?.id)
  const vars = project ? deriveVariables(project.blocks) : null
  const photos = project ? project.blocks.flatMap(blockPhotos) : []

  const done: Record<StepId, boolean> = {
    create: !!project,
    names: !!vars?.bride?.trim() && !!vars?.groom?.trim(),
    date: !!vars?.date?.trim(),
    details: !!vars?.venue?.trim() || !!vars?.address?.trim(),
    photos: photos.length > 0,
    // Открытие предпросмотра из данных не видно — отмечаем флагом
    preview: siteState.seenSteps.includes('preview'),
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
    siteState,
  }
}

/**
 * Сайт, по которому показываем обучение в кабинете, — последний изменённый.
 * Именно с ним человек работает прямо сейчас.
 */
export function pickActiveProject(projects: Project[]): Project | null {
  if (!projects.length) return null
  return [...projects].sort((a, b) => (a.updated_at < b.updated_at ? 1 : -1))[0]
}

/** Показывать ли обучение: подсказки включены, по этому сайту не пройдено. */
export function shouldShowOnboarding(state: OnboardingState, progress: OnboardingProgress): boolean {
  if (!state.hintsEnabled) return false
  if (progress.siteState.finished) return false
  return true
}
