<template>
  <div class="p-6">
    <div class="mb-8">
      <VCard flat
        class="py-6 px-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4 shadow-none border-b border-gray-200">
        <div>
          <h2 class="text-2xl font-bold mb-1">Product Management</h2>
          <p class="text-gray-500 text-base">
            Manage your products and inventory.
          </p>
        </div>
        <VBtn color="primary" class="mt-4 md:mt-0" @click="openCreate" size="large" prepend-icon="tabler-plus">
          Add Product
        </VBtn>
      </VCard>
    </div>

    <VAlert v-if="errorMsg" type="error" class="mb-4">
      {{ errorMsg }}
    </VAlert>

    <VDataTable :items="productList" :loading="loading" class="rounded-lg shadow" :headers="[
      { title: 'Name', key: 'name' },
      { title: 'Description', key: 'description' },
      { title: 'Price', key: 'price' },
      { title: 'Stock', key: 'stock' },
      { title: 'Created', key: 'created_at' },
      { title: 'Actions', key: 'actions', sortable: false },
    ]" item-value="id" density="comfortable">
      <template #item.created_at="{ item }">
        <span class="text-xs text-gray-500">{{ new Date(item.created_at).toLocaleString() }}</span>
      </template>
      <template #item.actions="{ item }">
        <VBtn icon variant="text" color="primary" @click="openEdit(item)">
          <VIcon icon="tabler-edit" />
        </VBtn>
        <VBtn icon variant="text" color="error" @click="openDelete(item.id)">
          <VIcon icon="tabler-trash" />
        </VBtn>
      </template>
      <template #no-data>
        <div class="text-center text-gray-400 py-8">No products.</div>
      </template>
    </VDataTable>

    <!-- Create/Edit Dialog -->
    <VDialog v-model="dialog" max-width="600">
      <VCard>
        <VCardTitle>
          {{ isEdit ? 'Edit Product' : 'Add Product' }}
        </VCardTitle>
        <VCardText>
          <VForm @submit.prevent="saveProduct">
            <VTextField v-model="form.name" label="Name" required class="mb-4" />
            <VTextarea v-model="form.description" label="Description" rows="2" class="mb-4" />
            <VTextField v-model="form.price" label="Price" type="number" min="0" step="0.01" required class="mb-4" />
            <VTextField v-model="form.stock" label="Stock" type="number" min="0" required class="mb-4" />
          </VForm>
          <!-- Product Images Management -->
          <div v-if="isEdit" class="mt-8">
            <h3 class="font-semibold mb-2">Product Images</h3>
            <div class="flex flex-wrap gap-4 mb-4">
              <div v-for="img in images" :key="img.id"
                class="relative w-28 h-28 border rounded overflow-hidden flex flex-col items-center justify-center mb-4">
                <VImg :src="img.image_url" alt="Product image" height="100" />
                <VBtn icon size="x-small" color="error" class="absolute top-1 right-1" @click="deleteImage(img.id)"
                  title="Delete">
                  <VIcon icon="tabler-trash" />
                </VBtn>
                <VBtn v-if="!img.is_primary" icon size="x-small" color="primary" class="absolute bottom-1 left-1"
                  @click="setPrimary(img.id)" title="Set as primary">
                  <VIcon icon="tabler-star" />
                </VBtn>
                <span v-if="img.is_primary"
                  class="absolute bottom-1 left-1 bg-primary text-white text-xs px-2 py-0.5 rounded">Primary</span>
              </div>
              <label
                class="w-28 h-28 border-dashed border-2 border-gray-300 rounded flex flex-col items-center justify-center cursor-pointer hover:border-primary">
                <VIcon icon="tabler-plus" size="32" class="text-gray-400" />
                <input type="file" accept="image/*" class="hidden" @change="onImageSelected" />
              </label>
            </div>
            <VProgressLinear v-if="uploading" indeterminate color="primary" class="mb-2" />
            <VAlert v-if="imgError" type="error" class="mb-2">{{ imgError }}</VAlert>
          </div>
        </VCardText>
        <VCardActions>
          <VSpacer />
          <VBtn text @click="dialog = false">Cancel</VBtn>
          <VBtn color="primary" :loading="loading" @click="saveProduct">
            Save
          </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>

    <!-- Delete Confirmation Dialog -->
    <VDialog v-model="deleteDialog" max-width="400">
      <VCard>
        <VCardTitle>Delete Product?</VCardTitle>
        <VCardText>
          Are you sure you want to delete this product?
        </VCardText>
        <VCardActions>
          <VSpacer />
          <VBtn text @click="deleteDialog = false">Cancel</VBtn>
          <VBtn color="error" :loading="loading" @click="deleteProduct">
            Delete
          </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>
  </div>
