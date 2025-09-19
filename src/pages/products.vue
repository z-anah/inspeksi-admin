<template>
  <NavBar active-id="Produk" />
  <div class="max-w-5xl mx-auto py-8 px-4 mt-16">
    <h1 class="text-3xl font-bold mb-6 text-center">Produk Kami</h1>
    <VAlert v-if="errorMsg" type="error" class="mb-4">{{ errorMsg }}</VAlert>
    <VRow class="mb-10" dense>
      <VCol v-for="product in products" :key="product.id" sm="6" cols="12">
        <VCard>
          <div class="d-flex justify-space-between flex-wrap flex-md-nowrap flex-column flex-md-row">
            <div class="ma-auto pa-5">
              <VImg width="137" height="176" :src="product.primary_image" alt="Product image" class="rounded" />
            </div>

            <VDivider :vertical="$vuetify.display.mdAndUp" />

            <div class="flex-grow-1">
              <VCardItem>
                <VCardTitle>{{ product.name }}</VCardTitle>
              </VCardItem>

              <VCardText>
                {{ product.description }}
              </VCardText>

              <VCardText class="text-subtitle-1">
                <span>Harga: </span>
                <span class="font-weight-medium">Rp {{ product.price.toLocaleString() }}</span>
              </VCardText>
              <VCardText class="text-subtitle-1">
                <span class="text-xs text-gray-400">Stok: {{ product.stock }}</span>
              </VCardText>

              <VCardActions class="justify-space-between flex-col md:flex-row gap-2 md:gap-0">
                <div class="flex items-center gap-2 w-full md:w-auto">
                  <VTextField v-model.number="quantities[product.id]" type="number" min="1" :max="product.stock"
                    density="compact" hide-details style="width: 90px" :disabled="product.stock === 0" label="Jumlah"
                    class="bg-gray-50 rounded" />
                </div>
                <div class="flex flex-col items-end md:items-center md:flex-row gap-1 md:gap-4 w-full md:w-auto">
                  <VBtn color="primary" size="small" class="font-semibold"
                    :disabled="product.stock === 0 || !quantities[product.id] || quantities[product.id] < 1"
                    @click="addToCart(product)" style="min-width: 160px" variant="tonal">
                    <VIcon icon="tabler-shopping-cart-plus" />
                    <span class="ms-2">Tambah ke keranjang</span>
                  </VBtn>
                </div>
              </VCardActions>
            </div>
          </div>
        </VCard>
      </VCol>
    </VRow>

    <!-- Cart Section -->
    <div v-if="cart.length" class="mb-10">
      <h2 class="text-xl font-bold mb-4">Keranjang Anda</h2>
      <div class="border rounded">
        <template v-for="(item, index) in cart" :key="item.id">
          <div class="d-flex align-center gap-4 pa-6 position-relative flex-column flex-sm-row"
            :class="index ? 'border-t' : ''">
            <VBtn icon @click="removeFromCart(item.id)" title="Delete" color="error" variant="tonal">
              <VIcon icon="tabler-trash" />
            </VBtn>

            <div>
              <VImg width="140" height="100" :src="item.primary_image" alt="Product image" class="rounded" />
            </div>

            <div class="d-flex w-100 flex-column flex-md-row">
              <div class="d-flex flex-column gap-y-2">
                <h6 class="text-h6">
                  {{ item.name }}
                </h6>
                <div class="d-flex align-center text-no-wrap gap-4 text-body-1">
                  <div class="text-disabled">
                    Stok:
                    <span class="d-inline-block text-primary">{{ item.stock }}</span>
                  </div>
                  <VChip :color="item.stock > 0 ? 'success' : 'error'" label size="small">
                    {{ item.stock > 0 ? 'Tersedia' : 'Habis' }}
                  </VChip>
                </div>
                <VTextField v-model.number="item.qty" type="number" min="1" :max="item.stock"
                  style="inline-size: 9.375rem;" density="compact" hide-details @change="updateCart(item)" />
              </div>

              <VSpacer />

              <div class="d-flex flex-column mt-5 text-start text-md-end gap-2">
                <div class="d-flex text-base align-self-md-end gap-2">
                  <div class="text-primary font-bold">
                    Rp {{ item.price.toLocaleString() }}
                  </div>
                </div>
                <!-- Wishlist button placeholder -->
                <!--
                <div>
                  <VBtn variant="tonal" size="small">
                    move to wishlist
                  </VBtn>
                </div>
                -->
              </div>
            </div>
          </div>
        </template>
      </div>
      <div class="flex justify-end items-center gap-4 mt-4">
        <div class="font-bold text-lg">Total: Rp {{ cartTotal.toLocaleString() }}</div>
        <VBtn color="success" size="large" @click="sendWhatsAppOrder" variant="tonal">
          Pesan lewat WhatsApp
        </VBtn>
      </div>
    </div>
    <div v-else class="text-center text-gray-400">Keranjang Anda kosong.</div>
  </div>
