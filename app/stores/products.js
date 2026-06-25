import { defineStore } from "pinia";

export const useProductsStore = defineStore("products", () => {
  const productsList = ref([]);
  const loading = ref(false);
  const error = ref(null);

  async function fetchProducts() {
    loading.value = true;
    error.value = null;

    try {
      // Use $fetch instead of useFetch
      const products = await $fetch("/api/products");
      productsList.value = products;
      return products;
    } catch (err) {
      error.value = err.message || "Failed to fetch products";
      console.error("Error fetching products:", err);
      return [];
    } finally {
      loading.value = false;
    }
  }

  const getSingleProduct = computed(() => {
    return (id) => {
      return productsList.value.find(product => product.id === id)
    }
  })

  return {
    productsList,
    loading,
    error,
    fetchProducts,
    getSingleProduct,
  };
});
