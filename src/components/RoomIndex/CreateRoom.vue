<template>
    <div class="border-green-400 text-lg p-2 flex flex-col space-y-2 border">
        <!-- Room Name -->
        <text-input 
        placeholder="Create Room"
        class="border rounded-md border-gray-600"
        v-model="roomName"
        @keyup.enter="callCreateRoom"
        />

        <!-- Room Password -->
        <text-input 
        placeholder="Password" 
        type="password"
        class="border rounded-md border-gray-600"
        v-model="password"
        @keyup.enter="callCreateRoom"
        v-if="isPrivate"
        />

        <!-- Room Features -->
        <div class="flex flex-row justify-between">
            Room Features
            <!-- Webcam-->
            <v-button
            @click="video = !video"
            :class="[video ? 'text-green-400' : '']"
            >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 filter hover:brightness-125" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
            </v-button>
            <!-- Audio -->
            <v-button
            @click="audio = !audio"
            :class="[audio ? 'text-green-400' : '']"
            >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 filter hover:brightness-125" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
            </v-button>
            <!-- Screenshare -->
            <v-button 
            @click="screenshare = !screenshare"
            :class="[screenshare ? 'text-green-400' : '']"
            >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 filter hover:brightness-125" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
            </v-button>
            <!-- Private -->
            <v-button 
            @click="isPrivate=!isPrivate"
            :class="[isPrivate ? 'text-green-400' : '']"
            >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 filter hover:brightness-125" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
            </v-button>
            <!-- TODO Implement user limit -->
            <div></div>
            <!-- <div>User limit(TBI)</div> -->
        </div>
        <div class="flex flex-row justify-center">
            <v-button 
            class="bg-gray-700 rounded-md p-2 pt-1 pb-1 text-blue-300 filter hover:brightness-125"
            @click="callCreateRoom"
            >
                Chat with some pepegas
            </v-button>
        </div>
    </div>
</template>

<script setup lang="ts">
import TextInput from "@/components/atomic/TextInput.vue";
import VButton from "@/components/atomic/VButton.vue"
import {computed, ref} from "vue";
import {useStore} from "vuex";
import {useRouter} from "vue-router";
import createRoom from "../../scripts/createRoom";

const store = useStore();
const router = useRouter();

const video = ref(true);
const audio = ref(true);
const isPrivate = ref(false);
const screenshare = ref(true);
const password = ref("")
const roomName = ref("")

const callCreateRoom = async () => {
    if (roomName.value === "\n" || !roomName.value)
        return;
    await createRoom({
        video: video.value,
        audio: audio.value,
        isPrivate: isPrivate.value,
        screenshare: screenshare.value,
        password: password.value,
        name: roomName.value
    })
    .catch((error) => {
        console.error(error)
    })
}
</script>