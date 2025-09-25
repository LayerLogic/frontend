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
            :disabled="trialsStore.currentTrialIndex === 0 || isLoading"
          >
            Prev trial
          </button>
          <button
            class="btn btn-outline"
            @click="loadNextTrial"
            :disabled="
              trialsStore.currentTrialIndex === trialsStore.trialsIDs.length - 1 || isLoading
            "
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
        <div v-for="test in trial.tests" :key="test.id" class="card">
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
              :options="chartOptions"
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
          <div class="card-header" @click="toggleProcedures" style="cursor: pointer">
            <h3 class="card-title">Procedures</h3>
            <button class="accordion-toggle">
              <svg
                :class="{ rotated: showProcedures }"
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
          <div v-if="showProcedures" class="card-content">
            <p v-html="trial.procedures"></p>
          </div>
        </div>

        <div class="card">
          <div class="card-header" @click="toggleNotes" style="cursor: pointer">
            <h3 class="card-title">Notes</h3>
            <button class="accordion-toggle">
              <svg
                :class="{ rotated: showNotes }"
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
          <div v-if="showNotes" class="card-content">
            <p v-html="trial.notes"></p>
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
            <div v-if="!isEditingNotes" class="notes-content" @click="startEditingNotes">
              <p v-if="selectedTest.notes" v-html="selectedTest.notes"></p>
              <p v-else class="empty-notes">Click to add notes...</p>
            </div>

            <!-- Edit Mode -->
            <div v-if="isEditingNotes" class="notes-edit-container">
              <textarea
                v-model="editedNotes"
                class="notes-textarea"
                placeholder="Add your notes here..."
                rows="4"
                @keydown.ctrl.enter="saveNotes"
                @keydown.esc="cancelEditingNotes"
              ></textarea>
              <div class="notes-actions">
                <button class="btn btn-secondary btn-sm" @click="cancelEditingNotes">Cancel</button>
                <button class="btn btn-primary btn-sm" @click="saveNotes">
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
            @click="exportTestData"
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
import { useRoute } from 'vue-router'
import Chart from 'primevue/chart'
import { useTrialsStore } from '@/store/trials'
import { deleteTestByTestId } from '@/api/test'
import { mapStores, mapActions } from 'pinia'
import { updateTest } from '@/api/test'
import { toast } from 'vue-sonner'

