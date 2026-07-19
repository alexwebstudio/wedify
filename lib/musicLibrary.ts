// Каталог музыкальной библиотеки Maruno.
// ВАЖНО: сами аудиофайлы (коммерческие треки) не входят в проект по причинам
// авторских прав. Поле `url` заполняется вашими лицензированными/собственными
// копиями (например, залитыми в Supabase Storage). Метаданные (название/исполнитель)
// нужны только для отображения списка и быстрого выбора.

export type MusicTier = 'standard' | 'premium'

export interface LibraryTrack {
  id: string
  title: string
  artist: string
  tier: MusicTier
  url?: string // заполните ссылкой на свой файл
}

// Первые 10 — тариф Standard, ещё 20 — Premium (итого Premium = 30).
export const MUSIC_LIBRARY: LibraryTrack[] = [
  // ── Standard (10) ──
  { id: 'm01', title: 'At Last', artist: 'Etta James', tier: 'standard' },
  { id: 'm02', title: "Can't Help Falling In Love", artist: 'Elvis Presley', tier: 'standard' },
  { id: 'm03', title: 'What A Wonderful World', artist: 'Louis Armstrong', tier: 'standard' },
  { id: 'm04', title: "Maybe I'm Amazed", artist: 'Paul McCartney', tier: 'standard' },
  { id: 'm05', title: 'The Way You Look Tonight', artist: 'Frank Sinatra', tier: 'standard' },
  { id: 'm06', title: '(Your Love Keeps Lifting Me) Higher & Higher', artist: 'Jackie Wilson', tier: 'standard' },
  { id: 'm07', title: 'Love Is Here To Stay', artist: 'Ella Fitzgerald', tier: 'standard' },
  { id: 'm08', title: 'My Girl', artist: 'The Temptations', tier: 'standard' },
  { id: 'm09', title: 'The Story', artist: 'Brandi Carlile', tier: 'standard' },
  { id: 'm10', title: 'When a Man Loves a Woman', artist: 'Percy Sledge', tier: 'standard' },

  // ── Premium (+20) ──
  { id: 'm11', title: 'It Had to Be You', artist: 'Harry Connick Jr.', tier: 'premium' },
  { id: 'm12', title: 'Crazy Love', artist: 'Van Morrison', tier: 'premium' },
  { id: 'm13', title: 'Always and Forever', artist: 'Luther Vandross', tier: 'premium' },
  { id: 'm14', title: 'Just the Way You Are', artist: 'Billy Joel', tier: 'premium' },
  { id: 'm15', title: 'Home', artist: 'Edward Sharpe & The Magnetic Zeros', tier: 'premium' },
  { id: 'm16', title: 'Amazed', artist: 'Lonestar', tier: 'premium' },
  { id: 'm17', title: 'From This Moment On', artist: 'Shania Twain', tier: 'premium' },
  { id: 'm18', title: "That's All", artist: 'Frank Sinatra', tier: 'premium' },
  { id: 'm19', title: "Danny's Song", artist: 'Loggins & Messina', tier: 'premium' },
  { id: 'm20', title: 'For Once In My Life', artist: 'Stevie Wonder', tier: 'premium' },
  { id: 'm21', title: 'Celebration', artist: 'Kool & The Gang', tier: 'premium' },
  { id: 'm22', title: 'Everlasting Love', artist: 'Carl Carlton', tier: 'premium' },
  { id: 'm23', title: 'Teenage Dream', artist: 'Katy Perry', tier: 'premium' },
  { id: 'm24', title: "You're All I Need To Get By", artist: 'Marvin Gaye', tier: 'premium' },
  { id: 'm25', title: 'When I Fall In Love', artist: 'Nat King Cole', tier: 'premium' },
  { id: 'm26', title: "You're Still The One", artist: 'Shania Twain', tier: 'premium' },
  { id: 'm27', title: 'Breathe', artist: 'Faith Hill', tier: 'premium' },
  { id: 'm28', title: "I'll Be", artist: 'Edwin McCain', tier: 'premium' },
  { id: 'm29', title: 'Thinking Out Loud', artist: 'Ed Sheeran', tier: 'premium' },
  { id: 'm30', title: "Ain't No Mountain High Enough", artist: 'Marvin Gaye', tier: 'premium' },
]

export function libraryForPlan(plan: 'start' | 'standard' | 'premium'): LibraryTrack[] {
  if (plan === 'premium') return MUSIC_LIBRARY
  if (plan === 'standard') return MUSIC_LIBRARY.filter((t) => t.tier === 'standard')
  return [] // на старте библиотека недоступна
}
