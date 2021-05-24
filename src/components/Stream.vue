<template>
    <div class="flex flex-col w-96 h-96 bg-blue-400">
        <video :autoplay="true" class="video" :srcObject="stream"></video>
        {{streamUser}}
        {{streamType}}
    </div>
</template>

<script setup lang="ts">
import {defineProps, computed, onMounted, onUnmounted} from "vue";

import {useStore} from "vuex";
import store from "../store";
import {getUserWebcam} from "../scripts/streams";

const props = defineProps({
    streamUser: {
        type: String,
        required: true
    },
    streamType: {
        type: String,
        required: true
    }
})

const stream = computed(() => store.getters.webcamStream(props.streamUser));

</script>