</template>

<script setup>
import { supabase } from '@/libs/supabase'
import { onMounted, reactive, ref } from 'vue'

definePage({
  meta: {
    public: false,
  },
})

const loading = ref(false)
const errorMsg = ref('')
const productList = ref([])
const dialog = ref(false)
const deleteDialog = ref(false)
const isEdit = ref(false)
const form = reactive({
  id: null,
  name: '',
  description: '',
  price: '',
  stock: '',
})
const deleteId = ref(null)
const images = ref([])
const uploading = ref(false)
const imgError = ref('')

const fetchProducts = async () => {
  loading.value = true
  errorMsg.value = ''
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) errorMsg.value = error.message
  else productList.value = data
  loading.value = false
}

const fetchImages = async (productId) => {
  if (!productId) return
  const { data, error } = await supabase
    .from('product_images')
    .select('*')
    .eq('product_id', productId)
    .order('is_primary', { ascending: false })
    .order('id', { ascending: true })
  if (!error) images.value = data
}

const openCreate = () => {
  isEdit.value = false
  Object.assign(form, { id: null, name: '', description: '', price: '', stock: '' })
  dialog.value = true
  images.value = []
  imgError.value = ''
}

const openEdit = (row) => {
  isEdit.value = true
  Object.assign(form, row)
  dialog.value = true
  fetchImages(row.id)
}

const saveProduct = async () => {
  if (!form.name || !form.price || !form.stock) {
    errorMsg.value = 'Name, Price, and Stock are required'
    return
  }
  loading.value = true
  errorMsg.value = ''
  let result
  if (isEdit.value) {
    result = await supabase
      .from('products')
      .update({
        name: form.name,
        description: form.description,
        price: form.price,
        stock: form.stock,
      })
      .eq('id', form.id)
      .select()
  } else {
    result = await supabase
      .from('products')
      .insert([{
        name: form.name,
        description: form.description,
        price: form.price,
        stock: form.stock,
      }])
      .select()
  }
  if (result.error) errorMsg.value = result.error.message
  else {
    dialog.value = false
    fetchProducts()
  }
  loading.value = false
}

const openDelete = (id) => {
  deleteId.value = id
  deleteDialog.value = true
}

const deleteProduct = async () => {
  loading.value = true
  errorMsg.value = ''
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', deleteId.value)
  if (error) errorMsg.value = error.message
  deleteDialog.value = false
  fetchProducts()
  loading.value = false
}

const onImageSelected = async (e) => {
  imgError.value = ''
  const file = e.target.files[0]
  if (!file) return
  if (!file.type.startsWith('image/')) {
    imgError.value = 'Only image files are allowed.'
    return
  }
  if (file.size > 2 * 1024 * 1024) {
    imgError.value = 'Image must be less than 2MB.'
    return
  }
  uploading.value = true
  // Use a unique filename
  const ext = file.name.split('.').pop()
  const filename = `product_${form.id}_${Date.now()}.${ext}`
  // Upload to Supabase Storage (bucket: 'product-images')
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('product-images')
    .upload(filename, file)
  if (uploadError) {
    imgError.value = uploadError.message
    uploading.value = false
    return
  }
  // Get public URL
  const { data: publicUrlData } = supabase.storage
    .from('product-images')
    .getPublicUrl(filename)
  const imageUrl = publicUrlData?.publicUrl
  // Insert into product_images table
  const { error: insertError } = await supabase
    .from('product_images')
    .insert([{ product_id: form.id, image_url: imageUrl }])
  if (insertError) imgError.value = insertError.message
  await fetchImages(form.id)
  uploading.value = false
}

const deleteImage = async (imgId) => {
  imgError.value = ''
  const { error } = await supabase
    .from('product_images')
    .delete()
    .eq('id', imgId)
  if (error) imgError.value = error.message
  await fetchImages(form.id)
}

const setPrimary = async (imgId) => {
  imgError.value = ''
  // Set all images is_primary=false, then set selected is_primary=true
  const { error: clearError } = await supabase
    .from('product_images')
    .update({ is_primary: false })
    .eq('product_id', form.id)
  if (clearError) {
    imgError.value = clearError.message
    return
  }
  const { error: setError } = await supabase
    .from('product_images')
    .update({ is_primary: true })
    .eq('id', imgId)
  if (setError) imgError.value = setError.message
  await fetchImages(form.id)
}

onMounted(fetchProducts)
</script>
