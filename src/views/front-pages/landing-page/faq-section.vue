<script setup>
import { supabase } from '@/libs/supabase'
import faqImg from '@images/front-pages/landing-page/faq.png'
import { onMounted, ref } from 'vue'

const faqData = ref([])

const fetchFaqs = async () => {
  const { data, error } = await supabase
    .from('faqs')
    .select('question, answer')
    .order('created_at', { ascending: false })
  if (!error && data) {
    faqData.value = data
  }
}

onMounted(fetchFaqs)
</script>

<template>
  <div id="faq">
    <VContainer>
      <!-- 👉 Header  -->
      <div class="faq-section">
        <div class="headers d-flex justify-center flex-column align-center">
          <VChip label color="primary" size="small" class="mb-4">
            FAQ
          </VChip>
          <h4 class="d-flex align-center text-h4 mb-1 flex-wrap justify-center">
            Pertanyaan yang
            <div class="position-relative ms-2">
              <div class="section-title">
                Sering Diajukan
              </div>
            </div>
          </h4>
          <p class="text-body-1 mb-0">
            Jelajahi FAQ berikut untuk menemukan jawaban.
          </p>
        </div>
        <VRow>
          <VCol cols="12" md="5">
            <div class="pt-10 d-flex align-center justify-center h-100">
              <VImg :src="faqImg" height="330" max-width="330" />
            </div>
          </VCol>
          <VCol cols="12" md="7">
            <VExpansionPanels class="pt-16">
              <VExpansionPanel v-for="faq in faqData" :key="faq.question">
                <VExpansionPanelTitle>
                  {{ faq.question }}
                </VExpansionPanelTitle>
                <VExpansionPanelText>
                  {{ faq.answer }}
                </VExpansionPanelText>
              </VExpansionPanel>
            </VExpansionPanels>
          </VCol>
        </VRow>
      </div>
    </VContainer>
  </div>
</template>

<style lang="scss" scoped>
.faq-section {
  margin-block: 5.25rem;
}

@media (max-width: 600px) {
  .faq-section {
    margin-block: 4rem;
  }
}

#faq {
  border-radius: 3.75rem 3.75rem 0 0;
  background-color: rgba(var(--v-theme-background));
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
  inline-size: 130%;
  inset-block-end: 12%;
  inset-inline-start: -12%;
}
</style>
