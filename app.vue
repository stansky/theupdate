<script setup>
import Home from './pages/Index.vue'
</script>
<template>
  <div>
    <NuxtPage :page-key="route => route.fullPath" />
  </div>
</template>
