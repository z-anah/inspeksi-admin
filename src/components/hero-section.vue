<template>
  <div class="misc-wrapper">
    <div class="text-center mb-15">
      <!-- 👉 Title and subtitle -->
      <h4 class="text-h4 font-weight-medium mb-2">
        {{ heroTitle }}
      </h4>
      <p class="text-body-1 mb-6">
        {{ heroSubtitle }}
      </p>

      <VBtn
        color="primary"
        class="px-8 py-3 rounded-pill font-weight-semibold"
        to="#"
      >
        Get Started
      </VBtn>
    </div>

    <!-- 👉 Hero Image -->
    <div class="misc-avatar w-100 text-center">
      <VImg
        :src="heroShieldArch"
        alt="Hero Shield Arch"
        :max-width="400"
        :min-height="240"
        class="mx-auto"
      />
    </div>

    <img
      class="misc-footer-img d-none d-md-block"
      :src="authThemeMask"
      alt="misc-footer-img"
      height="320"
    />
  </div>
</template>

<script setup>
import { useGenerateImageVariant } from '@core/composable/useGenerateImageVariant'
import heroShieldArch from '@images/front-pages/landing-page/hero-shield-arch.png'
import miscMaskDark from '@images/pages/misc-mask-dark.png'
import miscMaskLight from '@images/pages/misc-mask-light.png'

const authThemeMask = useGenerateImageVariant(miscMaskLight, miscMaskDark)

const heroTitle = 'Situs Resmi Insan Pengadaan Antikorupsi'
const heroSubtitle = 'Bersama, Kita Saling Mendukung dan Berani Melawan Korupsi demi Integritas Pengadaan yang Lebih Baik.'

definePage?.({
  meta: {
    layout: 'blank',
    public: true,
  },
})
</script>

<style lang="scss" scoped>
@use "@core/scss/template/pages/misc.scss";
</style>
