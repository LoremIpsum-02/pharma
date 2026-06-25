<template>
  <ClientOnly>
    <div class="container-fluid py-4">
      <h1 class="mb-4">Клиенты</h1>

      <div class="row mb-3 align-items-end">
        <div class="col-md-4">
          <label for="searchInput" class="form-label">Поиск</label>
          <input id="searchInput" v-model="searchQuery" type="text" class="form-control"
            placeholder="Имя, email или телефон..." />
        </div>
        <div class="col-md-3">
          <label for="roleFilter" class="form-label">Роль</label>
          <select id="roleFilter" v-model="roleFilter" class="form-select">
            <option value="all">Все</option>
            <option value="user">Пользователь</option>
            <option value="admin">Администратор</option>
          </select>
        </div>
        <div class="col-md-2">
          <button class="btn btn-primary w-100" @click="openAddModal">
            <i class="bi bi-plus-circle"></i> Добавить
          </button>
        </div>
      </div>

      <!-- Таблица пользователей -->
      <div class="table-responsive">
        <table class="table table-bordered table-striped table-hover">
          <thead class="table-dark">
            <tr>
              <th>ID</th>
              <th>ФИО</th>
              <th>Логин</th>
              <th>Email</th>
              <th>Телефон</th>
              <th>Роль</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in paginatedUsers" :key="user.id">
              <td>{{ user.id }}</td>
              <td>{{ user.fullName }}</td>
              <td>{{ user.login }}</td>
              <td>{{ user.email || '-' }}</td>
              <td>{{ user.phone || '-' }}</td>
              <td>
                <span :class="user.role === 'admin' ? 'badge bg-danger' : 'badge bg-secondary'">
                  {{ user.role }}
                </span>
              </td>
              <td>
                <button class="btn btn-sm btn-outline-primary me-1" @click="editUser(user)">
                  <i class="bi bi-pencil"></i> Редактировать
                </button>
                <button class="btn btn-sm btn-outline-danger" @click="deleteUser(user.id)">
                  <i class="bi bi-trash"></i> Удалить
                </button>
              </td>
            </tr>
            <tr v-if="!filteredUsers.length">
              <td colspan="7" class="text-center text-muted">Пользователи не найдены</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Пагинация -->
      <div class="d-flex justify-content-between align-items-center mt-3">
        <div>
          <span class="text-muted">
            Показано {{ (currentPage - 1) * pageSize + 1 }} – {{ Math.min(currentPage * pageSize, filteredUsers.length) }}
            из {{ filteredUsers.length }}
          </span>
        </div>
        <div>
          <button class="btn btn-outline-secondary btn-sm me-1" :disabled="currentPage === 1" @click="prevPage">
            ←
          </button>
          <span class="mx-2">Страница {{ currentPage }} из {{ totalPages }}</span>
          <button class="btn btn-outline-secondary btn-sm ms-1" :disabled="currentPage === totalPages" @click="nextPage">
            →
          </button>
        </div>
      </div>

      <!-- Модалка добавления/редактирования -->
      <div class="modal fade" id="userModal" tabindex="-1">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">{{ editingUser ? 'Редактировать' : 'Добавить' }} пользователя</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
              <form @submit.prevent="saveUser">
                <div class="mb-3">
                  <label class="form-label">ФИО</label>
                  <input v-model="form.fullName" type="text" class="form-control" required />
                </div>
                <div class="mb-3">
                  <label class="form-label">Логин</label>
                  <input v-model="form.login" type="text" class="form-control" required />
                </div>
                <div class="mb-3">
                  <label class="form-label">Email</label>
                  <input v-model="form.email" type="email" class="form-control" />
                </div>
                <div class="mb-3">
                  <label class="form-label">Телефон</label>
                  <input v-model="form.phone" type="text" class="form-control" />
                </div>
                <div class="mb-3">
                  <label class="form-label">Роль</label>
                  <select v-model="form.role" class="form-select">
                    <option value="user">Пользователь</option>
                    <option value="admin">Администратор</option>
                  </select>
                </div>
                <div v-if="!editingUser" class="mb-3">
                  <label class="form-label">Пароль</label>
                  <input v-model="form.password" type="password" class="form-control" required />
                </div>
                <button type="submit" class="btn btn-primary w-100">Сохранить</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </ClientOnly>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'

