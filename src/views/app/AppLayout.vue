<template>
  <SidebarProvider>
    <AppSidebar />
    <SidebarTrigger />
    <section class="flex flex-col min-h-screen w-full">
      <RouterView />
    </section>
  </SidebarProvider>
</template>

<script>
import { RouterView } from 'vue-router'

import AppSidebar from '@/components/ui/AppSidebar.vue'
import { SidebarTrigger, SidebarProvider } from '@/components/ui/sidebar'

export default {
  name: 'AppLayout',
  components: {
    RouterView,
    AppSidebar,
    SidebarTrigger,
    SidebarProvider,
  },
}
</script>
