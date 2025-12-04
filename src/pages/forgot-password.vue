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
})

const loading = ref(false)
const errorMsg = ref('')
const successMsg = ref('')
const router = useRouter()

const resetPassword = async () => {
    errorMsg.value = ''
    successMsg.value = ''

    loading.value = true

    try {
        const { error } = await supabase.auth.resetPasswordForEmail(form.value.email, {
            redirectTo: `${window.location.origin}/reset-password`,
        })

        if (error) {
            errorMsg.value = error.message
            loading.value = false
            return
        }

        successMsg.value = 'Password reset link has been sent to your email. Please check your inbox.'
    } catch (e) {
        errorMsg.value = 'Failed to send reset email. Please try again.'
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
                        Forgot Password? 🔒
                    </h4>
                    <p class="mb-0">
                        Enter your email and we'll send you instructions to reset your password
                    </p>
                </VCardText>
                <VCardText>
                    <VAlert v-if="errorMsg" type="error" class="mb-4" variant="tonal">
                        {{ errorMsg }}
                    </VAlert>
                    <VAlert v-if="successMsg" type="success" class="mb-4" variant="tonal">
                        {{ successMsg }}
                    </VAlert>
                    <VForm @submit.prevent="resetPassword">
                        <VRow>
                            <!-- email -->
                            <VCol cols="12">
                                <AppTextField v-model="form.email" autofocus label="Email" type="email"
                                    placeholder="your@email.com" />

                                <VBtn block type="submit" :loading="loading" :disabled="loading" class="mt-6">
                                    Send Reset Link
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
