<script setup>
defineProps({
  msg: {
    type: String,
    required: true,
  },
})
</script>

<template>
  <div>
    <h1 class="text-[2.5rem] font-medium leading-[3.25rem] text-primary text-center lg:text-left">
      {{ msg }}
    </h1>
    <h3 class="text-xl leading-7 text-muted-foreground text-center lg:text-left">
      Welcome to our platform.
    </h3>
  </div>
</template>
