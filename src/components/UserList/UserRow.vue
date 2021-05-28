<template>
    <div 
    class="flex flex-row items-center filter hover:brightness-125 hover:bg-gray-800 pb-1 pt-1 cursor-pointer relative justify-between"
    @contextmenu="onContextMenu" 
    >
        <!-- User Details -->
        <div class="flex flex-row items-center space-x-2">
            <avatar class="h-12 w-12" :src="avatar"></avatar>
            <p>{{username}}</p>
        </div>
        <!-- User Streams -->
        <div v-if="rowType==='room'" class="pr-1 text-red-400 flex flex-row">
            <div v-if="webcamState">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                </svg>
            </div>
            <div v-if="micState">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clip-rule="evenodd" />
                </svg>
            </div>
            <div v-if="screenshareState">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2h-2.22l.123.489.804.804A1 1 0 0113 18H7a1 1 0 01-.707-1.707l.804-.804L7.22 15H5a2 2 0 01-2-2V5zm5.771 7H5V5h10v7H8.771z" clip-rule="evenodd" />
                </svg>
            </div>
        </div>
        <div 
        class="absolute z-10 w-full h-full items-center flex justify-center rounded-lg flex-col bg-black bg-opacity-90"
        v-if="contextMenuOpen"
        v-click-outside="closeContextMenu"
        >
            <div>
                User Volume
            </div>
            <volume-slider streamType="userMedia" :stream-user="user"></volume-slider>
        </div>
    </div>
</template>

<script setup lang="ts">
import Avatar from "@/components/atomic/Avatar.vue"
import VolumeSlider from "@/components/Chatroom/VolumeSlider.vue"
import {computed, defineProps, ref} from "vue";
import {useStore} from "vuex";

const props = defineProps({
    user: {
        type: String,
        required: true
    },
    roomId: {
        type: String,
        required: true,
        default: ""
    },
    rowType: {
        type: String,
        required: true
    }
})

const store = useStore();

const onContextMenu = (e: Event) => {
    e.preventDefault();
    contextMenuOpen.value = true;
}

const closeContextMenu = () => {
    contextMenuOpen.value = false;
}

const contextMenuOpen = ref(false);

const username = computed(() => store.getters["users/username"](props.user));
const avatar = computed(() => store.getters["users/avatar"](props.user));
const webcamState = computed(() => store.getters["rooms/userWebcamState"](props.roomId, props.user));
const micState = computed(() => store.getters["rooms/userMicrophoneState"](props.roomId, props.user));
const screenshareState = computed(() => store.getters["rooms/userScreenshareState"](props.roomId, props.user));
</script>