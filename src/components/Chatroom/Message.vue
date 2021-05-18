<template>
    <div class="flex flex-row space-x-2" ref="msg">
        <avatar class="h-12 w-12" :src="userAvatar"></avatar>
        <div class="flex flex-col">
            <div class="flex flex-row space-x-2 text-sm">
                <p class="font-bold">
                    {{username}}
                </p>
                <p class="text-gray-400">
                    {{timestamp}}
                </p>
            </div>
            <div style="white-space: pre-wrap;">
                {{contents}}
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import {defineProps, computed, ref, onMounted, onBeforeUnmount} from "vue";
import {useStore} from "vuex";
import { format } from 'timeago.js';
import Avatar from "@/components/atomic/Avatar.vue"

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
    return store.getters.username(props.msg.userId);
});

const timestamp = ref(format(props.msg.timestamp));

const contents = computed(() => {
    console.log(JSON.stringify(props.msg.contents))
    return props.msg.contents;
})

const userAvatar = computed(() => {
    return store.getters.avatar(props.msg.userId);
})

</script>