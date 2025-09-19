<template>
  <NavBar />
  <VContainer>
    <div class="position-relative  customer-reviews mt-16">
      <VCard elevation="4" class="mb-6">
        <VCardText>
          <h2 class="text-2xl font-bold text-center mb-6" style="font-family: 'Merriweather', serif;">Formulir</h2>
          <p class="text-center text-gray-600 mb-6">
            Silakan pilih formulir yang sesuai untuk kebutuhan Anda. Semua data akan diproses secara aman dan
            profesional
            oleh tim kami.
          </p>
        </VCardText>
      </VCard>
      <VRow>
        <VCol v-for="f in forms" :key="f.id" cols="12" sm="6" lg="4">
          <VCard>
            <VCardText>
              <div>
                <h5 class="text-h5 mb-2 d-flex align-center gap-2">
                  <VAvatar color="primary" variant="tonal" rounded class="mr-2">
                    <VIcon>{{ f.icon }}</VIcon>
                  </VAvatar>
                  {{ f.title }}
                </h5>
                <div class="text-body-2 mb-2">
                  {{ f.description }}
                </div>
                <VBtn :href="f.link" target="_blank" block color="primary" variant="elevated">
                  Buka Formulir
                </VBtn>
              </div>
            </VCardText>
          </VCard>
        </VCol>
      </VRow>
    </div>
  </VContainer>
</template>

<script setup>

import { supabase } from '@/libs/supabase'
import NavBar from '@/views/front-pages/front-page-navbar.vue'
import { onMounted, ref } from 'vue'

definePage({
  meta: {
    layout: 'blank',
    public: true,
  },
})

const forms = ref([])

onMounted(async () => {
  const { data, error } = await supabase
    .from('forms')
    .select('*')
    .order('id', { ascending: true })
  if (!error && data) {
    forms.value = data.filter(f => f.is_active === true)
  }
})
</script>

<style scoped>
.material-icons {
  font-family: 'Material Icons';
}
</style>
