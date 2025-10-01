<template>
  <div class="flex items-start justify-center p-8">
    <form
      @submit.prevent="handleLogin"
      class="p-6 rounded-lg w-full max-w-96 border border-border grid gap-4 bg-white"
    >
      <div>
        <h2 class="text-xl leading-8 font-normal text-left text-zinc-950">Login</h2>
        <h3 class="text-sm leading-5 font-normal text-left text-muted-foreground mb-2">
          Don't have an account?
          <RouterLink to="/auth/register" class="text-zinc-950 hover:underline"
            >Register</RouterLink
          >
        </h3>
      </div>
      <div class="grid gap-2">
        <label for="email" class="block text-muted-foreground text-sm leading-5 font-normal"
          >Email:</label
        >
        <UiInput
          type="email"
          id="email"
          v-model="email"
          required
          placeholder="example@example.com"
        />
      </div>
      <div class="grid gap-2">
        <label for="password" class="block text-muted-foreground text-sm leading-5 font-normal"
          >Password:</label
        >
        <UiInput type="password" id="password" v-model="password" required />
      </div>
      <UiButton type="submit" class="mt-2"> Login </UiButton>
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
  name: 'LoginView',
  components: {
    UiInput,
    UiButton,
  },
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
        toast.error(error.response.data.message ?? 'Login failed')
      }
    },
  },
}
</script>
