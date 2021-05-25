<template>
  <router-view></router-view>
</template>

<script setup lang="ts">
import {useStore} from "vuex";
import {watchEffect} from "vue";

const store = useStore();

watchEffect(() => {
  document.title = store.state.windowTitle;
})

// We want to open the socket here, so we don't close it when we move to the chatroom.
import handler from "./scripts/ws-handler";

// const sock = new WebSocket("ws://localhost:3000");
const sock = new WebSocket("wss://pepeserver.herokuapp.com/");

sock.onmessage = handler;

sock.onopen = (ev: Event) => {
  store.commit("setSocket", sock);
}

sock.onclose = (ev: Event) => {
  store.commit("setSocket", null);
}

// On app launch we want to fetch what media devices we're allowed to access and store them for fast context menus
store.dispatch("getMediaDevices");
// Also an event listener for new devices
navigator.mediaDevices.ondevicechange = async (ev: Event) => {
  store.dispatch("getMediaDevices");
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
