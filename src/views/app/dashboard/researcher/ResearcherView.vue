<template>
  <div class="researcher-view">
    <div class="content">
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
        title="Update trial"
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

export default {
  name: 'ResearcherView',
  components: {
    TrialsTable,
    TrialFormDrawer,
    DeleteConfirmationDialog,
  },
  props: {
    username: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      trials: [],
      deleteDialog: false,
      selectedTrial: null,
      editDrawer: false,
      createDrawer: false,
    }
  },
  mounted() {
    this.fetchTrials()
  },
  methods: {
    async fetchTrials() {
      try {
        const response = await api.trail.getAllUserTrails()
        this.trials = response.data
      } catch (error) {
        console.error('Failed to fetch trials:', error)
      }
    },

    async handleCreateTrial(trialData) {
      if (!trialData) return

      try {
        await api.trail.createTrail(trialData)
        this.fetchTrials()
        this.createDrawer = false
      } catch (error) {
        console.error('Failed to create trial:', error)
      }
    },

    async handleUpdateTrial(trialData) {
      if (!this.selectedTrial) return

      try {
        await api.trail.updateTrail(this.selectedTrial._id, trialData)
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
        await api.trail.deleteTrail(this.selectedTrial._id)
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
