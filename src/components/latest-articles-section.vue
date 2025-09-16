<script setup>
const articles = [
  {
    title: 'Strategi Pengadaan Bersih di Era Digital',
    summary: 'Pelajari bagaimana teknologi dapat membantu mencegah korupsi dalam proses pengadaan barang dan jasa. Dengan pemanfaatan sistem digital, transparansi dan akuntabilitas dapat lebih mudah diwujudkan dalam setiap tahapan pengadaan.',
    date: '2024-06-01',
    link: '#',
    image: 'https://source.unsplash.com/400x240/?technology,meeting',
  },
  {
    title: 'Tips Menjadi Whistleblower yang Aman',
    summary: 'Panduan praktis untuk melaporkan pelanggaran secara aman dan efektif di lingkungan kerja. Temukan langkah-langkah perlindungan diri serta dukungan hukum yang tersedia bagi pelapor tindak korupsi.',
    date: '2024-05-28',
    link: '#',
    image: 'https://source.unsplash.com/400x240/?security,privacy',
  },
  {
    title: 'Workshop: Edukasi Antikorupsi untuk Pengadaan',
    summary: 'Ikuti workshop terbaru kami untuk meningkatkan integritas dan transparansi dalam pengadaan. Dapatkan materi edukasi, studi kasus, dan diskusi interaktif bersama para ahli di bidang antikorupsi.',
    date: '2024-05-20',
    link: '#',
    image: 'https://source.unsplash.com/400x240/?workshop,education',
  },
]
</script>

<template>
  <div
    id="customer-review"
    class="position-relative"
  >
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
          <VCol
            v-for="(article, idx) in articles"
            :key="idx"
            sm="6"
            cols="12"
            class="mb-1"
          >
            <VCard
              :to="article.link"
              class="hover:shadow-lg transition-shadow cursor-pointer"
            >
              <div class="d-flex justify-space-between flex-wrap flex-md-nowrap flex-column flex-md-row">
                <div class="ma-auto pa-5">
                  <VImg
                    :src="article.image"
                    width="137"
                    height="176"
                    class="rounded-lg"
                  />
                </div>
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
                  <!-- Removed VCardActions with buttons -->
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
