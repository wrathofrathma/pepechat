<template>
    <img :src="src" class="rounded-full">
</template>

<script setup lang="ts">
import {defineProps, computed} from "vue";
import {useStore} from "vuex";

const store = useStore();

const props = defineProps({
    src: {
        type: String,
        required: false,
        default: ""
    }
})
</script>