<template>
    <div class="p-2 flex flex-row">
        <text-field
        class="bg-transparent w-full resize-none focus:outline-none"
        @keyup.exact.enter="sendMessage"
        placeholder="Message"
        v-model="messageValue"
        id="chatbox"
        >
        </text-field>
        <div class="relative flex">
        <v-button class="hover:text-green-400" @click="emoteSelectorVisible=true">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
        </v-button>
        <emote-selector 
        class="bottom-0 right-0" 
        v-if="emoteSelectorVisible"
        @close="emoteSelectorVisible=false"
        @selectEmote="onSelect"
        ></emote-selector>
        </div>
    </div>
</template>

<script setup lang="ts">
import TextField from "@/components/atomic/TextField.vue";
import VButton from "@/components/atomic/VButton.vue";
import EmoteSelector from "@/components/EmoteSelector.vue";

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

const emoteSelectorVisible = ref(false);

const onSelect = (emote: string) => {
    emoteSelectorVisible.value = false;
    // Do we need to insert a leading space to separate the emote from other text?
    const leadingSpace = messageValue.value.length > 0 ? messageValue.value[messageValue.value.length-1] !== " " : false;
    messageValue.value = messageValue.value.concat(leadingSpace ? " :" : ":", emote,": ");
    // I tried so hard to get vue refs to work with the chatbox, but it just didn't want to work.
    // Kept telling me that focus() didn't exist on it. So I'm just gonna do it the old way.
    document.getElementById("chatbox")?.focus();
}

const sendMessage = () => {
    // TODO - Regex match this to check for messages containing only newlines lol
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