export default defineNuxtConfig({
  modules: ['@nuxtjs/tailwindcss'],
  css: ['@/assets/css/tailwind.css'],

  runtimeConfig: {
    apiSecret: process.env.API_SECRET,  
    public: {
      apiBase: '/api',
    }
  },

  build: {
    transpile: [],
  },

  // Enable dev tools for development
  devtools: { enabled: true },

  compatibilityDate: '2024-10-04'
})