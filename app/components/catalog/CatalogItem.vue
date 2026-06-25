<template>
  <div class="col-sm-6 col-lg-4 text-center item mb-4">
    <NuxtLink :to="`/catalog/${item.id}`">
      <img src="/images/no-image.png" alt="Image" class="product-item-image">
    </NuxtLink>
    <h3 class="text-dark">
      <a href="shop-single.html">
        {{ item.name }}
      </a>
    </h3>
    <p class="price">
      {{ item.price }} ₽
    </p>
  </div>
</template>

<script setup>
defineProps({
  item: {
    type: Object,
    required: true,
  },
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

.product-item-image{
  width: 100%;
}
</style>