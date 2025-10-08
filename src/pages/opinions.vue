<script setup>
import { supabase } from '@/libs/supabase'
import { onMounted, reactive, ref } from 'vue'

definePage({
  meta: {
    public: false,
  },
})

const opinions = ref([])
const loading = ref(false)
const errorMsg = ref('')
const dialog = ref(false)
const deleteDialog = ref(false)
const isEdit = ref(false)
const form = reactive({
  id: null,
  icon: '',
  title: '',
  description: '',
})
const deleteId = ref(null)

const fetchOpinions = async () => {
  loading.value = true
  errorMsg.value = ''
  const { data, error } = await supabase
    .from('opinion')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) errorMsg.value = error.message
  else opinions.value = data
  loading.value = false
}

const openCreate = () => {
  isEdit.value = false
  Object.assign(form, { id: null, icon: '', title: '', description: '' })
  dialog.value = true
  errorMsg.value = ''
}

const openEdit = (row) => {
  isEdit.value = true
  Object.assign(form, row)
  dialog.value = true
  errorMsg.value = ''
}

const saveOpinion = async () => {
  if (!form.icon || !form.title || !form.description) {
    errorMsg.value = 'Icon, Title, and Description are required'
    return
  }
  loading.value = true
  errorMsg.value = ''
  let result
  if (isEdit.value) {
    result = await supabase
      .from('opinion')
      .update({
        icon: form.icon,
        title: form.title,
        description: form.description,
      })
      .eq('id', form.id)
      .select()
  } else {
    result = await supabase
      .from('opinion')
      .insert([{
        icon: form.icon,
        title: form.title,
        description: form.description,
      }])
      .select()
  }
  if (result.error) errorMsg.value = result.error.message
  else {
    dialog.value = false
    fetchOpinions()
  }
  loading.value = false
}

const openDelete = (id) => {
  deleteId.value = id
  deleteDialog.value = true
}

const deleteOpinion = async () => {
  loading.value = true
  errorMsg.value = ''
  const { error } = await supabase
    .from('opinion')
    .delete()
    .eq('id', deleteId.value)
  if (error) errorMsg.value = error.message
  deleteDialog.value = false
  fetchOpinions()
  loading.value = false
}

onMounted(fetchOpinions)
</script>

<template>
  <div class="p-6">
    <div class="mb-8">

      <VAlert type="info" class="mb-4" variant="tonal"> Untuk memilih ikon, silakan cek daftar nama ikon di <a
          href="https://tabler.io/icons" target="_blank" class="text-primary font-semibold underline">
          https://tabler.io/icons</a> dan gunakan nama ikon (misal:
        <code>tabler-user</code>).
      </VAlert>
      <VCard flat
        class="py-6 px-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4 shadow-none border-b border-gray-200">
        <div>
          <h2 class="text-2xl font-bold mb-1">Opinions Management</h2>
          <p class="text-gray-500 text-base">
            Manage all opinions for your website.
          </p>
        </div>
        <VBtn color="primary" class="mt-4 md:mt-0" @click="openCreate" size="large" prepend-icon="tabler-plus">
          Add Opinion
        </VBtn>
      </VCard>
    </div>

    <VAlert v-if="errorMsg" type="error" class="mb-4">
      {{ errorMsg }}
    </VAlert>

    <VDataTable :items="opinions" :loading="loading" class="rounded-lg shadow" :headers="[
      { title: 'Icon', key: 'icon' },
      { title: 'Title', key: 'title' },
      { title: 'Description', key: 'description' },
      { title: 'Created At', key: 'created_at' },
      { title: 'Actions', key: 'actions', sortable: false },
    ]" item-value="id" density="comfortable">
      <template #item.icon="{ item }">
        <VIcon :icon="item.icon" size="32" />
        <span class="ms-2">{{ item.icon }}</span>
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
          {{ isEdit ? 'Edit Opinion' : 'Add Opinion' }}
        </VCardTitle>
        <VCardText>
          <VForm @submit.prevent="saveOpinion">
            <VTextField v-model="form.icon" label="Icon (e.g. tabler-star)" required class="mb-4" />
            <VTextField v-model="form.title" label="Title" required class="mb-4" />
            <VTextarea v-model="form.description" label="Description" rows="3" required class="mb-4" />
          </VForm>
        </VCardText>
        <VCardActions>
          <VSpacer />
          <VBtn text @click="dialog = false">Cancel</VBtn>
          <VBtn color="primary" :loading="loading" @click="saveOpinion">
            Save
          </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>

    <!-- Delete Confirmation Dialog -->
    <VDialog v-model="deleteDialog" max-width="400">
      <VCard>
        <VCardTitle>Delete Opinion?</VCardTitle>
        <VCardText>
          Are you sure you want to delete this opinion?
        </VCardText>
        <VCardActions>
          <VSpacer />
          <VBtn text @click="deleteDialog = false">Cancel</VBtn>
          <VBtn color="error" :loading="loading" @click="deleteOpinion">
            Delete
          </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>
  </div>
</template>
