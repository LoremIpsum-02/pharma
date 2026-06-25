export const useUser = () => {
  const user = useState("user", () => null);

  const fetchUser = async () => {
    try {
      const data = await $fetch("/api/auth/me");
      user.value = data;
    } catch {
      user.value = null;
    }
  };

  return { user, fetchUser };
};
