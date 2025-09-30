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
    <h1 class="text-[2.5rem] font-medium leading-[3.25rem] text-zinc-950 text-center lg:text-left">
      {{ msg }}
    </h1>
    <h3 class="text-xl leading-7 text-zinc-500 text-center lg:text-left">
      Welcome to our platform.
    </h3>
  </div>
</template>
