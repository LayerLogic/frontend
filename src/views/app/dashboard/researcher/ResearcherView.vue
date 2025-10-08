<template>
  <div class="w-screen max-w-3/4">
    <div class="container">
      <h2 class="text-3xl tracking-tight font-bold">Your Trials</h2>
      <p class="text-base text-muted-foreground">
        Here you can manage trials, you can create, edit, and delete trials.
      </p>

      <!-- Search and Filter Actions with the dataTable-->
      <DataTable
        :data="trials"
        @edit="openEditDrawer"
        @delete="confirmDelete"
        @create="openCreateDrawer"
      />

      <FormDrawer
        v-model:visible="editDrawer"
        title="Edit trial"
        :trial="selectedTrial"
        @submit="handleUpdateTrial"
        @close="closeDrawer"
      />

      <FormDrawer
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
import { mapActions } from 'pinia'
import { useTrialsStore } from '@/store/trials'
import DataTable from '@/components/dashboard/DataTable.vue'
import FormDrawer from '@/components/dashboard/FormDrawer.vue'
import DeleteConfirmationDialog from '@/components/ui/DeleteConfirmationDialog.vue'
import messages from '@/utils/messages.json'
import { toast } from 'vue-sonner'
import { removeElemsById } from '@/utils/helpers'

export default {
  name: 'ResearcherView',
  components: {
    DeleteConfirmationDialog,
    DataTable,
    FormDrawer,
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
    removeElemsById,
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
        this.trials = this.allTrials
      }, messages.fetching.trials.multiple.failure)
    },

    async handleCreateTrial(trialData) {
      if (!trialData) return
      await this.executeApiCallWithToasts(
        async () => {
          const newTrial = await this.createTrialStore(trialData)
          await this.fetchTrials()
          this.createDrawer = false
          return newTrial
        },
        messages.trials.created.failure,
        messages.trials.created.success,
      )
    },

    async handleUpdateTrial(trialData) {
      if (!this.selectedTrial) return
      await this.executeApiCallWithToasts(
        async () => {
          const updatedTrial = await this.updateTrialStore(this.selectedTrial._id, trialData)
          await this.fetchTrials()
          this.editDrawer = false
          this.selectedTrial = null
          return updatedTrial
        },
        messages.trials.updated.general.failure,
        messages.trials.updated.general.success,
      )
    },

    async deleteTrial() {
      const deleteInfoMsg = await this.executeApiCallWithToasts(async () => {
        const deleteInfoMsg = await this.deleteTrialStore(this.selectedTrial._id)
        this.trials = this.removeElemsById(this.trials, this.selectedTrial._id)
        this.allTrials = this.removeElemsById(this.allTrials, this.selectedTrial._id)
        this.deleteDialog = false
        this.selectedTrial = null
        return deleteInfoMsg
      }, messages.trials.deleted.failure)

      if (deleteInfoMsg) toast.success(deleteInfoMsg)
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

    /**
     * Executes an API call and displays results
     * @param {Function} apiCall The function to execute
     * @param {String} errorMsg Error message to log to the console and display via toasts
     * @param {String|null} [successMsg=null] Success message to display via toasts
     * @returns {Promise<Object>} Result of the API call
     */
    async executeApiCallWithToasts(apiCall, errorMsg, successMsg = null) {
      try {
        const result = await apiCall()
        if (successMsg) toast.success(successMsg)
        return result
      } catch (error) {
        console.error(errorMsg, ':', error)
        toast.error(error.message ?? errorMsg)
      }
    },
  },
}
</script>
