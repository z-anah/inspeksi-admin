<script setup>
const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  category: {
    type: String,
    default: ''
  },
  publishedAt: {
    type: String,
    default: ''
  },
  excerpt: {
    type: String,
    default: ''
  },
  categories: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['update:title', 'update:category', 'update:publishedAt', 'update:excerpt'])

// Handle category update with uppercase conversion
const handleCategoryUpdate = (value) => {
  emit('update:category', value ? value.toUpperCase() : '')
}
</script>

<template>
  <VCard>
    <VCardText class="pa-6">
      <h2 class="text-h5 font-weight-medium mb-6">Article Information</h2>

      <AppTextField :model-value="publishedAt" @update:model-value="$emit('update:publishedAt', $event)"
        label="Published Date" type="date" :rules="[v => !!v || 'Published date is required']" class="mb-4" />

      <AppTextField :model-value="title" @update:model-value="$emit('update:title', $event)" label="Article Title"
        placeholder="Enter an engaging title for your article" counter="100" maxlength="100"
        :rules="[v => !!v || 'Title is required']" class="mb-4" />

      <AppSelect :model-value="category" @update:model-value="handleCategoryUpdate" :items="categories" label="Category"
        placeholder="Select a category" :rules="[v => !!v || 'Category is required']" class="mb-4">
        <template #prepend-inner>
          <VIcon icon="tabler-category" />
        </template>
      </AppSelect>

      <AppTextarea :model-value="excerpt" @update:model-value="$emit('update:excerpt', $event)" label="Article Excerpt"
        placeholder="Write a brief summary of your article (for SEO and social sharing)" counter="160" maxlength="160"
        rows="3" auto-grow class="mb-4" />

      <VAlert type="info" variant="tonal">
        <VAlertTitle>SEO Tip</VAlertTitle>
        A good excerpt helps with search engine optimization and social media sharing. Keep it under 160 characters.
      </VAlert>

    </VCardText>
  </VCard>
</template>
