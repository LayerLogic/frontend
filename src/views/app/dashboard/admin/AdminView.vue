<template>
  <div class="admin-view">
    <h1>Hello, {{ username }}!</h1>
    <div class="content">
      <p>Welcome to your Admin dashboard</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AdminView',
  props: {
    username: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      // Add data properties here
    }
  },
}
</script>

<style scoped>
.admin-view {
  padding-bottom: 20px;
}

.content {
  margin-top: 20px;
}
</style>
