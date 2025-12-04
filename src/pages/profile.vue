<script setup>
import { supabase } from '@/libs/supabase'
import { useRouter } from 'vue-router'

const router = useRouter()
const user = ref(null)
const loading = ref(false)
const errorMsg = ref('')
const successMsg = ref('')

const passwordForm = ref({
    newPassword: '',
    confirmPassword: '',
})

const isNewPasswordVisible = ref(false)
const isConfirmPasswordVisible = ref(false)

onMounted(async () => {
    const { data: { user: currentUser }, error } = await supabase.auth.getUser()
    if (error) {
        errorMsg.value = 'Failed to load user data'
        return
    }
    user.value = currentUser
})

const updatePassword = async () => {
    errorMsg.value = ''
    successMsg.value = ''

    if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
        errorMsg.value = 'Passwords do not match.'
        return
    }

    if (passwordForm.value.newPassword.length < 6) {
        errorMsg.value = 'Password must be at least 6 characters long.'
        return
    }

    loading.value = true

    try {
        const { error } = await supabase.auth.updateUser({
            password: passwordForm.value.newPassword,
        })

        if (error) {
            errorMsg.value = error.message
        } else {
            successMsg.value = 'Password updated successfully!'
            passwordForm.value.newPassword = ''
            passwordForm.value.confirmPassword = ''
        }
    } catch (e) {
        errorMsg.value = 'Failed to update password. Please try again.'
    }

    loading.value = false
}
</script>

<template>
    <VRow>
        <VCol cols="12">
            <VCard title="Account Details">
                <VCardText>
                    <VRow>
                        <VCol cols="12" md="6">
                            <VTextField :model-value="user?.email" label="Email" readonly disabled />
                        </VCol>
                        <VCol cols="12" md="6">
                            <VTextField :model-value="user?.id" label="User ID" readonly disabled />
                        </VCol>
                        <VCol cols="12" md="6">
                            <VTextField
                                :model-value="user?.created_at ? new Date(user.created_at).toLocaleDateString() : ''"
                                label="Member Since" readonly disabled />
                        </VCol>
                    </VRow>
                </VCardText>
            </VCard>
        </VCol>

        <VCol cols="12">
            <VCard title="Change Password">
                <VCardText>
                    <VAlert v-if="errorMsg" type="error" class="mb-4" variant="tonal">
                        {{ errorMsg }}
                    </VAlert>
                    <VAlert v-if="successMsg" type="success" class="mb-4" variant="tonal">
                        {{ successMsg }}
                    </VAlert>

                    <VForm @submit.prevent="updatePassword">
                        <VRow>
                            <VCol cols="12" md="6">
                                <AppTextField v-model="passwordForm.newPassword" label="New Password"
                                    placeholder="············" :type="isNewPasswordVisible ? 'text' : 'password'"
                                    :append-inner-icon="isNewPasswordVisible ? 'tabler-eye-off' : 'tabler-eye'"
                                    @click:append-inner="isNewPasswordVisible = !isNewPasswordVisible" />
                            </VCol>
                            <VCol cols="12" md="6">
                                <AppTextField v-model="passwordForm.confirmPassword" label="Confirm New Password"
                                    placeholder="············" :type="isConfirmPasswordVisible ? 'text' : 'password'"
                                    :append-inner-icon="isConfirmPasswordVisible ? 'tabler-eye-off' : 'tabler-eye'"
                                    @click:append-inner="isConfirmPasswordVisible = !isConfirmPasswordVisible" />
                            </VCol>
                            <VCol cols="12">
                                <VBtn type="submit" :loading="loading" :disabled="loading">
                                    Update Password
                                </VBtn>
                            </VCol>
                        </VRow>
                    </VForm>
                </VCardText>
            </VCard>
        </VCol>
    </VRow>
</template>
