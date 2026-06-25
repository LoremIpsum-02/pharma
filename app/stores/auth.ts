import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", () => {
  const user = ref<any>(null);
  const isAuthenticated = computed(() => !!user.value);

  function setUser(userData: any) {
    user.value = userData;
  }

  function logout() {
    user.value = null;
  }

  return {
    user,
    isAuthenticated,
    setUser,
    logout,
  };
});
