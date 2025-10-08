<script setup>
import { supabase } from '@/libs/supabase'
import { onMounted, reactive, ref } from 'vue'

definePage({
  meta: {
    public: false,
  },
})

const faqs = ref([])
const loading = ref(false)
const errorMsg = ref('')
const dialog = ref(false)
const deleteDialog = ref(false)
const isEdit = ref(false)
const form = reactive({
  id: null,
  question: '',
  answer: '',
})
const deleteId = ref(null)

const fetchFaqs = async () => {
  loading.value = true
  errorMsg.value = ''
  const { data, error } = await supabase
    .from('faqs')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) errorMsg.value = error.message
  else faqs.value = data
  loading.value = false
}

const openCreate = () => {
  isEdit.value = false
  Object.assign(form, { id: null, question: '', answer: '' })
  dialog.value = true
  errorMsg.value = ''
}

const openEdit = (row) => {
  isEdit.value = true
  Object.assign(form, row)
  dialog.value = true
  errorMsg.value = ''
}

const saveFaq = async () => {
  if (!form.question || !form.answer) {
    errorMsg.value = 'Question and Answer are required'
    return
  }
  loading.value = true
  errorMsg.value = ''
  let result
  if (isEdit.value) {
    result = await supabase
      .from('faqs')
      .update({
        question: form.question,
        answer: form.answer,
      })
      .eq('id', form.id)
      .select()
  } else {
    result = await supabase
      .from('faqs')
      .insert([{
        question: form.question,
        answer: form.answer,
      }])
      .select()
  }
  if (result.error) errorMsg.value = result.error.message
  else {
    dialog.value = false
    fetchFaqs()
  }
  loading.value = false
}

const openDelete = (id) => {
  deleteId.value = id
  deleteDialog.value = true
}

const deleteFaq = async () => {
  loading.value = true
  errorMsg.value = ''
  const { error } = await supabase
    .from('faqs')
    .delete()
    .eq('id', deleteId.value)
  if (error) errorMsg.value = error.message
  deleteDialog.value = false
  fetchFaqs()
  loading.value = false
}

onMounted(fetchFaqs)
</script>

<template>
  <div class="p-6">
    <div class="mb-8">
      <VCard flat
        class="py-6 px-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4 shadow-none border-b border-gray-200">
        <div>
          <h2 class="text-2xl font-bold mb-1">FAQs Management</h2>
          <p class="text-gray-500 text-base">
            Manage all frequently asked questions for your website.
          </p>
        </div>
        <VBtn color="primary" class="mt-4 md:mt-0" @click="openCreate" size="large" prepend-icon="tabler-plus">
          Add FAQ
        </VBtn>
      </VCard>
    </div>

    <VAlert v-if="errorMsg" type="error" class="mb-4">
      {{ errorMsg }}
    </VAlert>

    <VDataTable :items="faqs" :loading="loading" class="rounded-lg shadow" :headers="[
      { title: 'Question', key: 'question' },
      { title: 'Answer', key: 'answer' },
      { title: 'Created', key: 'created_at' },
      { title: 'Actions', key: 'actions', sortable: false },
    ]" item-value="id" density="comfortable">
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
          {{ isEdit ? 'Edit FAQ' : 'Add FAQ' }}
        </VCardTitle>
        <VCardText>
          <VForm @submit.prevent="saveFaq">
            <VTextarea v-model="form.question" label="Question" required class="mb-4" />
            <VTextarea v-model="form.answer" label="Answer" required class="mb-4" />
          </VForm>
        </VCardText>
        <VCardActions>
          <VSpacer />
          <VBtn text @click="dialog = false">Cancel</VBtn>
          <VBtn color="primary" :loading="loading" @click="saveFaq">
            Save
          </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>

    <!-- Delete Confirmation Dialog -->
    <VDialog v-model="deleteDialog" max-width="400">
      <VCard>
        <VCardTitle>Delete FAQ?</VCardTitle>
        <VCardText>
          Are you sure you want to delete this FAQ?
        </VCardText>
        <VCardActions>
          <VSpacer />
          <VBtn text @click="deleteDialog = false">Cancel</VBtn>
          <VBtn color="error" :loading="loading" @click="deleteFaq">
            Delete
          </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>
  </div>
</template>