export default {
  name: 'TrialView',
  components: {
    TagsInput,
    Chart,
  },
  data() {
    return {
      trial: null,
      showTestDialog: false,
      selectedTest: null,
      isLoading: false,
      isEditingNotes: false,
      editedNotes: '',
      showProcedures: false,
      showNotes: false,
    }
  },
  computed: {
    ...mapStores(useTrialsStore),
    chartOptions() {
      return {
        responsive: true,
        maintainAspectRatio: true,
        aspectRatio: 1,
        animation: false,
        elements: {
          point: {
            radius: 0,
          },
          line: {
            tension: 0.4,
          },
        },
        plugins: {
          legend: {
            position: 'top',
            labels: {
              usePointStyle: true,
              pointStyle: 'line',
              boxWidth: 16,
              color: '#424242',
            },
          },
        },
        scales: {
          y: {
            type: 'linear',
            display: true,
            position: 'left',
          },
          y1: {
            type: 'linear',
            display: true,
            position: 'right',
          },
          x: {
            type: 'linear',
          },
        },
        interaction: { intersect: false, mode: 'index' },
      }
    },
  },
  async mounted() {
    const route = useRoute()
    this.isLoading = true

    try {
      await this.trialsStore.fetchTrialsStore() //might be redundant

      // Set current index to the route's trialId
      const index = this.trialsStore.trialsIDs.indexOf(route.params.trialId)
      if (index >= 0) {
        this.trialsStore.currentTrialIndex = index
      }
      await this.fetchTrialWithTests(route.params.trialId)
    } finally {
      this.isLoading = false
    }
  },
  methods: {
    ...mapActions(useTrialsStore, ['fetchTrialWithTestsStore', 'updateTrialStore']),
    toggleProcedures() {
      this.showProcedures = !this.showProcedures
    },
    toggleNotes() {
      this.showNotes = !this.showNotes
    },
    async fetchTrialWithTests(trialId) {
      try {
        this.trial = await this.fetchTrialWithTestsStore(trialId)
      } catch (error) {
        console.error('Error fetching trial or tests:', error)
        toast.error(error.message ?? 'Error fetching trial or tests')
      }
    },
    startEditingNotes() {
      this.isEditingNotes = true
      this.editedNotes = this.selectedTest.notes || ''
    },

    async saveNotes() {
      try {
        // Call your API to update the test notes
        await updateTest(this.selectedTest.id || this.selectedTest._id, {
          notes: this.editedNotes,
        })

        // Update the local data
        this.selectedTest.notes = this.editedNotes

        // Update the test in the trial.tests array as well
        const testIndex = this.trial.tests.findIndex(
          (t) => (t.id || t._id) === (this.selectedTest.id || this.selectedTest._id),
        )
        if (testIndex !== -1) {
          this.trial.tests[testIndex].notes = this.editedNotes
        }

        this.isEditingNotes = false
        this.editedNotes = ''
        toast.success('Notes saved successfully')
      } catch (error) {
        console.error('Error saving notes:', error)
        toast.error(error.message ?? 'Error saving notes')
      }
    },

    cancelEditingNotes() {
      this.isEditingNotes = false
      this.editedNotes = ''
    },
    async updateTrial(trialId, trialData) {
      try {
        this.trial = await this.updateTrialStore(trialId, trialData)
        toast.success('Trial updated successfully')
      } catch (error) {
        console.error('Error updating trial tags, notes or procedures: ', error)
        toast.error(error.message ?? 'Error updating trial tags, notes or procedures')
      }
    },
    getChartData(testType, measurements) {
      if (!measurements?.length) {
        return { labels: [], datasets: [] }
      }

      // X-axis values depend on test type
      const labels =
        testType === 'gate' ? measurements.map((m) => m.gateV) : measurements.map((m) => m.time)

      const datasets = []

      datasets.push({
        label: 'Voltage X',
        data: measurements.map((m) => m.voltageX),
        borderColor: '#36A2EB',
        backgroundColor: '#36A2EB',
        fill: false,
        yAxisID: 'y',
      })
      datasets.push({
        label: 'Voltage Y',
        data: measurements.map((m) => m.voltageY),
        borderColor: '#ef4444',
        backgroundColor: '#ef4444',
        fill: false,
        yAxisID: 'y1',
      })
      datasets.push({
        label: 'Y / X²',
        data: measurements.map((m) => (m.voltageX !== 0 ? m.voltageY / m.voltageX ** 2 : null)),
        borderColor: '#22c55e',
        backgroundColor: '#22c55e',
        fill: false,
        yAxisID: 'y1',
      })

      return { labels, datasets }
    },
    goToUI() {
      const id = this.trial._id
      const url = `https://layerlogic.github.io/research-test-ui?id=${encodeURIComponent(id)}`
      window.open(url, '_blank')
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
      this.isEditingNotes = false // Add this line
      this.editedNotes = ''
      // Restore body scroll
      document.body.style.overflow = 'auto'
    },
    formatDate(dateString) {
      return new Date(dateString).toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      })
    },
    formatConfigKey(key) {
      return key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())
    },
    getVoltageRange(measurements) {
      const voltages = measurements.map((m) => m.voltageX)
      const min = Math.min(...voltages)
      const max = Math.max(...voltages)
      return `${min.toFixed(3)} - ${max.toFixed(3)} mV`
    },
    getGateVoltageRange(measurements) {
      const voltages = measurements.map((m) => m.gateV)
      const min = Math.min(...voltages)
      const max = Math.max(...voltages)
      return `${min.toFixed(3)} - ${max.toFixed(3)} V`
    },
    getTimeRange(measurements) {
      const times = measurements.map((m) => m.time)
      const min = Math.min(...times)
      const max = Math.max(...times)
      return `${min.toFixed(3)} - ${max.toFixed(3)} s`
    },
    exportTestData() {
      if (!this.selectedTest || !this.selectedTest.measurements) return

      const csvContent = this.generateCSV(this.selectedTest)
      const blob = new Blob([csvContent], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `test-${this.selectedTest.id || this.selectedTest._id}-data.csv`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
    },
    generateCSV(test) {
      const headers =
        test.type === 'gate'
          ? ['Vg (V)', 'X (mV)', 'Y (mV)', 'I (nA)', 'f (Hz)']
          : ['Time (s)', 'X (mV)', 'Y (mV)', 'I (nA)', 'f (Hz)']

      const rows = test.measurements.map((m) =>
        test.type === 'gate'
          ? [m.gateV, m.voltageX, m.voltageY, m.current, m.frequency]
          : [m.time, m.voltageX, m.voltageY, m.current, m.frequency],
      )

      return [headers.join(','), ...rows.map((row) => row.join(','))].join('\n')
    },
    async loadPrevTrial() {
      if (this.isLoading) return

      this.isLoading = true

      try {
        const id = this.trialsStore.prevTrial()
        await this.fetchTrialWithTests(id)
        this.$router.push({ name: 'trial', params: { trialId: id } })
      } finally {
        this.isLoading = false
      }
    },
    async handleTagsUpdate(tags) {
      console.log({ ...this.trial, tags: tags })
      try {
        this.trial = await this.updateTrialStore(this.trial._id, { ...this.trial, tags })
        toast.success('Trial tags updated successfully')
      } catch (error) {
        console.error('Failed updating trial tags:', error)
        toast.error(error.message ?? 'Failed updating trial tags')
      }
    },
    async deleteTest(testId, trialId) {
      const confirmed = window.confirm('Are you sure you want to delete this test?')
      if (!confirmed) return

      try {
        await deleteTestByTestId(testId)
        this.trial = await this.fetchTrialWithTestsStore(trialId)
        toast.success('Test deleted successfully')
      } catch (error) {
        console.error('Failed to delete test:', error)
        toast.error(error.message ?? 'Failed to delete test')
      }
    },
    async loadNextTrial() {
      if (this.isLoading) return

      this.isLoading = true

      try {
        const id = this.trialsStore.nextTrial()
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

.empty-notes {
  color: #9ca3af;
  font-style: italic;
  margin: 0;
}

.notes-edit-container {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.notes-textarea {
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

.notes-textarea:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.notes-actions {
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
