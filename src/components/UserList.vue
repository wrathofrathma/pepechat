<template>
    <div class="flex flex-col bg-gray-900 border-green-400 h-full border-r border-l">
        <div class="border-green-400 border-b-2 text-lg text-center ">
            User list
        </div>
        <div class="overflow-y-scroll h-full no-scrollbar">
            <div v-for="user in users" class="flex flex-row items-center space-x-2">
                <avatar class="h-12 w-12"></avatar>
                <p>{{user.username}}</p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import Avatar from "@/components/atomic/Avatar.vue"
import {computed} from "vue";
import {useStore} from "vuex";

const store = useStore();
const users = computed(() => store.state.users);
</script>