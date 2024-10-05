export default defineNuxtConfig({
  modules: ['@nuxtjs/tailwindcss'],
  css: ['@/assets/css/tailwind.css'],

  runtimeConfig: {
    apiSecret: process.env.API_SECRET,  
    public: {
      apiBase: '/api',
    },
    MYSQL_HOST: process.env.MYSQL_HOST,
    MYSQL_USER: process.env.MYSQL_USER,
    MYSQL_PASSWORD: process.env.MYSQL_PASSWORD,
    MYSQL_DB_NAME: process.env.MYSQL_DB_NAME
  },

  build: {
    transpile: [],
  },

  // Enable dev tools for development
  devtools: { enabled: true },

  compatibilityDate: '2024-10-04'
})