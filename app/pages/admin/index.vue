<template>
  <div class="container-fluid py-4">
    <h1 class="mb-4">Управление заявками</h1>

    <!-- Фильтры -->
    <div class="row mb-3">
      <div class="col-md-3">
        <label for="statusFilter" class="form-label">Статус</label>
        <select id="statusFilter" v-model="statusFilter" class="form-select">
          <option value="all">Все</option>
          <option value="Новый">Новый</option>
          <option value="В обработке">В обработке</option>
          <option value="Завершен">Завершен</option>
          <option value="Отменен">Отменен</option>
        </select>
      </div>
      <div class="col-md-3">
        <label for="search" class="form-label">Поиск</label>
        <input id="search" v-model="search" type="text" class="form-control" placeholder="Клиент или товар..." />
      </div>
    </div>

    <!-- Таблица -->
    <div class="table-responsive">
      <table class="table table-bordered table-striped">
        <thead class="table-dark">
          <tr>
            <th>ID</th>
            <th>Клиент</th>
            <th>Товар</th>
            <th>Цена</th>
            <th>Дата получения</th>
            <th>Способ оплаты</th>
            <th>Пункт выдачи</th>
            <th>Статус</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in filteredOrders" :key="order.id">
            <td>{{ order.id }}</td>
            <td>{{ order.userName || order.clientName || '—' }}</td>
            <td>{{ order.productName || order.article }}</td>
            <td>{{ order.price }} ₽</td>
            <td>{{ new Date(order.desiredDate).toLocaleDateString() }}</td>
            <td>{{ order.paymentMethod }}</td>
            <td>{{ order.pickupAddress }}</td>
            <td>
              <span :class="statusBadgeClass(order.status)">{{ order.status }}</span>
            </td>
            <td>
              <select v-model="order.status" class="form-select form-select-sm"
                @change="updateStatus(order.id, order.status)">
                <option value="Новый">Новый</option>
                <option value="В обработке">В обработке</option>
                <option value="Завершен">Завершен</option>
                <option value="Отменен">Отменен</option>
              </select>
            </td>
          </tr>
          <tr v-if="!filteredOrders.length">
            <td colspan="9" class="text-center text-muted">Нет заказов</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const statusFilter = ref('all');
const search = ref('');

const { data: orders, refresh } = await useFetch('/api/admin/orders', {
  default: () => [],
});

const filteredOrders = computed(() => {
  let list = orders.value || [];
  if (statusFilter.value !== 'all') {
    list = list.filter(o => o.status === statusFilter.value);
  }
  if (search.value) {
    const s = search.value.toLowerCase();
    list = list.filter(o =>
      (o.userName?.toLowerCase().includes(s) || o.clientName?.toLowerCase().includes(s)) ||
      (o.productName?.toLowerCase().includes(s) || o.article?.toLowerCase().includes(s))
    );
  }
  return list;
});

function statusBadgeClass(status) {
  const map = {
    'Завершен': 'badge bg-success',
    'Новый': 'badge bg-secondary',
    'Отменен': 'badge bg-danger',
    'В обработке': 'badge bg-warning text-dark',
  };
  return map[status] || 'badge bg-secondary';
}

async function updateStatus(id, newStatus) {
  try {
    await $fetch(`/api/admin/orders/${id}`, {
      method: 'PATCH',
      body: { status: newStatus },
    });
    refresh();
  } catch (e) {
    alert('Ошибка при обновлении статуса');
  }
}
</script>

<style scoped>
@import "~/assets/css/bootstrap.min.css";
</style>