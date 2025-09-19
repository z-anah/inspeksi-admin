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
const partnerList = ref([])
const dialog = ref(false)
const deleteDialog = ref(false)
const isEdit = ref(false)
const form = reactive({
  id: null,
  name: '',
  logo_url: '',
})
const deleteId = ref(null)
const imageUploading = ref(false)
const imageUploadError = ref('')

const fetchPartners = async () => {
  loading.value = true
  errorMsg.value = ''
  const { data, error } = await supabase
    .from('partners')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) errorMsg.value = error.message
  else partnerList.value = data
  loading.value = false
}

const openCreate = () => {
  isEdit.value = false
  Object.assign(form, { id: null, name: '', logo_url: '' })
  dialog.value = true
}

const openEdit = (row) => {
  isEdit.value = true
  Object.assign(form, row)
  dialog.value = true
}

const savePartner = async () => {
  if (!form.name || !form.logo_url) {
    errorMsg.value = 'Name and Logo URL are required'
    return
  }
  loading.value = true
  errorMsg.value = ''
  let result
  if (isEdit.value) {
    result = await supabase
      .from('partners')
      .update({
        name: form.name,
        logo_url: form.logo_url,
      })
      .eq('id', form.id)
      .select()
  } else {
    result = await supabase
      .from('partners')
      .insert([{
        name: form.name,
        logo_url: form.logo_url,
      }])
      .select()
  }
  if (result.error) errorMsg.value = result.error.message
  else {
    dialog.value = false
    fetchPartners()
  }
  loading.value = false
}

const openDelete = (id) => {
  deleteId.value = id
  deleteDialog.value = true
}

const deletePartner = async () => {
  loading.value = true
  errorMsg.value = ''
  const { error } = await supabase
    .from('partners')
    .delete()
    .eq('id', deleteId.value)
  if (error) errorMsg.value = error.message
  deleteDialog.value = false
  fetchPartners()
  loading.value = false
}

// Handle image file selection and upload
const handleImageUpload = async (event) => {
  const file = event.target.files[0]
  if (!file) return
  imageUploading.value = true
  imageUploadError.value = ''
  try {
    const fileExt = file.name.split('.').pop()
    const fileName = `partner-logo-${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
    const { data, error } = await supabase.storage
      .from('product-images')
      .upload(fileName, file, { cacheControl: '3600', upsert: false })
    if (error) throw error
    // Get public URL
    const { data: publicUrlData } = supabase.storage.from('product-images').getPublicUrl(data.path)
    form.logo_url = publicUrlData.publicUrl
  } catch (err) {
    imageUploadError.value = err.message || 'Upload failed'
  }
  imageUploading.value = false
}

onMounted(fetchPartners)
</script>

<template>
  <div class="p-6">
    <div class="mb-8">
      <VCard flat
        class="py-6 px-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4 shadow-none border-b border-gray-200">
        <div>
          <h2 class="text-2xl font-bold mb-1">Partners Management</h2>
          <p class="text-gray-500 text-base">
            Manage all partners and their logos displayed on your website.
          </p>
        </div>
        <VBtn color="primary" class="mt-4 md:mt-0" @click="openCreate" size="large" prepend-icon="tabler-plus">
          Add Partner
        </VBtn>
      </VCard>
    </div>

    <VAlert v-if="errorMsg" type="error" class="mb-4">
      {{ errorMsg }}
    </VAlert>

    <VDataTable :items="partnerList" :loading="loading" class="rounded-lg shadow" :headers="[
      { title: 'Name', key: 'name' },
      { title: 'Logo', key: 'logo_url' },
      { title: 'Created', key: 'created_at' },
      { title: 'Actions', key: 'actions', sortable: false },
    ]" item-value="id" density="comfortable">
      <template #item.logo_url="{ item }">
        <img :src="item.logo_url" alt="logo" style="height:38px;max-width:100px;object-fit:contain;" />
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
          {{ isEdit ? 'Edit Partner' : 'Add Partner' }}
        </VCardTitle>
        <VCardText>
          <VForm @submit.prevent="savePartner">
            <VTextField v-model="form.name" label="Name" required class="mb-4" />
            <!-- Image upload section -->
            <div class="mb-4">
              <label class="block font-medium mb-1">Logo</label>
              <input type="file" accept="image/*" @change="handleImageUpload" :disabled="imageUploading" />
              <div v-if="imageUploading" class="text-sm text-gray-500 mt-1">Uploading...</div>
              <div v-if="imageUploadError" class="text-sm text-red-500 mt-1">{{ imageUploadError }}</div>
              <div v-if="form.logo_url" class="mt-2">
                <img :src="form.logo_url" alt="Partner Logo"
                  style="max-width: 120px; max-height: 120px; object-fit: contain; border-radius: 8px;" />
              </div>
            </div>
          </VForm>
        </VCardText>
        <VCardActions>
          <VSpacer />
          <VBtn text @click="dialog = false">Cancel</VBtn>
          <VBtn color="primary" :loading="loading" @click="savePartner">
            Save
          </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>

    <!-- Delete Confirmation Dialog -->
    <VDialog v-model="deleteDialog" max-width="400">
      <VCard>
        <VCardTitle>Delete Partner?</VCardTitle>
        <VCardText>
          Are you sure you want to delete this partner?
        </VCardText>
        <VCardActions>
          <VSpacer />
          <VBtn text @click="deleteDialog = false">Cancel</VBtn>
          <VBtn color="error" :loading="loading" @click="deletePartner">
            Delete
          </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>
  </div>
</template>
