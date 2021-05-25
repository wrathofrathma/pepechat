<template>
    <div class="flex h-full bg-black flex-col justify-between" @mouseenter="onFocus" @mouseleave="onUnfocus">
        <!-- Streams layouts -->
        <stream-layout></stream-layout>
        <!-- User Media Controls -->
        <div class="flex-row flex justify-center h-12">
            <webcam-button v-if="focused"
            ></webcam-button>
            <media-control-button :active="muted" @click="onToggleMute" v-if="focused">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clip-rule="evenodd" />
                </svg>
            </media-control-button>
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
import StreamLayout from "./StreamLayout.vue";
import {startMicrophone, stopMicrophone} from "../../scripts/streams";

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


const onToggleMute = async () => {
    if (!muted.value) {
        await startMicrophone();
    }
    else if (muted.value) {
        await stopMicrophone();
    }
}

const onToggleScreenshare = () => {
    screenshareActive.value = !screenshareActive.value
}
</script>