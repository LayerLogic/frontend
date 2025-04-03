import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { aliases, mdi } from 'vuetify/iconsets/mdi'

// Create a theme that matches your CSS variables
export default createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi,
    },
  },
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        dark: false,
        colors: {
          primary: '#7c19f6', // --vt-c-light-purple
          'primary-darken-1': '#3b0085', // --vt-c-dark-purple
          'primary-lighten-1': '#c497fb', // --vt-c-lightest-purple
          secondary: '#3b0085', // --vt-c-dark-purple
          accent: '#c497fb', // --vt-c-lightest-purple

          background: 'hsl(0 0% 100%)', // --color-background light mode
          surface: 'hsl(0 0% 100%)', // same as background

          error: '#FF5252', // Default Vuetify error
          info: '#2196F3', // Default Vuetify info
          success: '#4CAF50', // Default Vuetify success
          warning: '#dc8b5a', // --vt-c-warning
        },
      },
    },
  },
})
