<template>
  <SidebarProvider>
    <AppSidebar />
    <SidebarTrigger />
    <section class="app-wrapper">
      <div class="app-container">
        <RouterView />
      </div>
    </section>
  </SidebarProvider>
</template>

<script>
import { mapState } from 'pinia'
import { RouterView } from 'vue-router'
import { useUserStore } from '@/store/user'

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
  data() {
    return {
      currentRole: '',
    }
  },
  computed: {
    ...mapState(useUserStore, ['username', 'role']),
  },
}
</script>

<style scoped>
.app-wrapper {
  display: flex;
}

.app-container {
  display: flex;
  flex-direction: column;
  width: 100%;
}
</style>
