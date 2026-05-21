<template>
  <div class="iframe-container">
    <iframe
      :src="iframeUrl"
      frameborder="0"
      class="full-iframe"
    ></iframe>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
const route = useRoute()
console.log('route', route)
const iframeUrl = route.query.url
</script>

<style scoped>
.iframe-container {
  width: 100%;
  height: 100%;
}
.full-iframe {
  width: 100%;
  height: 100%;
  border: none;
}
</style>