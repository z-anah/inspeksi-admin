<script setup>
import { supabase } from '@/libs/supabase'
import { onMounted, ref } from 'vue'

const teamData = ref([])
const bgColors = [
  '#EEEEEE',
]
const borderColors = [
  '#E0E0E0',
]

const fetchTeam = async () => {
  const { data, error } = await supabase
    .from('team_members')
    .select('name, position, image_url')
    .order('created_at', { ascending: false })
  if (!error && data) {
    teamData.value = data.map((member, idx) => ({
      ...member,
      backgroundColor: bgColors[idx % bgColors.length],
      borderColor: borderColors[idx % borderColors.length],
    }))
  }
}

onMounted(fetchTeam)
</script>

<template>
  <VContainer id="team">
    <div class="our-team pa-">
      <div class="headers d-flex justify-center flex-column align-center">
        <VChip label color="primary" class="mb-4" size="small">
          Tim Hebat Kami
        </VChip>

        <h4 class="d-flex align-center text-h4 mb-1 flex-wrap justify-center">
          <div class="position-relative me-2">
            <div class="section-title">
              Didukung
            </div>
          </div>
          oleh
        </h4>

        <p class="text-center text-body-1 mb-0">
          Kenali siapa saja di balik.
        </p>
      </div>

      <VRow>
        <VCol v-for="(data, index) in teamData" :key="index" cols="12" lg="3" sm="6">
          <VCard flat min-width="267" class="position-relative overflow-visible team-card mb-lg-0 mb-12 mt-4">
            <div
              :style="{ maxHeight: '185px', minHeight: '185px', borderRadius: '90px 20px 0 0', backgroundColor: data.backgroundColor, border: `1px solid ${data.borderColor}`, borderBottom: 'none' }">
              <VImg :src="data.image_url" height="240" class="team-image bw-img" />
            </div>
            <VCardText class="text-center pa-4"
              :style="{ border: `1px solid ${data.borderColor}`, borderBlockStart: 'none', borderRadius: '0 0 6px 6px', boxSizing: 'border-box' }">
              <h5 class="text-h5">
                {{ data.name }}
              </h5>
              <p class="text-body-1 text-disabled mb-0">
                {{ data.position }}
              </p>
            </VCardText>
          </VCard>
        </VCol>
      </VRow>
    </div>
  </VContainer>
</template>

<style lang="scss" scoped>
.team-image {
  position: absolute;
  inset-block-start: -3.4rem;
  inset-inline: 0;
}

.headers {
  margin-block-end: 7.4375rem;
}

.our-team {
  margin-block: 5.25rem;
}

@media (max-width: 1264px) {
  .our-team {
    margin-block-end: 1rem;
  }
}

.team-card {
  border-radius: 90px 20px 6px 6px;
}

.section-title {
  font-size: 24px;
  font-weight: 800;
  line-height: 36px;
}

.section-title::after {
  position: absolute;
  background: url("../../../assets/images/front-pages/icons/section-title-icon.png") no-repeat left bottom;
  background-size: contain;
  block-size: 100%;
  content: "";
  font-weight: 800;
  inline-size: 120%;
  inset-block-end: 12%;
  inset-inline-start: -12%;
}

.bw-img {
  filter: grayscale(1);
  transition: filter 0.3s;
}

.team-card:hover .bw-img {
  filter: grayscale(0);
}
</style>
