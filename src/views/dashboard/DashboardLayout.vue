<template>
  <div class="dashboard-container">
    <component :is="currentRole" />
    <button @click="handleLogout">Logout</button>
  </div>
</template>

<script>
import { RouterView } from 'vue-router'
import ResearcherView from './researcher/ResearcherView.vue'
import AdminView from './admin/AdminView.vue'
import CustomerView from './customer/CustomerView.vue'
import { logout } from '@/api/user'

export default {
  name: 'DashboardLayout',
  components: {
    RouterView,
    ResearcherView,
    AdminView,
    CustomerView,
  },
  data() {
    return {
      currentRole: 'customerView',
    }
  },
  methods: {
    async handleLogout() {
      const res = await logout()
      console.log('res', res)
    },
  },
}
</script>

<style scoped>
.root {
  padding: 20px;
}

.root-content {
  margin-bottom: 20px;
}
</style>
