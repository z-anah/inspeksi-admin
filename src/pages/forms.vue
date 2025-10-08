<script setup>
import { supabase } from '@/libs/supabase'
import { onMounted, reactive, ref } from 'vue'

definePage({
  meta: {
    public: false,
  },
})

const loading = ref(false)
const errorMsg = ref('')
const formList = ref([])
const dialog = ref(false)
const deleteDialog = ref(false)
const isEdit = ref(false)
const form = reactive({
  id: null,
  icon: '',
  title: '',
  link: '',
  description: '',
  is_active: true,
})
const deleteId = ref(null)

const fetchForms = async () => {
  loading.value = true
  errorMsg.value = ''
  const { data, error } = await supabase
    .from('forms')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) errorMsg.value = error.message
  else formList.value = data
  loading.value = false
}

const openCreate = () => {
  isEdit.value = false
  Object.assign(form, { id: null, icon: '', title: '', link: '', description: '', is_active: true })
  dialog.value = true
}

const openEdit = (row) => {
  isEdit.value = true
  Object.assign(form, row)
  dialog.value = true
}

const saveForm = async () => {
  if (!form.title || !form.link) {
    errorMsg.value = 'Title and Link are required'
    return
  }
  loading.value = true
  errorMsg.value = ''
  let result
  if (isEdit.value) {
    result = await supabase
      .from('forms')
      .update({
        icon: form.icon,
        title: form.title,
        link: form.link,
        description: form.description,
        is_active: form.is_active,
      })
      .eq('id', form.id)
      .select()
  } else {
    result = await supabase
      .from('forms')
      .insert([{
        icon: form.icon,
        title: form.title,
        link: form.link,
        description: form.description,
        is_active: form.is_active,
      }])
      .select()
  }
  if (result.error) errorMsg.value = result.error.message
  else {
    dialog.value = false
    fetchForms()
  }
  loading.value = false
}

const openDelete = (id) => {
  deleteId.value = id
  deleteDialog.value = true
}

const deleteForm = async () => {
  loading.value = true
  errorMsg.value = ''
  const { error } = await supabase
    .from('forms')
    .delete()
    .eq('id', deleteId.value)
  if (error) errorMsg.value = error.message
  deleteDialog.value = false
  fetchForms()
  loading.value = false
}

onMounted(fetchForms)
</script>

<template>
  <VAlert type="info" class="mb-4" variant="tonal"> Untuk memilih ikon, silakan cek daftar nama ikon di <a
      href="https://tabler.io/icons" target="_blank" class="text-primary font-semibold underline">
      https://tabler.io/icons</a> dan gunakan nama ikon (misal:
    <code>tabler-user</code>).
  </VAlert>
  <div class="p-6">
    <div class="mb-8">
      <VCard flat
        class="py-6 px-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4 shadow-none border-b border-gray-200">
        <div>
          <h2 class="text-2xl font-bold mb-1">Forms Management</h2>
          <p class="text-gray-500 text-base">
            Manage all forms and their visibility on your website.
          </p>
        </div>
        <VBtn color="primary" class="mt-4 md:mt-0" @click="openCreate" size="large" prepend-icon="tabler-plus">
          Add Form
        </VBtn>
      </VCard>
    </div>

    <VAlert v-if="errorMsg" type="error" class="mb-4">
      {{ errorMsg }}
    </VAlert>

    <VDataTable :items="formList" :loading="loading" class="rounded-lg shadow" :headers="[
      { title: 'Icon', key: 'icon' },
      { title: 'Title', key: 'title' },
      { title: 'Link', key: 'link' },
      { title: 'Description', key: 'description' },
      { title: 'Active', key: 'is_active' },
      { title: 'Created', key: 'created_at' },
      { title: 'Actions', key: 'actions', sortable: false },
    ]" item-value="id" density="comfortable">
      <template #item.icon="{ item }">
        <span v-if="item.icon" class="material-icons">{{ item.icon }}</span>
        <span v-else class="text-gray-400">-</span>
      </template>
      <template #item.link="{ item }">
        <a :href="item.link" target="_blank" class="text-primary underline break-all">
          {{ item.link }}
        </a>
      </template>
      <template #item.is_active="{ item }">
        <VChip :color="item.is_active ? 'success' : 'error'" size="small">
          {{ item.is_active ? 'Active' : 'Inactive' }}
        </VChip>
      </template>
      <template #item.created_at="{ item }">
        <span class="text-xs text-gray-500">{{ new Date(item.created_at).toLocaleString() }}</span>
      </template>
      <template #item.actions="{ item }">
        <VBtn icon variant="text" color="primary" @click="openEdit(item)">
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
    <VDialog v-model="dialog" max-width="500">
      <VCard>
        <VCardTitle>
          {{ isEdit ? 'Edit Form' : 'Add Form' }}
        </VCardTitle>
        <VCardText>
          <VForm @submit.prevent="saveForm">
            <VTextField v-model="form.icon" label="Material Icon Name" class="mb-4" />
            <VTextField v-model="form.title" label="Title" required class="mb-4" />
            <VTextField v-model="form.link" label="Link" required class="mb-4" />
            <VTextarea v-model="form.description" label="Description" class="mb-4" />
            <VSwitch v-model="form.is_active" label="Active" class="mb-4" />
          </VForm>
        </VCardText>
        <VCardActions>
          <VSpacer />
          <VBtn text @click="dialog = false">Cancel</VBtn>
          <VBtn color="primary" :loading="loading" @click="saveForm">
            Save
          </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>

    <!-- Delete Confirmation Dialog -->
    <VDialog v-model="deleteDialog" max-width="400">
      <VCard>
        <VCardTitle>Delete Form?</VCardTitle>
        <VCardText>
          Are you sure you want to delete this form?
        </VCardText>
        <VCardActions>
          <VSpacer />
          <VBtn text @click="deleteDialog = false">Cancel</VBtn>
          <VBtn color="error" :loading="loading" @click="deleteForm">
            Delete
          </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>
  </div>
</template>
