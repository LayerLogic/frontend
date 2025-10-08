<template>
  <section class="flex gap-2">
    <div class="px-4 py-8 flex flex-col gap-4">
      <component :is="currentRole" :username="username" />
    </div>
  </section>
</template>

<script>
import { mapState } from 'pinia'
import { RouterView } from 'vue-router'

import { useUserStore } from '@/store/user'
import ResearcherView from './researcher/ResearcherView.vue'
import CustomerView from './customer/CustomerView.vue'
import AdminView from './admin/AdminView.vue'

export default {
  name: 'DashboardLayout',
  components: {
    RouterView,
    AdminView,
    ResearcherView,
    CustomerView,
  },
  data() {
    return {
      currentRole: '',
    }
  },
  computed: {
    ...mapState(useUserStore, ['username', 'role']),
  },
  created() {
    if (this.role === 'admin') {
      this.currentRole = 'AdminView'
    } else if (this.role === 'researcher') {
      this.currentRole = 'ResearcherView'
    } else {
      this.currentRole = 'CustomerView'
    }
  },
}
</script>
