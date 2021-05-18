import HTTP from "../http";
import router from "../routes";

export default async function ({video, audio, isPrivate, screenshare, password, name}: any) {
    await HTTP().post("/room/create", {
        video: video,
        audio: audio,
        private: isPrivate,
        screenshare: screenshare,
        password: password,
        name
    })
    .then((res) => {
        const {id} = res.data;
        router.push(id)
    })
    .catch((error) => {
        console.error(error)
    })
}