<template>
  <div class="trial-view">
    <div v-if="trial && !isLoading" class="trial-header">
      <div class="header">
        <h2 class="header-title">
          {{ trial.name }}
        </h2>
        <div class="header-actions">
          <button
            class="btn btn-outline"
            @click="loadPrevTrial"
            :disabled="currentTrialIndex === 0 || isLoading"
          >
            Prev trial
          </button>
          <button
            class="btn btn-outline"
            @click="loadNextTrial"
            :disabled="currentTrialIndex === trialsIDs.length - 1 || isLoading"
          >
            Next trial
          </button>
          <button class="btn btn-primary" @click="goToUI" :disabled="isLoading">New Test</button>
        </div>
      </div>
      <div class="trial-view-tags-container">
        <div>
          <TagsInput :initial-tags="trial.tags" :showHint="false" @update:tags="handleTagsUpdate" />
        </div>
      </div>
    </div>
    <div v-else>
      <p>Loading trial...</p>
    </div>

    <div class="trial-content">
      <div v-if="trial && trial.tests && trial.tests.length" class="trial-tests">
        <div v-for="test in trial.tests" :key="test._id" class="card">
          <div class="card-header">
            <div>
              <h3 class="card-title">{{ test.type }} Analyses</h3>
              <p class="card-description">
                {{
                  new Date(test.createdAt).toLocaleString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                  })
                }}
              </p>
            </div>
            <div class="card-actions">
              <button
                class="btn btn-outline btn-icon"
                @click="openTestDetailsDialog(test)"
                title="View test details"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
              </button>

              <button
                class="btn btn-outline btn-icon btn-danger"
                @click="deleteTest(test._id, trial._id)"
              >
                <v-icon small>mdi-delete</v-icon>
              </button>
              <v-chip size="small" class="tag">Channel {{ test.channel }}</v-chip>
            </div>
          </div>
          <div class="card-content">
            <Chart
              v-if="test.measurements && test.measurements.length"
              type="line"
              :data="getChartData(test.type, test.measurements)"
              :options="defaultChartOptions"
              :height="300"
            />
            <p v-else>No measurement data available for this test.</p>
          </div>
        </div>
      </div>
      <div v-else-if="trial && !isLoading">
        <p>No tests found for this trial.</p>
      </div>
      <div v-if="trial && !isLoading" class="trial-info">
        <div class="card">
          <div
            class="card-header"
            @click="toggleBool('showTrialProcedures')"
            style="cursor: pointer"
          >
            <h3 class="card-title">Procedures</h3>
            <button class="accordion-toggle">
              <svg
                :class="{ rotated: showTrialProcedures }"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <polyline points="6,9 12,15 18,9"></polyline>
              </svg>
            </button>
          </div>

          <div
            v-if="!isEditingTrialProcedures && showTrialProcedures"
            class="card-content"
            @click="startEditingTrialProcedures"
            style="cursor: pointer"
          >
            <p v-if="trial.procedures" v-html="trial.procedures"></p>
            <p v-else class="empty-text-field">Click to add procedures...</p>
          </div>

          <div v-if="isEditingTrialProcedures && showTrialProcedures" class="card-content">
            <!-- Edit Mode -->
            <textarea
              v-model="editedTrialProcedures"
              class="editing-textarea"
              placeholder="Add your procedures here..."
              rows="4"
              @keydown.ctrl.enter="saveTrialProcedures"
              @keydown.esc="cancelEditingTrialProcedures"
            ></textarea>
            <div class="editing-textarea-actions">
              <button class="btn btn-secondary btn-sm" @click="cancelEditingTrialProcedures">
                Cancel
              </button>
              <button class="btn btn-primary btn-sm" @click="saveTrialProcedures">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                  <polyline points="17,21 17,13 7,13 7,21"></polyline>
                  <polyline points="7,3 7,8 15,8"></polyline>
                </svg>
                Save
              </button>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-header" @click="toggleBool('showTrialNotes')" style="cursor: pointer">
            <h3 class="card-title">Notes</h3>
            <button class="accordion-toggle">
              <svg
                :class="{ rotated: showTrialNotes }"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <polyline points="6,9 12,15 18,9"></polyline>
              </svg>
            </button>
          </div>

          <div
            v-if="!isEditingTrialNotes && showTrialNotes"
            class="card-content"
            @click="startEditingTrialNotes"
            style="cursor: pointer"
          >
            <p v-if="trial.notes" v-html="trial.notes"></p>
            <p v-else class="empty-text-field">Click to add notes...</p>
          </div>

          <div v-if="isEditingTrialNotes && showTrialNotes" class="card-content">
            <!-- Edit Mode -->
            <textarea
              v-model="editedTrialNotes"
              class="editing-textarea"
              placeholder="Add your notes here..."
              rows="4"
              @keydown.ctrl.enter="saveTrialNotes"
              @keydown.esc="cancelEditingTrialNotes"
            ></textarea>
            <div class="editing-textarea-actions">
              <button class="btn btn-secondary btn-sm" @click="cancelEditingTrialNotes">
                Cancel
              </button>
              <button class="btn btn-primary btn-sm" @click="saveTrialNotes">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                  <polyline points="17,21 17,13 7,13 7,21"></polyline>
                  <polyline points="7,3 7,8 15,8"></polyline>
                </svg>
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
      <div v-else-if="!isLoading">
        <p>Loading trial...</p>
      </div>
    </div>

    <!-- Test Details Dialog -->
    <div v-if="showTestDialog" class="dialog-overlay" @click="closeTestDialog">
      <div class="dialog" @click.stop>
        <div class="dialog-header">
          <h2 class="dialog-title">Test Details</h2>
          <button class="dialog-close" @click="closeTestDialog">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div v-if="selectedTest" class="dialog-content">
          <!-- Test Overview -->
          <div class="detail-section">
            <h3 class="section-title">Test Overview</h3>
            <div class="detail-grid">
              <div class="detail-item">
                <label>Test Type:</label>
                <span>{{ selectedTest.type }}</span>
              </div>
              <div class="detail-item">
                <label>Channel:</label>
                <span>{{ selectedTest.channel }}</span>
              </div>
              <div class="detail-item">
                <label>Created:</label>
                <span>{{ formatDate(selectedTest.createdAt) }}</span>
              </div>
              <div class="detail-item">
                <label>Test ID:</label>
                <span class="monospace">{{ selectedTest.id || selectedTest._id }}</span>
              </div>
              <div v-if="selectedTest.commands" class="detail-section">
                <h3 class="section-title">Commands</h3>
                <div class="commands-content">
                  <pre>{{ selectedTest.commands }}</pre>
                </div>
              </div>
              <!-- Test Settings (if available) -->
              <div v-if="selectedTest.settings" class="detail-section">
                <h3 class="section-title">Test Settings</h3>
                <div class="detail-grid">
                  <!-- Gate test settings -->
                  <template v-if="selectedTest.type === 'gate'">
                    <div class="detail-item">
                      <label>Max Gate Voltage:</label>
                      <span>{{ selectedTest.settings.vgMax }} V</span>
                    </div>
                    <div class="detail-item">
                      <label>Min Gate Voltage:</label>
                      <span>{{ selectedTest.settings.vgMin }} V</span>
                    </div>
                    <div class="detail-item">
                      <label>Gate Step:</label>
                      <span>{{ selectedTest.settings.gateStep }} V</span>
                    </div>
                  </template>

                  <!-- Time test settings -->
                  <template v-else-if="selectedTest.type === 'time'">
                    <div class="detail-item">
                      <label>Gate Voltage:</label>
                      <span>{{ selectedTest.settings.gateV }} V</span>
                    </div>
                    <div class="detail-item">
                      <label>Delay:</label>
                      <span>{{ selectedTest.settings.delay }} ms</span>
                    </div>
                  </template>
                </div>
              </div>
            </div>
          </div>

          <!-- Test Configuration (if available) -->
          <div class="detail-section">
            <h3 class="section-title">Notes</h3>

            <!-- View Mode -->
            <div v-if="!isEditingTestNotes" class="notes-content" @click="startEditingTestNotes">
              <p v-if="selectedTest.notes" v-html="selectedTest.notes"></p>
              <p v-else class="empty-text-field">Click to add notes...</p>
            </div>

            <!-- Edit Mode -->
            <div v-if="isEditingTestNotes" class="notes-edit-container">
              <textarea
                v-model="editedTestNotes"
                class="editing-textarea"
                placeholder="Add your notes here..."
                rows="4"
                @keydown.ctrl.enter="saveTestNotes"
                @keydown.esc="cancelEditingTestNotes"
              ></textarea>
              <div class="editing-textarea-actions">
                <button class="btn btn-secondary btn-sm" @click="cancelEditingTestNotes">
                  Cancel
                </button>
                <button class="btn btn-primary btn-sm" @click="saveTestNotes">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <path
                      d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"
                    ></path>
                    <polyline points="17,21 17,13 7,13 7,21"></polyline>
                    <polyline points="7,3 7,8 15,8"></polyline>
                  </svg>
                  Save
                </button>
              </div>
            </div>
          </div>

          <!-- Measurements Summary -->
          <div
            v-if="selectedTest.measurements && selectedTest.measurements.length"
            class="detail-section"
          >
            <h3 class="section-title">Measurements Summary</h3>
            <div class="detail-grid">
              <div class="detail-item">
                <label>Total Points:</label>
                <span>{{ selectedTest.measurements.length }}</span>
              </div>
              <div class="detail-item">
                <label>Voltage X Range:</label>
                <span>{{ getVoltageRange(selectedTest.measurements) }}</span>
              </div>
              <div v-if="selectedTest.type === 'gate'" class="detail-item">
                <label>Gate Voltage Range:</label>
                <span>{{ getGateVoltageRange(selectedTest.measurements) }}</span>
              </div>
              <div v-else class="detail-item">
                <label>Time Range:</label>
                <span>{{ getTimeRange(selectedTest.measurements) }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="dialog-footer">
          <button class="btn btn-secondary" @click="closeTestDialog">Close</button>
          <button
            class="btn btn-primary"
            @click="exportTestData(selectedTest)"
            v-if="selectedTest && selectedTest.measurements"
          >
            Export Data
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TagsInput from '@/components/testing/TagsInput.vue'
import { defaultChartOptions, getChartData } from '@/utils/chart'
import { useRoute } from 'vue-router'
import Chart from 'primevue/chart'
import { useTrialsStore } from '@/store/trials'
import { useTestsStore } from '@/store/tests'
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
  executeApiCallWithToasts,
} from '@/utils/helpers'
import messages from '@/utils/messages.json'

