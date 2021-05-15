import store from "../store";
import {RoomIndex, RoomEntry} from "../scripts/types";

/**
 * This is called when the server sends us our updated user credentials (username, avatar, uuid).
 * @param {Object} payload 
 */
function onCredentials(payload: {username: string, avatar: string, uuid: string}) {
    const {username, avatar, uuid} = payload;
    if (username) {
        store.commit("setUsername", username);
    }
    if (avatar) {
        store.commit("setAvatar", avatar);
    }
    if (uuid) {
        store.commit("setUUID", uuid);
    }
}

function onRoomIndex(payload: {rooms: RoomIndex}) {
    const {rooms} = payload;
    console.log(rooms)
    store.commit("setRooms", rooms);
}

/**
 * Websocket message handler / router.
 * @param {WebSocket} ws Websocket
 * @param {MessageEvent<any>} ev Event payload
 */
function onMessage (this: WebSocket, ev: MessageEvent<any>): any {
    const data = JSON.parse(ev.data);

    switch (data.type) {
        case "credentials":
            onCredentials(data.payload);
            break;
    
        case "rooms/index":
            onRoomIndex(data.payload);
            break;

        default:
            break;
    }
}

export default onMessage;