<template>
    <div class="w-full h-full grid grid-flow-row grid-cols-3 gap-4">
        <stream v-for="s in userMedia" :stream-user="s.user" :stream-key="s.stream" stream-type="userMedia"></stream>
    </div>
</template>

<script setup lang="ts">
import Stream from "@/components/Stream.vue";
import {computed} from "vue";
import {useStore} from "vuex";

const store = useStore();

const room = computed(() => store.state.route.params.id);
const userMedia = computed(() => store.getters.userMediaStreamKeys(room.value));
</script>