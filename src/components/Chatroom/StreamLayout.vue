<template>
    <div class="w-full h-full grid grid-flow-row grid-cols-3 gap-4">
        <stream v-for="s in userMedia" :stream-user="s.user" :track="s.track" stream-type="webcam"></stream>
        <user-audio v-for="m in userMics" :stream-user="m.user" :track="m.track"></user-audio>
    </div>
</template>

<script setup lang="ts">
import Stream from "@/components/Stream.vue";
import UserAudio from "./UserAudio.vue";
import {defineProps, ref, computed} from "vue";
import {useStore} from "vuex";

const store = useStore();

const room = computed(() => store.state.route.params.id);
const userMedia = computed(() => store.getters.userWebcams(room.value));
const userMics = computed(() => store.getters.userMics(room.value));
</script>