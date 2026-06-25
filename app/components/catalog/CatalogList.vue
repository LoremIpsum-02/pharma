<template>
  <div v-if="title" class="row">
    <div class="title-section text-center col-12">
      <h2 class="text-uppercase">
        {{ title }}
      </h2>
    </div>
  </div>

  <div class="row">
    <CatalogItem v-for="item in displayedItems" :key="item.id" :item="item" />
  </div>
</template>

<script setup>
const props = defineProps({
  list: {
    type: Array,
    required: true,
  },

  title: {
    type: String,
    default: null,
  },

  listLimit: {
    type: Number,
    default: null,
  },
})

const displayedItems = computed(() => {
  if (props.listLimit > 0) {
    return props.list.slice(0, props.listLimit)
  }
  return props.list
})
</script>

<style lang="scss" scoped>
@import "~/assets/css/bootstrap.min.css";
@import "~/assets/css/magnific-popup.css";
@import "~/assets/css/owl.carousel.min.css";
@import "~/assets/css/owl.theme.default.min.css";
@import "~/assets/css/style.css";
@import "~/assets/css/bootstrap/bootstrap-grid.css";
@import "~/assets/css/bootstrap/bootstrap.css";
@import "~/assets/css/bootstrap/bootstrap-reboot.css";
</style>