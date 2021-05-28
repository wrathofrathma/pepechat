<template>
    <div class="flex flex-col">
        <room-stream-container 
        :class="streamContainerClasses"
        @expand="onExpand"
        @collapse="onCollapse"
        :expanded="expanded"
        ></room-stream-container>
        <message-list 
        :room-id="roomId" 
        :class="messageListClasses"
        ></message-list>
        <create-message class="border-green-400 border-t border-b" :room-id="roomId"></create-message>
    </div>
</template>

<script setup lang="ts">
import CreateMessage from "@/components/CreateMessage.vue";
import MessageList from "./MessageList.vue";
import {computed, defineProps, ref} from "vue";
import {useStore} from "vuex";
import RoomStreamContainer from "./RoomStreamContainer.vue"

const store = useStore();

const props = defineProps({
    roomId: {
        type: String,
        required: true
    }
});

const nVideos = computed(() => store.getters["streams/numberOfVideoStreams"](props.roomId));

const expanded = ref(false);
const onExpand = () => {
    expanded.value = true;
}

const onCollapse = () => {
    expanded.value = false;
}

const streamContainerClasses = computed(() => {
    const classes: Array<String> = [];
    // If there's no video streams, let's hide it and we'll allow the message list to take up the entire viewport
    if (nVideos.value === 0) {
        classes.push("hidden");
        return classes;
    }
    // If there are videos, it's dependent on whether the viewport is expanded.
    if (expanded.value) {
        classes.push("h-2/3");
    } else {
        classes.push("h-1/2");
    }

    return classes;
});

const messageListClasses = computed(() => {
    const classes: Array<String> = [];

    if (nVideos.value === 0) {
        classes.push("h-full");
        return classes;
    }
    if (expanded.value) {
        classes.push("h-1/3");
    } else {
        classes.push("h-1/2");
    }

    return classes;
});
</script>