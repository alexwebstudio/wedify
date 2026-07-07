export type Language = 'ru' | 'kz'

export type TemplateId = 'classic-luxury' | 'minimal-white' | 'dark-elegant' | 'sage-garden' | 'rose-blush'

export type BlockType =
  | 'hero'
  | 'story'
  | 'gallery'
  | 'timer'
  | 'location'
  | 'rsvp'
  | 'final'
  | 'schedule'
  | 'infocard'
  | 'video'
  | 'footer'
  | 'curtains'
  | 'preloader'
  | 'envelope'
  | 'dresscode'
  | 'custom'

// Глобальные переменные сайта — единый источник имён/даты/локации и пр.
// Значения «живут» внутри блоков; этот тип описывает их для панели «Данные сайта».
export interface SiteVariables {
  bride: string
  groom: string
  date: string
  time: string
  venue: string
  address: string
  coords: string
  mapUrl: string
  dresscode: string
  contactName: string
  contactPhone: string
  gifts: string
  instagram: string
  telegram: string
  whatsapp: string
  musicTitle: string
}

export interface BlockData {
  id: string
  type: BlockType
  enabled: boolean
  order: number
  content: Record<string, string | string[] | boolean | number>
}

export interface ProjectColors {
  primary: string
  secondary: string
  accent: string
  background: string
  text: string
}

export interface ProjectFonts {
  heading: string
  body: string
  // Форма элементов сайта. Опциональны — старые проекты не ломаются.
  buttonStyle?: 'rounded' | 'pill' | 'sharp'
  imageStyle?: 'rounded' | 'square' | 'pill' | 'circle'
}

export interface ProjectMusic {
  url: string | null
  autoplay: boolean
  title: string
}

export interface Project {
  id: string
  user_id: string
  title: string
  slug: string
  template: TemplateId
  language: Language
  colors: ProjectColors
  fonts: ProjectFonts
  music: ProjectMusic
  blocks: BlockData[]
  published: boolean
  created_at: string
  updated_at: string
}

export interface Template {
  id: TemplateId
  name: string
  description: string
  preview_url: string
  colors: ProjectColors
  fonts: ProjectFonts
  isPremium: boolean
}

export interface User {
  id: string
  email: string
  created_at: string
}

export type I18nKeys = {
  // Navigation
  nav_dashboard: string
  nav_new_project: string
  nav_logout: string
  nav_login: string
  nav_register: string
  // Landing
  hero_title: string
  hero_subtitle: string
  hero_cta: string
  hero_cta_secondary: string
  // Dashboard
  dashboard_title: string
  dashboard_empty: string
  dashboard_create: string
  dashboard_edit: string
  dashboard_delete: string
  dashboard_publish: string
  dashboard_unpublish: string
  dashboard_view: string
  dashboard_copy_link: string
  // Auth
  auth_email: string
  auth_password: string
  auth_login: string
  auth_register: string
  auth_no_account: string
  auth_have_account: string
  // Editor
  editor_save: string
  editor_publish: string
  editor_preview: string
  editor_back: string
  editor_template: string
  editor_colors: string
  editor_fonts: string
  editor_music: string
  editor_blocks: string
  editor_language: string
  // Blocks
  block_hero: string
  block_story: string
  block_gallery: string
  block_timer: string
  block_location: string
  block_rsvp: string
  block_final: string
  // Common
  save: string
  cancel: string
  delete: string
  close: string
  upload: string
  choose: string
  loading: string
  error: string
  success: string
  copied: string
  // Support
  support_title: string
  support_subtitle: string
}