// Данные
const users = ref([])
const searchQuery = ref('')
const roleFilter = ref('all')
const currentPage = ref(1)
const pageSize = 10
const editingUser = ref(null)

// Форма для модалки
const form = reactive({
  id: null,
  fullName: '',
  login: '',
  email: '',
  phone: '',
  role: 'user',
  password: ''
})

let modalInstance = null

// Загрузка пользователей
const fetchUsers = async () => {
  try {
    const data = await $fetch('/api/users')
    users.value = data
  } catch (e) {
    alert('Ошибка загрузки пользователей')
  }
}

// Фильтрация
const filteredUsers = computed(() => {
  let list = users.value
  if (roleFilter.value !== 'all') {
    list = list.filter(u => u.role === roleFilter.value)
  }
  if (searchQuery.value) {
    const s = searchQuery.value.toLowerCase()
    list = list.filter(u =>
      u.fullName.toLowerCase().includes(s) ||
      u.login.toLowerCase().includes(s) ||
      (u.email && u.email.toLowerCase().includes(s)) ||
      (u.phone && u.phone.includes(s))
    )
  }
  return list
})

// Пагинация
const totalPages = computed(() => Math.ceil(filteredUsers.value.length / pageSize))
const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  const end = start + pageSize
  return filteredUsers.value.slice(start, end)
})

function prevPage() {
  if (currentPage.value > 1) currentPage.value--
}
function nextPage() {
  if (currentPage.value < totalPages.value) currentPage.value++
}

// Модалка
async function initModal() {
  if (import.meta.client) {
    const { Modal } = await import('bootstrap')
    const modalElement = document.getElementById('userModal')
    if (modalElement) {
      modalInstance = new Modal(modalElement)
    }
  }
}

function openAddModal() {
  if (modalInstance) {
    editingUser.value = null
    resetForm()
    modalInstance.show()
  }
}

function editUser(user) {
  if (modalInstance) {
    editingUser.value = user
    Object.assign(form, {
      id: user.id,
      fullName: user.fullName,
      login: user.login,
      email: user.email || '',
      phone: user.phone || '',
      role: user.role,
      password: ''
    })
    modalInstance.show()
  }
}

function resetForm() {
  form.id = null
  form.fullName = ''
  form.login = ''
  form.email = ''
  form.phone = ''
  form.role = 'user'
  form.password = ''
}

async function saveUser() {
  try {
    if (editingUser.value) {
      await $fetch(`/api/users/${form.id}`, {
        method: 'PATCH',
        body: {
          fullName: form.fullName,
          login: form.login,
          email: form.email,
          phone: form.phone,
          role: form.role
        }
      })
    } else {
      await $fetch('/api/users', {
        method: 'POST',
        body: {
          fullName: form.fullName,
          login: form.login,
          email: form.email,
          phone: form.phone,
          role: form.role,
          password: form.password
        }
      })
    }
    if (modalInstance) modalInstance.hide()
    await fetchUsers()
  } catch (e) {
    alert('Ошибка сохранения')
  }
}

async function deleteUser(id) {
  if (confirm('Удалить пользователя?')) {
    try {
      await $fetch(`/api/users/${id}`, { method: 'DELETE' })
      await fetchUsers()
    } catch (e) {
      alert('Ошибка удаления')
    }
  }
}

onMounted(() => {
  initModal()
  fetchUsers()
})
</script>

<style scoped>
@import "~/assets/css/bootstrap.min.css";
</style>