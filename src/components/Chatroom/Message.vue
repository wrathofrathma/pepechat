<template>
    <div class="flex flex-row space-x-2">
        <avatar class="h-12 w-12"></avatar>
        <div class="flex flex-col">
            <div class="flex flex-row space-x-2 text-sm">
                <p class="font-bold">
                    {{username}}
                </p>
                <p class="text-gray-400">
                    {{timestamp}}
                </p>
            </div>
            <div>
                {{contents}}
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import {defineProps, computed} from "vue";
import {useStore} from "vuex";
import type {Message} from "../../scripts/types";
import { format } from 'timeago.js';
import Avatar from "@/components/atomic/Avatar.vue"

const store = useStore();

const props = defineProps({
    msg: {
        type: Object,
        required: true
    }
});

const username = computed(() => {
    return store.getters.username(props.msg.userId);
});

const timestamp = computed(() => {
    return format(props.msg.timestamp);
})

const contents = computed(() => {
    return props.msg.contents;
})

const userAvatar = computed(() => {
    return store.getters.avatar(props.msg.userId);
})

</script>