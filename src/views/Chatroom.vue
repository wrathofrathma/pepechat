<template>
    <layout>

        <room-list class="w-1/6"></room-list>
        <div class="flex flex-col h-full w-full">
            <div class="flex flex-col bg-gray-800 h-full w-full overflow-y-scroll no-scrollbar">
                <div class="flex flex-row space-x-2 p-2" v-for="n in 20">
                    <div>Avatar</div>
                    <div class="flex flex-col">
                        <div>Username - Timestamp</div>
                        <div>Message content</div>
                    </div>
                </div>
            </div>
            <create-message class="border-green-400 border"></create-message>
        </div>

        <user-list class="w-1/6"></user-list>
        <!-- <div class="flex p-4 justify-center mt-20 pt-8">
            <div class="bg-gray-800 rounded-md border-2 border-green-400 w-4/5 flex flex-col messages">
                <div class="border-green-400 border-b text-lg text-center">
                    Chatroom
                </div> 
                <div class="h-full overflow-y-scroll border-green-400 border-t border-b">
                </div>
                <create-message></create-message>
            </div>
        </div> -->

    </layout>
</template>

<script setup lang="ts">
import Layout from "@/layouts/Default.vue"
import UserList from "@/components/UserList.vue"
import RoomList from "@/components/RoomIndex/RoomList.vue"
import TopBar from "@/components/Header.vue";
import CreateMessage from "@/components/CreateMessage.vue";

import {ref} from "vue";
import {useStore} from "vuex";

import joinRoom from "../scripts/joinRoom";

const store = useStore();

// HTTP request to join the room and this function handles the redirects should something go fucky.
joinRoom(store.state.route.params.id);
</script>

<style>
.messages {
    height: 80vh;
}
</style>