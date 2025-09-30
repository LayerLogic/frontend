<template>
  <div class="flex items-start justify-center p-8">
    <form
      @submit.prevent="handleRegisteration"
      class="p-6 rounded-lg bg-white w-full max-w-96 border border-zinc-200 grid gap-4"
    >
      <div>
        <h2 class="text-xl leading-7 font-normal text-left text-zinc-900">Register</h2>
        <h3 class="text-sm leading-5 font-normal text-left text-zinc-600 mb-2">
          Already have an account?
          <RouterLink to="/" class="text-zinc-900 hover:underline">Login</RouterLink>
        </h3>
      </div>
      <div class="grid gap-2">
        <label for="email" class="block text-zinc-600 text-sm leading-5 font-normal">Email:</label>
        <UiInput
          type="email"
          id="email"
          v-model="email"
          required
          placeholder="example@example.com"
        />
      </div>
      <div class="grid gap-2">
        <label for="password" class="block text-zinc-600 text-sm leading-5 font-normal"
          >Password:</label
        >
        <UiInput type="password" id="password" v-model="password" required />
      </div>
      <div class="grid gap-2">
        <label for="confirmPassword" class="block text-zinc-600 text-sm leading-5 font-normal"
          >Confirm Password:</label
        >
        <UiInput type="password" id="confirmPassword" v-model="confirmPassword" required />
      </div>

      <UiButton type="submit" class="mt-2"> Register </UiButton>
    </form>
  </div>
</template>

<script>
import { useUserStore } from '@/store/user'
import { mapActions } from 'pinia'
import { toast } from 'vue-sonner'
import { Input as UiInput } from '@/components/ui/input'
import { Button as UiButton } from '@/components/ui/button'

export default {
  name: 'RegisterView',
  data() {
    return {
      email: '',
      password: '',
      confirmPassword: '',
    }
  },
  components: {
    UiInput,
    UiButton,
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
