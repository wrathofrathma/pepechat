<template>
    <div class="bg-green-400 w-full h-full">
        <stream v-for="s in userMedia" :stream-user="s.user" :track="s.track" stream-type="webcam"></stream>
    </div>
</template>

<script setup lang="ts">
import Stream from "@/components/Stream.vue"
import {defineProps, ref, computed} from "vue";
import {useStore} from "vuex";

const store = useStore();

const room = computed(() => store.state.route.params.id);
const userMedia = computed(() => store.getters.userWebcams(room.value));
</script>