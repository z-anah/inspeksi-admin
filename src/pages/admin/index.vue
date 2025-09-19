<script setup>
import { supabase } from '@/libs/supabase'
import { onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

definePage({
  meta: {
    public: false,
  },
})

const loading = ref(false)
const errorMsg = ref('')
const articleList = ref([])
const isEdit = ref(false)
const form = reactive({
  id: null,
  type: '',
  title: '',
  published_at: '',
  image_url: '',
  content: [],
})
const router = useRouter()
const deleteDialog = ref(false)
const deleteId = ref(null)

const fetchArticles = async () => {
  loading.value = true
  errorMsg.value = ''
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .order('published_at', { ascending: false })
  if (error) errorMsg.value = error.message
  else articleList.value = data
  loading.value = false
}

const openCreate = () => {
  isEdit.value = false
  Object.assign(form, { id: null, type: '', title: '', published_at: '', image_url: '', content: [] })
  // Change to correct route for creating a new article
  router.push('/admin/articles/edit/new')
}

const openEdit = (row) => {
  isEdit.value = true
  router.push(`/admin/articles/edit/${row.id}`)
}

const openDelete = (id) => {
  deleteId.value = id
  deleteDialog.value = true
}

const deleteArticle = async () => {
  loading.value = true
  errorMsg.value = ''
  const { error } = await supabase
    .from('articles')
    .delete()
    .eq('id', deleteId.value)
  if (error) errorMsg.value = error.message
  deleteDialog.value = false
  fetchArticles()
  loading.value = false
}

onMounted(fetchArticles)
</script>

<template>
  <div class="p-6">
    <div class="mb-8">
      <VCard flat
        class="py-6 px-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4 shadow-none border-b border-gray-200">
        <div>
          <h2 class="text-2xl font-bold mb-1">Articles Management</h2>
          <p class="text-gray-500 text-base">
            Manage all articles and their details for your website.
          </p>
        </div>
        <VBtn color="primary" class="mt-4 md:mt-0" @click="openCreate" size="large" prepend-icon="tabler-plus">
          Add Article
        </VBtn>
      </VCard>
    </div>

    <VAlert v-if="errorMsg" type="error" class="mb-4">
      {{ errorMsg }}
    </VAlert>

    <VDataTable :items="articleList" :loading="loading" class="rounded-lg shadow" :headers="[
      { title: 'Type', key: 'type' },
      { title: 'Title', key: 'title' },
      { title: 'Published', key: 'published_at' },
      { title: 'Created', key: 'created_at' },
      { title: 'Actions', key: 'actions', sortable: false },
    ]" item-value="id" density="comfortable">
      <template #item.published_at="{ item }">
        <span class="text-xs text-gray-700">{{ item.published_at }}</span>
      </template>
      <template #item.content="{ item }">
        <ul class="list-disc pl-4">
          <li v-for="(p, i) in item.content" :key="i" class="truncate max-w-xs">{{ p }}</li>
        </ul>
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

    <!-- Delete Confirmation Dialog -->
    <VDialog v-model="deleteDialog" max-width="400">
      <VCard>
        <VCardTitle>Delete Article?</VCardTitle>
        <VCardText>
          Are you sure you want to delete this article?
        </VCardText>
        <VCardActions>
          <VSpacer />
          <VBtn text @click="deleteDialog = false">Cancel</VBtn>
          <VBtn color="error" :loading="loading" @click="deleteArticle">
            Delete
          </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>
  </div>
</template>
