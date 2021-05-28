<template>
    <layout>
        <room-list class="w-1/6"></room-list>
        <room class="w-full h-full" :room-id="roomId"></room>
        <user-list class="w-1/6"></user-list>
    </layout>
</template>

<script setup lang="ts">
import Layout from "@/layouts/Default.vue"
import UserList from "@/components/UserList/UserList.vue"
import RoomList from "@/components/RoomIndex/RoomList.vue"
import Room from "@/components/Chatroom/Room.vue"

import {ref, watchEffect} from "vue";
import {useStore} from "vuex";

import joinRoom from "../scripts/joinRoom";
import leaveRoom from "../scripts/leaveRoom";
import { onBeforeRouteLeave } from "vue-router";

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
    roomName.value = store.getters["rooms/roomName"](id);
})

watchEffect(() => {
    store.commit("setWindowTitle", `PepeChat - #${roomName.value}`);
})

onBeforeRouteLeave(async () => {
    await leaveRoom(roomId.value);
})

joinRoom(store.state.route.params.id);
</script>

<style>
.messages {
    height: 80vh;
}
</style>