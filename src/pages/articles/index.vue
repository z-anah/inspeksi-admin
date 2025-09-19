<script setup>
import { supabase } from '@/libs/supabase'
import NavBar from '@/views/front-pages/front-page-navbar.vue'
import { computed, onMounted, ref } from 'vue'

definePage({
  meta: {
    layout: false,
    public: true,
  },
})

const articles = ref([])
const loading = ref(false)
const errorMsg = ref('')

const fetchArticles = async () => {
  loading.value = true
  errorMsg.value = ''
  const { data, error } = await supabase
    .from('articles')
    .select('id, type, title, published_at, image_url, content')
    .order('published_at', { ascending: false })
  if (error) errorMsg.value = error.message
  else {
    articles.value = (data || []).map(article => {
      let summary = ''
      if (Array.isArray(article.content) && article.content.length > 0 && typeof article.content[0] === 'string') {
        summary = article.content[0].slice(0, 150) + (article.content[0].length > 150 ? '...' : '')
      }
      return { ...article, summary }
    })
  }
  loading.value = false
}

const groupedArticles = computed(() => {
  const groups = {}
  for (const article of articles.value) {
    if (!groups[article.type]) groups[article.type] = []
    groups[article.type].push(article)
  }
  return groups
})

onMounted(fetchArticles)
</script>

<template>
  <NavBar active-id="Artikel" />
  <div class="position-relative customer-reviews mt-16">
    <VContainer>
      <h1 class="text-3xl font-bold mb-8 text-center">Artikel</h1>
      <VAlert v-if="errorMsg" type="error" class="mb-4">{{ errorMsg }}</VAlert>
      <div v-if="loading" class="text-center text-gray-400 py-8">Loading...</div>
      <div v-else>
        <template v-if="Object.keys(groupedArticles).length">
          <div v-for="(list, type) in groupedArticles" :key="type" class="mb-10">
            <h2 class="text-xl font-bold mb-4" style="text-transform: uppercase;">{{ type }}</h2>
            <VRow>
              <template v-if="list.length">
                <VCol v-for="(article, idx) in list" :key="article.id" sm="6" cols="12" class="mb-1">
                  <RouterLink :to="`/articles/${article.id}`" class="block">
                    <VCard class="hover:shadow-lg transition-shadow cursor-pointer">
                      <VImg v-if="!$vuetify.display.mdAndUp"
                        :src="article.image_url || 'https://source.unsplash.com/400x240/?news,article'"
                        class="rounded-lg bw-img" cover />
                      <div class="d-flex justify-space-between flex-wrap flex-md-nowrap flex-column flex-md-row">
                        <VImg v-if="$vuetify.display.mdAndUp"
                          :src="article.image_url || 'https://source.unsplash.com/400x240/?news,article'"
                          class="rounded-lg bw-img" cover width="230" />
                        <VDivider :vertical="$vuetify.display.mdAndUp" />
                        <div class="flex-1 min-w-0">
                          <VCardItem>
                            <VCardTitle class="text-[rgb(var(--v-theme-primary))]">
                              {{ article.title }}
                            </VCardTitle>
                          </VCardItem>
                          <VCardText>
                            {{ article.summary || '' }}
                          </VCardText>
                          <VCardText class="text-subtitle-1">
                            <span class="text-gray-500">Tanggal:</span>
                            <span class="font-weight-medium ms-2">
                              {{ new Date(article.published_at).toLocaleDateString() }}
                            </span>
                          </VCardText>
                        </div>
                      </div>
                    </VCard>
                  </RouterLink>
                </VCol>
              </template>
              <template v-else>
                <VCol cols="12" class="text-center text-gray-400 py-12">
                  Tidak ada artikel terbaru saat ini.
                </VCol>
              </template>
            </VRow>
          </div>
        </template>
        <div v-else class="text-center text-gray-400 py-8">Tidak ada artikel.</div>
      </div>
    </VContainer>
  </div>
</template>
