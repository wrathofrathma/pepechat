<template>
    <div class="flex h-full bg-black flex-col justify-between" @mouseenter="onFocus" @mouseleave="onUnfocus">
        <!-- Streams layouts -->
        <stream-layout></stream-layout>
        <!-- User Media Controls -->
        <div class="flex-row flex justify-center h-12">
            <webcam-button v-if="focused"
            ></webcam-button>
            <microphone-button v-if="focused"></microphone-button>
            <screenshare-button v-if="focused"></screenshare-button>
        </div>
    </div>
</template>

<script setup lang="ts">
import {ref} from "vue";
import {useStore} from "vuex";
import WebcamButton from "./WebcamButton.vue";
import MicrophoneButton from "./MicrophoneButton.vue";
import ScreenshareButton from "./ScreenshareButton.vue";
import StreamLayout from "./StreamLayout.vue";

const store = useStore();

const focused = ref(true);
const onFocus = () => {
    focused.value = true;
}

const onUnfocus = () => {
    focused.value = false;
}
</script>