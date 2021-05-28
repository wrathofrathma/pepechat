<template>
    <div class="w-screen h-screen absolute z-50 bg-opacity-20 items-center flex justify-center" v-if="visible">
        <div v-click-outside="close" class="grid grid-cols-9 gap-4 bg-gray-800 p-3 rounded-lg border-green-400 border">
            <div v-for="av in avatarList" @click="selectAvatar(av)">
                <avatar :src="av" class="w-16 h-16 cursor-pointer border-green-400 filter hover:brightness-125"></avatar>
            </div>

        </div>
    </div>
</template>

<script setup lang="ts">
import {defineProps, defineEmit, useContext, onMounted, ref} from "vue";
import getAvatarList from "../scripts/getAvatarList";
import Avatar from "@/components/atomic/Avatar.vue";
import updateAvatar from "../scripts/updateAvatar";
const props = defineProps({
    visible: {
        type: Boolean,
        default: true,
        required: true
    }
})

const {emit} = useContext();
const avatarList = ref([] as Array<string>);
onMounted(async () => {
    avatarList.value = await getAvatarList();
})

const close = () => {
    emit("close");
}
defineEmit(["close"])

const selectAvatar = async (avatar: string) => {
    await updateAvatar(avatar);
    close();
}
</script>