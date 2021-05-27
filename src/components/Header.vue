<template>
    <div class="flex flex-row w-full bg-gray-800 p-2 rounded-sm border-green-400 border-2 h-20">
        <div class="flex-row flex w-1/3 space-x-2">
            <v-button class="focus:outline-none hover:brightness-125 filter" @click="selectorVisible=true">
                <avatar class="border border-green-400 h-16 w-16" :src="userAvatar"></avatar>
            </v-button>
            <div class="justify-center items-center flex p-1 space-x-1">
                <p>
                {{username}}
                </p>
                <v-button @click="rerollUsername">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-400 hover:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                </v-button>
            </div>
        </div>
        <div class="items-center justify-center flex w-1/3 font-bold text-3xl text-green-400">
            <div class="select-none cursor-pointer filter hover:brightness-125" @click="$router.push('/')">
                {{title}}
            </div>
        </div>
        <div class="w-1/3 flex justify-end items-center">
            <webcam-button v-if="roomId" top="0"></webcam-button>
            <microphone-button v-if="roomId" top="0"></microphone-button>
            <screenshare-button v-if="roomId"></screenshare-button>

            <v-button class="hover:bg-gray-600 hover:bg-opacity-10 p-2 rounded-full focus:outline-none">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
            </v-button>
        </div>
    </div>
    <avatar-selector 
    :visible="selectorVisible"
    @close="selectorVisible=false"
    ></avatar-selector>
</template>

<script setup lang="ts">
import WebcamButton from "@/components/Chatroom/WebcamButton.vue";
import MicrophoneButton from "@/components/Chatroom/MicrophoneButton.vue";
import ScreenshareButton from "@/components/Chatroom/ScreenshareButton.vue";
import Avatar from "@/components/atomic/Avatar.vue";
import VButton from "@/components/atomic/VButton.vue"
import rerollUsername from "../scripts/rerollUsername";
import AvatarSelector from "./AvatarSelector.vue";

import {useStore} from "vuex";
import {computed, ref} from "vue";

const store = useStore();

const username = computed(() => store.state.username);
const userAvatar = computed(() => store.state.avatar)
const title = computed(() => store.state.windowTitle);
const selectorVisible = ref(false)
const roomId = computed(() => store.state.route.params.id);
</script>