<script setup>
import { supabase } from '@/libs/supabase'
import { onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

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
  else router.push({ name: 'admin-articles' })
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
          <AppTextField v-model="form.image_url" label="Image URL" class="mb-4" />
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
        <VBtn text @click="router.push({ name: 'admin-articles' })">Cancel</VBtn>
        <VBtn color="primary" :loading="loading" @click="saveArticle">
          Save
        </VBtn>
      </VCardActions>
    </VCard>
  </div>
</template>
