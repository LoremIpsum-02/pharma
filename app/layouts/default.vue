<template>
  <div>
    <div class="site-navbar py-2">
      <div class="container">
        <div class="d-flex align-items-center justify-content-between">
          <div class="logo">
            <div class="site-logo">
              <NuxtLink to="/" class="js-logo-clone">Фарма</NuxtLink>
            </div>
          </div>
          <div class="main-nav d-none d-lg-block">
            <nav class="site-navigation text-right text-md-center" role="navigation">
              <ul class="site-menu js-clone-nav d-none d-lg-block">
                <li v-for="link in headerLinks" :key="link.name" :class="route.path == link.path ? 'active' : null">
                  <NuxtLink :to="link.path">
                    {{ link.name }}
                  </NuxtLink>
                </li>
              </ul>
            </nav>
          </div>

          <div class="buttons-wrapper">
            <!-- Динамические ссылки в зависимости от авторизации -->
            <div class="d-flex align-items-center gap-2">
              <template v-if="user">
                <NuxtLink to="/profile" class="btn btn-primary btn-sm">
                  <i class="bi bi-person"></i> Профиль
                </NuxtLink>
                <NuxtLink v-if="user.role === 'Администратор'" to="/admin" class="btn btn-secondary btn-sm">
                  Админ-панель
                </NuxtLink>
                <button @click="logout" class="btn btn-danger btn-sm">Выйти</button>
              </template>

              <template v-else>
                <NuxtLink to="/login" class="btn btn-primary btn-sm">
                  Авторизация
                </NuxtLink>
              </template>
            </div>
          </div>
        </div>
      </div>

      <slot />
    </div>
  </div>
</template>

<script setup>
const headerLinks = [
  {
    path: "/",
    name: "Главная",
  },
  {
    path: "/catalog",
    name: "Каталог",
  },
]

const route = useRoute()

const { user, fetchUser } = useUser();

const logout = async () => {
  await $fetch('/api/auth/logout', { method: 'POST' });
  user.value = null;
  navigateTo('/');
};

onMounted(() => {
  if (!user.value) fetchUser();
});
</script>

<style scoped>
@import "~/assets/css/bootstrap.min.css";
@import "~/assets/css/magnific-popup.css";
@import "~/assets/css/owl.carousel.min.css";
@import "~/assets/css/owl.theme.default.min.css";
@import "~/assets/css/style.css";
@import "~/assets/css/bootstrap/bootstrap-grid.css";
@import "~/assets/css/bootstrap/bootstrap.css";
@import "~/assets/css/bootstrap/bootstrap-reboot.css";
</style>