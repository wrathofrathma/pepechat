<template>
    <div class="flex flex-col bg-gray-800 h-full w-full overflow-y-scroll no-scrollbar">
        <div class="flex flex-row space-x-2 p-2" v-for="n in 20">
            <message></message>
        </div>
    </div>
</template>

<script setup lang="ts">
import Message from "@/components/Chatroom/Message.vue"
</script>