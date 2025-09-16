<script setup>
import { supabase } from '@/libs/supabase'
import { onMounted, ref } from 'vue'

const hero = ref({})

onMounted(async () => {
  const { data, error } = await supabase
    .from('content')
    .select('key, value')
    .eq('section', 'hero')

  if (error) console.error(error)
  else {
    console.log(data);

    hero.value = Object.fromEntries(data.map(row => [row.key, row.value]))
  }
})
</script>

<template>
  <div class="hero">
    <h1>{{ hero.title }}</h1>
    <p>{{ hero.description }}</p>
  </div>
</template>
