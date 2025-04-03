<template>
  <v-dialog
    :modelValue="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    max-width="400"
  >
    <v-card>
      <v-card-title>
        Confirm deletion of trial
        <code> "{{ itemName }}" </code>
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text class="description"
        >Are you sure you want to delete the selected trial?
        <br />
        This action cannot be undone.
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <button class="btn btn-lg btn-outline" @click="$emit('update:modelValue', false)">
          Cancel
        </button>
        <button class="btn btn-lg btn-danger" @click="$emit('confirm')">Delete</button>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'DeleteConfirmationDialog',
  props: {
    modelValue: {
      type: Boolean,
      required: true,
    },
    itemName: {
      type: String,
      default: 'this item',
    },
  },
  emits: ['update:modelValue', 'confirm'],
}
</script>

<style scoped>
.v-card {
  border-radius: 8px !important;
  border: 1px solid var(--color-border) !important;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1) !important;
}
.v-card-title {
  font-size: 16px !important;
  padding: 20px !important;
  color: var(--color-text) !important;
}
.v-card-text {
  font-size: 14px !important;
  padding: 20px !important;
  color: var(--color-text) !important;
}
.v-card-actions {
  padding: 20px !important;
}
.description {
  font-size: 14px !important;
  color: var(--color-text);
  margin: 0;
}
.btn {
  width: 100%;
}
</style>
