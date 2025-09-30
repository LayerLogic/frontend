<template>
  <div class="flex flex-col bg-zinc-50 items-center justify-center min-h-dvh text-center">
    <div class="p-6 bg-white rounded-md border border-zinc-200">
      <h1 class="text-8xl m-0 font-black text-zinc-200">404</h1>
      <h2 class="text-2xl mt-6 mb-1.5 mx-0 font-medium">Page Not Found</h2>
      <p class="text-zinc-400 mb-8">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <UiButton class="rounded-full">
        <router-link to="/"> Return to Home </router-link>
      </UiButton>
    </div>
  </div>
</template>

<script>
import { Button as UiButton } from '@/components/ui/button'

export default {
  name: 'NotFoundView',
  components: {
    UiButton,
  },
}
</script>
