<template>
    <layout>
        <room-list class="w-1/6"></room-list>
        <room class="w-full h-full" :room-id="roomId"></room>
        <user-list class="w-1/6"></user-list>
    </layout>
</template>

<script setup lang="ts">
import Layout from "@/layouts/Default.vue"
import UserList from "@/components/UserList.vue"
import RoomList from "@/components/RoomIndex/RoomList.vue"
import Room from "@/components/Chatroom/Room.vue"

import {computed, ref, watchEffect} from "vue";
import {useStore} from "vuex";

import joinRoom from "../scripts/joinRoom";
// import { onBeforeRouteUpdate } from "vue-router";

const store = useStore();

const roomId = ref("");
const roomName = ref("");

// Update the window title.
watchEffect(() => {
    const id = store.state.route.params.id;
    if (!id) {
        roomId.value = "";
        roomName.value = "";
    }

    roomId.value = id;
    roomName.value = store.getters.roomName(id);
})

watchEffect(() => {
    store.commit("setWindowTitle", `PepeChat - #${roomName.value}`);
})

// store.commit("setWindowTitle", `PepeChat - #${roomName}`)
// Triggering lifecycle hooks again if we re-use the component but navigate to another channel.
// https://router.vuejs.org/guide/essentials/dynamic-matching.html
// onBeforeRouteUpdate((to, from, next) => {   
//     // const roomName = store.state.rooms[store.state.route.params.id].name;
//     // store.commit("setWindowTitle", `PepeChat - #${roomName}`)
//     // HTTP request to join the room and this function handles the redirects should something go fucky.
//     // joinRoom(store.state.route.params.id);
//     next();
// })

joinRoom(store.state.route.params.id);
</script>

<style>
.messages {
    height: 80vh;
}
</style>