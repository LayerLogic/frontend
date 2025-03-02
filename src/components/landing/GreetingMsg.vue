<script setup>
defineProps({
  msg: {
    type: String,
    required: true,
  },
})
</script>

<template>
  <div class="greetings">
    <h1>{{ msg }}</h1>
    <h3>Welcome to our platform.</h3>
  </div>
</template>

<style scoped>
h1 {
  font-size: 2.5rem;
  font-weight: 500;
  line-height: 3.25rem;
  color: var(--color-heading);
}

h3 {
  font-size: 1.2rem;
  font-weight: 400;
  line-height: 1.75rem;
  color: var(--color-text-muted);
}

.greetings h1,
.greetings h3 {
  text-align: center;
}

@media (min-width: 1024px) {
  .greetings h1,
  .greetings h3 {
    text-align: left;
  }
}
</style>
