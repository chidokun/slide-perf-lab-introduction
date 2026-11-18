import { ref, watch } from 'vue'

export type Lang = 'vi' | 'en'

const KEY = 'slides-lang'

function isLang(v: unknown): v is Lang {
  return v === 'vi' || v === 'en'
}

function initialLang(): Lang {
  try {
    const fromUrl = new URLSearchParams(location.search).get('lang')
    if (isLang(fromUrl)) return fromUrl
    const saved = localStorage.getItem(KEY)
    if (isLang(saved)) return saved
  }
  catch {}
  return 'vi'
}

// Shared across every slide; persisted so presenter/audience tabs stay in sync.
export const lang = ref<Lang>(initialLang())

if (typeof window !== 'undefined') {
  document.documentElement.lang = lang.value

  watch(lang, (v) => {
    document.documentElement.lang = v
    try { localStorage.setItem(KEY, v) }
    catch {}
  })

  window.addEventListener('storage', (e) => {
    if (e.key === KEY && isLang(e.newValue)) lang.value = e.newValue
  })
}
