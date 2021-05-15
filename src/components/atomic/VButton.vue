<template>
    <button @click="$emit('click')"
    class="focus:outline-none"
    ><slot></slot></button>
</template>

<script setup lang="ts">
import {defineEmit} from "vue";

defineEmit(["click"])
</script>