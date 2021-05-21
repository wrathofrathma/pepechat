<template>
    <div class="flex flex-col">
        <room-stream-container></room-stream-container>
        <message-list :room-id="roomId"></message-list>
        <create-message class="border-green-400 border-t border-b" :room-id="roomId"></create-message>
    </div>
</template>

<script setup lang="ts">
import CreateMessage from "@/components/CreateMessage.vue";
import MessageList from "./MessageList.vue";
import {defineProps} from "vue";
import RoomStreamContainer from "./RoomStreamContainer.vue"

const props = defineProps({
    roomId: {
        type: String,
        required: true
    }
});

</script>