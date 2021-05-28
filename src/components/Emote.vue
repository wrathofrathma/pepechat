<template>
    <div class="h-6 w-6">
        <img :src="src" class="h-full w-full">
    </div>
</template>

<script setup lang="ts">
import {defineProps} from "vue";

const props = defineProps({
    src: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    }
})
</script>