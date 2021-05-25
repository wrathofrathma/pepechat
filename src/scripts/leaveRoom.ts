import HTTP from "../http";
import { stopMicrophone, stopWebcam } from "./streams";
import {closeAllConnections} from "./webrtc";

export default async function leaveRoom(roomId: string) {
    // Clean up peer connections
    closeAllConnections();
    await stopWebcam();
    await stopMicrophone();
    await HTTP().post(`/room/${roomId}/leave`)
        .then(() => {
            // Do nothing?
        })
        .catch((error) => {
            // What error could we really hit here besides server not responding?
            console.error(error);
        })

}