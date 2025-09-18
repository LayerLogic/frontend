<template>
  <div class="trial-view">
    <div v-if="trial && !isLoading" class="card trial-header">
      <div class="card-header">
        <h3 class="card-title">
          {{ trial.name }}
        </h3>        
        <div class="flex gap-2">
          <button class="btn btn-secondary" 
            @click="loadPrevTrial"
            :disabled="trialsStore.currentTrialIndex === 0 || isLoading">Prev
          </button>
          <button class="btn btn-secondary" 
            @click="loadNextTrial"
            :disabled="trialsStore.currentTrialIndex === trialsStore.trialsIDs.length - 1 || isLoading">Next
          </button>
          <button class="btn btn-primary" @click="goToUI" :disabled="isLoading">New Test</button>
        </div>
      </div>
      <div class="trial-view-tags-container">
        <div>
          <TagsInput
            :initial-tags="trial.tags"
            :showHint="false"
            @update:tags="handleTagsUpdate"
          />
        </div>
      </div>
    </div>
    <div v-else>
      <p>Loading trial...</p>
    </div>

    <div v-if="trial && !isLoading" class="trial-info">
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
    <div v-else-if="!isLoading">
      <p>Loading trial...</p>
    </div>
    
    <div v-if="trial && trial.tests && trial.tests.length && !isLoading" class="trial-tests">
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
          <v-chip size="small">Channel {{ test.channel }}</v-chip>
          <button class="btn btn-danger" @click="deleteTest(test._id, trial._id)">
            <v-icon small>mdi-delete</v-icon>
            Delete
          </button>
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
    <div v-else-if="trial && !isLoading">
      <p>No tests found for this trial.</p>
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

export default {
  name: 'TrialView',
  components: {
    TagsInput,
    Chart,
  },
  data() {
    return {
      trial: null,
      isLoading: false,
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
    }
  },
  computed: {
    ...mapStores(useTrialsStore),
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
    async fetchTrialWithTests(trialId) {
      try {
        this.trial = await this.fetchTrialWithTestsStore(trialId)
      } catch (error) {
        console.error('Error fetching trial or tests:', error)
      }
    },
    async updateTrial(trialId, trialData){
      try{
        this.trial = await this.updateTrialStore(trialId, trialData)
      } catch (error) {
        console.error('Error updating trial tags, notes or procedures: ', error)
      }
    },
    getChartData(testType, measurements) {
      // Add safety check
      if (!measurements || !Array.isArray(measurements) || measurements.length === 0) {
        return {
          labels: [],
          datasets: [{
            label: 'Voltage X',
            data: [],
            borderColor: testType !== 'gate' ? '#f97316' : '#36A2EB',
            pointBackgroundColor: testType !== 'gate' ? '#f97316' : '#36A2EB',
          }]
        }
      }

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
    async handleTagsUpdate(tags){
      console.log({...this.trial, tags:tags})
      try{
        this.trial = await this.updateTrialStore(this.trial._id, {...this.trial, tags})
        console.log("new trial:", this.trial)
      } catch (error) {
        console.error("Failed updating trial tags:", error)
      }
    },
    async deleteTest(testId, trialId){
      try{
        await deleteTestByTestId(testId)
        this.trial = await this.fetchTrialWithTestsStore(trialId)
      } catch (error){
        console.error('Failed to delete test:', error)
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
.trial-view-tags-container {
  margin-top: 0.5rem;
}

</style>