export default defineNuxtRouteMiddleware(async (to) => {
  const { user, fetchUser } = useUser();

  if (user.value === undefined) {
    await fetchUser();
  }

  const isLoggedIn = !!user.value;

  const protectedPaths = ['/profile', '/admin', '/order'];
  const isProtected = protectedPaths.some(p => to.path === p || to.path.startsWith(p + '/'));

  if (isProtected && !isLoggedIn) {
    return navigateTo('/login');
  }

  if (isLoggedIn && (to.path === '/login' || to.path === '/register')) {
    return navigateTo('/');
  }
});