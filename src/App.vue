<script>
import { RouterView } from 'vue-router'
import { Toaster } from '@/components/ui/sonner'
import 'vue-sonner/style.css'

export default {
  name: 'App',
  components: {
    RouterView,
    Toaster,
  },
}
</script>

<template>
  <RouterView />
  <Toaster position="bottom-right" richColors />
</template>
