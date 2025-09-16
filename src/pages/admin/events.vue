<script setup>
import { supabase } from '@/libs/supabase'
import { onMounted, reactive, ref } from 'vue'

const loading = ref(false)
const errorMsg = ref('')
const eventList = ref([])
const dialog = ref(false)
const deleteDialog = ref(false)
const isEdit = ref(false)
const form = reactive({
  id: null,
  title: '',
  event_date: '',
  location: '',
  map_url: '',
})
const deleteId = ref(null)

const fetchEvents = async () => {
  loading.value = true
  errorMsg.value = ''
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .order('event_date', { ascending: false })
  if (error) errorMsg.value = error.message
  else eventList.value = data
  loading.value = false
}

const openCreate = () => {
  isEdit.value = false
  Object.assign(form, { id: null, title: '', event_date: '', location: '', map_url: '' })
  dialog.value = true
}

const openEdit = (row) => {
  isEdit.value = true
  Object.assign(form, row)
  dialog.value = true
}

const saveEvent = async () => {
  if (!form.title || !form.event_date || !form.location) {
    errorMsg.value = 'Title, Event Date, and Location are required'
    return
  }
  loading.value = true
  errorMsg.value = ''
  let result
  if (isEdit.value) {
    result = await supabase
      .from('events')
      .update({
        title: form.title,
        event_date: form.event_date,
        location: form.location,
        map_url: form.map_url,
      })
      .eq('id', form.id)
      .select()
  } else {
    result = await supabase
      .from('events')
      .insert([{
        title: form.title,
        event_date: form.event_date,
        location: form.location,
        map_url: form.map_url,
      }])
      .select()
  }
  if (result.error) errorMsg.value = result.error.message
  else {
    dialog.value = false
    fetchEvents()
  }
  loading.value = false
}

const openDelete = (id) => {
  deleteId.value = id
  deleteDialog.value = true
}

const deleteEvent = async () => {
  loading.value = true
  errorMsg.value = ''
  const { error } = await supabase
    .from('events')
    .delete()
    .eq('id', deleteId.value)
  if (error) errorMsg.value = error.message
  deleteDialog.value = false
  fetchEvents()
  loading.value = false
}

onMounted(fetchEvents)
</script>

<template>
  <div class="p-6">
    <div class="mb-8">
      <VCard flat
        class="py-6 px-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4 shadow-none border-b border-gray-200">
        <div>
          <h2 class="text-2xl font-bold mb-1">Events Management</h2>
          <p class="text-gray-500 text-base">
            Manage all events and their details for your website.
          </p>
        </div>
        <VBtn color="primary" class="mt-4 md:mt-0" @click="openCreate" size="large" prepend-icon="tabler-plus">
          Add Event
        </VBtn>
      </VCard>
    </div>

    <VAlert v-if="errorMsg" type="error" class="mb-4">
      {{ errorMsg }}
    </VAlert>

    <VDataTable :items="eventList" :loading="loading" class="rounded-lg shadow" :headers="[
      { title: 'Title', key: 'title' },
      { title: 'Event Date', key: 'event_date' },
      { title: 'Location', key: 'location' },
      { title: 'Map URL', key: 'map_url' },
      { title: 'Created', key: 'created_at' },
      { title: 'Actions', key: 'actions', sortable: false },
    ]" item-value="id" density="comfortable">
      <template #item.event_date="{ item }">
        <span class="text-xs text-gray-700">{{ item.event_date }}</span>
      </template>
      <template #item.map_url="{ item }">
        <a v-if="item.map_url" :href="item.map_url" target="_blank" class="text-primary underline break-all">
          Map Link
        </a>
        <span v-else class="text-gray-400">-</span>
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
          {{ isEdit ? 'Edit Event' : 'Add Event' }}
        </VCardTitle>
        <VCardText>
          <VForm @submit.prevent="saveEvent">
            <VTextField v-model="form.title" label="Title" required class="mb-4" />
            <VTextField v-model="form.event_date" label="Event Date" type="date" required class="mb-4" />
            <VTextField v-model="form.location" label="Location" required class="mb-4" />
            <VTextField v-model="form.map_url" label="Map URL" class="mb-4" />
          </VForm>
        </VCardText>
        <VCardActions>
          <VSpacer />
          <VBtn text @click="dialog = false">Cancel</VBtn>
          <VBtn color="primary" :loading="loading" @click="saveEvent">
            Save
          </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>

    <!-- Delete Confirmation Dialog -->
    <VDialog v-model="deleteDialog" max-width="400">
      <VCard>
        <VCardTitle>Delete Event?</VCardTitle>
        <VCardText>
          Are you sure you want to delete this event?
        </VCardText>
        <VCardActions>
          <VSpacer />
          <VBtn text @click="deleteDialog = false">Cancel</VBtn>
          <VBtn color="error" :loading="loading" @click="deleteEvent">
            Delete
          </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>
  </div>
</template>
