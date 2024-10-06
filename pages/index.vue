<template>
  <div class="min-h-screen bg-gray-100 flex flex-col">
    <header class="bg-indigo-600 text-white py-4 px-6 shadow-lg">
      <h1 class="text-3xl font-bold">Archived Newsletters</h1>
    </header>

    <main class="flex-1 container mx-auto p-6 grid grid-cols-1 sm:grid-cols-1 gap-4">
      <!-- Today's Emails Section -->
      <section class="bg-white shadow-md rounded-lg mb-6 p-6 col-6" v-if="todaysEmails">
        <h2 class="text-2xl font-semibold mb-4 border-b pb-2">Today's Emails</h2>
        <div v-for="(emails, tag) in groupedEmails(todaysEmails)" :key="tag" class="mb-4">
          <ul class="space-y-2">
            <li v-for="email in emails" :key="email.id">
              <NuxtLink :to="`/email/${email.id}`" class="text-indigo-600 hover:underline">
                {{ email.subject }} 
              </NuxtLink>
             <span class="bg-green-600 text-white px-3 py-1 rounded-full text-sm ml-3 ">{{ tag }}</span>
            </li>
          </ul>
        </div>
      </section>
      <!-- This Week's Emails Section -->
      <section class="bg-white shadow-md rounded-lg mb-6 p-6">
        <h2 class="text-2xl font-semibold mb-4 border-b pb-2">This Week's Emails</h2>
        <div v-for="(emails, tag) in groupedEmails(weeksEmails)" :key="tag" class="mb-10">
          <div class="flex items-center m mb-2">
            <span class="bg-indigo-600 text-white px-3 py-1 rounded-full text-sm">{{ tag }}</span>
          </div>
          <ul class="space-y-3">
            <li v-for="email in emails" :key="email.id">
              <NuxtLink :to="`/email/${email.id}`" class="text-indigo-600 hover:underline">
                {{ email.subject }} 
              </NuxtLink>
            </li>
          </ul>
        </div>
      </section>
    </main>
    <main class="flex-1 container mx-auto p-6 grid grid-cols-1 gap-4">

      <!-- This Month's Emails Section -->
      <section class="bg-white shadow-md rounded-lg mb-6 p-6">
        <h2 class="text-2xl font-semibold mb-4 border-b pb-2">This Month's Emails</h2>
        <div v-for="(emails, tag) in groupedEmails(monthsEmails)" :key="tag" class="mb-4">
          <div class="flex items-center mb-2">
            <span class="bg-indigo-600 text-white px-3 py-1 rounded-full text-sm">{{ tag }}</span>
          </div>
          <ul class="space-y-2">
            <li v-for="email in emails" :key="email.id">
              <NuxtLink :to="`/email/${email.id}`" class="text-indigo-600 hover:underline">
                {{ email.subject }} 
              </NuxtLink>
            </li>
          </ul>
        </div>
      </section>
      <!-- All Time Emails Section, broken into separate sections by tag -->
      <section class="bg-white shadow-md rounded-lg mb-6 p-6">
        <h2 class="text-2xl font-semibold mb-4 border-b pb-2">All Emails</h2>

        <div v-for="(emails, tag) in groupedEmails(allEmails)" :key="tag" class="mb-4">
          <div class="flex items-center mb-2">
            <span class="bg-indigo-600 text-white px-3 py-1 rounded-full text-sm">{{ tag }} Emails</span>
          </div>
          <ul class="space-y-2">
            <li v-for="email in emails" :key="email.id">
              <NuxtLink :to="`/email/${email.id}`" class="text-indigo-600 hover:underline">
                {{ email.subject }} 
              </NuxtLink>
              <span class="text-gray-500 text-sm"> - {{ new Date(email.date_received).toLocaleDateString() }}</span>
            </li>
          </ul>
        </div>
      </section>
    </main>

    <footer class="bg-gray-800 text-white py-4 text-center">
      <p>Displaying {{ allEmails.length }} emails starting from {{ earliestSentDate || 'N/A' }}</p>
    </footer>

    <NuxtPage />
  </div>
</template>

<script setup>
const { data: todaysEmails, pending: todayPending } = await useFetch('/api/emails/today')
const { data: weeksEmails, pending: weekPending } = await useFetch('/api/emails/week')
const { data: monthsEmails, pending: monthPending } = await useFetch('/api/emails/month')
const { data: allEmails, pending: allPending } = await useFetch('/api/emails/all')

// Function to extract tag from sender
const extractTag = (sender) => {
  
  // Match for tags like "TLDR AI", "TLDR Product", etc.
  const match = sender?.match(/TLDR\s([a-zA-Z\s]+)\s</);
  
  if (match) {
    return match[1].trim(); // Return the extracted tag
  }
  
  // If no specific tag is found (just "TLDR"), return "Main"
  if (sender.includes('TLDR <dan@tldrnewsletter.com>')) {
    return 'Main'; // Special case for "TLDR <dan@tldrnewsletter.com>"
  }
  
  console.log(sender); // Log for debugging purposes
  return 'Main';  // Fallback for other cases
};

// Function to group emails by tag, with a null/undefined check
const groupedEmails = (emails) => {
  if (!emails || emails.length === 0) return {};

  // First, sort the emails by date (most recent first)
  const sortedEmails = emails.sort((a, b) => new Date(b.date_received) - new Date(a.date_received));

  // Then, group the sorted emails by tag
  const groups = {};
  sortedEmails.forEach(email => {
    const tag = extractTag(email.sender); // Assuming extractTag correctly extracts the tag
    if (!groups[tag]) {
      groups[tag] = [];
    }
    groups[tag].push(email);
  });

  return groups;
};

// Compute earliest sent date
const earliestSentDate = computed(() => {
  if (!allEmails || allEmails.value.length === 0) return null;

  const earliestEmail = allEmails.value.reduce((earliest, email) => {
    const emailDate = new Date(email.date_received);
    return emailDate < new Date(earliest.date_received) ? email : earliest;
  });

  return new Date(earliestEmail.date_received).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
  });
});
</script>
