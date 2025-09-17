<template>
  <div class="p-6">
    <div class="mb-8">
      <VCard flat
        class="py-6 px-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4 shadow-none border-b border-gray-200">
        <div>
          <h2 class="text-2xl font-bold mb-1">Content Management</h2>
          <p class="text-gray-500 text-base">
            Manage all dynamic content for each section of your website.
          </p>
        </div>
        <VBtn color="primary" class="mt-4 md:mt-0" @click="openCreate" size="large" prepend-icon="tabler-plus">
          Add Content
        </VBtn>
      </VCard>
    </div>

    <VAlert v-if="errorMsg" type="error" class="mb-4">
      {{ errorMsg }}
    </VAlert>

    <VDataTable :items="contentList" :loading="loading" class="rounded-lg shadow" :headers="[
      { title: 'Section', key: 'section' },
      { title: 'Key', key: 'key' },
      { title: 'Value', key: 'value' },
      { title: 'Updated', key: 'updated_at' },
      { title: 'Actions', key: 'actions', sortable: false },
    ]" item-value="id" density="comfortable">
      <template #item.updated_at="{ item }">
        <span class="text-xs text-gray-500">{{ new Date(item.updated_at).toLocaleString() }}</span>
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
          {{ isEdit ? 'Edit Content' : 'Add Content' }}
        </VCardTitle>
        <VCardText>
          <VForm @submit.prevent="saveContent">
            <VTextField v-model="form.section" label="Section" required class="mb-4" />
            <VTextField v-model="form.key" label="Key" required class="mb-4" />
            <VTextarea v-model="form.value" label="Value" rows="3" class="mb-4" />
          </VForm>
        </VCardText>
        <VCardActions>
          <VSpacer />
          <VBtn text @click="dialog = false">Cancel</VBtn>
          <VBtn color="primary" :loading="loading" @click="saveContent">
            Save
          </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>

    <!-- Delete Confirmation Dialog -->
    <VDialog v-model="deleteDialog" max-width="400">
      <VCard>
        <VCardTitle>Delete Content?</VCardTitle>
        <VCardText>
          Are you sure you want to delete this content?
        </VCardText>
        <VCardActions>
          <VSpacer />
          <VBtn text @click="deleteDialog = false">Cancel</VBtn>
          <VBtn color="error" :loading="loading" @click="deleteContent">
            Delete
          </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>
  </div>
</template>

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
const contentList = ref([])
const dialog = ref(false)
const deleteDialog = ref(false)
const isEdit = ref(false)
const form = reactive({
  id: null,
  section: '',
  key: '',
  value: '',
})
const deleteId = ref(null)

const fetchContent = async () => {
  loading.value = true
  errorMsg.value = ''
  const { data, error } = await supabase
    .from('content')
    .select('*')
    .order('updated_at', { ascending: false })
  if (error) errorMsg.value = error.message
  else contentList.value = data
  loading.value = false
}

const openCreate = () => {
  isEdit.value = false
  Object.assign(form, { id: null, section: '', key: '', value: '' })
  dialog.value = true
}

const openEdit = (row) => {
  isEdit.value = true
  Object.assign(form, row)
  dialog.value = true
}

const saveContent = async () => {
  if (!form.section || !form.key) {
    errorMsg.value = 'Section and Key are required'
    return
  }
  loading.value = true
  errorMsg.value = ''
  let result
  if (isEdit.value) {
    result = await supabase
      .from('content')
      .update({
        section: form.section,
        key: form.key,
        value: form.value,
        updated_at: new Date().toISOString(),
      })
      .eq('id', form.id)
      .select()
  } else {
    result = await supabase
      .from('content')
      .insert([{
        section: form.section,
        key: form.key,
        value: form.value,
      }])
      .select()
  }
  if (result.error) errorMsg.value = result.error.message
  else {
    dialog.value = false
    fetchContent()
  }
  loading.value = false
}

const openDelete = (id) => {
  deleteId.value = id
  deleteDialog.value = true
}

const deleteContent = async () => {
  loading.value = true
  errorMsg.value = ''
  const { error } = await supabase
    .from('content')
    .delete()
    .eq('id', deleteId.value)
  if (error) errorMsg.value = error.message
  deleteDialog.value = false
  fetchContent()
  loading.value = false
}

onMounted(fetchContent)
</script>
