<template>
    <input type="range" min="0" max="100" @input="setStreamVolume" :value="streamVolume">
</template>

<script setup lang="ts">
import {defineProps, computed} from "vue";
import { useStore } from "vuex";

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

const store = useStore();

const streamVolume = computed(() => {
    if (props.streamType === "userMedia") {
        if (store.state.streams.userVolume[props.streamUser])
            return store.state.streams.userVolume[props.streamUser];
        return 100;
    } else {
        if (store.state.streams.userDisplayVolume[props.streamUser])
            return store.state.streams.userDisplayVolume[props.streamUser];
        return 100;
    }
});

const setStreamVolume = (e: Event) => {
    const volume = (e.target as HTMLInputElement).value;
    if (props.streamType === "userMedia") {
        store.commit("streams/setUserVolume", {user: props.streamUser, volume});
    } else {
        store.commit("streams/setUserDisplayVolume", {user: props.streamUser, volume});
    }
}
</script>