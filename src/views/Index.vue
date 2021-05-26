<template>
    <layout>
        <room-list class="w-5/6"></room-list>
        <user-list class="w-1/6"></user-list>
    </layout>
</template>

<script setup lang="ts">
import Layout from "@/layouts/Default.vue";
import RoomList from "@/components/RoomIndex/RoomList.vue"
import UserList from "@/components/UserList/UserList.vue"

import {useStore} from "vuex";

const store = useStore();

store.commit("setWindowTitle", "PepeChat")
</script>