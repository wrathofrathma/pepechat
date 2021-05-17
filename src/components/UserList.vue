<template>
    <div class="flex flex-col bg-gray-900 border-green-400 h-full">
        <div class="border-green-400 border-b-2 text-lg text-center ">
            User list
        </div>
        <div class="overflow-y-scroll h-full no-scrollbar">
            <div v-for="n in 30" class="flex flex-row items-center space-x-2">
                <avatar class="h-12 w-12"></avatar>
                <p>Some username</p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import Avatar from "@/components/atomic/Avatar.vue"
</script>