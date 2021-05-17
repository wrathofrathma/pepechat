import {createStore} from 'vuex';
import rooms from "./rooms";
import type {RoomIndex} from "../scripts/types";

export default createStore({
    strict: true,
    state: {
        username: "Some username",
        avatar: "",
        uuid: "",
        socket: null,
        baseURL: "http://localhost:3000",
        rooms: {},
        token: "",
        windowTitle: "PepeChat",
        users: {}
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
        }
    },
    actions: {
        
    },
    // modules: {rooms}
})