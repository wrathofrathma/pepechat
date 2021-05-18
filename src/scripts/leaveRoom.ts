import HTTP from "../http";

export default async function leaveRoom(roomId: string) {
    await HTTP().post(`/room/${roomId}/leave`)
        .then(() => {
            // Do nothing?
        })
        .catch((error) => {
            // What error could we really hit here besides server not responding?
            console.error(error);
        })

}