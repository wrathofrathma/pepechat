<template>
    <div class="p-2">
        <text-field
        class="bg-transparent w-full resize-none"
        @keyup.enter="sendMessage"
        placeholder="Message"
        v-model="messageValue"
        >
        </text-field>
    </div>

</template>

<script setup lang="ts">
import TextField from "@/components/atomic/TextField.vue";

import {ref} from "vue";
import {useStore} from "vuex";

const store = useStore();
const messageValue = ref("");

const sendMessage = () => {
    messageValue.value = "";
    store.state.socket.send(JSON.stringify({
        event: "room/createmessage",
        payload: {
            roomId: "",
            message: messageValue.value,
            media: ""
        }
    }))
}
</script>