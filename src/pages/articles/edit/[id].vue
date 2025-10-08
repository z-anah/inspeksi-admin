<script setup>
import { supabase } from '@/libs/supabase'
import ArticleContentEditor from '@/views/apps/article/add/article-content-editor.vue'
import ArticleHeaderSection from '@/views/apps/article/add/article-header-section.vue'
import ArticleMediaUpload from '@/views/apps/article/add/article-media-upload.vue'
import PublishingControls from '@/views/apps/article/add/publishing-controls.vue'
import { useConfigStore } from '@core/stores/config'
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const store = useConfigStore()
store.skin = 'default'

const route = useRoute()
const router = useRouter()
const loading = ref(false)
const saving = ref(false)
const errorMsg = ref('')
const isEdit = ref(route.params.id !== 'new')

// Article form data - aligned with database schema
const articleForm = ref({
  id: null,
  type: '',
  title: '',
  published_at: new Date().toISOString().split('T')[0],
  image_url: '',
  content: [], // Array as per database schema
  excerpt: '' // Local field for SEO and preview
})

// Available categories for type field
const categories = ref([
  'OPINI', 'KISAH', 'RILIS'
])

// Form validation - aligned with required database fields
const isFormValid = computed(() => {
  return articleForm.value.type.trim() !== '' &&
    articleForm.value.title.trim() !== '' &&
    articleForm.value.published_at !== '' &&
    Array.isArray(articleForm.value.content) &&
    articleForm.value.content.length > 0 &&
    articleForm.value.content.some(item => item.trim() !== '')
})

const lastSaved = ref(null)

// Fetch article data for editing
const fetchArticle = async () => {
  if (!isEdit.value) return

  loading.value = true
  errorMsg.value = ''

  try {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('id', route.params.id)
      .single()

    if (error) throw error

    // Map database fields directly to form
    articleForm.value = {
      id: data.id,
      type: data.type || '',
      title: data.title || '',
      published_at: data.published_at || new Date().toISOString().split('T')[0],
      image_url: data.image_url || '',
      content: Array.isArray(data.content) ? data.content : [],
      excerpt: data.excerpt || ''
    }

  } catch (error) {
    errorMsg.value = error.message
    console.error('Error fetching article:', error)
  }

  loading.value = false
}

// Save article to database
const saveArticle = async () => {
  if (!isFormValid.value) {
    errorMsg.value = 'Type, Title, Published Date, and Content are required'
    return
  }

  saving.value = true
  errorMsg.value = ''

  try {
    // Prepare data exactly as per database schema
    const articleData = {
      type: articleForm.value.type,
      title: articleForm.value.title,
      published_at: articleForm.value.published_at,
      image_url: articleForm.value.image_url,
      content: articleForm.value.content,
      excerpt: articleForm.value.excerpt
    }

    let result
    if (isEdit.value && articleForm.value.id) {
      result = await supabase
        .from('articles')
        .update(articleData)
        .eq('id', articleForm.value.id)
        .select()
    } else {
      result = await supabase
        .from('articles')
        .insert([articleData])
        .select()
    }

    if (result.error) throw result.error

    if (result.data && result.data[0]) {
      articleForm.value.id = result.data[0].id
      isEdit.value = true
    }

    lastSaved.value = new Date()
    router.push('/')
  } catch (error) {
    errorMsg.value = error.message
    console.error('Error saving article:', error)
  }

  saving.value = false
}

// Convert content between string (editor) and array (database)
const contentString = computed({
  get: () => Array.isArray(articleForm.value.content) ? articleForm.value.content.join('\n\n') : '',
  set: (value) => {
    articleForm.value.content = value.split('\n\n').filter(p => p.trim() !== '')
  }
})

// Handle image upload
const handleImageUpload = async (file) => {
  if (!file) return

  try {
    const fileExt = file.name.split('.').pop()
    const fileName = `articles/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`

    // Try uploading to product-images bucket first
    let uploadResult = await supabase.storage
      .from('product-images')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: true // Allow overwriting files
      })

    // If product-images fails due to RLS, try creating a public bucket path
    if (uploadResult.error) {
      console.warn('Upload to product-images failed, trying alternative approach:', uploadResult.error)

      // Try with a different path structure
      const altFileName = `public/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
      uploadResult = await supabase.storage
        .from('product-images')
        .upload(altFileName, file, {
          cacheControl: '3600',
          upsert: true
        })
    }

    if (uploadResult.error) {
      throw new Error(`Upload failed: ${uploadResult.error.message}. Please check storage permissions.`)
    }

    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from('product-images')
      .getPublicUrl(uploadResult.data.path)

    if (!publicUrlData.publicUrl) {
      throw new Error('Failed to get public URL for uploaded image')
    }

    articleForm.value.image_url = publicUrlData.publicUrl
  } catch (error) {
    console.error('Image upload error:', error)
    errorMsg.value = `Image upload failed: ${error.message}`
  }
}

onMounted(() => {
  if (isEdit.value) {
    fetchArticle()
  }
})

definePage({
  meta: {
    public: false,
  },
})
</script>

<template>
  <Navbar />

  <div class="add-article-container">
    <VContainer class="py-8">
      <!-- Loading State -->
      <div v-if="loading" class="d-flex justify-center align-center" style="height: 60vh;">
        <VProgressCircular indeterminate size="64" color="primary" />
      </div>

      <!-- Error Alert -->
      <VAlert v-if="errorMsg" type="error" class="mb-6" closable @click:close="errorMsg = ''">
        {{ errorMsg }}
      </VAlert>

      <!-- Main Content -->
      <div v-if="!loading">
        <!-- Page Header -->
        <div class="d-flex align-center justify-space-between mb-8">
          <div>
            <h1 class="text-h3 font-weight-bold mb-2">
              {{ isEdit ? 'Edit Article' : 'Create New Article' }}
            </h1>
            <p class="text-body-1 text-medium-emphasis">
              Write and publish engaging content for your community
            </p>
          </div>

          <div class="d-flex ga-3">
            <PublishingControls :is-valid="isFormValid" :last-saved="lastSaved" :saving="saving"
              @publish="saveArticle" />
          </div>
        </div>

        <VRow>
          <!-- Main Content Area -->
          <VCol cols="12" lg="8">
            <div class="d-flex flex-column ga-6">
              <!-- Content Editor -->
              <ArticleContentEditor v-model:content="contentString" />
            </div>
          </VCol>

          <!-- Sidebar -->
          <VCol cols="12" lg="4">
            <div class="d-flex flex-column ga-6" style="position: sticky; top: 2rem;">
              <!-- Article Header -->
              <ArticleHeaderSection v-model:title="articleForm.title" v-model:category="articleForm.type"
                v-model:published-at="articleForm.published_at" v-model:excerpt="articleForm.excerpt"
                :categories="categories" />

              <!-- Featured Image Upload -->
              <ArticleMediaUpload v-model:image-url="articleForm.image_url" @upload="handleImageUpload" />
            </div>
          </VCol>
        </VRow>
      </div>
    </VContainer>
  </div>

  <Footer />
</template>
