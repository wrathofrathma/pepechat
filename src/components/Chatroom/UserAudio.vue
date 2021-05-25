<template>
    <audio autoplay :srcObject="stream">

    </audio>
</template>

<script setup lang="ts">
import Stream from "@/components/Stream.vue"
import {defineProps, ref, computed} from "vue";
import {useStore} from "vuex";

const store = useStore();

const props = defineProps({
    streamUser: {
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