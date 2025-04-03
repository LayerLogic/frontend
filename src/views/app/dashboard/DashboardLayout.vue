<template>
  <section class="dashboard-wrapper">
    <div class="dashboard-container">
      <component :is="currentRole" :username="username" />
      <button @click="handleLogout" class="btn">Logout</button>
    </div>
  </section>
</template>

<script>
import { mapActions, mapState } from 'pinia'
import { RouterView } from 'vue-router'

import { useUserStore } from '@/store/user'
import ResearcherView from './researcher/ResearcherView.vue'
import CustomerView from './customer/CustomerView.vue'
import AdminView from './admin/AdminView.vue'

export default {
  name: 'DashboardLayout',
  components: {
    RouterView,
    AdminView,
    ResearcherView,
    CustomerView,
  },
  data() {
    return {
      currentRole: '',
    }
  },
  computed: {
    ...mapState(useUserStore, ['username', 'role']),
  },
  created() {
    if (this.role === 'admin') {
      this.currentRole = 'AdminView'
    } else if (this.role === 'researcher') {
      this.currentRole = 'ResearcherView'
    } else {
      this.currentRole = 'CustomerView'
    }
  },
  methods: {
    ...mapActions(useUserStore, ['logoutUser']),
    async handleLogout() {
      try {
        await this.logoutUser()
        this.$router.push('/auth/login')
      } catch (error) {
        console.error('Error during logout:', error)
      }
    },
  },
}
</script>

<style scoped>
.dashboard-wrapper {
  display: flex;
  gap: 8px;
}

.dashboard-container {
  padding: 12px 16px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.btn {
  max-width: 100px;
  background-color: #f44336;
}

.btn:hover {
  background-color: #d32f2f;
}
</style>
