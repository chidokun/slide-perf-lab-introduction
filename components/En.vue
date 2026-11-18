<script setup lang="ts">
import { lang } from '../composables/lang'
</script>

<template>
  <slot v-if="lang === 'en'" />
</template>
