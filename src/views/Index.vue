<template>
    <div class="flex flex-col">
        <top-bar></top-bar>
        <!-- Main content container-->
        <div class="flex" style="height: calc(100vh - 5rem);">
            <room-list class="w-5/6"></room-list>
            <user-list class="w-1/6"></user-list>
        </div>
    </div>
</template>

<script setup lang="ts">
import TopBar from "@/components/Header.vue";
import RoomList from "@/components/RoomIndex/RoomList.vue"
import UserList from "@/components/UserList.vue"
</script>