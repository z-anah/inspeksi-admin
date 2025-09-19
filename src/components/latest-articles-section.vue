<script setup>
import { supabase } from '@/libs/supabase'
import { onMounted, ref } from 'vue'

const articles = ref([])

const fetchArticles = async () => {
  const { data, error } = await supabase
    .from('articles')
    .select('title, content, published_at, image_url, id')
    .order('published_at', { ascending: false })
    .limit(4)

  if (!error && data) {
    articles.value = data.map(article => {
      let summary = article.content[0]
      summary = article.content[0].slice(0, 150) + (article.content[0].length > 150 ? '...' : '')
      return {
        title: article.title,
        summary,
        date: article.published_at,
        link: `/articles/${article.id}`,
        image: article.image_url || 'https://source.unsplash.com/400x240/?news,article',
      }
    })
  }
}

onMounted(fetchArticles)
</script>

<template>
  <div id="customer-review" class="position-relative">
    <div class="customer-reviews">
      <VContainer>
        <div class="text-center mb-12">
          <span class="inline-block px-4 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-3">
            Artikel Terbaru
          </span>
          <h2 class="text-3xl md:text-4xl font-extrabold text-[rgb(var(--v-theme-primary))] mb-4">
            Temukan Wawasan & Berita Terkini
          </h2>
          <p class="text-gray-500 dark:text-gray-300 max-w-2xl mx-auto">
            Dapatkan informasi, tips, dan edukasi terbaru seputar pengadaan antikorupsi.
          </p>
        </div>
        <VRow>
          <template v-if="articles.length">
            <VCol v-for="(article, idx) in articles" :key="idx" sm="6" cols="12" class="mb-1">
              <VCard :to="article.link" class="hover:shadow-lg transition-shadow cursor-pointer">
                <VImg v-if="!$vuetify.display.mdAndUp" :src="article.image" class="rounded-lg bw-img" cover />
                <div class="d-flex justify-space-between flex-wrap flex-md-nowrap flex-column flex-md-row">
                  <VImg v-if="$vuetify.display.mdAndUp" :src="article.image" class="rounded-lg bw-img" cover
                    width="230" />
                  <VDivider :vertical="$vuetify.display.mdAndUp" />
                  <div class="flex-1 min-w-0">
                    <VCardItem>
                      <VCardTitle class="text-[rgb(var(--v-theme-primary))]">
                        {{ article.title }}
                      </VCardTitle>
                    </VCardItem>
                    <VCardText>
                      {{ article.summary }}
                    </VCardText>
                    <VCardText class="text-subtitle-1">
                      <span class="text-gray-500">Tanggal:</span>
                      <span class="font-weight-medium ms-2">{{ new Date(article.date).toLocaleDateString() }}</span>
                    </VCardText>
                  </div>
                </div>
              </VCard>
            </VCol>
          </template>
          <template v-else>
            <VCol cols="12" class="text-center text-gray-400 py-12">
              Tidak ada artikel terbaru saat ini.
            </VCol>
          </template>
        </VRow>
      </VContainer>
    </div>
  </div>
</template>

<style scoped>
.bw-img {
  filter: grayscale(1);
  transition: filter 0.3s;
}

.bw-img:hover,
.v-card:hover .bw-img {
  filter: grayscale(0);
}
</style>
