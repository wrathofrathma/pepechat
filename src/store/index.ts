import {createStore} from 'vuex';
import rooms from "./rooms";
import {RoomIndex} from "../scripts/types";

export default createStore({
    strict: true,
    state: {
        username: "Some username",
        avatar: "",
        uuid: "",
        socket: null,
        baseURL: "http://localhost:3000",
        rooms: {} 
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