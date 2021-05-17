<template>
    <div class="flex flex-col">
        <message-list></message-list>
        <create-message class="border-green-400 border"></create-message>
    </div>
</template>

<script setup lang="ts">
import CreateMessage from "@/components/CreateMessage.vue";
import MessageList from "./MessageList.vue";
import {defineProps} from "vue";

const props = defineProps({
    roomId: {
        type: String,
        required: true
    }
});


</script>