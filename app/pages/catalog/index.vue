<template>
  <CatalogList :list="productsStore.productsList" />
</template>

<script setup>
const productsStore = useProductsStore()
</script>

<style lang="scss" scoped>

</style>