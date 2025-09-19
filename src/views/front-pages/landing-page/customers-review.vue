<script setup>
import { supabase } from '@/libs/supabase'
import { register } from 'swiper/element/bundle'
import { onMounted, ref } from 'vue'

register()

const brandLogos = ref([])

const fetchPartners = async () => {
  const { data, error } = await supabase
    .from('partners')
    .select('logo_url')
    .order('created_at', { ascending: false })
  if (!error && data) {
    brandLogos.value = data.map(item => item.logo_url).filter(Boolean)
  }
}

const reviewData = ref([])

const fetchTestimonials = async () => {
  const { data, error } = await supabase
    .from('testimonials')
    .select('text, author, location')
    .order('created_at', { ascending: false })
  if (!error && data) {
    reviewData.value = data.map(item => ({
      desc: item.text,
      rating: 5,
      name: item.author,
      position: item.location,
      avatar: "https://api.dicebear.com/9.x/notionists/svg?randomizeIds=false",
    }))
  }
}

onMounted(() => {
  fetchTestimonials()
  fetchPartners()
})

const customerReviewSwiper = ref(null)

const slide = dir => {
  const swiper = customerReviewSwiper.value?.swiper
  if (dir === 'prev')
    swiper.slidePrev()
  swiper.slideNext()
}
</script>

<template>
  <div id="customer-review" class="position-relative">
    <div class="customer-reviews">
      <VContainer>
        <!-- 👉 Headers  -->
        <VRow>
          <VCol cols="12" md="3">
            <div class="headers d-flex justify-center flex-column align-start h-100" style="max-inline-size: 275px;">
              <VChip label color="primary" class="mb-4" size="small">
                Ulasan
              </VChip>
              <div class="position-relative mb-1 me-2">
                <div class="section-title">
                  Apa Kata Mereka
                </div>
              </div>
              <p class="text-body-1 mb-12">
                Temukan cerita mereka.
              </p>
              <div class="position-relative">
                <IconBtn class="reviews-button-prev rounded me-4" variant="tonal" color="primary"
                  @click="slide('prev')">
                  <VIcon icon="tabler-chevron-left" class="flip-in-rtl" />
                </IconBtn>

                <IconBtn class="reviews-button-next rounded" variant="tonal" color="primary" @click="slide('next')">
                  <VIcon icon="tabler-chevron-right" class="flip-in-rtl" />
                </IconBtn>
              </div>
            </div>
          </VCol>

          <VCol cols="12" md="9">
            <!-- 👉 Customer Review Swiper -->
            <div class="swiper-reviews-carousel">
              <!-- eslint-disable vue/attribute-hyphenation -->
              <swiper-container ref="customerReviewSwiper" slides-per-view="1" space-between="20" loop="true"
                autoplay-delay="3000" autoplay-disable-on-interaction="false" events-prefix="swiper-" :injectStyles="[
                  `
                    .swiper{
                      padding-block: 12px;
                      padding-inline: 12px;
                      margin-inline: -12px;
                    }
                    .swiper-button-next, .swiper-button-prev{
                      visibility: hidden;
                    }
                  `,
                ]" navigation="{
                  nextEl: '.swiper-button-next',
                  prevEl: '.swiper-button-prev',
                }" :breakpoints="{
                  1280: {
                    slidesPerView: 3,
                    spaceBetween: 20,
                  },
                  960: {
                    slidesPerView: 2,
                    spaceBetween: 20,
                  },
                  600: {
                    slidesPerView: 2,
                    spaceBetween: 20,
                  },
                }">
                <swiper-slide v-for="(data, index) in reviewData" :key="index">
                  <VCard class="d-flex h-100 align-stretch">
                    <VCardText class="pa-6 d-flex flex-column justify-space-between align-start">
                      <p class="text-body-1">
                        {{ data.desc }}
                      </p>

                      <div class="d-flex align-center gap-x-3">
                        <VIcon icon="tabler-user" size="32" class="bw-avatar" />
                        <div>
                          <h6 class="text-h6">
                            {{ data.name }}
                          </h6>
                          <div class="text-body-2 text-disabled">
                            {{ data.position }}
                          </div>
                        </div>
                      </div>
                    </VCardText>
                  </VCard>
                </swiper-slide>
              </swiper-container>
            </div>
          </VCol>
        </VRow>
      </VContainer>

      <VDivider class="w-100 swiper-divider" />

      <VContainer>
        <!-- 👉 Brand-logo Swiper  -->
        <div class="swiper-brands-carousel">
          <swiper-container slides-per-view="2" :space-between="10" events-prefix="swiper-" :autoplay="{
            delay: 3000,
            disableOnInteraction: true,
          }" :breakpoints="{
            992: {
              slidesPerView: 5,
            },
            768: {
              slidesPerView: 3,
            },
          }">
            <swiper-slide v-for="(logo, index) in brandLogos" :key="index">
              <VImg :src="logo" height="38" class="bw-avatar" />
            </swiper-slide>
          </swiper-container>
        </div>
      </VContainer>
    </div>
  </div>
</template>

<style lang="scss">
@use "swiper/css/bundle";

swiper-container::part(bullet-active) {
  border-radius: 6px;
  background-color: rgba(var(--v-theme-on-background), var(--v-disabled-opacity));
  inline-size: 38px;
}

swiper-container::part(bullet) {
  background-color: rgba(var(--v-theme-on-background));
}

.swiper-divider {
  margin-block: 72px 1rem;
}

.swiper-reviews-carousel {
  swiper-container {
    .swiper {
      padding-block-end: 3rem;
    }

    .swiper-button-next {
      display: none;
    }
  }

  swiper-slide {
    block-size: auto;
    opacity: 1;
  }
}
</style>

<style lang="scss" scoped>
.customer-reviews {
  padding-block: 72px 84px;
}

@media (max-width: 600px) {
  .customer-reviews {
    padding-block: 4rem;
  }
}

#customer-review {
  border-radius: 3.75rem 3.75rem 0 0;
  background-color: rgb(var(--v-theme-background));
}

.section-title {
  font-size: 24px;
  font-weight: 800;
  line-height: 36px;
}

.section-title::after {
  position: absolute;
  background: url("../../../assets/images/front-pages/icons/section-title-icon.png") no-repeat left bottom/contain;
  background-size: contain;
  block-size: 100%;
  content: "";
  font-weight: 800;
  inline-size: 120%;
  inset-block-end: 0;
  inset-inline-start: -12%;
}

.bw-avatar {
  filter: grayscale(1);
  transition: filter 0.3s;
}

.bw-avatar:hover {
  filter: grayscale(0) !important;
}

.v-card:hover .bw-avatar,
.swiper-slide:hover .bw-avatar {
  filter: grayscale(0);
}
</style>
