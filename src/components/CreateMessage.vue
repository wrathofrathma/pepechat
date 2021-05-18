<template>
    <div class="p-2">
        <text-field
        class="bg-transparent w-full resize-none focus:outline-none"
        @keyup.exact.enter="sendMessage"
        placeholder="Message"
        v-model="messageValue"
        >
        </text-field>
    </div>
</template>

<script setup lang="ts">
import TextField from "@/components/atomic/TextField.vue";

import {ref, defineProps} from "vue";
import {useStore} from "vuex";

const store = useStore();
const messageValue = ref("");

const props = defineProps({
    roomId: {
        type: String,
        required: true
    }
})

const sendMessage = () => {
    console.log(JSON.stringify(messageValue.value))
    if (messageValue.value === "\n" || !messageValue.value){
        messageValue.value = "";
        return;
    }
    store.state.socket.send(JSON.stringify({
        event: "room/createmessage",
        payload: {
            roomId: props.roomId,
            message: messageValue.value,
        }
    }))
    messageValue.value = "";
}
</script>