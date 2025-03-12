<template>
  <div class="customer-view">
    <h1>Hello, {{ username }}!</h1>
    <div class="content">
      <p>Welcome to your customer dashboard</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CustomerView',
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
.customer-view {
  padding-bottom: 20px;
}

.content {
  margin-top: 20px;
}
</style>
