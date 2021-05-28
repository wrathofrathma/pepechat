<template>
    <div 
    class="absolute z-10 bg-gray-900 rounded-md p-2 gap-2 grid grid-cols-6 h-96 w-96 overflow-y-scroll no-scrollbar"
    v-click-outside="closeSelector"
    >
        <emote 
        v-for="(emhref, em) in emoteList" 
        :src="emhref"
        :name="em"
        class="cursor-pointer hover:brightness-125 filter h-12 w-12"
        @click="$emit('selectEmote', em)"
        ></emote>
    </div>
</template>

<script setup lang="ts">
import {defineEmit, useContext, computed} from "vue";
import {useStore} from "vuex";
import Emote from "@/components/Emote.vue";

const store = useStore();
defineEmit(["close", "selectEmote"]);

const {emit} = useContext();

const emoteList = computed(() => store.state.emotes as {[key: string]: string});

function closeSelector() {
    emit("close");
}
</script>