<script setup>
const props = defineProps({
  author: {
    type: Object,
    required: true
  }
})
</script>

<template>
  <VCard>
    <VCardText class="pa-6">
      <h2 class="text-h5 font-weight-medium mb-6">Author Information</h2>

      <div class="d-flex ga-4 mb-6">
        <!-- Author Avatar -->
        <VAvatar :image="author.avatar" size="80" class="flex-shrink-0" />

        <!-- Author Details -->
        <div class="flex-grow-1">
          <h3 class="text-h6 font-weight-medium mb-1">{{ author.name }}</h3>
          <p class="text-body-2 text-medium-emphasis mb-3">{{ author.role }}</p>

          <!-- Social Links -->
          <div v-if="author.socialLinks" class="d-flex ga-2">
            <VBtn v-if="author.socialLinks.twitter"
              :href="`https://twitter.com/${author.socialLinks.twitter.replace('@', '')}`" target="_blank"
              variant="outlined" size="small" prepend-icon="tabler-brand-twitter">
              {{ author.socialLinks.twitter }}
            </VBtn>

            <VBtn v-if="author.socialLinks.linkedin" :href="`https://linkedin.com/in/${author.socialLinks.linkedin}`"
              target="_blank" variant="outlined" size="small" prepend-icon="tabler-brand-linkedin">
              LinkedIn
            </VBtn>
          </div>
        </div>
      </div>

      <!-- Author Bio -->
      <div class="mb-6">
        <h4 class="text-body-1 font-weight-medium mb-2">Bio</h4>
        <p class="text-body-2 text-medium-emphasis">{{ author.bio }}</p>
      </div>

      <!-- Author Stats -->
      <VDivider class="mb-4" />

      <div class="d-flex justify-space-between text-center">
        <div>
          <div class="text-h6 font-weight-bold text-primary">24</div>
          <div class="text-caption text-medium-emphasis">Articles</div>
        </div>

        <VDivider vertical />

        <div>
          <div class="text-h6 font-weight-bold text-primary">1.2k</div>
          <div class="text-caption text-medium-emphasis">Followers</div>
        </div>

        <VDivider vertical />

        <div>
          <div class="text-h6 font-weight-bold text-primary">4.8</div>
          <div class="text-caption text-medium-emphasis">Rating</div>
        </div>
      </div>

      <!-- Author Actions -->
      <VDivider class="my-4" />

      <div class="d-flex ga-2">
        <VBtn variant="outlined" size="small" prepend-icon="tabler-edit">
          Edit Profile
        </VBtn>

        <VBtn variant="text" size="small" prepend-icon="tabler-eye">
          View Public Profile
        </VBtn>
      </div>

      <!-- Publishing Note -->
      <VAlert type="success" variant="tonal" class="mt-4">
        <VAlertTitle>Author Attribution</VAlertTitle>
        This information will be displayed with your published article to help readers connect with you and discover
        more of your content.
      </VAlert>
    </VCardText>
  </VCard>
</template>
