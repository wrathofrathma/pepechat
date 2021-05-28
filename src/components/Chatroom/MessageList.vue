<template>
    <div class="flex flex-col bg-gray-800 w-full overflow-y-scroll no-scrollbar">
        <div class="flex flex-row space-x-2 p-2" v-for="msg in roomMessages">
            <message :msg="msg"></message>
        </div>
    </div>
</template>

<script setup lang="ts">
import Message from "@/components/Message/Message.vue"

import {defineProps, computed} from "vue";
import {useStore} from "vuex";

const props = defineProps({
    roomId: {
        type: String,
        required: true
    }
});

const store = useStore();

const roomMessages = computed(() => store.getters["rooms/roomMessages"](props.roomId));
</script>