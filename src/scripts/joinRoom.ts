import HTTP from "../http";

import store from "../store";
import router from "../routes";

export default async function joinRoom(roomId: string, password: string = "") {
    await HTTP().post(`/room/${roomId}/join`, {password})
        .then(() => {
            // If we're not already on the page, then let's redirect.
            if (store.state.route.path !== `/${roomId}`)
                router.push(`/${roomId}`)
        })
        .catch((error) => {
            // Either connection error or failed to join the room for some reason
            if (error.response) {
                switch (error.response.status) {
                    case 403:
                        // Room needs valid password
                        router.push(`/${roomId}/knock`)
                        break;
                    case 404:
                        // Room doesn't exist
                        router.push("/")
                        break;
                    default:
                        break;
                }

            } else {
                console.error(error);
            }

        })
}