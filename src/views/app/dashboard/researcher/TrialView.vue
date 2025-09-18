<template>
  <div class="trial-view">
    <div v-if="trial" class="card trial-header">
      <div class="card-header">
        <h3 class="card-title">
          {{ trial.name }}
        </h3>
        <button class="btn btn-primary" @click="goToUI">New Test</button>
      </div>
      <TrialTags :tags="trial.tags" />
    </div>
    <div v-else>
      <p>Loading trial...</p>
    </div>

    <div v-if="trial" class="trial-info">
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">Procedures</h3>
        </div>
        <div class="card-content">
          <p v-html="trial.procedures"></p>
        </div>
      </div>
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">Notes</h3>
        </div>
        <div class="card-content">
          <p v-html="trial.notes"></p>
        </div>
      </div>
    </div>
    <div v-else>
      <p>Loading trial...</p>
    </div>

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
            <v-chip size="small">Channel {{ test.channel }}</v-chip>
            <button
              class="btn btn-outline btn-sm"
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
              Details
            </button>
          </div>
        </div>
        <div class="card-content">
          <Chart
            v-if="test.measurements && test.measurements.length"
            type="line"
            :data="getChartData(test.type, test.measurements)"
            :options="test.type === 'gate' ? gateChartOptions : timeChartOptions"
            :height="300"
          />
          <p v-else>No measurement data available for this test.</p>
        </div>
      </div>
    </div>
    <div v-else>
      <p>No tests found for this trial.</p>
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
            </div>
          </div>

          <!-- Test Configuration (if available) -->
          <div v-if="selectedTest.notes || isEditingNotes" class="detail-section">
            <h3 class="section-title">Notes</h3>

            <!-- View Mode -->
            <div v-if="!isEditingNotes" class="notes-content" @click="startEditingNotes">
              <p v-if="selectedTest.notes" v-html="selectedTest.notes"></p>
              <p v-else class="empty-notes">Click to add notes...</p>
            </div>

            <!-- Edit Mode -->
            <div v-else class="notes-edit-container">
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
import { api } from '@/api'
import TrialTags from '@/components/dashboard/TrialTags.vue'
import { useRoute } from 'vue-router'
import Chart from 'primevue/chart'

export default {
  name: 'TrialView',
  components: {
    TrialTags,
    Chart,
  },
  data() {
    return {
      trial: null,
      showTestDialog: false,
      selectedTest: null,
      gateChartOptions: {
        interaction: {
          mode: 'index',
          intersect: false,
        },
        plugins: {
          legend: {
            labels: {
              color: '#495057',
              font: {
                size: 12,
              },
            },
          },
          tooltip: {
            mode: 'index',
            intersect: false,
          },
        },
        scales: {
          x: {
            type: 'linear',
            stacked: true,
            title: {
              display: true,
              text: 'Gate Voltage (V)',
              color: '#2c3e50',
              font: {
                weight: 'bold',
              },
            },
            ticks: {
              color: '#495057',
            },
          },
          y: {
            type: 'linear',
            title: {
              display: true,
              text: 'Voltage X (mV)',
              color: '#2c3e50',
              font: {
                weight: 'bold',
              },
            },
            ticks: {
              color: '#495057',
            },
          },
        },
        elements: {
          line: {
            tension: 0.4,
          },
          point: {
            radius: 1,
          },
        },
      },
      timeChartOptions: {
        interaction: {
          mode: 'index',
          intersect: false,
        },
        plugins: {
          legend: {
            labels: {
              color: '#495057',
              font: {
                size: 12,
              },
            },
          },
          tooltip: {
            mode: 'index',
            intersect: false,
          },
        },
        scales: {
          x: {
            type: 'linear',
            title: {
              display: true,
              text: 'Time (S)',
              color: '#2c3e50',
              font: {
                weight: 'bold',
              },
            },
            ticks: {
              color: '#495057',
            },
          },
          y: {
            type: 'linear',
            title: {
              display: true,
              text: 'Voltage X (mV)',
              color: '#2c3e50',
              font: {
                weight: 'bold',
              },
            },
            ticks: {
              color: '#495057',
            },
          },
        },
        elements: {
          line: {
            tension: 0.4,
          },
          point: {
            radius: 1,
          },
        },
      },
      isEditingNotes: false,
      editedNotes: '',
    }
  },
  mounted() {
    const route = useRoute()
    this.fetchTrialWithTests(route.params.trialId)
  },
  methods: {
    async fetchTrialWithTests(trialId) {
      try {
        // First get the trial data
        const trialResponse = await api.trial.getTrialById(trialId)
        this.trial = trialResponse.data

        // Then get all tests for this trial
        const testResponse = await api.test.getTestsByTrialId(trialId)
        this.trial.tests = testResponse.data.data
      } catch (error) {
        console.error('Error fetching trial or tests:', error)
      }
    },
    startEditingNotes() {
      this.isEditingNotes = true
      this.editedNotes = this.selectedTest.notes || ''
    },

    async saveNotes() {
      try {
        // Call your API to update the test notes
        await api.test.updateTest(this.selectedTest.id || this.selectedTest._id, {
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
      } catch (error) {
        console.error('Error saving notes:', error)
        // You might want to show a toast/notification here
      }
    },

    cancelEditingNotes() {
      this.isEditingNotes = false
      this.editedNotes = ''
    },
    getChartData(testType, measurements) {
      return {
        labels:
          testType === 'gate'
            ? measurements.map((item) => item.gateV)
            : measurements.map((item) => item.time),
        datasets: [
          {
            label: 'Voltage X',
            data: measurements.map((item) => item.voltageX),
            borderColor: testType !== 'gate' ? '#f97316' : '#36A2EB',
            pointBackgroundColor: testType !== 'gate' ? '#f97316' : '#36A2EB',
          },
        ],
      }
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
          ? ['Gate Voltage (V)', 'Voltage X (mV)']
          : ['Time (s)', 'Voltage X (mV)']

      const rows = test.measurements.map((m) =>
        test.type === 'gate' ? [m.gateV, m.voltageX] : [m.time, m.voltageX],
      )

      return [headers.join(','), ...rows.map((row) => row.join(','))].join('\n')
    },
  },
}
</script>

<style scoped>
.trial-view {
  padding: 12px 16px;
}

.trial-header {
  max-width: 400px;
  min-width: auto;
}

.card {
  background-color: white;
  border: 1px solid #e5e7eb;
  border-radius: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  padding: 1.5rem;
  min-width: 320px;
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

.card-header {
  margin-bottom: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.card-actions {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.card-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
  color: #111827;
  text-transform: capitalize;
}

.card-description {
  font-size: 0.875rem;
  color: #6b7280;
}

.card-content {
  font-size: 1rem;
  color: #374151;
  margin-bottom: 1rem;
}

.card-footer {
  display: flex;
}

.trial-info {
  margin-bottom: 1rem;
  margin-top: 1rem;
  display: flex;
  gap: 1rem;
}

.trial-tests {
  margin-top: 1rem;
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1rem;
}

/* Button Styles */
.btn {
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
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
  color: #6b7280;
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
</style>
