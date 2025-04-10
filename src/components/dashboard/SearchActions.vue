<template>
  <div class="actions">
    <div class="search-actions">
      <InputField
        id="search"
        type="text"
        placeholder="Search trials..."
        class="search-input"
        @input="($emit('update:searchQuery', $event), $emit('fetch-filtered-trials'))"
        prefix-icon="search"
      />
      <v-menu>
        <template v-slot:activator="{ props }">
          <button class="btn btn-outline filter" v-bind="props">
            <v-icon>
              {{ filterType === 'tag' ? 'mdi-tag-outline' : 'mdi-alphabetical-variant' }}
            </v-icon>
          </button>
        </template>
        <v-list>
          <v-list-item slim @click="$emit('set-filter-type', 'name')">
            <v-list-item-title>
              <v-icon size="14">mdi-alphabetical-variant</v-icon>
              <p>By name</p>
            </v-list-item-title>
          </v-list-item>

          <v-divider></v-divider>

          <v-list-item slim @click="$emit('set-filter-type', 'tag')">
            <v-list-item-title>
              <v-icon size="14">mdi-tag-outline</v-icon>
              <p>By tag</p>
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </div>
    <button class="btn btn-primary" @click="$emit('open-create-drawer')">Create New Trial</button>
  </div>
</template>

<script>
import InputField from '@/components/ui/InputField.vue'

export default {
  name: 'ResearcherView',
  components: {
    InputField,
  },
  props: {
    filterType: {
      type: String,
      default: 'name',
    },
  },
  emits: ['set-filter-type', 'fetch-filtered-trials', 'open-create-drawer', 'update:searchQuery'],
}
</script>

<style scoped>
.actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 20px 0px;
}
.search-actions {
  display: flex;
  align-items: end;
  gap: 10px;
}
.search-actions .filter {
  width: 40px;
  height: 40px;
  border: 1px dashed var(--color-border);
}
.search-actions .filter:hover {
  border: 1px dashed var(--color-primary);
  background: transparent;
}
.search-input {
  width: 400px;
}
</style>
