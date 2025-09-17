<script setup>
import { supabase } from '@/libs/supabase'
import { onMounted, reactive, ref } from 'vue'

definePage({
  meta: {
    public: false,
  },
})

const users = ref([])
const loading = ref(false)
const errorMsg = ref('')
const infoMsg = ref('')
const dialog = ref(false)
const deleteDialog = ref(false)
const isEdit = ref(false)
const form = reactive({
  id: null,
  username: '',
  password: '',
})
const deleteId = ref(null)
const name = ref("")

// Fetch users
const fetchUsers = async () => {
  name.value = localStorage.getItem('user_name');
  loading.value = true
  errorMsg.value = ''
  const { data, error } = await supabase
    .from('users')
    .select('id, username, password, created_at')
    .order('created_at', { ascending: false })
  if (error) errorMsg.value = error.message
  else users.value = data
  loading.value = false
}

// Open dialog for add/edit
const openCreate = () => {
  isEdit.value = false
  Object.assign(form, { id: null, username: '', password: 'pass1234' })
  dialog.value = true
  errorMsg.value = ''
  infoMsg.value = 'Default password will be "pass1234"'
}

const openEdit = (user) => {
  isEdit.value = true
  Object.assign(form, user)
  dialog.value = true
  errorMsg.value = ''
  infoMsg.value = ''
}

// Add or update user
const saveUser = async () => {
  errorMsg.value = ''
  infoMsg.value = ''
  if (!form.username) {
    errorMsg.value = 'Username is required'
    return
  }
  loading.value = true
  let result
  if (isEdit.value) {
    if (form.username === localStorage.getItem('user_name')) {
      result = await supabase
        .from('users')
        .update({
          password: form.password,
        })
        .eq('id', form.id)
        .select()
    } else {
      loading.value = false
      dialog.value = false
      return
    }
  } else {
    result = await supabase
      .from('users')
      .insert([{
        username: form.username,
        password: 'pass1234',
      }])
      .select()
    if (!result.error) {
      infoMsg.value = 'User created with default password "pass1234".'
    }
  }
  if (result && result.error) errorMsg.value = result.error.message
  else {
    dialog.value = false
    fetchUsers()
  }
  loading.value = false
}

// Delete user
const openDelete = (id) => {
  deleteId.value = id
  deleteDialog.value = true
}

const deleteUser = async () => {
  loading.value = true
  errorMsg.value = ''
  const { error } = await supabase.from('users').delete().eq('id', deleteId.value)
  if (error) errorMsg.value = error.message
  deleteDialog.value = false
  fetchUsers()
  loading.value = false
}

onMounted(fetchUsers)
</script>

<template>
  <div class="p-6">
    <div class="mb-8">
      <VCard flat
        class="py-6 px-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4 shadow-none border-b border-gray-200">
        <div>
          <h2 class="text-2xl font-bold mb-1">Users Management</h2>
          <p class="text-gray-500 text-base">
            Manage all users for your website.
          </p>
        </div>
        <VBtn color="primary" class="mt-4 md:mt-0" @click="openCreate" size="large" prepend-icon="tabler-plus">
          Add User
        </VBtn>
      </VCard>
    </div>

    <VAlert v-if="errorMsg" type="error" class="mb-4">
      {{ errorMsg }}
    </VAlert>
    <VAlert v-if="infoMsg" type="info" class="mb-4">
      {{ infoMsg }}
    </VAlert>

    <VDataTable :items="users" :loading="loading" class="rounded-lg shadow" :headers="[
      { title: 'Username', key: 'username' },
      { title: 'Password', key: 'password' },
      { title: 'Created At', key: 'created_at' },
      { title: 'Actions', key: 'actions', sortable: false },
    ]" item-value="id" density="comfortable">
      <template #item.password="{ item }">
        <span v-if="item.username === name">{{ item.password }}</span>
        <span v-else class="text-gray-400">••••••••</span>
      </template>
      <template #item.created_at="{ item }">
        <span class="text-xs text-gray-500">{{ new Date(item.created_at).toLocaleString() }}</span>
      </template>
      <template #item.actions="{ item }">
        <VBtn icon variant="text" color="primary" @click="openEdit(item)" :disabled="item.username !== name">
          <VIcon icon="tabler-edit" />
        </VBtn>
        <VBtn icon variant="text" color="error" @click="openDelete(item.id)">
          <VIcon icon="tabler-trash" />
        </VBtn>
      </template>
      <template #no-data>
        <div class="text-center text-gray-400 py-8">No data.</div>
      </template>
    </VDataTable>

    <!-- Create/Edit Dialog -->
    <VDialog v-model="dialog" max-width="400">
      <VCard>
        <VCardTitle>
          {{ isEdit ? 'Edit User' : 'Add User' }}
        </VCardTitle>
        <VCardText>
          <VForm @submit.prevent="saveUser">
            <VTextField v-model="form.username" label="Username" required class="mb-4" :disabled="isEdit" />
            <VTextField v-if="!isEdit || form.username === name" v-model="form.password" label="Password" type="text"
              required class="mb-4" :readonly="!isEdit" />
            <VAlert v-if="infoMsg && !isEdit" type="info" class="mb-2">{{ infoMsg }}</VAlert>
          </VForm>
        </VCardText>
        <VCardActions>
          <VSpacer />
          <VBtn text @click="dialog = false">Cancel</VBtn>
          <VBtn color="primary" :loading="loading" @click="saveUser" :disabled="isEdit && form.username !== name">
            Save
          </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>

    <!-- Delete Confirmation Dialog -->
    <VDialog v-model="deleteDialog" max-width="400">
      <VCard>
        <VCardTitle>Delete User?</VCardTitle>
        <VCardText>
          Are you sure you want to delete this user?
        </VCardText>
        <VCardActions>
          <VSpacer />
          <VBtn text @click="deleteDialog = false">Cancel</VBtn>
          <VBtn color="error" :loading="loading" @click="deleteUser">
            Delete
          </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>
  </div>
</template>
