export function buildUIUrl(id) {
  const url = `https://layerlogic.github.io/research-test-ui?id=${encodeURIComponent(id)}`
  return url
}

export function formatDate(dateString) {
  return new Date(dateString).toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}

export function formatConfigKey(key) {
  return key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())
}

export function getVoltageRange(measurements) {
  const voltages = measurements.map((m) => m.voltageX)
  const min = Math.min(...voltages)
  const max = Math.max(...voltages)
  return `${min.toFixed(3)} - ${max.toFixed(3)} mV`
}

export function getGateVoltageRange(measurements) {
  const voltages = measurements.map((m) => m.gateV)
  const min = Math.min(...voltages)
  const max = Math.max(...voltages)
  return `${min.toFixed(3)} - ${max.toFixed(3)} V`
}

export function getTimeRange(measurements) {
  const times = measurements.map((m) => m.time)
  const min = Math.min(...times)
  const max = Math.max(...times)
  return `${min.toFixed(3)} - ${max.toFixed(3)} s`
}

export function exportTestData(test) {
  if (!test || !test.measurements) return

  const csvContent = generateCSV(test)
  const blob = new Blob([csvContent], { type: 'text/csv' })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `test-${test._id}-data.csv`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  window.URL.revokeObjectURL(url)
}

function generateCSV(test) {
  const headers =
    test.type === 'gate'
      ? ['Vg (V)', 'X (mV)', 'Y (mV)', 'I (nA)', 'f (Hz)']
      : ['Time (s)', 'X (mV)', 'Y (mV)', 'I (nA)', 'f (Hz)']

  const rows = test.measurements.map((m) =>
    test.type === 'gate'
      ? [m.gateV, m.voltageX, m.voltageY, m.current, m.frequency]
      : [m.time, m.voltageX, m.voltageY, m.current, m.frequency],
  )

  return [headers.join(';'), ...rows.map((row) => row.join(';'))].join('\n')
}
