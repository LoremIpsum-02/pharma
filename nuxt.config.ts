export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  vite: {
    optimizeDeps: {
      include: [
        "@internationalized/date",
        "@tanstack/table-core",
        "@unovis/vue",
        "@vue/devtools-core",
        "@vue/devtools-kit",
        "@vueuse/core",
        "date-fns",
        "@pinia/nuxt",
      ],
    },
  },

  modules: [
    "@nuxt/eslint",
    "@nuxt/ui",
    "@vueuse/nuxt",
    "@pinia/nuxt",
  ],

  app: {
    head: {
      script: [
        {
          src: "https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js",
          defer: true,
        },
      ],
    },
  },

  pinia: {
    storesDirs: ["./stores/**"],
  },

  components: [
    {
      path: "~/components",
      pathPrefix: false,
    },
    {
      path: "~/components/admin",
      pathPrefix: false,
    },
  ],

  routeRules: {
    "/api/**": {
      cors: true,
    },
    "/admin/**": {
      appLayout: "admin",
    },
  },

  eslint: {
    config: {
      stylistic: {
        commaDangle: "never",
        braceStyle: "1tbs",
      },
    },
  },

  runtimeConfig: {
    databaseUrl: process.env.DATABASE_URL,
    jwtSecret: process.env.JWT_SECRET,
  },
});
