import store from "../store";

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
    
        default:
            break;
    }
}

export default onMessage;