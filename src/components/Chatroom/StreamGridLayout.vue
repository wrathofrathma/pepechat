<template>
    <div class="w-full h-full gap-4 grid grid-cols-12">
        <stream 
        v-for="s in userMedia" 
        :stream-user="s.user" 
        :stream-key="s.stream" 
        stream-type="userMedia" 
        :class="streamClasses(s.stream)"
        @click="$emit('selectPrimary', s.stream, s.user, 'userMedia')"
        ></stream>
        <stream 
        v-for="s in userScreens" 
        :stream-user="s.user" 
        :stream-key="s.stream" 
        stream-type="screenshare"
        :class="streamClasses(s.stream)"
        @click="$emit('selectPrimary', s.stream, s.user, 'screenshare')"
        ></stream>
    </div>
</template>

<script setup lang="ts">
import Stream from "@/components/Stream.vue";
import {computed, defineEmit} from "vue";
import {useStore} from "vuex";

const store = useStore();
defineEmit(["selectPrimary"])

const room = computed(() => store.state.route.params.id);
const userMedia = computed(() => store.getters["streams/userMediaStreamKeys"](room.value));
const userScreens = computed(() => store.getters["streams/userDisplayMediaKeys"](room.value));
const numberOfStreams = computed(() => store.getters["streams/numberOfVideoStreams"](room.value));

function streamClasses(key: string) {
    let cols = "col-span-12";
    if (numberOfStreams.value === 2)
        cols = "col-span-6";
    if (numberOfStreams.value >= 3)
        cols = "col-span-4";
    return [
        cols
    ]
}
</script>