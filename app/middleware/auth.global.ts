// middleware/auth.global.ts
export default defineNuxtRouteMiddleware((to) => {
  // Проверяем наличие токена в cookies (синхронно)
  const token = useCookie('token').value;
  const isLoggedIn = !!token;

  // Если пользователь уже авторизован и пытается зайти на логин или регистрацию
  if (isLoggedIn && (to.path === '/login' || to.path === '/register')) {
    return navigateTo('/');
  }

  // Защищённые маршруты уже проверяются на сервере (server/middleware/auth.ts)
  // Здесь дополнительная проверка не нужна
});