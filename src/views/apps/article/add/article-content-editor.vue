<script setup>
import ProductDescriptionEditor from '@/@core/components/ProductDescriptionEditor.vue';

const props = defineProps({
  content: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:content'])
</script>

<template>
  <VCard>
    <VCardText class="pa-6">
      <h2 class="text-h5 font-weight-medium mb-6">Article Content</h2>

      <div class="d-flex flex-column ga-6">
        <!-- Main Content Editor -->
        <div>
          <VLabel class="mb-2">Article Content</VLabel>
          <VCard variant="outlined">
            <ProductDescriptionEditor :model-value="content" @update:model-value="$emit('update:content', $event)"
              placeholder="Start writing your article content here..." />
          </VCard>
        </div>

        <!-- Writing Tips -->
        <VAlert type="info" variant="tonal" class="mt-4">
          <VAlertTitle>Writing Tips</VAlertTitle>
          <ul class="mt-2">
            <li>Use clear, engaging headings to structure your content</li>
            <li>Keep paragraphs short and easy to read</li>
            <li>Add images and media to break up text</li>
            <li>Include a compelling excerpt for social sharing</li>
          </ul>
        </VAlert>
      </div>
    </VCardText>
  </VCard>
</template>
