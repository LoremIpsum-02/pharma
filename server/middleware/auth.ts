export default defineEventHandler((event) => {
  const path = event.path;

  const protectedPrefixes = [
    "/profile",
    "/admin",
    "/order",
    "/api/orders",
    "/api/admin",
    "/api/auth/me",
  ];

  const isProtected = protectedPrefixes.some(
    (p) => path === p || path.startsWith(p + "/"),
  );

  if (isProtected) {
    const token = getCookie(event, "token");
    if (!token) {
      if (path.startsWith("/api/")) {
        throw createError({ status: 401, message: "Unauthorized" });
      }
      return sendRedirect(event, "/login");
    }
  }
})