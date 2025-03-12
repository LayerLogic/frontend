<template>
  <div class="researcher-view">
    <h1>Hello, {{ username }}!</h1>
    <div class="content">
      <p>Welcome to your research dashboard</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ResearcherView',
  props: {
    username: {
      type: String,
      required: true,
    },
  },
  data() {
    return {}
  },
}
</script>

<style scoped>
.researcher-view {
  padding-bottom: 20px;
}

.content {
  margin-top: 0px;
}
</style>
