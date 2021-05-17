<template>
    <img :src="src" class="rounded-full">
</template>

<script setup lang="ts">
import {defineProps} from "vue";

const props = defineProps({
    src: {
        type: String,
        required: false,
        default: "/src/assets/avatars/pepejam.gif"
    }
})
</script>