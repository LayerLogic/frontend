<!-- TODO: Restyle -->
<template>
  <v-menu>
    <template v-slot:activator="{ props }">
      <button class="btn btn-outline btn-icon-only btn-action" v-bind="props">
        <v-icon>mdi-dots-vertical</v-icon>
      </button>
    </template>
    <v-list>
      <v-list-item slim @click="$emit('edit')">
        <v-list-item-title>
          <v-icon size="14">mdi-square-edit-outline</v-icon>
          <p>Edit</p>
        </v-list-item-title>
      </v-list-item>

      <v-divider></v-divider>

      <v-list-item slim @click="$emit('delete')" class="text-error">
        <v-list-item-title>
          <v-icon class="text-error" size="14">mdi-delete-outline</v-icon>
          <p>Delete</p>
        </v-list-item-title>
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

<style>
.v-list-item-title {
  font-size: 14px !important;
  padding: 0 !important;
}
.btn-action {
  padding: 0 !important;
  width: 26px !important;
  height: 26px !important;
}
.v-menu > .v-overlay__content > .v-list {
  box-shadow: var(--shadow) !important;
  padding: 4px !important;
}
.v-list {
  border: 1px solid var(--color-border) !important;
}
.v-list-item {
  margin: 0 !important;
  min-height: 0 !important;
  padding: 4px 8px !important;
  min-width: 128px !important;
  border-radius: 4px !important;
}
.v-list-item-title {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--color-text) !important;
}
.v-divider {
  margin: 4px -4px !important;
}
</style>
