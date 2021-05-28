<template>
    <div class="flex bg-black flex-col justify-between" @mouseenter="onFocus" @mouseleave="onUnfocus">
        <!-- Streams layouts -->
        <stream-layout></stream-layout>
        <!-- User Media Controls -->
        <div class="flex-row flex justify-between h-12 pr-2 pl-2">
            <!-- Ah yes, more ghetto empty divs -->
            <div></div>
            <div>
                <webcam-button v-if="focused"
                ></webcam-button>
                <microphone-button v-if="focused"></microphone-button>
                <screenshare-button v-if="focused"></screenshare-button>
            </div>
            <v-button 
            v-if="focused && !expanded" 
            class="rounded-full p-2 hover:bg-green-400 hover:brightness-125 hover:bg-opacity-10"
            @click="onExpand"
            >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
            </v-button>
            <v-button 
            v-if="focused && expanded" 
            class="rounded-full p-2 hover:bg-green-400 hover:brightness-125 hover:bg-opacity-10"
            @click="onCollapse"
            >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
                </svg>
            </v-button>
        </div>
    </div>
</template>

<script setup lang="ts">
import {ref, defineEmit, useContext, defineProps} from "vue";
import {useStore} from "vuex";
import WebcamButton from "./WebcamButton.vue";
import MicrophoneButton from "./MicrophoneButton.vue";
import ScreenshareButton from "./ScreenshareButton.vue";
import StreamLayout from "./StreamLayout.vue";
import VButton from "@/components/atomic/VButton.vue"

const store = useStore();
defineEmit(["expand", "collapse"])

const props = defineProps({
    expanded: {
        type: Boolean,
        required: true
    }
});

const focused = ref(true);
const onFocus = () => {
    focused.value = true;
}

const onUnfocus = () => {
    focused.value = false;
}

const {emit} = useContext();


const onExpand = () => {
    emit("expand");
}

const onCollapse = () => {
    emit("collapse");
}
</script>