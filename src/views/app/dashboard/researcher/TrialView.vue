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
          <v-chip size="small">Channel {{ test.channel }}</v-chip>
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
      const id = this.trial._id // Replace with your actual trial ID variable
      const url = `https://layerlogic.github.io/ui-v-2?id=${encodeURIComponent(id)}`
      window.open(url, '_blank') // Opens in a new tab
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
</style>
