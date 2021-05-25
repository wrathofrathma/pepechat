<template>
    <div 
    class="flex items-center relative flex-col"
    @mouseenter="onHover"
    @mouseleave="onLeave"
    >
        <video :autoplay="true" class="video" :srcObject="stream" style="display: block;"></video>
        <div class="absolute bottom-0 bg-black bg-opacity-20 p-1 rounded-lg" v-if="hovering">
            {{username}}
        </div>
    </div>
</template>

<script setup lang="ts">
import {defineProps, computed, ref} from "vue";

import {useStore} from "vuex";

const store = useStore();
const props = defineProps({
    streamUser: {
        type: String,
        required: true
    },
    streamType: {
        type: String,
        required: true
    },
    track: {
        type: String,
        required: true
    }
})


const stream = computed(() => store.getters.track(props.track));
const username = computed(() => store.getters.username(props.streamUser));

const hovering = ref(false);
const onHover = () => {
    hovering.value = true;
}

const onLeave = () => {
    hovering.value = false;
}
</script>