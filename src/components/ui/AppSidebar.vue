<template>
  <div class="sidebar-wrapper" :class="{ collapsed: isCollapsed }">
    <div class="sidebar">
      <div class="sidebar-header">
        <div class="logo-container" v-if="!isCollapsed">
          <h1 class="logo">{{ appName }}</h1>
        </div>

        <button class="collapse-button" @click="toggleSidebar">
          <span class="chevron" :class="{ rotated: isCollapsed }">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="chevron-icon"
            >
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </span>
        </button>
      </div>

      <div class="sidebar-content">
        <div class="nav-group-title" v-if="!isCollapsed">main</div>
        <div class="nav-group" v-for="(route, index) in navigationGroups" :key="index">
          <!-- <div class="nav-group-title" v-if="route.title && !isCollapsed">{{ route.title }}</div> -->
          <nav class="nav-links" v-if="!isCollapsed">
            <RouterLink
              :key="route.path"
              :to="route.path"
              class="nav-link"
              :class="{ active: currentPath === route.path }"
              :title="isCollapsed ? route.meta.title : ''"
            >
              <span class="nav-label">{{ route.meta.title }}</span>
            </RouterLink>
          </nav>
        </div>
      </div>

      <div v-if="isCollapsed" class="create-test-collapse">
        <button class="collapse-button">
          <RouterLink to="/app/create-test" class="nav-link">
            <span class="nav-label">+</span>
          </RouterLink>
        </button>
      </div>
      <div class="sidebar-footer" v-if="!isCollapsed">
        <slot name="footer">
          <div class="user-info">
            <div class="user-details">
              <div class="user-name">{{ this.username }}</div>
              <div class="user-role">{{ this.role }}</div>
            </div>
            <ToggleTheme class="toggle-theme" />
          </div>
        </slot>
      </div>
      <div class="sidebar-footer" v-else>
        <slot name="footer">
          <div class="user-info">
            <ToggleTheme class="toggle-theme" />
          </div>
        </slot>
      </div>
    </div>
  </div>
</template>

<script>
import { RouterLink } from 'vue-router'
import ToggleTheme from './ToggleTheme.vue'

export default {
  name: 'AppSidebar',
  props: {
    appName: {
      type: String,
      required: true,
    },
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
    ToggleTheme,
    RouterLink,
  },
  data() {
    return {}
  },
  methods: {},
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
  --sidebar-shadow: 0 1px 10px rgba(0, 0, 0, 0.1);

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
  height: 100%;
  overflow: hidden;
  position: fixed;
  width: inherit;
  box-shadow: var(--sidebar-shadow);
  transition:
    background-color 0.5s,
    border-color 0.5s;
}

.sidebar-header {
  align-items: center;
  border-bottom: 1px solid var(--sidebar-border-color);
  display: flex;
  justify-content: space-between;
  padding: 12px 16px;
  transition: border-color 0.5s;
}

.logo-container {
  overflow: hidden;
}

.logo {
  color: var(--color-heading);
  font-size: 1.2rem;
  font-weight: 600;
  margin: 0;
  white-space: nowrap;
  transition: color 0.5s;
}

.collapse-button {
  align-items: center;
  background: var(--sidebar-border-color);
  border: none;
  border-radius: 4px;
  color: var(--sidebar-muted-color);
  cursor: pointer;
  display: flex;
  height: 32px;
  justify-content: center;
  padding: 0;
  transition:
    background-color 0.2s,
    color 0.2s;
  width: 32px;
}

.collapse-button:hover {
  background-color: var(--sidebar-hover-bg);
  color: var(--sidebar-hover-text);
}

.chevron {
  display: flex;
  transition: transform 0.3s ease;
}

.chevron.rotated {
  transform: rotate(180deg);
}

.chevron-icon {
  height: 18px;
  width: 18px;
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
  flex-direction: column;
  gap: 4px;
}

.nav-link {
  font-weight: 500;
  align-items: center;
  border-radius: 4px;
  color: var(--sidebar-text-color);
  display: flex;
  margin: 0px 8px;
  padding: 4px 8px;
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

.nav-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 0px;
  flex-shrink: 0;
  /* width: 24px;
  height: 24px; */
}

.collapsed .nav-icon {
  margin-right: 0;
}

.nav-label {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.create-test-collapse {
  display: flex;
  justify-content: center;
  margin: 12px auto;
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
  font-size: 0.9rem;
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
  font-size: 0.8rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  transition: color 0.5s;
}

.toggle-theme {
  position: relative !important;
  margin-left: auto;
  top: 0 !important;
  right: 0 !important;
  flex-shrink: 0;
}

/* Mobile responsiveness */
@media (max-width: 768px) {
  .sidebar-wrapper {
    position: fixed;
    z-index: 100;
    transform: translateX(0);
    transition:
      transform 0.3s ease,
      width 0.3s ease;
  }

  .sidebar-wrapper.collapsed {
    transform: translateX(calc(-1 * var(--sidebar-collapsed-width)));
  }
}
</style>
