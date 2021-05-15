<template>
    <div class="flex flex-col">
        <top-bar></top-bar>
        <!-- Main content container-->
        <div class="flex p-4 justify-center mt-20 pt-8">
            <!-- Rooms card -->
            <room-list></room-list>
        </div>
    </div>
</template>

<script setup lang="ts">
import TopBar from "@/components/Header.vue";
import RoomList from "@/components/RoomList.vue"
</script>