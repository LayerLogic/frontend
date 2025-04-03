<!-- TODO: Restyle -->
<template>
  <v-menu>
    <template v-slot:activator="{ props }">
      <button class="btn btn-icon-only" v-bind="props">
        <v-icon>mdi-dots-horizontal</v-icon>
      </button>
    </template>
    <v-list>
      <v-list-item slim @click="$emit('edit')">
        <v-list-item-title>Edit</v-list-item-title>
      </v-list-item>

      <v-divider></v-divider>

      <v-list-item slim @click="$emit('delete')" class="text-error">
        <v-list-item-title>Delete</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script>
export default {
  name: 'ActionMenu',
  emits: ['edit', 'delete'],
}
</script>

<style scoped>
.v-list-item-title {
  font-size: 14px !important;
  padding: 0 !important;
}
</style>
