<template>
    <div class="flex flex-row w-full h-20 bg-green-400 p-2 absolute rounded-sm">
        <div class="flex-row flex w-1/3">
            <div class="h-16 w-16 rounded-full bg-blue-400 flex items-center justify-center">
                Avatar
            </div>
            <div class="bg-gray-600 justify-center items-center flex p-1">
                {{username}}
            </div>
        </div>
        <div class="bg-gray-600 items-center justify-center flex w-1/3">
            PEPE CHAT LOGO
        </div>
        <div class="w-1/3 flex justify-end">
            <div class="bg-gray-600 flex justify-center items-center">
                Settings
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import {useStore} from "vuex";
import {computed} from "vue";

const store = useStore();

const username = computed(() => store.state.username);
</script>