<template>
  <div class="min-h-screen bg-gray-100 flex flex-col">
    <header class="bg-indigo-600 text-white py-4 px-6 shadow-lg">
      <h1 class="text-3xl font-bold">Email Details</h1>
    </header>

    <main class="flex-1 container mx-auto p-6">
      <section class="bg-white shadow-md rounded-lg p-6">
        <h2 class="text-3xl font-semibold mb-4">{{ email.subject }}</h2>
        <!-- <div class="mb-4 text-gray-600">
          <p><strong>From:</strong> {{ email.sender }}</p>
          <p><strong>Date:</strong> {{ email.date_received }}</p>
        </div> -->
        <div class="prose max-w-none" v-html="email.body"></div>
      </section>
    </main>

    <footer class="bg-gray-800 text-white py-4 text-center">
      <p>&copy; 2024 Email Dashboard. All rights reserved.</p>
    </footer>
  </div>

  <NuxtPage />
</template>

<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()
const { data: email } = await useFetch(`/api/emails/${route.params.id}`)
</script>
