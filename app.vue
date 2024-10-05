<script setup>
import Home from './pages/index.vue'
</script>
<template>
  <div>
    <NuxtPage :page-key="route => route.fullPath" />
  </div>
</template>
