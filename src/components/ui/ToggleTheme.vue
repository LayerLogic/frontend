<template>
  <button @click="toggleTheme" class="theme-toggle">
    <span v-if="isDarkMode">☀️</span>
    <span v-else>🌙</span>
  </button>
</template>

<script>
export default {
  data() {
    return {
      isDarkMode: false,
    }
  },
  mounted() {
    const savedTheme = localStorage.getItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    this.isDarkMode = savedTheme === 'dark' || (!savedTheme && prefersDark)
    this.applyTheme()
  },
  methods: {
    toggleTheme() {
      this.isDarkMode = !this.isDarkMode
      this.applyTheme()
    },
    applyTheme() {
      document.documentElement.classList.remove('light-mode', 'dark-mode')
      const theme = this.isDarkMode ? 'dark' : 'light'
      document.documentElement.classList.add(`${theme}-mode`)
      localStorage.setItem('theme', theme)
    },
  },
}
</script>

<style scoped>
.theme-toggle {
  width: 2.2rem;
  height: 2.2rem;
  border: 2px solid var(--color-border);
  border-radius: 50%;
  cursor: pointer;
  color: var(--color-text-muted);
  background-color: var(--color-background);
  display: flex;
  align-items: center;
  justify-content: center;
  transition:
    background-color 0.3s,
    color 0.3s;
  position: fixed;
  top: 1rem;
  right: 1rem;
}

.theme-toggle:hover {
  background-color: var(--color-border);
  color: var(--color-text);
}
</style>
