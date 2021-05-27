<template>
    <div class="flex flex-col">
        <room-stream-container :class="[nVideos === 0 ? 'hidden' : '']"></room-stream-container>
        <message-list :room-id="roomId"></message-list>
        <create-message class="border-green-400 border-t border-b" :room-id="roomId"></create-message>
    </div>
</template>

<script setup lang="ts">
import CreateMessage from "@/components/CreateMessage.vue";
import MessageList from "./MessageList.vue";
import {computed, defineProps} from "vue";
import {useStore} from "vuex";
import RoomStreamContainer from "./RoomStreamContainer.vue"

const store = useStore();

const props = defineProps({
    roomId: {
        type: String,
        required: true
    }
});

const nVideos = computed(() => store.getters.numberOfVideoStreams(props.roomId));
</script>