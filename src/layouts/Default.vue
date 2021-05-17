<template>
    <div class="flex flex-col">
        <top-bar></top-bar>
        <!-- Main content container-->
        <div class="flex" style="height: calc(100vh - 5rem);">
            <slot></slot>
        </div>
    </div>
</template>

<script setup lang="ts">
import TopBar from "@/components/Header.vue";
</script>