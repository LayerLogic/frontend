export const defaultChartOptions = {
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

export function getChartData(testType, measurements) {
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
}
