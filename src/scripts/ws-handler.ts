import store from "../store";
import type {RoomIndex, RoomEntry, Message} from "../scripts/types";
import { addICECandidate, answerOffer, initWebRTC, onAnswer } from "./webrtc";

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
}

function onRoomIndex(payload: {rooms: RoomIndex}) {
    const {rooms} = payload;
    store.commit("setRooms", rooms);
}

function onUserIndex(payload: {users: Object}) {
    const {users} = payload;
    store.commit("setUsers", users)
}

function onRoomMessage(payload: {room: string, message: Message}) {
    const {message, room} = payload;
    store.commit("addRoomMessage", {room, message});
}

function onRoomHistory(payload: {room: string, history: Array<Message>}) {
    const {room, history} = payload;
    store.commit("setRoomMessages", {room, messages: history})
}

function onRoomInfo(payload: {id: string, room: RoomEntry}) {
    store.commit("setRoom", payload);
}

async function onInitWebRTC(sock: WebSocket, payload: {target: string}) {
    console.log("Told to init webrtc")
    const {target} = payload;
    const offer = await initWebRTC(target);
    const uuid = store.state.uuid;
    sock.send(JSON.stringify({
        event: "rtc/offer",
        payload: {
            target,
            sender: uuid,
            offer
        }
    }));
}

async function onRTCOffer(sock: WebSocket, payload: {target: string, sender: string, offer: RTCSessionDescriptionInit}) {
    console.log("Received an rtc offer")
    const {target, sender, offer} = payload;
    const answer = await answerOffer(offer, sender);
    sock.send(JSON.stringify({
        event: "rtc/answer",
        payload: {
            target: sender,
            sender: target,
            answer
        }
    }));
    console.log("Sending answer")
}

async function onRTCAnswer(socket: WebSocket, payload: {target: string, sender: string, answer: Object}) {
    console.log("Received rtc answer")
    const {answer, target, sender} = payload;
    await onAnswer(answer, sender);
}

async function onICECandidate(socket: WebSocket, payload: {target: string, sender: string, candidate: RTCIceCandidate}) {
    console.log("Received an ICE Candidate")
    const {sender, candidate} = payload;
    addICECandidate(sender, candidate);
}

/**
 * Websocket message handler / router.
 * @param {WebSocket} ws Websocket
 * @param {MessageEvent<any>} ev Event payload
 */
async function onMessage (this: WebSocket, ev: MessageEvent<any>): Promise<any>{
    const data = JSON.parse(ev.data);
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
        
        case "room/message":
            onRoomMessage(data.payload);
            break;

        case "room/history":
            onRoomHistory(data.payload);
            break;

        case "room/info":
            onRoomInfo(data.payload.room);
            break;

        case "ping":
            this.send(JSON.stringify({event: "pong"}));
            break;

        case "pong":
            this.send(JSON.stringify({event: "ping"}));
            break;

        case "rtc/init":
            await onInitWebRTC(this, data.payload);
            break;
        
        case "rtc/offer":
            await onRTCOffer(this, data.payload);
            break;
        
        case "rtc/answer":
            await onRTCAnswer(this, data.payload);
            break;
        
        case "rtc/icecandidate":
            await onICECandidate(this, data.payload);
            break;

        default:
            break;
    }
}

export default onMessage;