<template>
    <div class="flex flex-col bg-gray-900 border-green-400 h-full border-r border-l border-b">
        <div class="border-green-400 border-b-2 text-lg text-center flex flex-row justify-between">
            <div class="w-full cursor-pointer" @click="tab='index'" :class="[tab === 'index' && roomId ? 'bg-gray-800': '']">
                User Index
            </div>
            <div class="w-full cursor-pointer" v-if="roomId" @click="tab='room'" :class="[tab === 'room' && roomId ? 'bg-gray-800' : '']">
                Room Users
            </div>
        </div>
        <div class="overflow-y-scroll h-full no-scrollbar">
            <div v-for="user in users" class="flex flex-row items-center space-x-2">
                <avatar class="h-12 w-12" :src="user.avatar"></avatar>
                <p>{{user.username}}</p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import Avatar from "@/components/atomic/Avatar.vue"
import {computed, ref} from "vue";
import {useStore} from "vuex";
import type {User} from "../scripts/types";

const store = useStore();


const roomId = computed(() => store.state.route.params.id);
const tab = ref(store.state.route.params.id ? "room" : "index");

function removeDeadUsers(userDict: {[key: string]: User}) {
    const newDict: {[key: string]: User} = {};
    for (const [key, val] of Object.entries(userDict)) {
        if (!val.dead)
            newDict[key] = val;
    }
    return newDict;
}

const users = computed(() => {
    if (tab.value === "index")
        return removeDeadUsers(store.state.users)
    else {
        const uuids = store.getters.roomUsers(roomId.value);
        return uuids.map((val: string) => {
            return store.state.users[val];
        });
    }
});
</script>