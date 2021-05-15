<template>
  <router-view></router-view>
</template>

<script setup lang="ts">
// We want to open the socket here, so we don't close it when we move to the chatroom.
import handler from "./scripts/ws-handler";

const sock = new WebSocket("ws://localhost:3000");

sock.onmessage = handler;

sock.onopen = (ev: Event) => {
    console.log("opened!")
}

sock.onclose = (ev: Event) => {
    console.log("Closed")
}
</script>

<style>
#app {
  @apply bg-gray-700;
  @apply w-screen;
  @apply h-screen;
  @apply text-white;
}
</style>
