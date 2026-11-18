<script setup lang="ts">
import { lang, type Lang } from '../composables/lang'

const options: { value: Lang, label: string }[] = [
  { value: 'vi', label: 'Tiếng Việt' },
  { value: 'en', label: 'English' },
]
</script>

<template>
  <div class="lang-switch" role="group" aria-label="Language">
    <button
      v-for="o in options"
      :key="o.value"
      type="button"
      :aria-pressed="lang === o.value"
      :class="{ active: lang === o.value }"
      @click.stop="lang = o.value"
    >
      {{ o.label }}
    </button>
  </div>
</template>

<style scoped>
.lang-switch {
  position: absolute;
  top: 1.4rem;
  right: 1.6rem;
  z-index: 10;
  display: inline-flex;
  padding: 3px;
  gap: 2px;
  border-radius: 999px;
  background: var(--panel);
  border: 1px solid var(--line);
  box-shadow: 0 2px 10px rgba(29, 27, 38, 0.06);
}
button {
  font: 600 0.72rem/1 'Be Vietnam Pro', sans-serif;
  padding: 0.45rem 0.85rem;
  border-radius: 999px;
  color: var(--muted);
  background: transparent;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
}
button:hover { color: var(--text); }
button.active {
  background: var(--accent);
  color: var(--on-accent);
}
</style>
