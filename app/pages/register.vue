<template>
  <div class="container py-5">
    <div class="row justify-content-center">
      <div class="col-md-6 col-lg-5">
        <div class="card shadow">
          <div class="card-body p-4">
            <h2 class="card-title text-center mb-4">Регистрация</h2>

            <form @submit.prevent="onSubmit" novalidate>
              <!-- ФИО -->
              <div class="mb-3">
                <label for="fullName" class="form-label">ФИО</label>
                <input id="fullName" v-model="state.fullName" type="text" class="form-control"
                  :class="{ 'is-invalid': errors.fullName }" placeholder="Иванов Иван Иванович" />
                <div v-if="errors.fullName" class="invalid-feedback">{{ errors.fullName }}</div>
              </div>

              <!-- Логин -->
              <div class="mb-3">
                <label for="login" class="form-label">Логин</label>
                <input id="login" v-model="state.login" type="text" class="form-control"
                  :class="{ 'is-invalid': errors.login }" placeholder="Минимум 6 символов (латиница, цифры)" />
                <div v-if="errors.login" class="invalid-feedback">{{ errors.login }}</div>
              </div>

              <!-- Email -->
              <div class="mb-3">
                <label for="email" class="form-label">Email</label>
                <input id="email" v-model="state.email" type="email" class="form-control"
                  :class="{ 'is-invalid': errors.email }" placeholder="example@mail.ru" />
                <div v-if="errors.email" class="invalid-feedback">{{ errors.email }}</div>
              </div>

              <!-- Телефон с маской -->
              <div class="mb-3">
                <label for="phone" class="form-label">Телефон</label>
                <input id="phone" v-model="state.phone" type="tel" class="form-control"
                  :class="{ 'is-invalid': errors.phone }" placeholder="8(XXX)XXX-XX-XX" @input="applyPhoneMask"
                  maxlength="15" />
                <div v-if="errors.phone" class="invalid-feedback">{{ errors.phone }}</div>
                <small class="text-muted">Формат: 8(XXX)XXX-XX-XX</small>
              </div>

              <!-- Пароль -->
              <div class="mb-3">
                <label for="password" class="form-label">Пароль</label>
                <input id="password" v-model="state.password" type="password" class="form-control"
                  :class="{ 'is-invalid': errors.password }" placeholder="Минимум 8 символов" />
                <div v-if="errors.password" class="invalid-feedback">{{ errors.password }}</div>
              </div>

              <!-- Общая ошибка (например, логин занят) -->
              <div v-if="generalError" class="alert alert-danger">{{ generalError }}</div>

              <button type="submit" class="btn btn-success w-100" :disabled="loading">
                {{ loading ? 'Загрузка...' : 'Зарегистрироваться' }}
              </button>
            </form>

            <p class="mt-3 text-center">
              Уже есть аккаунт? <NuxtLink to="/login" class="text-decoration-none">Войти</NuxtLink>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';

// Состояние формы
const state = reactive({
  fullName: '',
  login: '',
  email: '',
  phone: '',
  password: '',
});

// Ошибки полей (объект с ключами = имена полей)
const errors = reactive({
  fullName: '',
  login: '',
  email: '',
  phone: '',
  password: '',
});
const generalError = ref('');
const loading = ref(false);

// Маска для телефона
function applyPhoneMask(event) {
  let value = event.target.value.replace(/\D/g, ''); // только цифры
  if (value.length > 11) value = value.slice(0, 11); // макс 11 цифр (8 + 10)

  let formatted = '';
  if (value.length > 0) {
    formatted = '8(';
    if (value.length > 1) {
      formatted += value.slice(1, 4);
      if (value.length > 4) {
        formatted += ')' + value.slice(4, 7);
        if (value.length > 7) {
          formatted += '-' + value.slice(7, 9);
          if (value.length > 9) {
            formatted += '-' + value.slice(9, 11);
          }
        }
      }
    }
  }
  state.phone = formatted;
}

// Валидация на клиенте (перед отправкой)
function validateForm() {
  let valid = true;
  // Очищаем старые ошибки
  Object.keys(errors).forEach(key => errors[key] = '');
  generalError.value = '';

  if (!state.fullName.trim()) {
    errors.fullName = 'ФИО обязательно для заполнения';
    valid = false;
  } else if (state.fullName.trim().length < 2) {
    errors.fullName = 'Слишком короткое ФИО';
    valid = false;
  }

  if (!state.login.trim()) {
    errors.login = 'Логин обязателен';
    valid = false;
  } else if (state.login.length < 6) {
    errors.login = 'Логин должен содержать минимум 6 символов';
    valid = false;
  } else if (!/^[a-zA-Z0-9]+$/.test(state.login)) {
    errors.login = 'Логин может содержать только латиницу и цифры';
    valid = false;
  }

  if (!state.email.trim()) {
    errors.email = 'Email обязателен';
    valid = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.email)) {
    errors.email = 'Введите корректный email';
    valid = false;
  }

  if (!state.phone.trim()) {
    errors.phone = 'Телефон обязателен';
    valid = false;
  } else if (!/^8\(\d{3}\)\d{3}-\d{2}-\d{2}$/.test(state.phone)) {
    errors.phone = 'Формат телефона: 8(XXX)XXX-XX-XX';
    valid = false;
  }

  if (!state.password) {
    errors.password = 'Пароль обязателен';
    valid = false;
  } else if (state.password.length < 8) {
    errors.password = 'Пароль должен содержать минимум 8 символов';
    valid = false;
  }

  return valid;
}

// Отправка формы
async function onSubmit() {
  if (!validateForm()) return;

  loading.value = true;
  generalError.value = '';

  try {
    await $fetch('/api/auth/register', {
      method: 'POST',
      body: state,
    });
    // Успех – редирект на логин
    navigateTo('/login');
  } catch (e) {
    // Парсим ошибки валидации от сервера (zod)
    if (e.data?.data?.issues) {
      // Zod ошибки – показываем под соответствующими полями
      e.data.data.issues.forEach(issue => {
        const path = issue.path[0];
        if (path && errors.hasOwnProperty(path)) {
          errors[path] = issue.message;
        } else {
          generalError.value = issue.message;
        }
      });
    } else {
      generalError.value = e.data?.message || 'Ошибка регистрации. Попробуйте позже.';
    }
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
@import "~/assets/css/bootstrap.min.css";
</style>