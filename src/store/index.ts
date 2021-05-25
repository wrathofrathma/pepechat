import {createStore, storeKey} from 'vuex';
import type {RoomIndex, Message, RoomEntry, RoomStreamTracks} from "../scripts/types";
import lodash from "lodash";

export default createStore({
    strict: true,
    state: {
        username: "Some username",
        avatar: "",
        uuid: "",
        socket: null,
        // baseURL: "http://localhost:3000",
        baseURL: "https://pepeserver.herokuapp.com",
        rooms: {},
        token: "",
        windowTitle: "PepeChat",
        users: {},
        roomMessages: {},
        webcamStream: null, // MediaStream
        microphoneStream: null, // MediaStream
        webcamActive: false,
        microphoneActive: false, 
        peerConnections: {}, // RTCPeerConnections
        tracks: {}, // Remote MediaStreamTracks
    },

    mutations: {
        setAvatar(state: any, avatar: string) {
            state.avatar = avatar;
        },
        setUsername(state: any, username: string) {
            state.username = username;
        },
        setUUID(state: any, uuid: string) {
            state.uuid = uuid;
        },
        setSocket(state: any, socket: WebSocket) {
            state.socket = socket;
        },
        setRooms(state: any, rooms: any) {
            state.rooms = rooms;
        },
        setRoom(state: any, payload: {id: string, room: RoomEntry}) {
            const {id, room} = payload;
            state.rooms[id] = room;
        },
        setToken(state: any, token: string) {
            state.token = token;
        },
        setWindowTitle(state: any, title: string) {
            state.windowTitle = title;
        },
        setUsers(state: any, users: any) {
            state.users = users;
        },
        setRoomMessages(state: any, payload: {room: string, messages: Array<Message>}) {
            const {room, messages} = payload;
            state.roomMessages[room] = messages;
        },
        addRoomMessage(state: any, payload: {message: Message, room: string}) {
            const {message, room} = payload;
            if (!state.roomMessages[room])
                state.roomMessages[room] = [];
            state.roomMessages[room].push(message);
        },
        setMicrophoneActive(state: any, mic: boolean) {
            state.microphoneActive = mic;
        },
        setWebcamActive(state: any, webcam: boolean) {
            state.webcamActive = webcam;
        },
        setPeerConnection(state: any, payload: {pc: RTCPeerConnection, user: string}) {
            const {user, pc} = payload;
            state.peerConnections[user] = pc;
        },
        addTrack(state: any, track: MediaStreamTrack) {
            state.tracks[track.id] = track;
            state.tracks = {
                ...state.tracks
            }
        },
        removeTrack(state: any, track: string) {
            delete state.tracks[track];
        },
        setWebcam(state: any, webcam: MediaStream) {
            state.webcamStream = webcam;
        },
        setMicrophone(state: any, microphone: MediaStream) {
            state.microphoneStream = microphone;
        },
    },
    getters: {
        roomList(state: any) {
            const list = [];
            for (const [key,val] of Object.entries(state.rooms)) {
                list.push({
                    ...(val as RoomIndex),
                    id: key
                })
            }
            return list;
        },
        roomMessages: (state: any) => (roomId: string) => {
            if (state.roomMessages[roomId])
                return state.roomMessages[roomId];
            return [];
        },
        roomName: (state: any) => (roomId: string) => {
            if (state.rooms[roomId])
                return state.rooms[roomId].name;
            return "";
        },
        roomUsers: (state: any) => (roomId: string) => {
            if (state.rooms[roomId])
                return state.rooms[roomId].users;
            return [];
        },
        username: (state: any) => (uuid: string) => {
            if (state.users[uuid]) {
                return state.users[uuid].username;
            }
            return ""
        },
        avatar: (state: any) => (uuid: string) => {
            if (state.users[uuid]) {
                return state.users[uuid].avatar;
            }
            return ""
        },
        userWebcams: (state: any) => (room: string) => {
            const streams: Array<{user: string, track: string}> = [];
            if (!state.rooms[room]) {
                return streams;
            }
            for (const [key, val] of Object.entries(state.rooms[room].streams)) {
                if ((val as {webcam: string}).webcam)
                    streams.push({
                        user: key, 
                        track: (val as {webcam: string}).webcam
                    });
            }
            return streams;
        },
        peerConnection: (state: any) => (uuid: string) => {
            return state.peerConnections[uuid];
        },
        track: (state: any) => (uuid: string) => {
            return state.tracks[uuid];
        }
    },
    actions: {
        
    },
})