</template>

<script setup>
import { supabase } from '@/libs/supabase'
import NavBar from '@/views/front-pages/front-page-navbar.vue'
import { onMounted, ref } from 'vue'

definePage({
  meta: {
    layout: false, // keep admin drawer hidden
    public: true,
  },
})

const products = ref([])
const errorMsg = ref('')
const quantities = ref({})
const cart = ref([])
const whatsappNumber = ref('')

// Fetch products with stock > 0
const fetchProducts = async () => {
  errorMsg.value = ''
  const { data, error } = await supabase
    .from('products')
    .select('*, product_images(image_url, is_primary)')
    .gt('stock', 0)
    .order('created_at', { ascending: false })
  if (error) {
    errorMsg.value = error.message
    return
  }
  // Attach primary image
  products.value = data.map(p => ({
    ...p,
    primary_image: p.product_images?.find(img => img.is_primary)?.image_url
      || p.product_images?.[0]?.image_url
      || null,
  }))
}

// Fetch WhatsApp number from Supabase
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

const addToCart = (product) => {
  const qty = Number(quantities.value[product.id]) || 1
  if (qty < 1 || qty > product.stock) return
  const idx = cart.value.findIndex(i => i.id === product.id)
  if (idx !== -1) {
    // Update qty, but not above stock
    cart.value[idx].qty = Math.min(cart.value[idx].qty + qty, product.stock)
  } else {
    cart.value.push({
      id: product.id,
      name: product.name,
      price: product.price,
      stock: product.stock,
      primary_image: product.primary_image,
      qty,
    })
  }
  quantities.value[product.id] = 1
  saveCart()
}

const updateCart = (item) => {
  if (item.qty < 1) item.qty = 1
  if (item.qty > item.stock) item.qty = item.stock
  saveCart()
}

const removeFromCart = (id) => {
  cart.value = cart.value.filter(i => i.id !== id)
  saveCart()
}

const cartTotal = computed(() =>
  cart.value.reduce((sum, item) => sum + item.price * item.qty, 0)
)

const saveCart = () => {
  localStorage.setItem('front_cart', JSON.stringify(cart.value))
}
const loadCart = () => {
  const c = localStorage.getItem('front_cart')
  if (c) cart.value = JSON.parse(c)
}

const sendWhatsAppOrder = () => {
  if (!whatsappNumber.value) return
  let msg = `Hello, I would like to order:\n`
  cart.value.forEach(item => {
    msg += `- ${item.name} x${item.qty} (Rp ${item.price.toLocaleString()} each)\n`
  })
  msg += `Total: Rp ${cartTotal.value.toLocaleString()}\n`
  msg += `\nPlease contact me for further details.`
  const url = `https://wa.me/${whatsappNumber.value}?text=${encodeURIComponent(msg)}`
  window.open(url, '_blank')
}

onMounted(() => {
  fetchProducts()
  loadCart()
  fetchWhatsAppNumber()
})
</script>
