<template>
    <layout>
        <div class="flex w-full items-center justify-center">
            <div class="bg-gray-800 flex p-2 border-green-400 border-2 rounded-md flex-col items-center">
                <div class="">
                    STOP RIGHT THERE CRIMINAL SCUM!
                </div>
                <img :src="proteccURL" class="h-32 w-32">
                <div class="border-t pt-1">
                    To enter 
                    <span class="font-bold">{{roomName}}</span>
                     you must answer the question
                </div>
                <div class="text-red-400 font-bold w-full">
                    {{questions[question]}} 
                </div>
                <text-input 
                placeholder="Room password"
                class="bg-gray-700 rounded-md"
                type="password"
                v-model="password"
                @keyup.enter="submit"
                ></text-input>
            </div>
        </div>
    </layout>
</template>

<script setup lang="ts">
import Layout from "@/layouts/Default.vue"
import TextInput from "@/components/atomic/TextInput.vue";

import {computed, ref} from "vue";
import {useStore} from "vuex";
import joinRoom from "../scripts/joinRoom";


const store = useStore();
const proteccURL = computed(() => {
    const base = store.state.baseURL;
    return `${base}/assets/avatars/pepeprotecc.png`
})

const questions = [
    "What is the color of night?",
    "What is the music of life?",
    "What is life's greatest illusion?",
    "What is the flavor of fear?",
    "What is the gift of death?"
]

const question = ref(Math.floor(Math.random() * 4));

const roomId = computed(() => store.state.route.params.id);
const roomName = computed(() => store.getters["rooms/roomName"](roomId.value));
const password = ref("");

const submit = () => {
    if (password.value === "\n" || !password.value) {
        return;
    }

    joinRoom(roomId.value, password.value);

    question.value = Math.floor(Math.random() * 4);
    password.value = "";
}
</script>