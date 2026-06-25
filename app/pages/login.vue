<template>
  <div class="container py-5">
    <div class="row justify-content-center">
      <div class="col-md-6 col-lg-5">
        <div class="card shadow">
          <div class="card-body p-4">
            <h2 class="card-title text-center mb-4">Вход в систему</h2>

            <form @submit.prevent="onSubmit">
              <div class="mb-3">
                <label for="loginOrEmail" class="form-label">Логин или Email</label>
                <input id="loginOrEmail" v-model="state.loginOrEmail" type="text" class="form-control"
                  placeholder="Введите логин или email" required />
              </div>

              <div class="mb-3">
                <label for="password" class="form-label">Пароль</label>
                <input id="password" v-model="state.password" type="password" class="form-control"
                  placeholder="Введите пароль" required />
              </div>

              <div v-if="errorMessage" class="alert alert-danger">{{ errorMessage }}</div>

              <button type="submit" class="btn btn-primary w-100" :disabled="loading">
                {{ loading ? 'Загрузка...' : 'Войти' }}
              </button>
            </form>

            <p class="mt-3 text-center">
              Нет аккаунта? <NuxtLink to="/register" class="text-decoration-none">Зарегистрироваться</NuxtLink>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const state = reactive({ loginOrEmail: '', password: '' });
const loading = ref(false);
const errorMessage = ref('');

const { user } = useUser();

const onSubmit = async () => {
  loading.value = true;
  errorMessage.value = '';
  try {
    const response = await $fetch('/api/auth/login', { method: 'POST', body: state });
    user.value = response.user;
    navigateTo('/');
  } catch (e) {
    errorMessage.value = e.data?.message || 'Неверный логин/email или пароль';
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
@import "~/assets/css/bootstrap.min.css";
</style>