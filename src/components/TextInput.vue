<template>
    <input 
    class="p-1 bg-transparent h-full w-full"
    :placeholder="placeholder"
    :value="modelValue"
    @input="onInput"
    >
</template>
<script setup lang="ts">
import {defineProps, defineEmit, useContext} from "vue";

const props = defineProps({
    placeholder: {
        type: String,
        required: false
    },
    modelValue: {
        type: String,
        required: false
    }
})

defineEmit(["update:modelValue"])
const {emit} = useContext();

const onInput = (event: Event) => {
    const {target} = event;
    emit("update:modelValue", (target as HTMLInputElement).value);
}
</script>