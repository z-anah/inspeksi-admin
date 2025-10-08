<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  tags: {
    type: Array,
    default: () => []
  },
  availableCategories: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['update:tags'])

const newTag = ref('')
const searchQuery = ref('')

// Predefined popular tags
const popularTags = ref([
  'community', 'technology', 'innovation', 'local-news', 'events',
  'education', 'health', 'environment', 'business', 'volunteer',
  'policy', 'development', 'services', 'engagement', 'digital',
  'sustainability', 'youth', 'seniors', 'safety', 'transportation'
])

// Filtered suggestions based on search
const tagSuggestions = computed(() => {
  if (!searchQuery.value) return popularTags.value.slice(0, 10)

  return popularTags.value.filter(tag =>
    tag.toLowerCase().includes(searchQuery.value.toLowerCase()) &&
    !props.tags.includes(tag)
  ).slice(0, 8)
})

const addTag = (tag) => {
  const trimmedTag = tag.trim().toLowerCase()
  if (trimmedTag && !props.tags.includes(trimmedTag)) {
    emit('update:tags', [...props.tags, trimmedTag])
  }
  newTag.value = ''
  searchQuery.value = ''
}

const removeTag = (tagToRemove) => {
  emit('update:tags', props.tags.filter(tag => tag !== tagToRemove))
}

const addNewTag = () => {
  if (newTag.value.trim()) {
    addTag(newTag.value)
  }
}

const handleKeyPress = (event) => {
  if (event.key === 'Enter') {
    event.preventDefault()
    addNewTag()
  }
}
</script>

<template>
  <VCard>
    <VCardText class="pa-6">
      <h2 class="text-h5 font-weight-medium mb-6">Tags & Categories</h2>

      <!-- Current Tags -->
      <div v-if="tags.length > 0" class="mb-4">
        <h4 class="text-body-1 font-weight-medium mb-3">Selected Tags</h4>
        <div class="d-flex flex-wrap ga-2">
          <VChip v-for="tag in tags" :key="tag" closable color="primary" variant="tonal" @click:close="removeTag(tag)">
            #{{ tag }}
          </VChip>
        </div>
      </div>

      <!-- Add New Tag -->
      <div class="mb-4">
        <VTextField v-model="newTag" label="Add Tags" placeholder="Type a tag and press Enter" variant="outlined"
          hide-details @keypress="handleKeyPress">
          <template #append-inner>
            <VBtn icon="tabler-plus" variant="text" size="small" @click="addNewTag" :disabled="!newTag.trim()" />
          </template>
        </VTextField>
      </div>

      <!-- Tag Suggestions -->
      <div class="mb-6">
        <h4 class="text-body-1 font-weight-medium mb-3">Popular Tags</h4>
        <VTextField v-model="searchQuery" placeholder="Search tags..." variant="outlined"
          prepend-inner-icon="tabler-search" hide-details class="mb-3" />

        <div class="d-flex flex-wrap ga-2">
          <VChip v-for="tag in tagSuggestions" :key="tag" size="small" variant="outlined" class="cursor-pointer"
            @click="addTag(tag)">
            #{{ tag }}
          </VChip>
        </div>
      </div>

      <!-- Category-based Tags -->
      <div>
        <h4 class="text-body-1 font-weight-medium mb-3">Category Tags</h4>
        <VExpansionPanels variant="accordion">
          <VExpansionPanel v-for="category in availableCategories" :key="category">
            <VExpansionPanelTitle>
              {{ category }}
            </VExpansionPanelTitle>
            <VExpansionPanelText>
              <div class="d-flex flex-wrap ga-2">
                <VChip
                  v-for="tag in popularTags.filter(t => t.includes(category.toLowerCase()) || Math.random() > 0.7).slice(0, 5)"
                  :key="`${category}-${tag}`" size="small" variant="outlined" class="cursor-pointer"
                  @click="addTag(tag)">
                  #{{ tag }}
                </VChip>
              </div>
            </VExpansionPanelText>
          </VExpansionPanel>
        </VExpansionPanels>
      </div>

      <!-- Tagging Tips -->
      <VAlert type="info" variant="tonal" class="mt-4">
        <VAlertTitle>Tagging Tips</VAlertTitle>
        <ul class="mt-2">
          <li>Use 3-8 relevant tags for best reach</li>
          <li>Include both specific and general tags</li>
          <li>Use lowercase, dash-separated phrases</li>
          <li>Tags help readers discover your content</li>
        </ul>
      </VAlert>
    </VCardText>
  </VCard>
</template>
