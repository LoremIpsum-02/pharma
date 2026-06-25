<template>
  <div>
    <div class="site-blocks-cover" style="background-image: url('/images/hero_1.jpg');">
      <div class="container">
        <div class="row">
          <div class="col-lg-7 mx-auto order-lg-2 align-self-center">
            <div class="site-block-cover-content text-center">
              <h2 class="sub-title">Поставки каждый день</h2>
              <h1>Добро пожаловать в Фарма</h1>
              <p>
                <NuxtLink to="/catalog" class="btn btn-primary px-5 py-3">КАТАЛОГ</NuxtLink>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="site-section">
      <div class="container">
        <div class="row align-items-stretch section-overlap">
          <div class="col-md-6 col-lg-4 mb-4 mb-lg-0">
            <div class="banner-wrap bg-primary h-100">
              <a href="#" class="h-100">
                <h5>Бесплатная <br> доставка</h5>
              </a>
            </div>
          </div>
          <div class="col-md-6 col-lg-4 mb-4 mb-lg-0">
            <div class="banner-wrap h-100">
              <a href="#" class="h-100">
                <h5>Сезонные <br> скидки до 50%</h5>
              </a>
            </div>
          </div>
          <div class="col-md-6 col-lg-4 mb-4 mb-lg-0">
            <div class="banner-wrap bg-warning h-100">
              <a href="#" class="h-100">
                <h5>Оформите <br> бонусную карту</h5>
              </a>
            </div>
          </div>
        </div>

        <!-- Слайдер -->
        <div class="container mt-3">
          <swiper :modules="[Autoplay]" :slides-per-view="1" :loop="true" :autoplay="{ delay: 3000 }" class="mySwiper">
            <swiper-slide v-for="(img, i) in slides" :key="i">
              <img :src="img" class="w-100" style="height: 400px; object-fit: cover;" />
            </swiper-slide>
          </swiper>
        </div>

      </div>
    </div>

    <div class="site-section">
      <div class="container">
        <CatalogList :list="productsStore.productsList" :list-limit="6" title="Популярные продукты" />

        <div class="row mt-5">
          <div class="col-12 text-center">
            <NuxtLink to="/catalog" class="btn btn-primary px-4 py-3">ВЕСЬ КАТАЛОГ</NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';

const slides = [
  '/images/slide1.jpg',
  '/images/slide2.jpg',
  '/images/slide3.jpg',
  '/images/slide4.jpg'
];

const productsStore = useProductsStore()
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