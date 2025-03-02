<template>
  <div class="dashboard">
    <div class="dashboard-content">
      <p>Welcome to your dashboard!</p>
    </div>
  </div>
  <RouterView />
</template>

<script>
import { RouterView } from 'vue-router'

export default {
  name: 'DashboardLayout',
  components: {
    RouterView,
  },
}
</script>

<style scoped>
.dashboard {
  padding: 20px;
}

.dashboard-content {
  margin-bottom: 20px;
}
</style>
