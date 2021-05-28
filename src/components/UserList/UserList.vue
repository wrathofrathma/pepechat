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
            <user-row v-for="user in users" :user="user" :room-id="roomId" :row-type="tab"></user-row>
        </div>
    </div>
</template>

<script setup lang="ts">
import {computed, ref} from "vue";
import {useStore} from "vuex";
import type {User} from "../../scripts/types";
import UserRow from "./UserRow.vue"

const store = useStore();


const roomId = computed(() => store.state.route.params.id);
const tab = ref(store.state.route.params.id ? "room" : "index");

/**
 * Converts the dictionary of users in the store to a list of user keys.
 */
function removeDeadUsers(userDict: {[key: string]: User}) {
    const newUsers = [];
    for (const [key, val] of Object.entries(userDict)) {
        if (!val.dead)
            newUsers.push(key);
    }
    return newUsers;
}

const users = computed(() => {
    if (tab.value === "index")
        return removeDeadUsers(store.state.users.users)
    else {
        return store.getters["rooms/roomUsers"](roomId.value);
    }
});
</script>