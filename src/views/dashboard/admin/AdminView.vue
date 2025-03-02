<template>
  <div class="admin-view">
    <h1>Hello, Admin!</h1>
    <div class="content">
      <p>Welcome to your Admin dashboard</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AdminView',
  data() {
    return {
      // Add data properties here
    }
  },
}
</script>

<style scoped>
.admin-view {
  padding: 20px;
}

.content {
  margin-top: 20px;
}
</style>
