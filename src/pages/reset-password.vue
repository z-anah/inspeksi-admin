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
    password: '',
    confirmPassword: '',
})

const isPasswordVisible = ref(false)
const isConfirmPasswordVisible = ref(false)

const loading = ref(false)
const errorMsg = ref('')
const successMsg = ref('')
const router = useRouter()

const updatePassword = async () => {
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
        const { error } = await supabase.auth.updateUser({
            password: form.value.password,
        })

        if (error) {
            errorMsg.value = error.message
            loading.value = false
            return
        }

        successMsg.value = 'Password updated successfully! Redirecting to login...'
        setTimeout(() => {
            router.push({ name: 'login' })
        }, 2000)
    } catch (e) {
        errorMsg.value = 'Failed to update password. Please try again.'
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
                        Reset Password 🔐
                    </h4>
                    <p class="mb-0">
                        Enter your new password
                    </p>
                </VCardText>
                <VCardText>
                    <VAlert v-if="errorMsg" type="error" class="mb-4" variant="tonal">
                        {{ errorMsg }}
                    </VAlert>
                    <VAlert v-if="successMsg" type="success" class="mb-4" variant="tonal">
                        {{ successMsg }}
                    </VAlert>
                    <VForm @submit.prevent="updatePassword">
                        <VRow>
                            <!-- password -->
                            <VCol cols="12">
                                <AppTextField v-model="form.password" autofocus label="New Password"
                                    placeholder="············" :type="isPasswordVisible ? 'text' : 'password'"
                                    :append-inner-icon="isPasswordVisible ? 'tabler-eye-off' : 'tabler-eye'"
                                    @click:append-inner="isPasswordVisible = !isPasswordVisible" />
                            </VCol>

                            <!-- confirm password -->
                            <VCol cols="12">
                                <AppTextField v-model="form.confirmPassword" label="Confirm New Password"
                                    placeholder="············" :type="isConfirmPasswordVisible ? 'text' : 'password'"
                                    :append-inner-icon="isConfirmPasswordVisible ? 'tabler-eye-off' : 'tabler-eye'"
                                    @click:append-inner="isConfirmPasswordVisible = !isConfirmPasswordVisible" />

                                <VBtn block type="submit" :loading="loading" :disabled="loading" class="mt-6">
                                    Reset Password
                                </VBtn>
                            </VCol>

                            <!-- back to login -->
                            <VCol cols="12" class="d-flex align-center justify-center">
                                <RouterLink class="text-primary d-flex align-center" :to="{ name: 'login' }">
                                    <VIcon icon="tabler-chevron-left" class="flip-in-rtl" />
                                    <span>Back to login</span>
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
