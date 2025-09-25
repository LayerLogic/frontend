<template>
  <div class="register-container">
    <form @submit.prevent="handleRegisteration" class="register-form">
      <div>
        <h2 class="register-title">Register</h2>
        <h3 class="register-subtitle">
          Already have an account? <RouterLink to="/">Login</RouterLink>
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
      <div class="form-group">
        <label for="confirmPassword" class="form-label">Confirm Password:</label>
        <input
          type="password"
          id="confirmPassword"
          v-model="confirmPassword"
          required
          class="form-input"
        />
      </div>

      <button type="submit" class="btn btn-primary register-button">Register</button>
    </form>
  </div>
</template>

<script>
import { useUserStore } from '@/store/user'
import { mapActions } from 'pinia'
import { toast } from 'vue-sonner'

export default {
  name: 'RegisterView',
  data() {
    return {
      email: '',
      password: '',
      confirmPassword: '',
    }
  },
  methods: {
    ...mapActions(useUserStore, ['registerUser']),
    async handleRegisteration() {
      if (!this.confirmPasswordMatch()) {
        toast.error('Passwords do not match')
        return
      }
      const data = {
        email: this.email,
        password: this.password,
        username: this.email.split('@')[0],
        role: 'customer',
      }
      try {
        await this.registerUser(data)
        toast.success('Registration successful')
        this.$router.push({ name: 'dashboard' })
      } catch (error) {
        console.error(error)
        toast.error(error.response.data.message ?? 'Registration failed')
      }
    },
    confirmPasswordMatch() {
      if (this.password !== this.confirmPassword) {
        console.log('Passwords do not match')
        return false
      }
      console.log('Passwords match')
      return true
    },
  },
}
</script>

<style scoped>
.register-container {
  display: flex;
  align-items: start;
  justify-content: center;
  padding: 2rem;
}

.register-form {
  padding: 1.5rem;
  border-radius: 0.5rem;
  background-color: var(--color-background);
  box-shadow: 0 0 20rem -3.3rem var(--color-primary);
  width: 100%;
  max-width: 24rem;
  border: 1px solid var(--color-border);
  display: grid;
  gap: 1rem;
}

.register-title {
  font-size: 1.2rem;
  line-height: 1.75rem;
  font-weight: 400;
  text-align: left;
}

.register-subtitle {
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
  border: 1px solid var(--color-border);
  border-radius: 0.5rem;
  background-color: transparent;
  color: var(--color-text);
}

.form-input:focus {
  outline: var(--color-primary);
  border-color: var(--color-primary);
}

.register-button {
  background-color: var(--vt-c-light-purple);
  color: var(--vt-c-white);
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  border: none;
  cursor: pointer;
  transition: opacity 0.2s;
  margin-top: 0.5rem;
  height: auto !important;
  font-size: 0.875rem;
  line-height: 1.25rem;
}

.register-button:hover {
  opacity: 0.9;
}

.register-button:focus {
  outline: none;
}
</style>
