<template>
  <div class="container py-5">
    <div class="row justify-content-center">
      <div class="col-lg-8">
        <h1 class="mb-4">Оформление заказа</h1>
        <form @submit.prevent="onSubmit">
          <!-- Выбор товара -->
          <div class="mb-3">
            <label for="productSelect" class="form-label">Товар</label>
            <select id="productSelect" v-model="selectedProduct" class="form-select" required>
              <option v-for="p in products" :key="p.id" :value="p">
                {{ p.name }} - {{ p.price }} ₽
              </option>
            </select>
          </div>

          <div class="mb-3">
            <label class="form-label">Цена</label>
            <input type="text" class="form-control" :value="selectedProduct ? selectedProduct.price + ' ₽' : ''"
              disabled />
          </div>

          <div class="mb-3">
            <label for="desiredDate" class="form-label">Дата получения</label>
            <input id="desiredDate" v-model="desiredDate" type="date" class="form-control" :min="today" required />
          </div>

          <div class="mb-3">
            <label class="form-label">Способ оплаты</label>
            <div class="form-check">
              <input id="cash" v-model="paymentMethod" class="form-check-input" type="radio" value="Наличные" />
              <label for="cash" class="form-check-label">Наличные</label>
            </div>
            <div class="form-check">
              <input id="transfer" v-model="paymentMethod" class="form-check-input" type="radio"
                value="Перевод по номеру телефона" />
              <label for="transfer" class="form-check-label">Перевод по номеру телефона</label>
            </div>
          </div>

          <div class="mb-3">
            <label for="pickupPointSelect" class="form-label">Пункт выдачи</label>
            <select id="pickupPointSelect" v-model="pickupPointId" class="form-select" required>
              <option v-for="point in pickupPoints" :key="point.id" :value="point.id">
                {{ point.address }}
              </option>
            </select>
          </div>

          <div v-if="errorMessage" class="alert alert-danger">{{ errorMessage }}</div>

          <button type="submit" class="btn btn-primary" :disabled="loading">
            {{ loading ? 'Отправка...' : 'Оформить заказ' }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
const route = useRoute();
const { data: products } = await useFetch('/api/products');
const { data: pickupPoints } = await useFetch('/api/pickup-points');

const today = ref(new Date().toISOString().split('T')[0]);

const selectedProduct = ref(null);
const desiredDate = ref('');
const paymentMethod = ref('Наличные');
const pickupPointId = ref(null);
const loading = ref(false);
const errorMessage = ref('');

onMounted(() => {
  const article = route.query.article;
  if (article && products.value) {
    selectedProduct.value = products.value.find(p => p.id === article);
  }
});

const onSubmit = async () => {
  if (!selectedProduct.value) {
    errorMessage.value = 'Выберите товар';
    return;
  }
  if (!desiredDate.value) {
    errorMessage.value = 'Выберите дату';
    return;
  }
  if (!paymentMethod.value) {
    errorMessage.value = 'Выберите способ оплаты';
    return;
  }
  if (!pickupPointId.value) {
    errorMessage.value = 'Выберите пункт выдачи';
    return;
  }

  loading.value = true;
  errorMessage.value = '';

  try {
    await $fetch('/api/orders', {
      method: 'POST',
      body: {
        article: selectedProduct.value.article,
        desiredDate: desiredDate.value,
        paymentMethod: paymentMethod.value,
        price: Number(selectedProduct.value.price),
        pickupPointId: pickupPointId.value,
      },
    });
    navigateTo('/profile');
  } catch (e) {
    errorMessage.value = e.data?.message || 'Ошибка создания заказа';
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
@import "~/assets/css/bootstrap.min.css";
</style>