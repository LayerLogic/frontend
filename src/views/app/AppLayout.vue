<template>
  <section class="app-wrapper">
    <AppSidebar
      :appName="appName"
      :username="username"
      :role="role"
      :currentPath="$route.path"
      :navigationGroups="navigationGroups"
      :toggleSidebar="toggleSidebar"
      :isCollapsed="opened"
    />
    <div class="app-container">
      <RouterView />
    </div>
  </section>
</template>

<script>
import { mapActions, mapState } from 'pinia'
import { RouterView } from 'vue-router'
import AppSidebar from '@/components/ui/AppSidebar.vue'
import { useUserStore } from '@/store/user'
import { useSidebarStore } from '@/store/sidebar'

export default {
  name: 'AppLayout',
  components: {
    RouterView,
    AppSidebar,
  },
  data() {
    return {
      appName: 'LayerLogic',
      currentRole: '',
    }
  },
  computed: {
    ...mapState(useUserStore, ['username', 'role']),
    ...mapState(useSidebarStore, ['opened', 'navigationGroups']),
  },
  methods: {
    ...mapActions(useSidebarStore, ['toggleSidebar']),
  },
}
</script>

<style scoped>
.app-wrapper {
  display: flex;
  gap: 8px;
}

.app-container {
  padding: 12px 16px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}
</style>
