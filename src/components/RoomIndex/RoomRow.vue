<template>
    <div 
    class="p-2 justify-between flex flex-row hover:bg-green-400 hover:bg-opacity-20 cursor-pointer items-center filter hover:brightness-125"
    @click="joinRoom(room.id)"
    >
        <!-- Room name -->
        <div class="">
            {{room.name}}
        </div>
        <!-- Avatars for the users in the room -->
        <div v-if="mainIndex" class="flex">
            <!-- I had no fucking idea I could use store.getters in this binding. I wonder if something will break with this. -->
            <avatar 
            v-for="user in room.users" 
            :src="store.getters['users/avatar'](user)"
            class="h-8 w-8"
            ></avatar>
        </div>
        <!-- <div v-else>
            {{room.users.length}} / ∞
        </div> -->
        <!-- Room Settings -->
        <div class="flex flex-row text-gray-500">
            <!-- Webcam-->
            <svg v-if="room.video" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <!-- Audio -->
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
            <!-- Screenshare -->
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <!-- Private -->
            <svg v-if="room.locked" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
        </div>
    </div>
</template>

<script setup lang="ts">
import {defineProps, computed} from "vue";
import {useStore} from "vuex";
import joinRoom from "../../scripts/joinRoom";
import Avatar from "@/components/atomic/Avatar.vue"

const props = defineProps({
    room: {
        type: Object,
        required: true
    }
})

const store = useStore();

// We need to find out if we're in a room, since that would use the smaller layout without the user avatars in the list.
const mainIndex = computed(() => {
    const id = store.state.route.params.id;
    if (id) {
        // if this is true, we're in a normal room
        return false;
    }
    return true;
})
</script>