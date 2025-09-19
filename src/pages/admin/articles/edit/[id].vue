<script setup>
import { supabase } from '@/libs/supabase'
import { onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

definePage({
  meta: {
    public: false,
  },
})

const route = useRoute()
const router = useRouter()
const loading = ref(false)
const errorMsg = ref('')
const isEdit = ref(route.params.id !== 'new')
const form = reactive({
  id: null,
  type: '',
  title: '',
  published_at: '',
  image_url: '',
  content: [],
})

// Add image upload state
const imageUploading = ref(false)
const imageUploadError = ref('')

// Handle image file selection and upload
const handleImageUpload = async (event) => {
  const file = event.target.files[0]
  if (!file) return
  imageUploading.value = true
  imageUploadError.value = ''
  try {
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
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

const fetchArticle = async () => {
  if (!isEdit.value) return
  loading.value = true
  errorMsg.value = ''
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('id', route.params.id)
    .single()
  if (error) errorMsg.value = error.message
  else Object.assign(form, { ...data, content: Array.isArray(data.content) ? data.content : (data.content ? [data.content] : []) })
  loading.value = false
}

const saveArticle = async () => {
  if (!form.type || !form.title || !form.published_at || !form.content.length) {
    errorMsg.value = 'Type, Title, Published Date, and Content are required'
    return
  }
  loading.value = true
  errorMsg.value = ''
  let result
  if (isEdit.value) {
    result = await supabase
      .from('articles')
      .update({
        type: form.type,
        title: form.title,
        published_at: form.published_at,
        image_url: form.image_url,
        content: form.content,
      })
      .eq('id', form.id)
      .select()
  } else {
    result = await supabase
      .from('articles')
      .insert([{
        type: form.type,
        title: form.title,
        published_at: form.published_at,
        image_url: form.image_url,
        content: form.content,
      }])
      .select()
  }
  if (result.error) errorMsg.value = result.error.message
  else router.push({ name: 'admin' })
  loading.value = false
}

onMounted(() => {
  if (isEdit.value) fetchArticle()
})
</script>

<template>
  <div class="p-6 max-w-2xl mx-auto">
    <VCard>
      <VCardTitle>
        {{ isEdit ? 'Edit Article' : 'Add Article' }}
      </VCardTitle>
      <VCardText>
        <VAlert v-if="errorMsg" type="error" class="mb-4">
          {{ errorMsg }}
        </VAlert>
        <VForm @submit.prevent="saveArticle">
          <AppTextField v-model="form.type" label="Type (e.g. opini, kisah, rilis)" required class="mb-4" />
          <AppTextField v-model="form.title" label="Title" required class="mb-4" />
          <AppTextField v-model="form.published_at" label="Published Date" type="date" required class="mb-4" />
          <!-- Image upload section -->
          <div class="mb-4">
            <label class="block font-medium mb-1">Image</label>
            <input type="file" accept="image/*" @change="handleImageUpload" :disabled="imageUploading" />
            <div v-if="imageUploading" class="text-sm text-gray-500 mt-1">Uploading...</div>
            <div v-if="imageUploadError" class="text-sm text-red-500 mt-1">{{ imageUploadError }}</div>
            <div v-if="form.image_url" class="mt-2">
              <img :src="form.image_url" alt="Article Image" style="max-width: 200px; max-height: 200px;" />
            </div>
          </div>
          <div class="mb-4">
            <label class="block font-medium mb-1">Content Paragraphs</label>
            <div v-for="(p, i) in form.content" :key="i" class="flex items-center gap-2 mb-2">
              <AppTextarea v-model="form.content[i]" auto-grow label="Paragraph" class="flex-1" />
              <VBtn icon variant="text" color="error" @click="form.content.splice(i, 1)">
                <VIcon icon="tabler-trash" />
              </VBtn>
            </div>
            <VBtn color="secondary" variant="tonal" size="small" @click="form.content.push('')">
              Add Paragraph
            </VBtn>
          </div>
        </VForm>
      </VCardText>
      <VCardActions>
        <VSpacer />
        <VBtn text @click="router.push({ name: 'admin' })">Cancel</VBtn>
        <VBtn color="primary" :loading="loading" @click="saveArticle">
          Save
        </VBtn>
      </VCardActions>
    </VCard>
  </div>
</template>
