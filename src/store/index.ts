import {createStore} from 'vuex';
import type {RoomIndex, Message} from "../scripts/types";

export default createStore({
    strict: true,
    state: {
        username: "Some username",
        avatar: "",
        uuid: "",
        socket: null,
        baseURL: "http://pepeserver.herokuapp.com",
        // baseURL: "http://localhost:3000",
        rooms: {},
        token: "",
        windowTitle: "PepeChat",
        users: {},
        roomMessages: {}
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
        }
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
        }
    },
    actions: {
        
    },
})