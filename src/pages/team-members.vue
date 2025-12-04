<script setup>
import { supabase } from '@/libs/supabase'
import { onMounted, reactive, ref } from 'vue'
import draggable from 'vuedraggable'

definePage({
  meta: {
    public: false,
  },
})

const teamMembers = ref([])
const loading = ref(false)
const errorMsg = ref('')
const dialog = ref(false)
const deleteDialog = ref(false)
const isEdit = ref(false)
const form = reactive({
  id: null,
  name: '',
  position: '',
  image_url: '',
  order_index: 0,
  section: '', // Added section
})
const deleteId = ref(null)
const imageUploading = ref(false)
const imageUploadError = ref('')

const fetchTeamMembers = async () => {
  loading.value = true
  errorMsg.value = ''
  const { data, error } = await supabase
    .from('team_members')
    .select('*')
    .order('order_index', { ascending: true })
  if (error) errorMsg.value = error.message
  else teamMembers.value = data
  loading.value = false
}

const openCreate = () => {
  isEdit.value = false
  Object.assign(form, { id: null, name: '', position: '', image_url: '', order_index: teamMembers.value.length, section: '' }) // Add section
  dialog.value = true
  errorMsg.value = ''
}

const openEdit = (row) => {
  isEdit.value = true
  Object.assign(form, row)
  dialog.value = true
  errorMsg.value = ''
}

const saveTeamMember = async () => {
  if (!form.name || !form.position) {
    errorMsg.value = 'Name and Position are required'
    return
  }
  loading.value = true
  errorMsg.value = ''
  let result
  if (isEdit.value) {
    result = await supabase
      .from('team_members')
      .update({
        name: form.name,
        position: form.position,
        image_url: form.image_url,
        order_index: form.order_index,
        section: form.section, // Add section
      })
      .eq('id', form.id)
      .select()
  } else {
    result = await supabase
      .from('team_members')
      .insert([{
        name: form.name,
        position: form.position,
        image_url: form.image_url,
        order_index: form.order_index,
        section: form.section, // Add section
      }])
      .select()
  }
  if (result.error) errorMsg.value = result.error.message
  else {
    dialog.value = false
    fetchTeamMembers()
  }
  loading.value = false
}

const openDelete = (id) => {
  deleteId.value = id
  deleteDialog.value = true
}

