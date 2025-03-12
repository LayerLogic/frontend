<template>
  <div class="test-layout">
    <header class="header">
      <h1>Test Layout</h1>
    </header>
  </div>
</template>

<script>
export default {
  name: 'TestLayout',
}
</script>

<style scoped>
.test-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.header {
  padding: 1rem;
}
</style>