export default {
  name: 'TrialView',
  components: {
    TagsInput,
    Chart,
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
      await this.fetchTrialsStore() //might be redundant

      // Set current index to the route's trialId
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
    //chart.js:
    getChartData,
    exportTestData,
    //data.js:
    buildUIUrl,
    formatDate,
    formatConfigKey,
    getVoltageRange,
    getGateVoltageRange,
    getTimeRange,
    //helpers.js:
    resetEditingStates,
    toggleBoolStates,
    findIndexById,
    executeApiCallWithToasts,
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
      // Prevent body scroll when dialog is open
      document.body.style.overflow = 'hidden'
    },
    closeTestDialog() {
      this.showTestDialog = false
      this.selectedTest = null
      this.cancelEditingTestNotes()
      // Restore body scroll
      document.body.style.overflow = 'auto'
    },
    async updateTrial(trialId, trialData) {
      //expects caller to handle thrown errors
      this.trial = await this.updateTrialStore(trialId, trialData)
    },
    async fetchTrialWithTests(trialId) {
      await this.executeApiCallWithToasts(async () => {
        this.trial = await this.fetchTrialWithTestsStore(trialId)
      }, messages.fetching.general.failure)
    },
    async saveTestNotes() {
      await this.executeApiCallWithToasts(
        async () => {
          await this.updateTestStore(this.selectedTest.id || this.selectedTest._id, {
            notes: this.editedTestNotes,
          })
        },
        messages.tests.updated.notes.failure,
        messages.tests.updated.notes.success,
      )
      this.selectedTest.notes = this.editedTestNotes
      // Update the test in the trial.tests array as well
      const testIndex = this.findIndexById(this.trial.tests, this.selectedTest)
      if (testIndex !== -1) {
        this.trial.tests[testIndex].notes = this.editedTestNotes
      }
      this.cancelEditingTestNotes()
    },
    async saveTrialProcedures() {
      await this.executeApiCallWithToasts(
        () => {
          this.updateTrial(this.trial._id, {
            ...this.trial,
            procedures: this.editedTrialProcedures,
          })
        },
        messages.trials.updated.procedures.failure,
        messages.trials.updated.procedures.success,
      )
      this.resetStates(this.getTrialProceduresStates)
    },
    async saveTrialNotes() {
      await this.executeApiCallWithToasts(
        () => {
          this.updateTrial(this.trial._id, {
            ...this.trial,
            notes: this.editedTrialNotes,
          })
        },
        messages.trials.updated.notes.failure,
        messages.trials.updated.notes.success,
      )
      this.resetStates(this.getTrialNotesStates)
    },
    async handleTagsUpdate(tags) {
      await this.executeApiCallWithToasts(
        () => {
          this.updateTrial(this.trial._id, { ...this.trial, tags })
        },
        messages.trials.updated.tags.failure,
        messages.trials.updated.tags.success,
      )
    },
    async deleteTest(testId) {
      const confirmed = window.confirm(messages.tests.deleted.confirm)
      if (!confirmed) return
      await this.executeApiCallWithToasts(
        () => {
          this.deleteTestByTestIdStore(testId)
        },
        messages.tests.deleted.failure,
        messages.tests.deleted.success,
      )
      //optimistic approach of removing the deleted test
      this.trial.tests = this.trial.tests.filter((t) => t._id !== testId)
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
  },
}
</script>

