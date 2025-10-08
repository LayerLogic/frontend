<script>
import { RouterLink, RouterView } from 'vue-router'
import GreetingMsg from '@/components/landing/GreetingMsg.vue'
import LayerLogicLogo from '@/components/ui/LayerLogicLogo.vue'

export default {
  name: 'AuthLayout',
  components: {
    RouterLink,
    RouterView,
    GreetingMsg,
    LayerLogicLogo,
  },
}
</script>

<template>
  <section
    class="grid grid-cols-1 content-center justify-center h-screen px-8 max-w-screen-lg mx-auto lg:grid-cols-2"
  >
    <header
      class="leading-none max-h-screen lg:flex lg:items-center lg:pr-[calc(var(--section-gap)/2)]"
    >
      <LayerLogicLogo class="block mx-auto lg:mx-0 lg:mr-8" width="160" hight="160" />

      <div class="lg:flex lg:items-start lg:flex-wrap">
        <GreetingMsg msg="LayerLogic" />

        <nav
          class="w-full text-sm text-center mt-8 lg:text-left lg:-ml-4 lg:text-base lg:py-4 lg:mt-4"
        >
          <RouterLink
            to="/auth/login"
            class="inline-block px-4 border-l border-border first:border-0 text-muted-foreground hover:text-primary hover:bg-muted transition-colors duration-200 [&.router-link-exact-active]:text-primary [&.router-link-exact-active:hover]:bg-transparent"
          >
            Login
          </RouterLink>
          <RouterLink
            to="/auth/register"
            class="inline-block px-4 border-l border-border first:border-0 text-muted-foreground hover:text-primary hover:bg-muted transition-colors duration-200 [&.router-link-exact-active]:text-primary [&.router-link-exact-active:hover]:bg-transparent"
          >
            Register
          </RouterLink>
        </nav>
      </div>
    </header>
    <RouterView />
  </section>
</template>
