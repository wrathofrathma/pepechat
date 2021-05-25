<template>
    <div class="flex flex-col w-96 h-96 bg-blue-400">
        <video :autoplay="true" class="video" :srcObject="stream"></video>
        {{streamUser}}
        {{streamType}}
    </div>
</template>

<script setup lang="ts">
import {defineProps, computed} from "vue";

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
</script>