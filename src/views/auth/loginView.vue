<template>
  <div class="login-container">
    <form @submit.prevent="handleLogin" class="login-form">
      <div>
        <h2 class="login-title">Login</h2>
        <h3 class="login-subtitle">
          Don't have an account? <RouterLink to="/auth/register">Register</RouterLink>
        </h3>
      </div>
      <div class="form-group">
        <label for="email" class="form-label">Email:</label>
        <input
          type="email"
          id="email"
          v-model="email"
          required
          placeholder="example@example.com"
          class="form-input"
        />
      </div>
      <div class="form-group">
        <label for="password" class="form-label">Password:</label>
        <input type="password" id="password" v-model="password" required class="form-input" />
      </div>
      <button type="submit" class="login-button">Login</button>
    </form>
  </div>
</template>

<script>
import { useUserStore } from '@/store/user'
import { mapActions } from 'pinia'

export default {
  name: 'LoginView',
  data() {
    return {
      email: '',
      password: '',
    }
  },
  methods: {
    ...mapActions(useUserStore, ['loginUser']),
    async handleLogin() {
      const data = {
        email: this.email,
        password: this.password,
      }
      try {
        await this.loginUser(data)
        this.$router.push({ name: 'dashboard' })
      } catch (error) {
        console.error(error)
      }
    },
  },
}
</script>

<style scoped>
.login-container {
  display: flex;
  align-items: start;
  justify-content: center;
  padding: 2rem;
}

.login-form {
  padding: 1.5rem;
  border-radius: 1rem;
  background-color: var(--color-background);
  box-shadow: 0 0 20rem -3.3rem var(--color-primary);
  width: 100%;
  max-width: 24rem;
  border: 2px solid var(--color-border);
  display: grid;
  gap: 1rem;
}

.login-title {
  font-size: 1.2rem;
  line-height: 1.75rem;
  font-weight: 400;
  text-align: left;
}

.login-subtitle {
  font-size: 0.875rem;
  line-height: 1.25rem;
  font-weight: 400;
  text-align: left;
  color: var(--color-text-muted);
  margin-bottom: 0.5rem;
}

.form-group {
  display: grid;
  gap: 0.5rem;
}

.form-label {
  display: block;
  color: var(--color-text-muted);
  font-size: 0.875rem;
  line-height: 1.25rem;
  font-weight: 400;
}

.form-input {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 2px solid var(--color-border);
  border-radius: 0.5rem;
  background-color: transparent;
  color: var(--color-text);
}

.form-input:focus {
  outline: var(--color-primary);
  border-color: var(--color-primary);
}

.login-button {
  width: 100%;
  background-color: var(--vt-c-light-purple);
  color: var(--vt-c-white);
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  border: none;
  cursor: pointer;
  transition: opacity 0.2s;
  margin-top: 1rem;
}

.login-button:hover {
  opacity: 0.9;
}

.login-button:focus {
  outline: none;
}
</style>
