export default defineEventHandler((event) => {
  deleteCookie(event, "token");
  return { success: true };
});
