<script setup>
import { supabase } from '@/libs/supabase'
import NavBar from '@/views/front-pages/front-page-navbar.vue'
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

definePage({
  meta: {
    layout: false,
    public: true,
  },
})

const route = useRoute()
const router = useRouter()
const article = ref(null)
const loading = ref(false)
const errorMsg = ref('')

const fetchArticle = async () => {
  loading.value = true
  errorMsg.value = ''
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('id', route.params.id)
    .single()
  if (error) errorMsg.value = error.message
  else article.value = data
  loading.value = false
}

onMounted(fetchArticle)
</script>

<template>
  <NavBar active-id="Artikel" />
  <VContainer>
    <div class="max-w-2xl mx-auto py-8 px-4 mt-16 ">
      <VBtn variant="text" prepend-icon="tabler-arrow-left" class="mb-6" @click="router.back()">
        Kembali ke daftar artikel
      </VBtn>
      <VAlert v-if="errorMsg" type="error" class="mb-4">{{ errorMsg }}</VAlert>
      <div v-if="loading" class="text-center text-gray-400 py-8">Loading...</div>
      <div v-else-if="article">
        <h1 class="text-2xl font-bold mb-2">{{ article.title }}</h1>
        <div class="text-sm text-gray-500 mb-4">
          <span class="capitalize">{{ article.type }}</span> &middot; {{ article.published_at }}
        </div>
        <VImg v-if="article.image_url || true"
          :src="article.image_url || 'https://source.unsplash.com/600x320/?news,article'" height="240" width="500" cover
          class="rounded mb-6" />
        <div v-if="Array.isArray(article.content)">
          <div v-for="(p, i) in article.content" :key="i" class="mb-4 text-base leading-relaxed">
            {{ p }}
          </div>
        </div>
        <div v-else-if="article.content" class="mb-4 text-base leading-relaxed">
          {{ article.content }}
        </div>
      </div>
      <div v-else class="text-center text-gray-400 py-8">Artikel tidak ditemukan.</div>
    </div>
  </VContainer>
</template>
