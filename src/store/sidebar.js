import { defineStore } from 'pinia'
import { getSidebarStatusCookie, setSidebarStatusCookie } from '@/services/cookies'

export const useSidebarStore = defineStore('sidebar', {
  state: () => ({
    opened: getSidebarStatusCookie() ? !!+getSidebarStatusCookie() : true,
    navigationGroups: [],
  }),

  getters: {
    getNavigationGroups() {
      return this.navigationGroups
    },
  },

  actions: {
    /**
     * @param {boolean} status
     */
    toggleSidebar() {
      this.opened = !this.opened
      if (this.opened) {
        setSidebarStatusCookie(1)
      } else {
        setSidebarStatusCookie(0)
      }
      return this.opened
    },
    setRoutes(routes) {
      for (const route of routes) {
        if (route.meta.showOnSidebar) {
          this.navigationGroups.push(route)
        }
      }
    },
  },
})
