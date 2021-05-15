<template>
    <div class="bg-gray-800 w-1/2 rounded-md border-green-400 border-2">
        <!-- Header -->
        <div class="text-center border-b-2 border-green-400 text-lg">
            Active Pepechats
        </div>
        <!-- Rooms list -->
        <div class="flex flex-col overflow-y-scroll roomlist">
            <div v-for="room in rooms.length" class="p-2" :class="[room % 2 === 0 ? 'bg-gray-700' : 'bg-gray-800']">
                {{rooms[room-1].name}}
            </div>
        </div>
        <!-- Create room -->
        <create-room></create-room>
    </div>
</template>

<script setup lang="ts">
import CreateRoom from "@/components/CreateRoom.vue"
import {useStore} from "vuex";
import {computed} from "vue";

const store = useStore();

const rooms = computed(() => store.getters["roomList"]);
</script>

<style scoped>
.roomlist {
    max-height: 70vh;
    min-height: 20vh;
    -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;  /* Firefox */
}

.roomlist:nth-child(odd) {
    @apply bg-blue-600;
}

.roomlist::-webkit-scrollbar {
    display: none;
}
</style>