<style scoped>
.trial-view {
  display: flex;
  flex-direction: column;
}

.trial-header {
  padding: 1rem;
  min-width: auto;
  border-bottom: 1px solid #e5e7eb;
}

.accordion-toggle {
  background: none;
  border: none;
  cursor: pointer;
  border-radius: 0.25rem;
  color: #6b7280;
  transition: all 0.2s;
}

.accordion-toggle svg {
  transition: transform 0.2s ease;
}

.accordion-toggle svg.rotated {
  transform: rotate(180deg);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center !important;
}

.card {
  background-color: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  padding: 1.25rem;
  font-family: system-ui, sans-serif;
  transition: box-shadow 0.2s ease-in-out;
}

.card-button {
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  text-align: center;
  cursor: pointer;
  position: relative;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.header-title {
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--color-text);
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.card-actions {
  display: flex;
  gap: 0.3rem;
}

.card-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #111827;
  text-transform: capitalize;
}

.card-description {
  font-size: 0.875rem;
  color: #6b7280;
}

.card-content {
  padding-top: 0.5rem;
  font-size: 0.75rem;
  color: #374151;
}

.card-content p {
  white-space: pre-wrap;
  word-break: break-word;
  overflow-wrap: anywhere;
}

.card-footer {
  display: flex;
}

