<script setup>
import { supabase } from '@/libs/supabase'
import { VNodeRenderer } from '@layouts/components/VNodeRenderer'
import { themeConfig } from '@themeConfig'
import { useRouter } from 'vue-router'

definePage({
  meta: {
    layout: 'blank',
    public: true,
  },
})

const form = ref({
  username: '',
  password: '',
  remember: false,
})

const isPasswordVisible = ref(false)

const loading = ref(false)
const errorMsg = ref('')
const router = useRouter()

const login = async () => {
  errorMsg.value = ''
  loading.value = true
  try {
    // Query the users table directly for test-only authentication
    const { data, error } = await supabase
      .from('users')
      .select('id, username, password')
      .eq('username', form.value.username)
      .single()

    if (error || !data) {
      errorMsg.value = 'Invalid username or password.'
      loading.value = false
      return
    }

    // Simple plaintext password check (test only, do NOT use in production)
    if (form.value.password !== data.password) {
      errorMsg.value = 'Invalid username or password.'
      loading.value = false
      return
    }

    localStorage.setItem('is_signed', 'true')
    localStorage.setItem('user_name', form.value.username)
    console.log(localStorage.getItem('user_name'));

    router.push('/pages')
  } catch (e) {
    errorMsg.value = 'Login failed. Please try again.'
  }
  loading.value = false
}
</script>

<template>
  <a href="javascript:void(0)">
    <div class="auth-logo d-flex align-center gap-x-3">
      <VNodeRenderer :nodes="themeConfig.app.logo" />
    </div>
  </a>

  <VRow no-gutters class="auth-wrapper bg-surface">

    <VCol cols="12" md="4" class="auth-card-v2 d-flex align-center justify-center">
      <VCard flat :max-width="500" class="mt-12 mt-sm-0 pa-6" :width="`calc(100% - 48px)`">
        <VCardText>
          <h4 class="text-h4 mb-1">
            Welcome! 👋🏻
          </h4>
        </VCardText>
        <VCardText>
          <VAlert v-if="errorMsg" type="error" class="mb-4" variant="tonal">
            {{ errorMsg }}
          </VAlert>
          <VForm @submit.prevent="login">
            <VRow>
              <!-- username -->
              <VCol cols="12">
                <AppTextField v-model="form.username" autofocus label="Username" type="text"
                  placeholder="yourusername" />
              </VCol>

              <!-- password -->
              <VCol cols="12">
                <AppTextField v-model="form.password" label="Password" placeholder="············"
                  :type="isPasswordVisible ? 'text' : 'password'" autocomplete="password"
                  :append-inner-icon="isPasswordVisible ? 'tabler-eye-off' : 'tabler-eye'"
                  @click:append-inner="isPasswordVisible = !isPasswordVisible" />

                <VBtn block type="submit" :loading="loading" :disabled="loading" class="mt-6">
                  Login
                </VBtn>
              </VCol>
            </VRow>
          </VForm>
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>

<style lang="scss">
@use "@core/scss/template/pages/page-auth";
</style>
