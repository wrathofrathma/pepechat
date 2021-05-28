<template>
    <div class="bg-gray-900 border-green-400 border border-t-0 border-b-0 flex flex-col"> 
        <!-- Header -->
        <div class="text-center border-b-2 border-green-400 text-lg">
            Active Pepechats
        </div>
        <!-- Rooms list -->
        <div class="flex flex-col overflow-y-scroll flex-grow no-scrollbar">
            <room-row 
            v-for="room in rooms.length"
            :class="[room % 2 === 0 ? 'bg-gray-700' : 'bg-gray-800']"
            :room="rooms[room-1]"
            >
            </room-row>
        </div>
        <create-room></create-room>
    </div>
</template>

<script setup lang="ts">
import RoomRow from "@/components/RoomIndex/RoomRow.vue";
import CreateRoom from "@/components/RoomIndex/CreateRoom.vue"

import {useStore} from "vuex";
import {computed} from "vue";

const store = useStore();

const rooms = computed(() => store.getters["rooms/roomList"]);
</script>