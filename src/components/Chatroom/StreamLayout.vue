<template>
    <div class="w-full h-full gap-4 grid grid-cols-12">
        <stream 
        v-for="s in userMedia" 
        :stream-user="s.user" 
        :stream-key="s.stream" 
        stream-type="userMedia" 
        :class="streamClasses(s.stream)"
        ></stream>
        <stream 
        v-for="s in userScreens" 
        :stream-user="s.user" 
        :stream-key="s.stream" 
        stream-type="screenshare"
        :class="streamClasses(s.stream)"
        ></stream>
    </div>
</template>

<script setup lang="ts">
import Stream from "@/components/Stream.vue";
import {computed, ref} from "vue";
import {useStore} from "vuex";

const store = useStore();

const room = computed(() => store.state.route.params.id);
const userMedia = computed(() => store.getters.userMediaStreamKeys(room.value));
const userScreens = computed(() => store.getters.userDisplayMediaKeys(room.value));
const numberOfStreams = computed(() => store.getters.numberOfVideoStreams(room.value));
const primaryVideo = ref("");

// Layout of the actual class
function streamClasses(key: string) {
    // Is not the selected video
    let cols = "col-span-12";
    if (numberOfStreams.value === 2)
        cols = "col-span-6";
    if (numberOfStreams.value >= 3)
        cols = "col-span-4";
    console.log(cols)
    return [
        cols
    ]
}
</script>