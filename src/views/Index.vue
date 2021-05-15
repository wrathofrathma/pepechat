<template>
    <div class="flex flex-col">
        <top-bar></top-bar>
        <!-- Main content container-->
        <div class="flex p-4 justify-center mt-20 pt-8">
            <!-- Rooms card -->
            <div class="bg-gray-800 w-1/2 rounded-sm border-green-400 border-2">
                <!-- Header -->
                <div class="text-center border-b-2 border-green-400 text-lg">
                    Active Pepechats
                </div>
                <!-- Rooms list -->
                <div class="flex flex-col">
                    <div v-for="n in 20" class="p-2" :class="[n % 2 === 0 ? 'bg-gray-700' : 'bg-gray-800']">
                        Room {{n}}
                    </div>
                </div>
                <!-- Create room -->
                <div class="border-t-2 border-green-400 text-lg p-2">
                    Create room form
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import TopBar from "@/components/Header.vue";
</script>