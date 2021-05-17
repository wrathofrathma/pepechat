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

/**
 * Update the JWT token so our REST requests match our session id.
 * @param payload Data payload containing the user's JWT token.
 */
function onToken(payload: {token: string}) {
    const {token} = payload;
    store.commit("setToken", token);
    console.log("Token", token)
}

function onRoomIndex(payload: {rooms: RoomIndex}) {
    const {rooms} = payload;
    store.commit("setRooms", rooms);
}

function onUserIndex(payload: {users: Object}) {
    const {users} = payload;
    store.commit("setUsers", users)
}

/**
 * Websocket message handler / router.
 * @param {WebSocket} ws Websocket
 * @param {MessageEvent<any>} ev Event payload
 */
function onMessage (this: WebSocket, ev: MessageEvent<any>): any {
    const data = JSON.parse(ev.data);
    console.log(data)
    switch (data.event) {
        case "credentials":
            onCredentials(data.payload);
            break;
        
        case "token":
            onToken(data.payload);
            break;
    
        case "room/index":
            onRoomIndex(data.payload);
            break;

        case "user/index":
            onUserIndex(data.payload);
            break;
        default:
            break;
    }
}

export default onMessage;