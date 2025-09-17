<template>
  <v-data-table
    :headers="headers"
    :items="trials"
    :items-per-page="5"
    :hide-default-footer="trials.length < 10"
    item-value="_id"
    hover
    show-expand
  >
    <template #[`item.tags`]="{ item }">
      <TrialTags :tags="item.tags" />
    </template>

    <template #[`item.createdAt`]="{ item }">
      {{ formatDate(item.createdAt) }}
    </template>

    <template #[`item.updatedAt`]="{ item }">
      {{ formatDate(item.updatedAt) }}
    </template>

    <template v-slot:[`item.data-table-expand`]="{ internalItem, isExpanded, toggleExpand }">
      <div class="actions">
        <button class="btn btn-outline" @click="toggleExpand(internalItem)">
          {{ isExpanded(internalItem) ? 'Collapse' : 'More info' }}
          <v-icon>{{ isExpanded(internalItem) ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
        </button>
        <ActionMenu
          @edit="$emit('edit', internalItem.raw)"
          @delete="$emit('delete', internalItem.raw)"
          :id="internalItem.raw._id"
        />
      </div>
    </template>

    <template v-slot:expanded-row="{ columns, item }">
      <tr>
        <td :colspan="columns.length" class="py-2">
          <v-table class="expanded-table">
            <tbody class="more-info-header">
              <tr>
                <th>Procedures</th>
                <th>Notes</th>
              </tr>
            </tbody>
            <tbody>
              <tr>
                <td class="inner-html py-4" v-html="item.procedures"></td>
                <td class="inner-html py-4" v-html="item.notes"></td>
              </tr>
            </tbody>
          </v-table>
        </td>
      </tr>
    </template>
  </v-data-table>
</template>

<script>
import TrialTags from './TrialTags.vue'
import ActionMenu from './ActionMenu.vue'

export default {
  name: 'TrialsTable',
  components: {
    TrialTags,
    ActionMenu,
  },
  emits: ['edit', 'delete'],
  props: {
    trials: {
      type: Array,
      required: true,
      default: () => [],
    },
  },
  data() {
    return {
      headers: [
        { title: 'Name', key: 'name', align: 'start' },
        { title: 'Tags', key: 'tags' },
        { title: 'Created at', key: 'createdAt' },
        { title: 'Updated at', key: 'updatedAt' },
      ],
    }
  },
  methods: {
    formatDate(date) {
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
        hour: 'numeric',
        minute: 'numeric'
      }).format(new Date(date))
    },
  },
}
</script>

<style scoped>
.v-table:not(.expanded-table) {
  margin-top: 20px;
  border-radius: 8px;
  border: 1px solid var(--color-border);
  width: 1024px;
}

.expanded-table {
  border-radius: 8px;
  border: 1px solid var(--color-border);
}

.more-info-header th {
  font-weight: 500;
  background-color: var(--color-border);
  max-width: 1024px;
  height: 44px !important;
}

.v-toolbar {
  border-radius: 8px 8px 0 0;
  border-bottom: 1px solid var(--color-border);
}

.v-toolbar-title {
  font-weight: 500;
}

.actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 6px;
}

:deep(.v-data-table__td) {
  border-bottom: 1px solid var(--color-border) !important;
}

:deep(.inner-html) {
  vertical-align: top !important;
}

:deep(tbody > tr:last-child td) {
  border-bottom: none !important;
}

:deep(.v-toolbar__content) {
  height: 44px !important;
}

:deep(p) {
  font-family: var(--font-family) !important;
  background-color: transparent !important;
  color: var(--color-text) !important;
}
:deep(thead) {
  background-color: var(--color-background-soft) !important;
}
</style>
