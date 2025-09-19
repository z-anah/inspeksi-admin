<script setup>
import { supabase } from '@/libs/supabase'
import { onMounted, ref } from 'vue'

const sectionTitle = 'Mengapa Bergabung?'
const sectionSubTitle = 'Opini Kami'
const featuresData = ref([])

const fetchOpinions = async () => {
  const { data, error } = await supabase
    .from('opinion')
    .select('icon, title, description')
    .order('created_at', { ascending: false })
  if (!error && data) {
    featuresData.value = data
  }
}

onMounted(fetchOpinions)
</script>

<template>
  <VContainer id="features">
    <div class="feature-cards">
      <div class="headers d-flex justify-center flex-column align-center mb-12">
        <VChip label color="primary" class="mb-4" size="small">
          {{ sectionSubTitle }}
        </VChip>
        <div class="d-flex text-h4 mb-1 align-center flex-wrap justify-center">
          <div class="position-relative me-2">
            <div class="section-title">
              {{ sectionTitle }}
            </div>
          </div>
        </div>
      </div>
      <VRow>
        <VCol v-for="(data, index) in featuresData" :key="index" cols="12" md="4" sm="6">
          <div class="d-flex flex-column align-center justify-center gap-4 mx-auto">
            <VIcon :icon="data.icon" size="64" color="primary" />
            <div class="text-center">
              <h5 class="text-h5 mb-2">
                {{ data.title }}
              </h5>
              <p class="text-body-1 mb-6" style="max-inline-size: 310px;">
                {{ data.description }}
              </p>
            </div>
          </div>
        </VCol>
      </VRow>
    </div>
  </VContainer>
</template>

<style lang="scss" scoped>
.feature-cards {
  margin-block: 3.75rem;
}

.section-title::after {
  position: absolute;
  background: url("../../../assets/images/front-pages/icons/section-title-icon.png") no-repeat left bottom;
  background-size: contain;
  block-size: 100%;
  content: "";
  inline-size: 120%;
  inset-block-end: 0;
  inset-inline-start: -12%;
}

.section-title {
  font-size: 24px;
  font-weight: 800;
  line-height: 36px;
}

.feature {
  .v-avatar {
    &.v-avatar--variant-outlined {
      border: 2px solid rgba(var(--v-theme-primary), 0.32);

      &:hover {
        background: rgba(var(--v-theme-primary), 0.16);
        cursor: pointer;
      }
    }
  }
}
</style>
