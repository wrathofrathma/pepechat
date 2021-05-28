<template>
    <media-control-button 
    :active="webcamActive" 
    @click="onToggleWebcam" 
    @contextmenu="onContextMenu"
    >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
        <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
        </svg>
    </media-control-button>
    <div
    class="absolute z-10 bg-gray-900 p-2 rounded-md"
    :style="contextMenuStyle"
    v-if="contextMenuOpen"
    v-click-outside="closeContextMenu"
    >
        <div v-for="device in videoDevices" class="p-2 hover:bg-gray-800 cursor-pointer" @click="onSelectWebcam(device)">
            {{device.label}}
        </div>
    </div>
</template>

<script setup lang="ts">
import {computed, ref, defineProps} from "vue";
import {useStore} from "vuex";
import MediaControlButton from "./MediaControlButton.vue";
import {startWebcam, stopWebcam, selectWebcam} from "../../scripts/streams";

const store = useStore();
const props = defineProps({
    top: {
        type: String,
        required: false,
    }
})

// Is our webcam active? 
const webcamActive = computed(() => store.state.devices.webcamActive);
// List of video devices gathered from navigator.mediaDevices.enumerateDevices()
const videoDevices = computed(() => store.getters["devices/videoDevices"]);
// Position of the click for our modal to be positioned at.
const menuLeft = ref(0);
const menuTop = ref(0);
// Context menu open?
const contextMenuOpen = ref(false);

/**
 * What happens when we right click the button. Launches our context menu
 */
const onContextMenu = async (e: MouseEvent) => {
    // Prevent default behavior
    e.preventDefault();
    // Set the position of our context menu to where we clicked
    menuLeft.value = e.pageX;
    menuTop.value = e.pageY;
    // Show our context menu
    contextMenuOpen.value = true;
}

const closeContextMenu = () => {
    contextMenuOpen.value = false;
}

// Computed the context menu position styling
const contextMenuStyle = computed(() => {
    return {
        top: props.top? props.top : menuTop.value,
        left: menuLeft.value
    }
})

const onToggleWebcam = async () => {
    // If we're turning on the webcam, we need to fetch a stream for it. 
    if (!webcamActive.value) {
        await startWebcam();
    }
    // Otherwise, turning it off, we need to stop the active track if it exists.
    else if (webcamActive.value) {
        await stopWebcam();
    }
}

const onSelectWebcam = async (webcam: MediaDeviceInfo) => {
    contextMenuOpen.value = false;
    await selectWebcam(webcam);
}
</script>