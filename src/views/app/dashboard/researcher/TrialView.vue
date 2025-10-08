<template>
  <div class="flex flex-col w-auto">
    <div v-if="trial && !isLoading" class="p-4 min-w-auto border-b border-muted">
      <div class="flex justify-between items-start">
        <h2 class="text-2xl font-extrabold text-foreground">
          {{ trial.name }}
        </h2>
        <div class="flex items-center gap-2">
          <UiButton
            variant="outline"
            @click="loadPrevTrial"
            :disabled="currentTrialIndex === 0 || isLoading"
          >
            Prev trial
          </UiButton>
          <UiButton
            variant="outline"
            @click="loadNextTrial"
            :disabled="currentTrialIndex === trialsIDs.length - 1 || isLoading"
          >
            Next trial
          </UiButton>
          <UiButton @click="goToUI" :disabled="isLoading">New Test</UiButton>
        </div>
      </div>
      <div class="max-w-fit mt-4">
        <TagsInput :initial-tags="trial.tags" :showHint="false" @update:tags="handleTagsUpdate" />
      </div>
    </div>
    <div v-else>
      <p class="p-4">Loading trial...</p>
    </div>

    <div class="p-4 grid grid-cols-1 lg:grid-cols-[1.5fr_0.5fr] gap-4 items-start">
      <div
        v-if="trial && trial.tests && trial.tests.length"
        class="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-4"
      >
        <Card v-for="test in trial.tests" :key="test._id">
          <CardHeader class="flex flex-row justify-between items-start space-y-0">
            <div>
              <CardTitle class="text-xl capitalize flex items-center justify-center gap-2"
                >{{ test.type }}
                Analyses
                <Badge variant="outline"> Channel {{ test.channel }} </Badge>
              </CardTitle>

              <CardDescription class="text-sm">
                {{
                  new Date(test.createdAt).toLocaleString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                  })
                }}
              </CardDescription>
            </div>
            <div class="flex gap-1.5 items-center">
              <UiButton
                variant="outline"
                size="icon"
                class="h-7 w-7"
                @click="openTestDetailsDialog(test)"
                title="View test details"
              >
                <Eye class="h-4 w-4" />
              </UiButton>
              <UiButton
                variant="outline"
                size="icon"
                class="h-7 w-7 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/50"
                @click="deleteTest(test._id, trial._id)"
              >
                <Trash2 class="h-4 w-4" />
              </UiButton>
            </div>
          </CardHeader>
          <CardContent class="pt-2">
            <Chart
              v-if="test.measurements && test.measurements.length"
              type="line"
              :data="getChartData(test.type, test.measurements)"
              :options="defaultChartOptions"
              :height="300"
            />
            <p v-else class="text-sm text-muted-foreground">
              No measurement data available for this test.
            </p>
          </CardContent>
        </Card>
      </div>
      <div v-else-if="trial && !isLoading">
        <p class="text-muted-foreground">No tests found for this trial.</p>
      </div>

      <div v-if="trial && !isLoading" class="flex flex-col gap-4">
        <Card>
          <CardHeader
            class="cursor-pointer flex flex-row justify-between items-center space-y-0"
            @click="toggleBool('showTrialProcedures')"
          >
            <CardTitle>Procedures</CardTitle>
            <UiButton variant="ghost" size="icon">
              <ChevronDown
                :class="[
                  'h-4 w-4 transition-transform duration-200 shrink-0',
                  { 'rotate-180': showTrialProcedures },
                ]"
              />
            </UiButton>
          </CardHeader>

          <CardContent
            v-if="!isEditingTrialProcedures && showTrialProcedures"
            class="cursor-pointer"
            @click="startEditingTrialProcedures"
          >
            <div
              v-if="trial.procedures"
              v-html="trial.procedures"
              class="text-sm whitespace-pre-wrap break-words border border-border rounded-md p-2"
            ></div>
            <p v-else class="text-sm text-muted-foreground italic">Click to add procedures...</p>
          </CardContent>

          <CardContent v-if="isEditingTrialProcedures && showTrialProcedures">
            <RichTextInput
              v-model="editedTrialProcedures"
              :initial-content="editedTrialProcedures || ''"
              placeholder="Add your procedures here..."
            />
            <div class="flex justify-end gap-2 mt-3">
              <UiButton variant="secondary" size="sm" @click="cancelEditingTrialProcedures">
                Cancel
              </UiButton>
              <UiButton size="sm" @click="saveTrialProcedures">
                <Save class="h-4 w-4 mr-2" />
                Save
              </UiButton>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader
            class="cursor-pointer flex flex-row justify-between items-center space-y-0"
            @click="toggleBool('showTrialNotes')"
          >
            <CardTitle>Notes</CardTitle>
            <UiButton variant="ghost" size="icon">
              <ChevronDown
                :class="[
                  'h-4 w-4 transition-transform duration-200 shrink-0',
                  { 'rotate-180': showTrialNotes },
                ]"
              />
            </UiButton>
          </CardHeader>

          <CardContent
            v-if="!isEditingTrialNotes && showTrialNotes"
            class="cursor-pointer"
            @click="startEditingTrialNotes"
          >
            <div
              v-if="trial.notes"
              v-html="trial.notes"
              class="text-sm whitespace-pre-wrap break-words border border-border rounded-md p-2"
            ></div>
            <p v-else class="text-sm text-muted-foreground italic">Click to add notes...</p>
          </CardContent>

          <CardContent v-if="isEditingTrialNotes && showTrialNotes">
            <RichTextInput
              v-model="editedTrialNotes"
              :initial-content="editedTrialNotes || ''"
              placeholder="Add your notes here..."
            />
            <div class="flex justify-end gap-2 mt-3">
              <UiButton variant="secondary" size="sm" @click="cancelEditingTrialNotes">
                Cancel
              </UiButton>
              <UiButton size="sm" @click="saveTrialNotes">
                <Save class="h-4 w-4 mr-2" />
                Save
              </UiButton>
            </div>
          </CardContent>
        </Card>
      </div>
      <div v-else-if="!isLoading">
        <p class="text-muted-foreground">Loading trial...</p>
      </div>
    </div>

    <!-- Test Details Dialog -->
    <UiDialog :open="showTestDialog" @update:open="(val) => !val && closeTestDialog()">
      <DialogContent class="max-w-[800px] max-h-[90vh] flex flex-col p-0">
        <DialogHeader class="p-6 pb-4 border-b">
          <DialogTitle class="text-2xl">Test Details</DialogTitle>
        </DialogHeader>

        <div v-if="selectedTest" class="flex-1 overflow-y-auto p-6 space-y-8">
          <!-- Test Overview -->
          <div>
            <h3 class="text-lg font-semibold mb-4 pb-2 border-b-2">Test Overview</h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div class="space-y-1">
                <UiLabel class="text-muted-foreground">Test Type:</UiLabel>
                <p class="text-sm">{{ selectedTest.type }}</p>
              </div>
              <div class="space-y-1">
                <UiLabel class="text-muted-foreground">Channel:</UiLabel>
                <p class="text-sm">{{ selectedTest.channel }}</p>
              </div>
              <div class="space-y-1">
                <UiLabel class="text-muted-foreground">Created:</UiLabel>
                <p class="text-sm">{{ formatDate(selectedTest.createdAt) }}</p>
              </div>
              <div class="space-y-1">
                <UiLabel class="text-muted-foreground">Test ID:</UiLabel>
                <code class="text-xs bg-muted px-1 py-0.5 rounded">{{
                  selectedTest.id || selectedTest._id
                }}</code>
              </div>
            </div>
          </div>

          <!-- Commands -->
          <div v-if="selectedTest.commands">
            <h3 class="text-lg font-semibold mb-4 pb-2 border-b-2">Commands</h3>
            <div class="bg-muted border rounded-lg p-4">
              <pre class="text-xs whitespace-pre-wrap break-words">{{ selectedTest.commands }}</pre>
            </div>
          </div>

          <!-- Test Settings -->
          <div v-if="selectedTest.settings">
            <h3 class="text-lg font-semibold mb-4 pb-2 border-b-2">Test Settings</h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <template v-if="selectedTest.type === 'gate'">
                <div class="space-y-1">
                  <UiLabel class="text-muted-foreground">Max Gate Voltage:</UiLabel>
                  <p class="text-sm">{{ selectedTest.settings.vgMax }} V</p>
                </div>
                <div class="space-y-1">
                  <UiLabel class="text-muted-foreground">Min Gate Voltage:</UiLabel>
                  <p class="text-sm">{{ selectedTest.settings.vgMin }} V</p>
                </div>
                <div class="space-y-1">
                  <UiLabel class="text-muted-foreground">Gate Step:</UiLabel>
                  <p class="text-sm">{{ selectedTest.settings.gateStep }} V</p>
                </div>
              </template>

              <template v-else-if="selectedTest.type === 'time'">
                <div class="space-y-1">
                  <UiLabel class="text-muted-foreground">Gate Voltage:</UiLabel>
                  <p class="text-sm">{{ selectedTest.settings.gateV }} V</p>
                </div>
                <div class="space-y-1">
                  <UiLabel class="text-muted-foreground">Delay:</UiLabel>
                  <p class="text-sm">{{ selectedTest.settings.delay }} ms</p>
                </div>
              </template>
            </div>
          </div>

          <!-- Notes -->
          <div>
            <h3 class="text-lg font-semibold mb-4 pb-2 border-b-2">Notes</h3>
            <div
              v-if="!isEditingTestNotes"
              class="bg-muted border rounded-lg p-4 cursor-pointer transition-all hover:border-primary hover:ring-2 hover:ring-primary/20"
              @click="startEditingTestNotes"
            >
              <div v-if="selectedTest.notes" v-html="selectedTest.notes" class="text-sm"></div>
              <p v-else class="text-sm text-muted-foreground italic">Click to add notes...</p>
            </div>

            <div v-if="isEditingTestNotes" class="space-y-3">
              <UiTextarea
                v-model="editedTestNotes"
                placeholder="Add your notes here..."
                rows="4"
                @keydown.ctrl.enter="saveTestNotes"
                @keydown.esc="cancelEditingTestNotes"
              />
              <div class="flex justify-end gap-2">
                <UiButton variant="secondary" size="sm" @click="cancelEditingTestNotes">
                  Cancel
                </UiButton>
                <UiButton size="sm" @click="saveTestNotes">
                  <Save class="h-4 w-4 mr-2" />
                  Save
                </UiButton>
              </div>
            </div>
          </div>

          <!-- Measurements Summary -->
          <div v-if="selectedTest.measurements && selectedTest.measurements.length">
            <h3 class="text-lg font-semibold mb-4 pb-2 border-b-2">Measurements Summary</h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div class="space-y-1">
                <UiLabel class="text-muted-foreground">Total Points:</UiLabel>
                <p class="text-sm">{{ selectedTest.measurements.length }}</p>
              </div>
              <div class="space-y-1">
                <UiLabel class="text-muted-foreground">Voltage X Range:</UiLabel>
                <p class="text-sm">{{ getVoltageRange(selectedTest.measurements) }}</p>
              </div>
              <div v-if="selectedTest.type === 'gate'" class="space-y-1">
                <UiLabel class="text-muted-foreground">Gate Voltage Range:</UiLabel>
                <p class="text-sm">{{ getGateVoltageRange(selectedTest.measurements) }}</p>
              </div>
              <div v-else class="space-y-1">
                <UiLabel class="text-muted-foreground">Time Range:</UiLabel>
                <p class="text-sm">{{ getTimeRange(selectedTest.measurements) }}</p>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter class="p-6 pt-4 border-t">
          <UiButton variant="secondary" @click="closeTestDialog">Close</UiButton>
          <UiButton
            @click="exportTestData(selectedTest)"
            v-if="selectedTest && selectedTest.measurements"
          >
            Export Data
          </UiButton>
        </DialogFooter>
      </DialogContent>
    </UiDialog>
  </div>
