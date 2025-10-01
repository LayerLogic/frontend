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
import TrialsTable from '@/components/dashboard/TrialsTable.vue'
import TrialFormDrawer from '@/components/dashboard/TrialFormDrawer.vue'
import DeleteConfirmationDialog from '@/components/ui/DeleteConfirmationDialog.vue'
import SearchActions from '@/components/dashboard/SearchActions.vue'
import { useTrialsStore } from '@/store/trials'
import { mapActions } from 'pinia'
import messages from '@/utils/messages.json'
import { executeApiCallWithToasts } from '@/utils/helpers'

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
    ...mapActions(useTrialsStore, [
      'fetchTrialsStore',
      'deleteTrialStore',
      'createTrialStore',
      'updateTrialStore',
    ]),
    //helper.js
    executeApiCallWithToasts,
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
      await this.executeApiCallWithToasts(async () => {
        this.allTrials = await this.fetchTrialsStore()
      }, messages.fetching.trials.multiple.failure)
      this.trials = this.allTrials
    },

    async handleCreateTrial(trialData) {
      if (!trialData) return
      await this.executeApiCallWithToasts(
        () => {
          this.createTrialStore(trialData)
        },
        messages.trials.created.failure,
        messages.trials.created.success,
      )

      await this.fetchTrials()
      this.createDrawer = false
    },

    async handleUpdateTrial(trialData) {
      if (!this.selectedTrial) return
      await this.executeApiCallWithToasts(
        () => {
          this.updateTrialStore(this.selectedTrial._id, trialData)
        },
        messages.trials.updated.general.failure,
        messages.trials.updated.general.success,
      )

      await this.fetchTrials()
      this.editDrawer = false
      this.selectedTrial = null
    },

    async deleteTrial() {
      await this.executeApiCallWithToasts(
        () => {
          this.deleteTrialStore(this.selectedTrial._id)
        },
        messages.trials.deleted.failure,
        messages.trials.deleted.success,
      )
      this.trials = this.trials.filter((trial) => trial._id !== this.selectedTrial._id)
      this.allTrials = this.allTrials.filter((trial) => trial._id !== this.selectedTrial._id)
      this.deleteDialog = false
      this.selectedTrial = null
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
