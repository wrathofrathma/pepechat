<template>
    <div class="w-full">
        <!-- Contents -->
        <div style="white-space: pre-wrap;" v-html="processedContents" class="message text-lg">
        </div>
        <!-- Embeded Images -->
        <img v-for="image in images" :src="image">
        <!-- Embeded videos -->
        <iframe v-for="video in videos" :src="video" width="690" height="360"></iframe>
    </div>
</template>

<script setup lang="ts">
import {defineProps, computed, ref} from "vue";
import {useStore} from "vuex";
import marked from "marked";
import * as linkify from "linkifyjs";
import getVideoId from "get-video-id";


const store = useStore();

const props = defineProps({
    contents: {
        type: String,
        required: true
    }
});

function isImage(link: string) {
    const extensions = [
        "apng",
        "avif",
        "gif",
        "jpg",
        "jpeg",
        "jfif",
        "pjpeg",
        "pjp",
        "png",
        "svg",
        "webp"
    ];
    const linkSplit = link.split('.');
    const extension = linkSplit[linkSplit.length - 1];
    return extensions.includes(extension);
}

function getEmote(text: string, nTokens: number) {
    const key = text.substring(1, text.length-1).trim();
    const emote = store.state.emotes[key];
    const emoteSize = nTokens === 1 ? 16 : 8;
    // Shit, getting closer to JSX every day >:(
    if (emote)
        return `<img src="${emote}" class="h-${emoteSize} inline-block">`;
    return text;
}

const images = ref(Array<string>())
const videos = ref(Array<string>())
// So I was gonna do all of the parsing myself and then I found out about the marked javascript library
// It converts markdown to html and tbh, it works really well even with computed properties.
// It recognizes most things, and we can use v-html on our message div to embed the html marked spits out
// So our plan now is to pre-process our contents by tokenizing => detecting links / youtube videos / images / emotes => Converting those to markdown images & such => join back to a string => pass to marked
const processedContents = computed(() => {
    // Tokenize
    let tokens = props.contents.split(' ');
    const nTokens = props.contents.trim().split(' ').length;
    // Find our emotes by mapping to the tokens
    tokens = tokens.map((token) => {
        // Detect emotes
        const cleanToken = token.trim();
        if (cleanToken.substring(0, 1).trim() === ":" && cleanToken.substring(cleanToken.length-1, cleanToken.length).trim() === ":") {
            // If the first and last index are both :, then we have an emote
            return getEmote(cleanToken, nTokens);
        } 
        // Detect links using linkifyjs
        const link = linkify.find(token);
        // Detect if the link is an image
        if (link.length > 0 && isImage(link[0].href)) {
            images.value.push(link[0].href);
        }
        // Detect if the link is a video
        if (link.length > 0) {
            const video = getVideoId(link[0].href)
            if (video.id) {
                if (video.service === "youtube") {
                    videos.value.push(`https://www.youtube.com/embed/${video.id}`)
                }
            }
        }

        return token;
    });

    const preprocessedContents = tokens.join(' ');

    return marked(preprocessedContents);
})
</script>

<style scoped>
.message >>> a {
    @apply text-blue-400
}
</style>