<template>
    <div class="flex flex-col bg-gray-800 h-full w-full overflow-y-scroll no-scrollbar" ref="messageContainer">
        <div class="flex flex-row space-x-2 p-2" v-for="msg in roomMessages">
            <message :msg="msg"></message>
        </div>
    </div>
</template>

<script setup lang="ts">
import Message from "@/components/Chatroom/Message.vue"

import {defineProps, computed, ref, watch} from "vue";
import {useStore} from "vuex";

const props = defineProps({
    roomId: {
        type: String,
        required: true
    }
});

const store = useStore();

const roomMessages = computed(() => store.getters.roomMessages(props.roomId));
// const messageContainer = ref(null);

// watch(roomMessages.value, (() => {
//     if (messageContainer.value !== null) {
//         ((messageContainer.value as unknown) as HTMLElement).scrollTop = ((messageContainer.value as unknown) as HTMLElement).scrollHeight;
//     }
// }));
</script>