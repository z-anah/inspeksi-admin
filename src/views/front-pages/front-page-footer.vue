<script setup>
import { supabase } from '@/libs/supabase'
import { VNodeRenderer } from '@layouts/components/VNodeRenderer'
import { themeConfig } from '@themeConfig'
import { onMounted, ref } from 'vue'


const pagesList = [
]

const demoList = [
]

// WhatsApp number from Supabase
const whatsappNumber = ref('')

const fetchWhatsAppNumber = async () => {
  const { data, error } = await supabase
    .from('content')
    .select('value')
    .eq('section', 'contact')
    .eq('key', 'wa')
    .single()
  if (!error && data) {
    whatsappNumber.value = data.value
  }
}

onMounted(fetchWhatsAppNumber)
</script>

<template>
  <div class="footer">
    <VContainer>
      <VRow>
        <!-- 👉 Footer  -->
        <VCol cols="12" md="5">
          <div class="mb-4" :class="$vuetify.display.smAndDown ? 'w-100' : 'w-75'">
            <div class="app-logo mb-6">
              <VNodeRenderer :nodes="themeConfig.app.logo" />
              <h1 class="app-logo-title text-white">
                {{ themeConfig.app.title }}
              </h1>
            </div>

            <div class="mb-6" :class="[$vuetify.theme.current.dark ? 'text-body-1' : 'text-primary']">
              Situs Resmi Insan <br>Pengadaan Antikorupsi <br>{{ whatsappNumber || '+' }}
            </div>
          </div>
        </VCol>

        <!-- 👉 Demos -->
        <VCol md="2" sm="4" xs="6">
          <div class="footer-links">
            <h6 class="footer-title text-h6 mb-6">
              Demos
            </h6>
            <ul style="list-style: none;">
              <li v-for="(item, index) in demoList" :key="index" class="mb-4">
                <a :href="item.to" target="_blank" rel="noopener noreferrer"
                  :class="$vuetify.theme.current.dark ? 'text-body-1' : 'text-white-variant'">
                  {{ item.title }}
                </a>
              </li>
            </ul>
          </div>
        </VCol>

        <!-- 👉 Pages  -->
        <VCol md="2" sm="4" xs="6">
          <div class="footer-links">
            <h6 class="footer-title text-h6 mb-6">
              Pages
            </h6>
            <ul style="list-style: none;">
              <li v-for="(item, index) in pagesList" :key="index" class="mb-4">
                <RouterLink :class="$vuetify.theme.current.dark ? 'text-body-1' : 'text-white-variant'" class="me-2"
                  :to="item.to">
                  {{ item.name }}
                </RouterLink>
                <template v-if="item.isNew">
                  <VChip color="primary" variant="elevated" label size="small">
                    New
                  </VChip>
                </template>
              </li>
            </ul>
          </div>
        </VCol>

        <!-- 👉 Download App -->
        <VCol cols="12" md="3" sm="4">
          <div>
            <h6 class="footer-title text-h6 mb-6">
              Download our app
            </h6>

            <div>
              <VBtn v-for="(item, index) in [
                { icon: 'tabler-trophy', store: 'Mendukung' },
                { icon: 'tabler-crown', store: 'Berani Melawan' },
              ]" :key="index" color="#282c3e" height="56" class="mb-4 d-block">
                <template #default>
                  <div class="d-flex align-center gap-x-8 footer-logo-buttons">
                    <VIcon :icon="item.icon" size="34" />
                    <div class="d-flex flex-column justify-content-start">
                      <div :class="$vuetify.theme.current.dark ? 'text-body-2' : 'text-white-variant text-body-2'">
                        Bersama, Kita Saling
                      </div>
                      <h6 class="text-h6 text-start"
                        :class="$vuetify.theme.current.dark ? 'text-body-1' : 'footer-title'">
                        {{ item.store }}
                      </h6>
                    </div>
                  </div>
                </template>
              </VBtn>
            </div>
          </div>
        </VCol>
      </VRow>
    </VContainer>

    <!-- 👉 Footer Line -->
    <div class="footer-line w-100">
      <VContainer>
        <div class="d-flex justify-space-between flex-wrap gap-y-5 align-center">
          <div class="text-body-1 text-white-variant text-wrap me-4">
            &copy;

            {{ new Date().getFullYear() }}
            Inspeksi
          </div>
        </div>
      </VContainer>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.footer-title {
  color: rgba(255, 255, 255, 92%);
}

.footer-top {
  border-radius: 60px 60px 0 0;
  background-size: cover;
  color: #fff;
}

.footer-links {

  .text-white-variant,
  .text-body-1 {
    &:hover {
      color: #fff;
    }
  }
}

.footer-line {
  background: #000;
}
</style>

<style lang="scss">
.subscribe-form {
  .v-label {
    color: rgba(225, 222, 245, 90%) !important;
  }

  .v-field {
    border-end-end-radius: 0;
    border-end-start-radius: 10px;
    border-start-end-radius: 0;
    border-start-start-radius: 10px;

    input.v-field__input::placeholder {
      color: rgba(225, 222, 245, 40%) !important;
    }

    input.v-field__input {
      color: rgba(255, 255, 255, 78%);
    }
  }
}

.footer {
  border-radius: 50%;

  @media (min-width: 600px) and (max-width: 960px) {
    .v-container {
      padding-inline: 2rem !important;
    }

    .footer-logo-buttons {
      gap: 0.75rem;
    }
  }
}
</style>
