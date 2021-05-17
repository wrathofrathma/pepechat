<template>
    <textarea
    :value="modelValue"
    @input="onInput"
    ></textarea>
</template>

<script setup lang="ts">
import {defineProps, defineEmit, useContext} from "vue";

const props = defineProps({
    modelValue: {
        type: String,
    }
})

defineEmit(["update:modelValue"])

const {emit} = useContext();

function onInput(event: Event) {
    const {target} = event;
    emit("update:modelValue", (target as HTMLInputElement).value);
}
</script>