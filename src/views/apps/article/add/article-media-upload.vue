<script setup>
import { ref } from 'vue'

const props = defineProps({
  imageUrl: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:imageUrl', 'upload'])

const uploading = ref(false)
const uploadError = ref('')

const handleFileUpload = async (event) => {
  const file = event.target.files[0]
  if (!file) return

  uploading.value = true
  uploadError.value = ''

  try {
    await emit('upload', file)
  } catch (error) {
    uploadError.value = error.message
  }

  uploading.value = false
}

const removeImage = () => {
  emit('update:imageUrl', '')
}
</script>

<template>
  <VCard>
    <VCardText class="pa-6">
      <h2 class="text-h5 font-weight-medium mb-6">Featured Image</h2>

      <div v-if="!imageUrl" class="upload-area">
        <input type="file" accept="image/*" @change="handleFileUpload" :disabled="uploading" class="d-none"
          ref="fileInput" />

        <VBtn variant="outlined" prepend-icon="tabler-upload" :loading="uploading" @click="$refs.fileInput.click()"
          block>
          Upload Image
        </VBtn>

        <VAlert v-if="uploadError" type="error" class="mt-4">
          {{ uploadError }}
        </VAlert>

        <!-- <p class="text-caption text-medium-emphasis mt-4 text-center">
          Recommended: 1200x630px for optimal social media sharing
        </p> -->
      </div>

      <div v-else class="image-preview">
        <VImg :src="imageUrl" aspect-ratio="1.91" cover class="rounded" style="max-height: 200px;" />

        <div class="d-flex justify-space-between align-center mt-4">
          <p class="text-body-2 text-medium-emphasis">
            Image uploaded successfully
          </p>

          <VBtn variant="text" color="error" prepend-icon="tabler-trash" size="small" @click="removeImage">
            Remove
          </VBtn>
        </div>
      </div>
    </VCardText>
  </VCard>
</template>

<style scoped>
.upload-area {
  border: 2px dashed rgba(var(--v-theme-primary), 0.3);
  border-radius: 8px;
  padding: 2rem;
  text-align: center;
  transition: border-color 0.3s ease;
}

.upload-area:hover {
  border-color: rgba(var(--v-theme-primary), 0.5);
}
</style>
