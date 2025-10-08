<script setup>
import { computed } from 'vue'

const props = defineProps({
  article: {
    type: Object,
    required: true
  },
  author: {
    type: Object,
    required: true
  }
})

const previewDate = computed(() => {
  return new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
})

const readingTime = computed(() => {
  const wordCount = props.article.content.replace(/<[^>]*>/g, '').split(/\s+/).length
  const wordsPerMinute = 200
  const minutes = Math.ceil(wordCount / wordsPerMinute)
  return `${minutes} min read`
})

const getImageUrl = () => {
  if (props.article.featuredImage instanceof File) {
    return URL.createObjectURL(props.article.featuredImage)
  }
  return props.article.featuredImage || 'https://images.unsplash.com/photo-1560472355-536de3962603?w=400&h=200&fit=crop'
}
</script>

<template>
  <VCard>
    <VCardText class="pa-6">
      <h3 class="text-h5 font-weight-medium mb-4">Article Preview</h3>

      <div class="preview-container">
        <!-- Featured Image -->
        <VImg v-if="article.featuredImage || article.title" :src="getImageUrl()"
          :alt="article.title || 'Article preview'" height="200" class="rounded mb-4" cover />

        <!-- Article Header -->
        <div class="mb-4">
          <VChip v-if="article.category" color="primary" size="small" class="mb-2">
            {{ article.category }}
          </VChip>

          <h1 class="text-h4 font-weight-bold mb-2">
            {{ article.title || 'Your Article Title' }}
          </h1>

          <p v-if="article.subtitle" class="text-h6 text-medium-emphasis mb-3">
            {{ article.subtitle }}
          </p>

          <!-- Meta Information -->
          <div class="d-flex align-center ga-4 text-body-2 text-medium-emphasis mb-4">
            <div class="d-flex align-center ga-2">
              <VAvatar :image="author.avatar" size="24" />
              <span>{{ author.name }}</span>
            </div>
            <span>{{ previewDate }}</span>
            <span>{{ readingTime }}</span>
          </div>
        </div>

        <!-- Content Preview -->
        <div class="content-preview">
          <div v-if="article.content" class="article-content" v-html="article.content" />
          <p v-else class="text-medium-emphasis font-style-italic">
            Start writing your article content to see the preview here...
          </p>
        </div>

        <!-- Tags -->
        <div v-if="article.tags && article.tags.length > 0" class="mt-4">
          <h4 class="text-body-1 font-weight-medium mb-2">Tags</h4>
          <div class="d-flex flex-wrap ga-2">
            <VChip v-for="tag in article.tags" :key="tag" size="small" variant="outlined">
              #{{ tag }}
            </VChip>
          </div>
        </div>

        <!-- Preview Actions -->
        <VDivider class="my-4" />

        <div class="d-flex justify-space-between align-center">
          <div class="text-caption text-medium-emphasis">
            Live Preview
          </div>

          <div class="d-flex ga-2">
            <VBtn size="small" variant="outlined" prepend-icon="tabler-external-link">
              Full Preview
            </VBtn>
          </div>
        </div>
      </div>
    </VCardText>
  </VCard>
</template>

<style scoped>
.preview-container {
  max-height: 600px;
  overflow-y: auto;
}

.article-content :deep(h1),
.article-content :deep(h2),
.article-content :deep(h3) {
  font-weight: 600;
  margin: 1.5rem 0 1rem 0;
  line-height: 1.3;
}

.article-content :deep(h1) {
  font-size: 1.75rem;
}

.article-content :deep(h2) {
  font-size: 1.5rem;
}

.article-content :deep(h3) {
  font-size: 1.25rem;
}

.article-content :deep(p) {
  margin-bottom: 1rem;
  line-height: 1.6;
}

.article-content :deep(ul),
.article-content :deep(ol) {
  margin: 1rem 0;
  padding-left: 1.5rem;
}

.article-content :deep(blockquote) {
  border-left: 4px solid rgba(var(--v-theme-primary));
  padding-left: 1rem;
  margin: 1rem 0;
  font-style: italic;
  color: rgba(var(--v-theme-on-surface), var(--v-medium-emphasis-opacity));
}
</style>