const deleteTeamMember = async () => {
  loading.value = true
  errorMsg.value = ''
  const { error } = await supabase
    .from('team_members')
    .delete()
    .eq('id', deleteId.value)
  if (error) errorMsg.value = error.message
  deleteDialog.value = false
  fetchTeamMembers()
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
    const fileName = `team-member-${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
    const { data, error } = await supabase.storage
      .from('product-images')
      .upload(fileName, file, { cacheControl: '3600', upsert: false })
    if (error) throw error
    // Get public URL
    const { data: publicUrlData } = supabase.storage.from('product-images').getPublicUrl(data.path)
    form.image_url = publicUrlData.publicUrl
  } catch (err) {
    imageUploadError.value = err.message || 'Upload failed'
  }
  imageUploading.value = false
}

const updateOrderIndexes = async () => {
  loading.value = true
  errorMsg.value = ''
  try {
    const updates = teamMembers.value.map((member, index) => ({
      id: member.id,
      order_index: index,
    }))

    for (const update of updates) {
      const { error } = await supabase
        .from('team_members')
        .update({ order_index: update.order_index })
        .eq('id', update.id)
      if (error) throw error
    }
  } catch (err) {
    errorMsg.value = err.message || 'Failed to update order'
    await fetchTeamMembers() // Revert on error
  }
  loading.value = false
}

const onDragEnd = () => {
  // Update local order_index after drag-and-drop
  teamMembers.value.forEach((member, idx) => {
    member.order_index = idx
  })
  updateOrderIndexes()
}

onMounted(fetchTeamMembers)
</script>

<template>
  <div class="p-6">
    <div class="mb-8">
      <VCard flat
        class="py-6 px-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4 shadow-none border-b border-gray-200">
        <div>
          <h2 class="text-2xl font-bold mb-1">Team Members Management</h2>
          <p class="text-gray-500 text-base">
            Manage all team members displayed on your website.
          </p>
        </div>
        <VBtn color="primary" class="mt-4 md:mt-0" @click="openCreate" size="large" prepend-icon="tabler-plus">
          Add Team Member
        </VBtn>
      </VCard>
      <VProgressLinear v-if="loading" indeterminate color="primary" />
    </div>

    <VAlert v-if="errorMsg" type="error" class="mb-4">
      {{ errorMsg }}
    </VAlert>

    <div class="overflow-x-auto">
      <table class="w-full">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 text-left text-sm font-semibold text-gray-700">Range</th>
            <th class="px-6 text-left text-sm font-semibold text-gray-700">Section</th>
            <th class="px-6 text-left text-sm font-semibold text-gray-700">Name</th>
            <th class="px-6 text-left text-sm font-semibold text-gray-700">Position</th>
            <th class="px-6 text-left text-sm font-semibold text-gray-700">Image</th>
            <th class="px-6 text-left text-sm font-semibold text-gray-700">Actions</th>
            <th class="px-6 text-left text-sm font-semibold text-gray-700" style="width: 40px;"></th>
          </tr>
        </thead>
        <draggable v-model="teamMembers" tag="tbody" item-key="id" @end="onDragEnd" handle=".drag-handle"
          :disabled="loading">
          <template #item="{ element: item }">
            <tr class="border-b hover:bg-gray-100 hover:shadow rounded-lg transition-all duration-150 cursor-move">
              <td class="px-6 align-middle text-align-right">
                <span class="text-xs text-gray-500">{{ item.order_index + 1 }}</span>
              </td>
              <td class="px-6 align-middle text-sm">{{ item.section }}</td>
              <td class="px-6 align-middle text-sm">{{ item.name }}</td>
              <td class="px-6 align-middle text-sm">{{ item.position }}</td>
              <td class="px-6 align-middle text-center">
                <img v-if="item.image_url" :src="item.image_url" alt="team member"
                  style="height:48px;max-width:80px;object-fit:cover;border-radius:8px;" />
                <span v-else class="text-gray-400 text-sm">-</span>
              </td>
              <td class="px-6 align-middle">
                <VBtn icon variant="text" color="primary" size="small" @click="openEdit(item)">
                  <VIcon icon="tabler-edit" />
                </VBtn>
                <VBtn icon variant="text" color="error" size="small" @click="openDelete(item.id)">
                  <VIcon icon="tabler-trash" />
                </VBtn>
              </td>
              <td class="px-6 align-middle">
                <VIcon icon="tabler-grip-vertical"
                  class="drag-handle text-gray-400 cursor-grab active:cursor-grabbing" />
              </td>
            </tr>
          </template>
        </draggable>
        <tbody v-if="!teamMembers.length && !loading">
          <tr>
            <td colspan="6" class="text-center text-gray-400 py-12">No data.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Create/Edit Dialog -->
    <VDialog v-model="dialog" max-width="500">
      <VCard>
        <VCardTitle>
          {{ isEdit ? 'Edit Team Member' : 'Add Team Member' }}
        </VCardTitle>
        <VCardText>
          <VForm @submit.prevent="saveTeamMember">
            <VTextField v-model="form.name" label="Name" required class="mb-4" />
            <VTextField v-model="form.position" label="Position" required class="mb-4" />
            <VTextField v-model="form.section" label="Section" class="mb-4" /> <!-- Add section input -->
            <!-- Image upload section -->
            <div class="mb-4">
              <label class="block font-medium mb-1">Image</label>
              <input type="file" accept="image/*" @change="handleImageUpload" :disabled="imageUploading" />
              <div v-if="imageUploading" class="text-sm text-gray-500 mt-1">Uploading...</div>
              <div v-if="imageUploadError" class="text-sm text-red-500 mt-1">{{ imageUploadError }}</div>
              <div v-if="form.image_url" class="mt-2">
                <img :src="form.image_url" alt="Team Member Image"
                  style="max-width: 120px; max-height: 120px; border-radius: 8px;" />
              </div>
            </div>
          </VForm>
        </VCardText>
        <VCardActions>
          <VSpacer />
          <VBtn text @click="dialog = false">Cancel</VBtn>
          <VBtn color="primary" :loading="loading" @click="saveTeamMember">
            Save
          </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>

    <!-- Delete Confirmation Dialog -->
    <VDialog v-model="deleteDialog" max-width="400">
      <VCard>
        <VCardTitle>Delete Team Member?</VCardTitle>
        <VCardText>
          Are you sure you want to delete this team member?
        </VCardText>
        <VCardActions>
          <VSpacer />
          <VBtn text @click="deleteDialog = false">Cancel</VBtn>
          <VBtn color="error" :loading="loading" @click="deleteTeamMember">
            Delete
          </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>
  </div>
</template>

<style scoped>
table tr {
  border-radius: 12px;
}
</style>
