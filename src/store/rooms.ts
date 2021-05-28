import type {RoomIndex, Message, RoomEntry} from "../scripts/types";

export default {
    namespaced: true,
    state: {
        rooms: {},
        roomMessages: {},
    },
    mutations: {
        setRoom(state: any, payload: {id: string, room: RoomEntry}) {
            const {id, room} = payload;
            state.rooms[id] = room;
        },
        setRooms(state: any, rooms: any) {
            state.rooms = rooms;
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
        userWebcamState: (state: any) => (roomId: string, user: string) => {
            const room = state.rooms[roomId];
            if (!room)
                return false;
            if (!room.streamState[user])
                return false;
            return room.streamState[user].webcam;
        },
        userMicrophoneState: (state: any) => (roomId: string, user: string) => {
            const room = state.rooms[roomId];
            if (!room)
                return false;
            if (!room.streamState[user])
                return false;
            return room.streamState[user].microphone;
        },
        userScreenshareState: (state: any) => (roomId: string, user: string) => {
            const room = state.rooms[roomId];
            if (!room)
                return false;
            if (!room.streamState[user])
                return false;
            return room.streamState[user].screenshare;
        },
        roomMessages: (state: any) => (roomId: string) => {
            if (state.roomMessages[roomId])
                return state.roomMessages[roomId];
            return [];
        },
    }
}