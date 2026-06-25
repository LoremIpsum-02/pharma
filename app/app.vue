<template>
  <UApp>
    <NuxtLoadingIndicator />

    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>

<script setup>
const productsStore = useProductsStore()
const { fetchUser } = useUser();

onMounted(() => {
  productsStore.fetchProducts()
  fetchUser()
})
</script>