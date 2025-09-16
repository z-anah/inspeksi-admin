<script setup>
import { supabase } from '@/libs/supabase'
import { onMounted, reactive, ref } from 'vue'

const loading = ref(false)
const errorMsg = ref('')
const testimonialList = ref([])
const dialog = ref(false)
const deleteDialog = ref(false)
const isEdit = ref(false)
const form = reactive({
  id: null,
  text: '',
  author: '',
  location: '',
})
const deleteId = ref(null)

const fetchTestimonials = async () => {
  loading.value = true
  errorMsg.value = ''
  const { data, error } = await supabase
    .from('testimonials')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) errorMsg.value = error.message
  else testimonialList.value = data
  loading.value = false
}

const openCreate = () => {
  isEdit.value = false
  Object.assign(form, { id: null, text: '', author: '', location: '' })
  dialog.value = true
}

const openEdit = (row) => {
  isEdit.value = true
  Object.assign(form, row)
  dialog.value = true
}

const saveTestimonial = async () => {
  if (!form.text || !form.author) {
    errorMsg.value = 'Text and Author are required'
    return
  }
  loading.value = true
  errorMsg.value = ''
  let result
  if (isEdit.value) {
    result = await supabase
      .from('testimonials')
      .update({
        text: form.text,
        author: form.author,
        location: form.location,
      })
      .eq('id', form.id)
      .select()
  } else {
    result = await supabase
      .from('testimonials')
      .insert([{
        text: form.text,
        author: form.author,
        location: form.location,
      }])
      .select()
  }
  if (result.error) errorMsg.value = result.error.message
  else {
    dialog.value = false
    fetchTestimonials()
  }
  loading.value = false
}

const openDelete = (id) => {
  deleteId.value = id
  deleteDialog.value = true
}

const deleteTestimonial = async () => {
  loading.value = true
  errorMsg.value = ''
  const { error } = await supabase
    .from('testimonials')
    .delete()
    .eq('id', deleteId.value)
  if (error) errorMsg.value = error.message
  deleteDialog.value = false
  fetchTestimonials()
  loading.value = false
}

onMounted(fetchTestimonials)
</script>

<template>
  <div class="p-6">
    <div class="mb-8">
      <VCard flat
        class="py-6 px-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4 shadow-none border-b border-gray-200">
        <div>
          <h2 class="text-2xl font-bold mb-1">Testimonials Management</h2>
          <p class="text-gray-500 text-base">
            Manage all testimonials displayed on your website.
          </p>
        </div>
        <VBtn color="primary" class="mt-4 md:mt-0" @click="openCreate" size="large" prepend-icon="tabler-plus">
          Add Testimonial
        </VBtn>
      </VCard>
    </div>

    <VAlert v-if="errorMsg" type="error" class="mb-4">
      {{ errorMsg }}
    </VAlert>

    <VDataTable :items="testimonialList" :loading="loading" class="rounded-lg shadow" :headers="[
      { title: 'Text', key: 'text' },
      { title: 'Author', key: 'author' },
      { title: 'Location', key: 'location' },
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
          {{ isEdit ? 'Edit Testimonial' : 'Add Testimonial' }}
        </VCardTitle>
        <VCardText>
          <VForm @submit.prevent="saveTestimonial">
            <VTextarea v-model="form.text" label="Testimonial Text" required class="mb-4" />
            <VTextField v-model="form.author" label="Author" required class="mb-4" />
            <VTextField v-model="form.location" label="Location" class="mb-4" />
          </VForm>
        </VCardText>
        <VCardActions>
          <VSpacer />
          <VBtn text @click="dialog = false">Cancel</VBtn>
          <VBtn color="primary" :loading="loading" @click="saveTestimonial">
            Save
          </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>

    <!-- Delete Confirmation Dialog -->
    <VDialog v-model="deleteDialog" max-width="400">
      <VCard>
        <VCardTitle>Delete Testimonial?</VCardTitle>
        <VCardText>
          Are you sure you want to delete this testimonial?
        </VCardText>
        <VCardActions>
          <VSpacer />
          <VBtn text @click="deleteDialog = false">Cancel</VBtn>
          <VBtn color="error" :loading="loading" @click="deleteTestimonial">
            Delete
          </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>
  </div>
</template>
