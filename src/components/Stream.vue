<template>
    <div 
    class="flex items-center relative flex-col justify-center"
    @mouseenter="onHover"
    @mouseleave="onLeave"
    :class="[containsVideo ? '' : 'hidden']"
    @contextmenu="onContextMenu"
    >
        <video :autoplay="true" :srcObject="stream" class="block flex-grow" :volume="streamVolume / 100"></video>
        <div class="absolute bottom-0 bg-black bg-opacity-20 p-1 rounded-lg" v-if="hovering">
            {{username}}
        </div>
        <div class="bg-black bg-opacity-50 w-full h-full z-10 absolute items-center justify-center flex flex-col space-y-2" v-if="contextMenuOpen" v-click-outside="closeContextMenu">
            <div>
                Stream Volume
            </div>
            <volume-slider :stream-user="streamUser" :stream-type="streamType"></volume-slider>
        </div>
    </div>
</template>

<script setup lang="ts">
import {defineProps, computed, ref} from "vue";
import VolumeSlider from "@/components/Chatroom/VolumeSlider.vue";

import {useStore} from "vuex";

const store = useStore();
const props = defineProps({
    streamUser: {
        type: String,
        required: true
    },
    streamKey: {
        type: String,
        required: true
    },
    streamType: {
        type: String,
        required: true
    }
})

const stream = computed(() => store.getters.stream(props.streamKey));
const username = computed(() => store.getters.username(props.streamUser));
const uuid = computed(() => store.state.uuid);

const containsVideo = computed(() => {
    const roomId = store.state.route.params.id;
    const room = store.state.rooms[roomId];
    return room.streamState[props.streamUser].webcam;
})

const hovering = ref(false);
const onHover = () => {
    hovering.value = true;
}

const onLeave = () => {
    hovering.value = false;
}

/*******  Context menu stuff *******/
const contextMenuOpen = ref(false);
const onContextMenu = (e: Event) => {
    e.preventDefault();
    // Let's not do anything if it's our own stream
    if (props.streamUser === uuid.value)
        return;
    // Open the context menu
    contextMenuOpen.value = !contextMenuOpen.value;
}

const closeContextMenu = () => {
    contextMenuOpen.value = false;
}

const streamVolume = computed(() => {
    if (props.streamType === "userMedia") {
        if (store.state.userVolume[props.streamUser])
            return store.state.userVolume[props.streamUser];
        return 100;
    }
    // TODO - Add support for screenshare streams
    return 100;
});
</script>