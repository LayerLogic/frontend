<template>
  <div class="dashboard-container">
    <RouterView />
    <button @click="handleLogout">Logout</button>
  </div>
</template>

<script>
import { useUserStore } from '@/store/user'
import { mapActions } from 'pinia'
import { RouterView } from 'vue-router'

export default {
  name: 'DashboardLayout',
  components: {
    RouterView,
  },
  data() {
    return {}
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
.dashboard-container {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

button {
  max-width: 100px;
  padding: 8px 16px;
  background-color: #f44336;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 10px;
}

button:hover {
  background-color: #d32f2f;
}
</style>
