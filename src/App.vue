<script setup>
import { RouterLink, RouterView } from 'vue-router'
import GreetingMsg from './components/landing/GreetingMsg.vue'
import ToggleTheme from './components/ToggleTheme.vue'
import LayerLogicLogo from './components/LayerLogicLogo.vue'
</script>

<template>
  <header>
    <LayerLogicLogo class="logo" width="160" hight="160" />

    <div class="wrapper">
      <GreetingMsg msg="LayerLogic" />
      <ToggleTheme />

      <nav>
        <RouterLink to="/">Login</RouterLink>
        <RouterLink to="/auth/register">Register</RouterLink>
      </nav>
    </div>
  </header>
  <RouterView />
</template>

<style scoped>
header {
  line-height: 1;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 0.875rem;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text-muted);
  transition: background-color 0.2s;
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style>
