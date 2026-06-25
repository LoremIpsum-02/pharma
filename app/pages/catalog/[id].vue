<template>
  <div v-if="product" class="site-section">
    <div class="container">
      <div class="row">
        <div class="col-md-5 mr-auto">
          <div class="border text-center">
            <img src="/images/no-image.png" alt="Image" class="img-fluid p-5">
          </div>
        </div>
        <div class="col-md-6">
          <h2 class="text-black">{{ product.name }}, {{ product.unit }}</h2>
          <p>{{ product.description }}</p>
          <p>
            <strong class="text-primary h4">{{ product.price }} ₽</strong>
          </p>

          <!-- Кнопка "Заказать" -->
          <NuxtLink :to="`/order/create?article=${product.article}`" class="btn btn-success btn-lg">
            Заказать
          </NuxtLink>

          <div class="mb-5 mt-3">
            <div class="input-group mb-3" style="max-width: 220px;">
              <div class="input-group-prepend">
                <button class="btn btn-outline-primary js-btn-minus" type="button">&minus;</button>
              </div>
              <input type="text" class="form-control text-center" value="1" placeholder="Количество"
                aria-label="Example text with button addon" aria-describedby="button-addon1">
              <div class="input-group-append">
                <button class="btn btn-outline-primary js-btn-plus" type="button">&plus;</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const route = useRoute()
const productId = route.params.id
const productsStore = useProductsStore()
const product = computed(() => productsStore.getSingleProduct(productId))
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