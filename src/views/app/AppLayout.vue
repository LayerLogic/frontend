<template>
  <SidebarProvider>
    <AppSidebar />
    <SidebarTrigger />
    <section class="flex">
      <div class="flex flex-col w-full min-h-screen">
        <RouterView />
      </div>
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
