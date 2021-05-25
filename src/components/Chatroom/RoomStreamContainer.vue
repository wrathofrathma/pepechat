<template>
    <div class="flex h-full bg-black flex-col justify-between" @mouseenter="onFocus" @mouseleave="onUnfocus">
        <!-- Streams layouts -->
        <stream-layout></stream-layout>
        <!-- User Media Controls -->
        <div class="flex-row flex justify-center h-12">
            <webcam-button v-if="focused"
            ></webcam-button>
            <microphone-button v-if="focused"></microphone-button>
            <media-control-button :active="screenshareActive" @click="onToggleScreenshare" v-if="focused">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2h-2.22l.123.489.804.804A1 1 0 0113 18H7a1 1 0 01-.707-1.707l.804-.804L7.22 15H5a2 2 0 01-2-2V5zm5.771 7H5V5h10v7H8.771z" clip-rule="evenodd" />
                </svg>
            </media-control-button>
        </div>
    </div>
</template>

<script setup lang="ts">
import {computed, ref} from "vue";
import {useStore} from "vuex";
import MediaControlButton from "./MediaControlButton.vue";
import WebcamButton from "./WebcamButton.vue";
import MicrophoneButton from "./MicrophoneButton.vue";
import StreamLayout from "./StreamLayout.vue";

const store = useStore();

const muted = computed(() => store.state.microphoneActive)
const screenshareActive = ref(false);

const focused = ref(true);
const onFocus = () => {
    focused.value = true;
}

const onUnfocus = () => {
    focused.value = false;
}

const onToggleScreenshare = () => {
    screenshareActive.value = !screenshareActive.value
}
</script>