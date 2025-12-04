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
    email: '',
    password: '',
    confirmPassword: '',
})

const isPasswordVisible = ref(false)
const isConfirmPasswordVisible = ref(false)

const loading = ref(false)
const errorMsg = ref('')
const successMsg = ref('')
const router = useRouter()

const signup = async () => {
    errorMsg.value = ''
    successMsg.value = ''

    if (form.value.password !== form.value.confirmPassword) {
        errorMsg.value = 'Passwords do not match.'
        return
    }

    if (form.value.password.length < 6) {
        errorMsg.value = 'Password must be at least 6 characters long.'
        return
    }

    loading.value = true

    try {
        const { data, error } = await supabase.auth.signUp({
            email: form.value.email,
            password: form.value.password,
        })

        if (error) {
            errorMsg.value = error.message
            loading.value = false
            return
        }

        if (data.user) {
            if (data.user.identities && data.user.identities.length === 0) {
                errorMsg.value = 'An account with this email already exists.'
            } else {
                successMsg.value = 'Account created! Please check your email to verify your account.'
                setTimeout(() => {
                    router.push({ name: 'login' })
                }, 3000)
            }
        }
    } catch (e) {
        errorMsg.value = 'Signup failed. Please try again.'
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
                        Create Account 🚀
                    </h4>
                    <p class="mb-0">
                        Start your journey with us
                    </p>
                </VCardText>
                <VCardText>
                    <VAlert v-if="errorMsg" type="error" class="mb-4" variant="tonal">
                        {{ errorMsg }}
                    </VAlert>
                    <VAlert v-if="successMsg" type="success" class="mb-4" variant="tonal">
                        {{ successMsg }}
                    </VAlert>
                    <VForm @submit.prevent="signup">
                        <VRow>
                            <!-- email -->
                            <VCol cols="12">
                                <AppTextField v-model="form.email" autofocus label="Email" type="email"
                                    placeholder="your@email.com" />
                            </VCol>

                            <!-- password -->
                            <VCol cols="12">
                                <AppTextField v-model="form.password" label="Password" placeholder="············"
                                    :type="isPasswordVisible ? 'text' : 'password'"
                                    :append-inner-icon="isPasswordVisible ? 'tabler-eye-off' : 'tabler-eye'"
                                    @click:append-inner="isPasswordVisible = !isPasswordVisible" />
                            </VCol>

                            <!-- confirm password -->
                            <VCol cols="12">
                                <AppTextField v-model="form.confirmPassword" label="Confirm Password"
                                    placeholder="············" :type="isConfirmPasswordVisible ? 'text' : 'password'"
                                    :append-inner-icon="isConfirmPasswordVisible ? 'tabler-eye-off' : 'tabler-eye'"
                                    @click:append-inner="isConfirmPasswordVisible = !isConfirmPasswordVisible" />

                                <VBtn block type="submit" :loading="loading" :disabled="loading" class="mt-6">
                                    Sign Up
                                </VBtn>
                            </VCol>

                            <!-- back to login -->
                            <VCol cols="12" class="text-center">
                                <span>Already have an account?</span>
                                <RouterLink class="text-primary ms-2" :to="{ name: 'login' }">
                                    Login here
                                </RouterLink>
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
