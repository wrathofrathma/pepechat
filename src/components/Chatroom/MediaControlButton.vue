<template>
    <v-button 
    class="p-2 rounded-full hover:brightness-125 filter hover:bg-opacity-10 hover:bg-green-400" 
    :class="mediaButtonClasses(active)"
    @click="$emit('click')"
    >
        <slot></slot>
    </v-button>
</template>

<script setup lang="ts">
import {defineProps, defineEmit} from "vue";
import VButton from "@/components/atomic/VButton.vue"

const props = defineProps({
    active: {
        type: Boolean,
        default: false
    }
})

defineEmit(["click"]);

const mediaButtonClasses = (active: boolean) => {
    const activeClasses = [
        "text-white"
    ];

    const inactiveClasses = [
        "text-gray-400"
    ];

    return active ? activeClasses : inactiveClasses;
}
</script>