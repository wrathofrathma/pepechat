<template>
    <media-control-button 
    :active="screenshareActive" 
    @mouseup="onToggleScreenshare"
    @contextmenu="onContextMenu"
    >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2h-2.22l.123.489.804.804A1 1 0 0113 18H7a1 1 0 01-.707-1.707l.804-.804L7.22 15H5a2 2 0 01-2-2V5zm5.771 7H5V5h10v7H8.771z" clip-rule="evenodd" />
        </svg>
    </media-control-button>
</template>

<script setup lang="ts">
import {computed, ref} from "vue";
import {useStore} from "vuex";
import MediaControlButton from "./MediaControlButton.vue";
import {startScreenshare, stopScreenshare} from "../../scripts/streams";

const store = useStore();

// Is our screenshare active? 
const screenshareActive = computed(() => store.state.devices.screenshareActive);

/**
 * What happens when we right click the button. Launches our context menu
 */
const onContextMenu = async (e: MouseEvent) => {
    // Prevent default behavior
    e.preventDefault();
}

const onToggleScreenshare = async (e: MouseEvent) => {
    // If we're turning on the screenshare stream, we need to fetch a stream for it. 
    if (!screenshareActive.value) {
        await startScreenshare();
    }
    // Otherwise, turning it off, we need to stop the active track if it exists.
    else if (screenshareActive.value) {
        await stopScreenshare();
    }
}
</script>