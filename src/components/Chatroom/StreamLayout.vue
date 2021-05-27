<template>
    <stream-primary-video-layout
     v-if="primaryVideo" 
     @select-primary="onSelectPrimary"
    :primary-video="primaryVideo"
    :primary-video-type="primaryVideoType"
    :primary-video-user="primaryVideoUser"
     ></stream-primary-video-layout>
    <stream-grid-layout 
    v-else 
    @select-primary="onSelectPrimary"
    ></stream-grid-layout>
</template>

<script setup lang="ts">
import StreamPrimaryVideoLayout from "@/components/Chatroom/StreamPrimaryVideoLayout.vue";
import StreamGridLayout from "@/components/Chatroom/StreamGridLayout.vue";
import {ref} from "vue";

const primaryVideo = ref("");
const primaryVideoType = ref("");
const primaryVideoUser = ref("");

const onSelectPrimary = (key: string, user: string, videoType: string) => {
    primaryVideo.value = key;
    primaryVideoType.value = videoType;
    primaryVideoUser.value = user;
}
</script>