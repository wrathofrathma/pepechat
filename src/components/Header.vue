<template>
    <div class="flex flex-row w-full bg-gray-800 p-2 rounded-sm border-green-400 border-2 h-20">
        <div class="flex-row flex w-1/3 space-x-2">
            <v-button class="focus:outline-none">
                <avatar class="border border-green-400 h-16 w-16"></avatar>
            </v-button>
            <div class="justify-center items-center flex p-1">
                {{username}}
            </div>
        </div>
        <div class="items-center justify-center flex w-1/3 font-bold text-3xl text-green-400">
            <div class="select-none cursor-pointer" @click="$router.push('/')">
                {{title}}
            </div>
        </div>
        <div class="w-1/3 flex justify-end items-center">
            <v-button class="hover:bg-gray-600 hover:bg-opacity-10 p-2 rounded-full focus:outline-none">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
            </v-button>
        </div>
    </div>
</template>

<script setup lang="ts">
import Avatar from "@/components/atomic/Avatar.vue";
import VButton from "@/components/atomic/VButton.vue"

import {useStore} from "vuex";
import {computed} from "vue";

const store = useStore();

const username = computed(() => store.state.username);
const title = computed(() => store.state.windowTitle);
</script>