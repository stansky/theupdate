<template>
  <div class="min-h-screen bg-gray-100 flex flex-col">
    <header class="bg-indigo-600 text-white py-4 px-6 shadow-lg">
      <h1 class="text-3xl font-bold">Archived Newsletters</h1>
    </header>

    <main class="flex-1 container mx-auto p-6">
      <!-- Today's Emails Section -->
      <section class="bg-white shadow-md rounded-lg mb-6 p-6">
        <h2 class="text-2xl font-semibold mb-4 border-b pb-2">Today's Emails</h2>
        <ul class="space-y-4">
          <li v-for="email in todaysEmails" :key="email.id">
            <NuxtLink :to="`/email/${email.id}`" class="text-indigo-600 hover:underline">
              {{ email.subject }}
            </NuxtLink>
          </li>
        </ul>
      </section>

      <!-- This Week's Emails Section -->
      <section class="bg-white shadow-md rounded-lg mb-6 p-6">
        <h2 class="text-2xl font-semibold mb-4 border-b pb-2">This Week's Emails</h2>
        <ul class="space-y-4">
          <li v-for="email in weeksEmails" :key="email.id">
            <NuxtLink :to="`/email/${email.id}`" class="text-indigo-600 hover:underline">
              {{ email.subject }}
            </NuxtLink>
          </li>
        </ul>
      </section>

      <!-- This Month's Emails Section -->
      <section class="bg-white shadow-md rounded-lg mb-6 p-6">
        <h2 class="text-2xl font-semibold mb-4 border-b pb-2">This Month's Emails</h2>
        <ul class="space-y-4">
          <li v-for="email in monthsEmails" :key="email.id">
            <NuxtLink :to="`/email/${email.id}`" class="text-indigo-600 hover:underline">
             {{ email.subject }}
            </NuxtLink>
          </li>
        </ul>
      </section>

      <!-- All Time Emails Section -->
      <section class="bg-white shadow-md rounded-lg p-6">
        <h2 class="text-2xl font-semibold mb-4 border-b pb-2">All Time Emails</h2>
        <ul class="space-y-4">
          <li v-for="email in allEmails" :key="email.id">
            <NuxtLink :to="`/email/${email.id}`" class="text-indigo-600 hover:underline">
              {{ email.subject }}
            </NuxtLink>
          </li>
        </ul>
      </section>
    </main>

    <footer class="bg-gray-800 text-white py-4 text-center">
      <p>Displaying {{ allEmails.length }} emails starting from {{ earliestSentDate || 'N/A' }}</p>
    </footer>

    <NuxtPage />
  </div>
</template>

<script setup>
const { data: todaysEmails } = await useFetch('/api/emails/today')
const { data: weeksEmails } = await useFetch('/api/emails/week')
const { data: monthsEmails } = await useFetch('/api/emails/month')
const { data: allEmails } = await useFetch('/api/emails/all')

const earliestSentDate = computed(() => {
  if (allEmails.value.length === 0) return null;

  const earliestEmail = allEmails.value.reduce((earliest, email) => {
    const emailDate = new Date(email.date_received);
    return emailDate < new Date(earliest.date_received) ? email : earliest;
  });

  return new Date(earliestEmail.date_received).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
  });
});
</script>