.trial-content {
  padding: 1rem;
  display: grid;
  grid-template-columns: 2.25fr 0.75fr;
  gap: 1rem;
  align-items: start;
}

.trial-info {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.trial-tests {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.tag {
  display: inline-flex;
  align-items: center;
  padding: 2px 12px;
  border-radius: 16px;
  font-size: 12px;
  max-width: 100%;
  background-color: var(--color-text);
  color: white;
  font-weight: 600;
}

@media (max-width: 1040px) {
  .trial-content {
    padding: 1rem;
    display: grid;
    grid-template-columns: 1.5fr 1fr;
    gap: 1rem;
  }
  .trial-tests {
    grid-template-columns: 1fr;
  }
}

.btn {
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  border: none;
  cursor: pointer;
  font-weight: 500;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s;
}

.btn-primary {
  background-color: #3b82f6;
  color: white;
}

.btn-primary:hover {
  background-color: #2563eb;
}

.btn-secondary {
  background-color: #6b7280;
  color: white;
}

.btn-secondary:hover {
  background-color: #4b5563;
}

.btn-outline {
  background-color: transparent;
  color: #6b7280;
  border: 1px solid #d1d5db;
}

.btn-icon {
  width: 28px;
  height: 28px;
  padding: 0;
  border-radius: 5rem;
}

svg {
  display: block;
  margin: auto;
  stroke: currentColor;
}

.btn-outline:hover {
  background-color: #f9fafb;
  border-color: #9ca3af;
}

.btn-sm {
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
}

/* Dialog Styles */
.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.dialog {
  background: white;
  border-radius: 1rem;
  max-width: 800px;
  width: 100%;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

.dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.dialog-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
  color: #111827;
}

.dialog-close {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 0.5rem;
  color: #6b7280;
  transition: all 0.2s;
}

.dialog-close:hover {
  background-color: #f3f4f6;
  color: #111827;
}

.dialog-content {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  padding: 1.5rem;
  border-top: 1px solid #e5e7eb;
}

/* Detail Section Styles */
.detail-section {
  margin-bottom: 2rem;
}

.detail-section:last-child {
  margin-bottom: 0;
}

.section-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 1rem 0;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #f3f4f6;
}

.detail-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.detail-item label {
  font-weight: 500;
  color: #5c5b5b;
  font-size: 0.875rem;
}

.detail-item span {
  color: #111827;
  font-size: 0.875rem;
}

.monospace {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  background-color: #f3f4f6;
  padding: 0.125rem 0.25rem;
  border-radius: 0.25rem;
  font-size: 0.8125rem;
}

.notes-content {
  background-color: #f9fafb;
  padding: 1rem;
  border-radius: 0.5rem;
  border: 1px solid #e5e7eb;
}

/* Data Table Styles */
.data-table-container {
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  overflow: hidden;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table th,
.data-table td {
  padding: 0.75rem;
  text-align: left;
  border-bottom: 1px solid #e5e7eb;
}

.data-table th {
  background-color: #f9fafb;
  font-weight: 600;
  color: #374151;
  font-size: 0.875rem;
}

.data-table td {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 0.8125rem;
  color: #111827;
}

.data-table tr:last-child td {
  border-bottom: none;
}

.data-note {
  padding: 0.5rem 0.75rem;
  background-color: #f9fafb;
  color: #6b7280;
  font-size: 0.875rem;
  margin: 0;
}

.notes-content {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  padding: 1rem;
  color: #374151;
  line-height: 1.6;
  cursor: pointer;
  transition: all 0.2s;
}

.notes-content:hover {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.empty-text-field {
  color: #9ca3af;
  font-style: italic;
  margin: 0;
}

.notes-edit-container {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.editing-textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-family: inherit;
  font-size: 0.875rem;
  line-height: 1.5;
  resize: vertical;
  min-height: 100px;
  transition: border-color 0.2s;
}

.editing-textarea:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.editing-textarea-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}

.commands-content {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  padding: 1rem;
}

.commands-content pre {
  margin: 0;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 0.8125rem;
  color: #374151;
  white-space: pre-wrap;
  word-wrap: break-word;
}

@media (max-width: 640px) {
  .dialog {
    margin: 0.5rem;
    max-height: 95vh;
  }

  .detail-grid {
    grid-template-columns: 1fr;
  }

  .card-header {
    flex-direction: column;
    gap: 0.5rem;
  }

  .card-actions {
    align-self: flex-start;
  }
}
.trial-view-tags-container {
  max-width: fit-content;
}
</style>
