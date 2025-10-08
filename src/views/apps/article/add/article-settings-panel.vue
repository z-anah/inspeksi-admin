<script setup>
import { computed, watch } from 'vue'

const props = defineProps({
  seoTitle: {
    type: String,
    default: ''
  },
  seoDescription: {
    type: String,
    default: ''
  },
  slug: {
    type: String,
    default: ''
  },
  allowComments: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: ''
  }
})

const emit = defineEmits([
  'update:seoTitle',
  'update:seoDescription',
  'update:slug',
  'update:allowComments',
  'update:isFeatured'
])

// Auto-generate slug from title
const generateSlug = (text) => {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim('-')
}

// Auto-generate SEO title if empty
const autoSeoTitle = computed(() => {
  return props.seoTitle || props.title
})

// SEO Score calculation
const seoScore = computed(() => {
  let score = 0
  const maxScore = 100

  // Title length (ideal: 50-60 characters)
  if (autoSeoTitle.value.length >= 30 && autoSeoTitle.value.length <= 60) {
    score += 30
  } else if (autoSeoTitle.value.length > 0) {
    score += 15
  }

  // Description length (ideal: 140-160 characters)
  if (props.seoDescription.length >= 120 && props.seoDescription.length <= 160) {
    score += 30
  } else if (props.seoDescription.length > 0) {
    score += 15
  }

  // Slug quality
  if (props.slug.length > 0) {
    score += 20
  }

  // Title and description filled
  if (props.title.length > 0) score += 10
  if (props.seoDescription.length > 0) score += 10

  return Math.min(score, maxScore)
})

const seoScoreColor = computed(() => {
  if (seoScore.value >= 80) return 'success'
  if (seoScore.value >= 60) return 'warning'
  return 'error'
})

// Watch title changes to auto-generate slug
watch(() => props.title, (newTitle) => {
  if (!props.slug && newTitle) {
    emit('update:slug', generateSlug(newTitle))
  }
})
</script>

<template>
  <VCard>
    <VCardText class="pa-6">
      <h3 class="text-h5 font-weight-medium mb-4">Article Settings</h3>

      <!-- SEO Score -->
      <div class="mb-6">
        <div class="d-flex align-center justify-space-between mb-2">
          <span class="text-body-1 font-weight-medium">SEO Score</span>
          <VChip :color="seoScoreColor" size="small">
            {{ seoScore }}/100
          </VChip>
        </div>

        <VProgressLinear :model-value="seoScore" :color="seoScoreColor" height="6" rounded />
      </div>

      <!-- SEO Settings -->
      <div class="d-flex flex-column ga-4 mb-6">
        <VTextField :model-value="seoTitle" @update:model-value="$emit('update:seoTitle', $event)" label="SEO Title"
          :placeholder="title || 'Enter SEO title'" variant="outlined" counter="60" maxlength="60"
          :hint="`${autoSeoTitle.length}/60 characters`" persistent-hint />

        <VTextarea :model-value="seoDescription" @update:model-value="$emit('update:seoDescription', $event)"
          label="SEO Description" placeholder="Write a compelling description for search engines" variant="outlined"
          rows="3" counter="160" maxlength="160" :hint="`${seoDescription.length}/160 characters`" persistent-hint />
      </div>

      <VDivider class="my-4" />

      <!-- Publication Settings -->
      <div class="d-flex flex-column ga-4">
        <h4 class="text-h6 font-weight-medium">Publication Settings</h4>

        <VCheckbox :model-value="allowComments" @update:model-value="$emit('update:allowComments', $event)"
          label="Allow Comments" hide-details />

        <VCheckbox :model-value="isFeatured" @update:model-value="$emit('update:isFeatured', $event)"
          label="Featured Article" hide-details />
      </div>

      <!-- SEO Tips -->
      <VDivider class="my-4" />

      <VAlert type="info" variant="tonal" class="text-body-2">
        <VAlertTitle class="text-body-1">SEO Tips</VAlertTitle>
        <ul class="mt-2">
          <li>Keep titles between 50-60 characters</li>
          <li>Write descriptions between 140-160 characters</li>
          <li>Use descriptive, keyword-rich URLs</li>
          <li>Include your main keyword in the title</li>
        </ul>
      </VAlert>
    </VCardText>
  </VCard>
</template>
