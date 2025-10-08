<script setup>
const props = defineProps({
  isValid: {
    type: Boolean,
    default: false
  },
  saving: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['publish'])
</script>

<template>
  <div class="d-flex align-center ga-3">
    <!-- Publish Button -->
    <VBtn color="primary" variant="flat" prepend-icon="tabler-send" :disabled="!isValid" :loading="saving"
      @click="$emit('publish')">
      Save Article
    </VBtn>
  </div>
</template>
