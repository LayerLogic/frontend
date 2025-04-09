<template>
  <div class="sidebar-wrapper" :class="{ collapsed: isCollapsed }">
    <div class="sidebar">
      <div
        class="sidebar-header"
        :style="{
          padding: !isCollapsed ? '0px 16px' : '17px',
          justifyContent: isCollapsed ? 'center' : 'space-between',
        }"
      >
        <LayerLogicLogo width="64" height="64" v-if="!isCollapsed" />
        <button class="btn btn-outline btn-icon-only" @click="toggleSidebar">
          <v-icon v-if="isCollapsed"> mdi-chevron-right </v-icon>
          <v-icon v-else> mdi-chevron-left </v-icon>
        </button>
      </div>

      <div class="sidebar-content" v-if="!isCollapsed">
        <div class="nav-group-title">main</div>
        <div class="nav-group" v-for="(route, index) in navigationGroups" :key="index">
          <nav class="nav-links">
            <RouterLink
              :key="route.path"
              :to="route.path"
              class="nav-link"
              :class="{ active: currentPath === route.path }"
              :title="isCollapsed ? route.meta.title : ''"
            >
              <v-icon>{{ route.meta.icon }}</v-icon>
              <span class="nav-label">{{ route.meta.title }}</span>
            </RouterLink>
          </nav>
        </div>
      </div>

      <div class="sidebar-footer" v-if="!isCollapsed">
        <slot name="footer">
          <div class="user-info">
            <div class="user-details">
              <div class="user-name">{{ this.username }}</div>
              <div class="user-role">{{ this.role }}</div>
            </div>
            <button @click="handleLogout" class="btn btn-icon-only btn-outline">
              <v-icon>mdi-logout</v-icon>
            </button>
          </div>
        </slot>
      </div>
      <div class="sidebar-footer" v-else>
        <slot name="footer">
          <div class="user-info" style="justify-content: center">
            <button @click="handleLogout" class="btn btn-danger" v-if="!isCollapsed">Logout</button>
            <button @click="handleLogout" class="btn btn-icon-only btn-outline" v-else>
              <v-icon>mdi-logout</v-icon>
            </button>
          </div>
        </slot>
      </div>
    </div>
  </div>
</template>

<script>
import { RouterLink } from 'vue-router'
import { mapActions } from 'pinia'
import { useUserStore } from '@/store/user'
import LayerLogicLogo from './LayerLogicLogo.vue'

export default {
  name: 'AppSidebar',
  props: {
    username: {
      default: 'User',
      required: true,
    },
    role: {
      default: 'Role',
      required: true,
    },
    navigationGroups: {
      default: () => [],
    },
    currentPath: {
      type: String,
      required: true,
    },
    toggleSidebar: {
      type: Function,
      required: true,
    },
    isCollapsed: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    RouterLink,
    LayerLogicLogo,
  },
  data() {
    return {}
  },
  methods: {
    ...mapActions(useUserStore, ['logoutUser']),
    async handleLogout() {
      try {
        await this.logoutUser()
        this.$router.push('/auth/login')
      } catch (error) {
        console.error('Error during logout:', error)
      }
    },
  },
}
</script>

<style>
.sidebar-wrapper {
  --sidebar-width: 260px;
  --sidebar-collapsed-width: 70px;
  --sidebar-bg-color: var(--color-background);
  --sidebar-border-color: var(--color-border);
  --sidebar-text-color: var(--color-text);
  --sidebar-muted-color: var(--color-text-muted, var(--vt-c-text-light-2));
  --sidebar-hover-bg: var(--vt-c-light-purple, #7c19f6);
  --sidebar-hover-text: var(--vt-c-white, #ffffff);
  --sidebar-active-bg: var(--vt-c-dark-purple, #3b0085);
  --sidebar-active-text: var(--vt-c-white, #ffffff);

  height: 100vh;
  position: relative;
  transition:
    width 0.3s ease,
    background-color 0.5s,
    color 0.5s,
    border-color 0.5s;
  width: var(--sidebar-width);
  flex-shrink: 0;
}

.sidebar-wrapper.collapsed {
  width: var(--sidebar-collapsed-width);
}

.sidebar {
  background-color: var(--sidebar-bg-color);
  border-right: 1px solid var(--sidebar-border-color);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  overflow: hidden;
  position: fixed;
  width: inherit;
  transition:
    background-color 0.5s,
    border-color 0.5s;
}

.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0px 16px;
  transition: border-color 0.5s;
  border-bottom: 1px solid var(--sidebar-border-color);
}

.sidebar-content {
  flex: 1;
  overflow-y: auto;
  padding: 16px 0;
}

.nav-group:not(:last-child) {
  margin-bottom: 0.25rem;
}

.nav-group-title {
  color: var(--color-text-muted);
  font-size: 0.9rem;
  font-weight: 500;
  letter-spacing: 0.05em;
  margin-bottom: 8px;
  padding: 0 16px;
  text-transform: uppercase;
  transition: color 0.5s;
}

.nav-links {
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
}

.nav-link {
  font-weight: 500;
  align-items: center;
  border-radius: 4px;
  color: var(--sidebar-text-color);
  display: flex;
  margin: 0px 8px;
  padding: 4px 8px;
  gap: 8px;
  text-decoration: none;
  transition:
    background-color 0.2s,
    color 0.2s;
}

.nav-link:hover {
  background-color: var(--sidebar-hover-bg);
  color: var(--sidebar-hover-text);
}

.nav-link.active {
  background-color: var(--sidebar-active-bg);
  color: var(--sidebar-active-text);
  font-weight: 500;
}
.nav-label {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.sidebar-footer {
  border-top: 1px solid var(--sidebar-border-color);
  padding: 12px 16px;
  align-content: center;
  transition: border-color 0.5s;
}

.user-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.user-details {
  overflow: hidden;
}

.user-name {
  color: var(--color-heading);
  font-size: 1rem;
  line-height: normal;
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  transition: color 0.5s;
  text-transform: capitalize;
}

.user-role {
  color: var(--sidebar-muted-color);
  font-size: 0.875rem;
  line-height: normal;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  transition: color 0.5s;
}
</style>
