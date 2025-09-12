<template>
  <div class="researcher-view">
    <div class="content">
      <h2>Your Trials</h2>
      <p>Here you can manage trials, you can create, edit, and delete trials.</p>

      <!-- Actions -->
      <search-actions
        :searchQuery="searchQuery"
        :filter-type="filterType"
        @update:searchQuery="searchQuery = $event.target.value"
        @set-filter-type="setFilterType"
        @fetch-filtered-trials="fetchFilteredTrials"
        @open-create-drawer="openCreateDrawer"
      />

      <!-- Trials Table -->
      <TrialsTable
        :trials="trials"
        @edit="openEditDrawer"
        @delete="confirmDelete"
        @create="openCreateDrawer"
      />

      <!-- Edit Drawer -->
      <TrialFormDrawer
        v-model:visible="editDrawer"
        title="Edit trial"
        :trial="selectedTrial"
        @submit="handleUpdateTrial"
        @close="closeDrawer"
      />

      <!-- Create Drawer -->
      <TrialFormDrawer
        v-model:visible="createDrawer"
        title="Create new trial"
        @submit="handleCreateTrial"
        @close="closeDrawer"
      />

      <!-- Delete Confirmation Dialog -->
      <DeleteConfirmationDialog
        v-model="deleteDialog"
        :item-name="selectedTrial?.name"
        @confirm="deleteTrial"
      />
    </div>
  </div>
</template>

<script>
import { api } from '@/api'
import TrialsTable from '@/components/dashboard/TrialsTable.vue'
import TrialFormDrawer from '@/components/dashboard/TrialFormDrawer.vue'
import DeleteConfirmationDialog from '@/components/ui/DeleteConfirmationDialog.vue'
import SearchActions from '@/components/dashboard/SearchActions.vue'
import { useTrialsStore } from '@/store/trials'
import { mapActions } from 'pinia'

export default {
  name: 'ResearcherView',
  components: {
    TrialsTable,
    TrialFormDrawer,
    DeleteConfirmationDialog,
    SearchActions,
  },
  props: {
    username: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      allTrials: [],
      trials: [],
      deleteDialog: false,
      selectedTrial: null,
      editDrawer: false,
      createDrawer: false,
      isFiltering: false,
      filterType: null,
      searchQuery: '',
    }
  },
  mounted() {
    this.fetchTrials()
  },
  methods: {
    ...mapActions(useTrialsStore, ['fetchTrialsStore']),
    setFilterType(type) {
      if (this.filterType === type) {
        this.isFiltering = !this.isFiltering
      } else {
        this.isFiltering = true
      }
      this.filterType = type
    },
    fetchFilteredTrials() {
      if (this.searchQuery === '') {
        this.trials = this.allTrials
        return
      }
      if (this.filterType === 'tag') {
        this.trials = this.allTrials.filter((trial) =>
          trial.tags.some((tag) => tag.toLowerCase().includes(this.searchQuery.toLowerCase())),
        )
      } else {
        this.trials = this.allTrials.filter((trial) =>
          trial.name.toLowerCase().includes(this.searchQuery.toLowerCase()),
        )
      }
    },
    async fetchTrials() {
      try {
        const response = await this.fetchTrialsStore()
        this.trials = response
        this.allTrials = response
      } catch (error) {
        console.error('Failed to fetch trials:', error)
      }
    },
    async handleCreateTrial(trialData) {
      if (!trialData) return

      try {
        await api.trial.createtrial(trialData)
        this.fetchTrials()
        this.createDrawer = false
      } catch (error) {
        console.error('Failed to create trial:', error)
      }
    },

    async handleUpdateTrial(trialData) {
      if (!this.selectedTrial) return

      try {
        await api.trial.updatetrial(this.selectedTrial._id, trialData)
        this.fetchTrials()
        this.editDrawer = false
        this.selectedTrial = null
      } catch (error) {
        console.error('Failed to update trial:', error)
      }
    },

    async deleteTrial() {
      if (!this.selectedTrial) {
        console.error('No trial selected for deletion')
        return
      }

      try {
        await api.trial.deletetrial(this.selectedTrial._id)
        this.trials = this.trials.filter((trial) => trial._id !== this.selectedTrial._id)
        this.deleteDialog = false
        this.selectedTrial = null
      } catch (error) {
        console.error('Failed to delete trial:', error)
      }
    },

    openEditDrawer(trial) {
      this.selectedTrial = trial
      this.editDrawer = true
    },

    openCreateDrawer() {
      this.createDrawer = true
    },

    confirmDelete(trial) {
      this.selectedTrial = trial
      this.deleteDialog = true
    },

    closeDrawer() {
      this.editDrawer = false
      this.createDrawer = false
      this.selectedTrial = null
    },
  },
}
</script>

<style scoped>
.researcher-view {
  padding-bottom: 20px;
}
</style>
