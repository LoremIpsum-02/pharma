<template>
  <div class="container py-5">
    <h1 class="mb-4">Мои заявки</h1>

    <div class="table-responsive">
      <table class="table table-bordered table-striped">
        <thead class="table-dark">
          <tr>
            <th>№</th>
            <th>Товар</th>
            <th>Цена</th>
            <th>Дата получения</th>
            <th>Способ оплаты</th>
            <th>Пункт выдачи</th>
            <th>Статус</th>
            <th>Отзыв</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="order in orders" :key="order.id">
            <td>{{ order.id }}</td>
            <td>{{ order.productName || order.article }}</td>
            <td>{{ order.price }} ₽</td>
            <td>{{ new Date(order.desiredDate).toLocaleDateString() }}</td>
            <td>{{ order.paymentMethod }}</td>
            <td>{{ order.pickupAddress }}</td>
            <td>
              <span :class="statusBadgeClass(order.status)">{{ order.status }}</span>
            </td>
            <td>
              <button v-if="order.status === 'Завершен' && !order.review" class="btn btn-sm btn-outline-primary"
                @click="openReview(order.id)">
                Оставить отзыв
              </button>
              <span v-else-if="order.review">{{ order.review }}</span>
              <span v-else class="text-muted">—</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Модалка для отзыва -->
    <div class="modal fade" id="reviewModal" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Ваш отзыв</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <textarea v-model="reviewText" class="form-control" rows="4" placeholder="Напишите отзыв..."></textarea>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" data-bs-dismiss="modal">Отмена</button>
            <button class="btn btn-primary" @click="submitReview">Отправить</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const { data: orders, refresh } = await useFetch('/api/orders/my');
const reviewText = ref('');
const selectedOrderId = ref(null);

function openReview(orderId) {
  selectedOrderId.value = orderId;
  const modal = new bootstrap.Modal(document.getElementById('reviewModal'));
  modal.show();
}

async function submitReview() {
  await $fetch('/api/orders/review', {
    method: 'POST',
    body: { orderId: selectedOrderId.value, review: reviewText.value }
  });
  reviewText.value = '';
  refresh();
  bootstrap.Modal.getInstance(document.getElementById('reviewModal')).hide();
}

function statusBadgeClass(status) {
  const map = {
    'Новый': 'badge bg-secondary',
    'В обработке': 'badge bg-warning text-dark',
    'Завершен': 'badge bg-success',
    'Отменен': 'badge bg-danger',
  };
  return map[status] || 'badge bg-secondary';
}
</script>

<style scoped>
@import "~/assets/css/bootstrap.min.css";
</style>