</template>

<script>
import TagsInput from '@/components/testing/TagsInput.vue'
import { defaultChartOptions, getChartData } from '@/utils/chart'
import { useRoute } from 'vue-router'
import Chart from 'primevue/chart'
import { useTrialsStore } from '@/store/trials'
import { useTestsStore } from '@/store/tests'
import { toast } from 'vue-sonner'
import { mapState, mapWritableState, mapActions } from 'pinia'
import {
  buildUIUrl,
  exportTestData,
  formatDate,
  formatConfigKey,
  getVoltageRange,
  getGateVoltageRange,
  getTimeRange,
} from '@/utils/data'
import {
  resetEditingStates,
  toggleBoolStates,
  findIndexById,
  removeElemsById,
  isTextEmpty,
} from '@/utils/helpers'
import messages from '@/utils/messages.json'
import { Button as UiButton } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog as UiDialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Textarea as UiTextarea } from '@/components/ui/textarea'
import RichTextInput from '@/components/testing/RichTextInput.vue'
import { Label as UiLabel } from '@/components/ui/label'
import { Eye, Trash2, Save, ChevronDown } from 'lucide-vue-next'

export default {
  name: 'TrialView',
  components: {
    TagsInput,
    Chart,
    UiButton,
    Badge,
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    UiDialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    UiTextarea,
    UiLabel,
    Eye,
    Trash2,
    Save,
    ChevronDown,
    RichTextInput,
  },
  data() {
    return {
      defaultChartOptions,
      trial: null,
      isEditingTrialProcedures: false,
      showTrialProcedures: false,
      editedTrialProcedures: '',
      isEditingTrialNotes: false,
      showTrialNotes: false,
      editedTrialNotes: '',
      isEditingTestNotes: false,
      editedTestNotes: '',
      showTestDialog: false,
      selectedTest: null,
      isLoading: false,
    }
  },
  computed: {
    ...mapState(useTrialsStore, ['trialsIDs']),
    ...mapWritableState(useTrialsStore, ['currentTrialIndex']),
    getTrialProceduresStates() {
      return ['editedTrialProcedures', 'showTrialProcedures', 'isEditingTrialProcedures']
    },
    getTrialNotesStates() {
      return ['editedTrialNotes', 'showTrialNotes', 'isEditingTrialNotes']
    },
    getTestNotesStates() {
      return ['isEditingTestNotes', 'editedTestNotes']
    },
  },

  async mounted() {
    const route = useRoute()
    this.isLoading = true

    try {
      await this.fetchTrialsStore()

      const index = this.trialsIDs.indexOf(route.params.trialId)
      if (index >= 0) {
        this.currentTrialIndex = index
      }
      await this.fetchTrialWithTests(route.params.trialId)
    } finally {
      this.isLoading = false
    }
  },
  methods: {
    ...mapActions(useTrialsStore, [
      'fetchTrialWithTestsStore',
      'updateTrialStore',
      'fetchTrialsStore',
      'prevTrial',
      'nextTrial',
    ]),
    ...mapActions(useTestsStore, ['updateTestStore', 'deleteTestByTestIdStore']),
    getChartData,
    exportTestData,
    buildUIUrl,
    formatDate,
    formatConfigKey,
    getVoltageRange,
    getGateVoltageRange,
    getTimeRange,
    resetEditingStates,
    toggleBoolStates,
    findIndexById,
    removeElemsById,
    isTextEmpty,
    resetStates(varsArray) {
      resetEditingStates(this, varsArray)
    },
    toggleBool(boolVar) {
      toggleBoolStates(this, boolVar)
    },
    cancelEditingTestNotes() {
      this.resetStates(this.getTestNotesStates)
    },
    cancelEditingTrialProcedures() {
      this.resetStates(this.getTrialProceduresStates)
    },
    cancelEditingTrialNotes() {
      this.resetStates(this.getTrialNotesStates)
    },
    startEditingTestNotes() {
      this.isEditingTestNotes = true
      this.editedTestNotes = this.selectedTest.notes || ''
    },
    startEditingTrialProcedures() {
      this.isEditingTrialProcedures = true
      this.editedTrialProcedures = this.trial.procedures || ''
    },
    startEditingTrialNotes() {
      this.isEditingTrialNotes = true
      this.editedTrialNotes = this.trial.notes || ''
    },
    goToUI() {
      window.open(buildUIUrl(this.trial._id), '_blank')
    },
    openTestDetailsDialog(test) {
      this.selectedTest = test
      this.showTestDialog = true
    },
    closeTestDialog() {
      this.showTestDialog = false
      this.selectedTest = null
      this.cancelEditingTestNotes()
    },
    async updateTrial(trialId, trialData) {
      // expects caller to handle thrown errors, called only after tests are appended to this. trial
      this.trial = await this.updateTrialStore(trialId, trialData)
      return this.trial
    },
    async fetchTrialWithTests(trialId) {
      await this.executeApiCallWithToasts(async () => {
        this.trial = await this.fetchTrialWithTestsStore(trialId)
        return this.trial
      }, messages.fetching.general.failure)
    },
    async saveTestNotes() {
      await this.executeApiCallWithToasts(
        async () => {
          const newTest = await this.updateTestStore(
            this.selectedTest.id || this.selectedTest._id,
            { notes: this.editedTestNotes },
          )
          this.selectedTest.notes = this.editedTestNotes
          // Update the test in the trial.tests array as well
          const testIndex = this.findIndexById(this.trial.tests, this.selectedTest._id)
          if (testIndex !== -1) {
            this.trial.tests[testIndex].notes = this.editedTestNotes
          }
          this.cancelEditingTestNotes()
          return newTest
        },
        messages.tests.updated.notes.failure,
        messages.tests.updated.notes.success,
      )
    },
    async saveTrialProcedures() {
      await this.executeApiCallWithToasts(
        async () => {
          const updatedTrial = await this.updateTrial(this.trial._id, {
            ...this.trial,
            procedures: this.isTextEmpty(this.editedTrialProcedures)
              ? ''
              : this.editedTrialProcedures,
          })
          this.resetStates(this.getTrialProceduresStates)
          return updatedTrial
        },
        messages.trials.updated.procedures.failure,
        messages.trials.updated.procedures.success,
      )
    },
    async saveTrialNotes() {
      await this.executeApiCallWithToasts(
        async () => {
          const updatedTrial = await this.updateTrial(this.trial._id, {
            ...this.trial,
            notes: this.isTextEmpty(this.editedTrialNotes) ? '' : this.editedTrialNotes,
          })
          this.resetStates(this.getTrialNotesStates)
          return updatedTrial
        },
        messages.trials.updated.notes.failure,
        messages.trials.updated.notes.success,
      )
    },
    async handleTagsUpdate(tags) {
      await this.executeApiCallWithToasts(
        async () => {
          const updatedTrial = await this.updateTrial(this.trial._id, { ...this.trial, tags })
          return updatedTrial
        },
        messages.trials.updated.tags.failure,
        messages.trials.updated.tags.success,
      )
    },
    async deleteTest(testId) {
      const confirmed = window.confirm(messages.tests.deleted.confirm)
      if (!confirmed) return
      await this.executeApiCallWithToasts(
        //backend returns success message, but unused
        async () => {
          await this.deleteTestByTestIdStore(testId)

          //optimistic approach of removing the deleted test
          this.trial.tests = this.removeElemsById(this.trial.tests, testId)
        },
        messages.tests.deleted.failure,
        messages.tests.deleted.success,
      )
    },
    async loadNextTrial() {
      if (this.isLoading) return

      this.isLoading = true
      this.resetStates(this.getTrialProceduresStates)

      try {
        const id = this.nextTrial()
        await this.fetchTrialWithTests(id)
        this.$router.push({ name: 'trial', params: { trialId: id } })
      } finally {
        this.isLoading = false
      }
    },
    async loadPrevTrial() {
      if (this.isLoading) return

      this.isLoading = true
      this.resetStates(this.getTrialProceduresStates)

      try {
        const id = this.prevTrial()
        await this.fetchTrialWithTests(id)
        this.$router.push({ name: 'trial', params: { trialId: id } })
      } finally {
        this.isLoading = false
      }
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
