<template>
    <media-control-button 
    :active="microphoneActive" 
    @click="onToggleMicrophone" 
    @contextmenu="onContextMenu"
    >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clip-rule="evenodd" />
        </svg>
    </media-control-button>
    <div
    class="absolute z-10 bg-gray-900 p-2 rounded-md"
    :style="contextMenuStyle"
    v-if="contextMenuOpen"
    v-click-outside="closeContextMenu"
    >
        <div v-for="device in audioDevices" class="p-2 hover:bg-gray-800 cursor-pointer" @click="onSelectMicrophone(device)">
            {{device.label}}
        </div>
    </div>
</template>

<script setup lang="ts">
import {computed, ref, defineProps} from "vue";
import {useStore} from "vuex";
import MediaControlButton from "./MediaControlButton.vue";
import {startMicrophone, stopMicrophone, selectMicrophone} from "../../scripts/streams";

const store = useStore();

const props = defineProps({
    top: {
        type: String,
        required: false,
    }
})

// Is our mic active? 
const microphoneActive = computed(() => store.state.devices.microphoneActive);
// List of audio devices gathered from navigator.mediaDevices.enumerateDevices()
const audioDevices = computed(() => store.getters["devices/audioDevices"]);
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

const onToggleMicrophone = async () => {
    // If we're turning on the mic , we need to fetch a stream for it. 
    if (!microphoneActive.value) {
        await startMicrophone();
    }
    // Otherwise, turning it off, we need to stop the active track if it exists.
    else if (microphoneActive.value) {
        await stopMicrophone();
    }
}

const onSelectMicrophone = async (mic: MediaDeviceInfo) => {
    contextMenuOpen.value = false;
    await selectMicrophone(mic);
}
</script>