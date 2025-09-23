<template>
  <section class="app-wrapper">
    <AppSidebar
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
}

.app-container {
  display: flex;
  flex-direction: column;
  width: 100%;
}
</style>
