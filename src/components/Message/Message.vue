<template>
    <div class="flex flex-row space-x-2 w-full" ref="msg">
        <avatar class="h-12 w-12" :src="userAvatar"></avatar>
        <div class="flex flex-col w-full">
            <div class="flex flex-row space-x-2 text-sm">
                <p class="font-bold">
                    {{username}}
                </p>
                <p class="text-gray-400">
                    {{timestamp}}
                </p>
            </div>
            <message-contents :contents="contents"></message-contents>
        </div>
    </div>
</template>

<script setup lang="ts">
import {defineProps, computed, ref, onMounted, onBeforeUnmount} from "vue";
import {useStore} from "vuex";
import { format } from 'timeago.js';
import Avatar from "@/components/atomic/Avatar.vue";
import MessageContents from "./MessageContents.vue";

const store = useStore();

const msg = ref();

const props = defineProps({
    msg: {
        type: Object,
        required: true
    }
});

onMounted(() => {
    ((msg.value as unknown) as HTMLElement).scrollIntoView()
})

const labelUpdater = setInterval(() => {
    timestamp.value = format(props.msg.timestamp);
}, 30*1000)

onBeforeUnmount(() => {
    clearInterval(labelUpdater);
})

const username = computed(() => {
    return store.getters["users/username"](props.msg.userId);
});

const timestamp = ref(format(props.msg.timestamp));

const contents = computed(() => {
    return props.msg.contents;
})

const userAvatar = computed(() => {
    return store.getters["users/avatar"](props.msg.userId);
})

</script>