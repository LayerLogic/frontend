<script>
import { mapActions, mapState } from 'pinia'
import { Home } from 'lucide-vue-next'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  NavUser,
  SidebarHeader,
} from '@/components/ui/sidebar'
import { useUserStore } from '@/store/user'

export default {
  name: 'UiAppSidebar',
  components: {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarHeader,
    NavUser,
  },
  data() {
    return {
      items: [
        {
          title: 'Dashboard',
          url: '/app/dashboard',
          icon: Home,
        },
      ],
    }
  },
  computed: {
    ...mapState(useUserStore, ['username', 'email']),
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

<template>
  <Sidebar collapsible="icon">
    <SidebarHeader>
      <NavUser :user="{ name: this.username, email: this.email }" @logout="handleLogout" />
    </SidebarHeader>
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel>Application</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem v-for="item in this.items" :key="item.title">
              <SidebarMenuButton asChild :tooltip="item.title">
                <RouterLink :key="item.url" :to="item.url">
                  <component :is="item.icon" />
                  <span>{{ item.title }}</span>
                </RouterLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  </Sidebar>
</template>
