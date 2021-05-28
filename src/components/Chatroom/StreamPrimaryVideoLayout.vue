<template>
    <div class="w-full h-full flex flex-row space-x-2">
        <!-- Primary video -->
        <div class="w-5/6 object-contain">
            <stream
            :stream-user="primaryVideoUser"
            :stream-key="primaryVideo"
            :stream-type="primaryVideoType"
            @click="$emit('selectPrimary', primaryVideo, primaryVideoUser, primaryVideoType)"
            >
            </stream>
        </div>
        <div class="grid grid-rows-3 grid-flow-col w-1/6 gap-1">
            <stream 
            v-for="s in userMedia" 
            :stream-user="s.user" 
            :stream-key="s.stream" 
            stream-type="userMedia" 
            @click="$emit('selectPrimary', s.stream, s.user, 'userMedia')"
            ></stream>
            <stream 
            v-for="s in userScreens" 
            :stream-user="s.user" 
            :stream-key="s.stream" 
            stream-type="screenshare"
            @click="$emit('selectPrimary', s.stream, s.user, 'screenshare')"
            ></stream>
        </div>
    </div>
</template>

<script setup lang="ts">
import Stream from "@/components/Stream.vue";
import {computed, defineEmit, defineProps} from "vue";
import {useStore} from "vuex";

const store = useStore();

const props = defineProps({
    primaryVideo: {
        type: String,
        required: true
    },
    primaryVideoType: {
        type: String,
        required: true
    },
    primaryVideoUser: {
        type: String,
        required: true
    }
})

defineEmit(["selectPrimary"])

const room = computed(() => store.state.route.params.id);
const userMedia = computed(() => {
    return (store.getters["streams/userMediaStreamKeys"](room.value) as Array<{user: string, stream: string}>)
        .filter((val) => {
            if (val.stream === props.primaryVideo)
                return false;
            return true;
        })
});
const userScreens = computed(() => {
    return (store.getters["streams/userDisplayMediaKeys"](room.value) as Array<{user: string, stream: string}>)
        .filter((val) => {
            if (val.stream === props.primaryVideo)
                return false;
            return true;
        })
});
</script>