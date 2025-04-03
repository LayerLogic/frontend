<template>
  <div class="tags-container">
    <v-chip v-for="tag in visibleTags" :key="tag" size="small">
      {{ tag }}
    </v-chip>
    <v-chip v-if="tags.length > maxVisible" size="small">
      +{{ tags.length - maxVisible }} more
    </v-chip>
  </div>
</template>

<script>
export default {
  name: 'TrialTags',
  props: {
    tags: {
      type: Array,
      default: () => [],
    },
    maxVisible: {
      type: Number,
      default: 4,
    },
  },
  computed: {
    visibleTags() {
      return this.tags.slice(0, this.maxVisible)
    },
  },
}
</script>

<style scoped>
.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}
</style>
