import {createStore, storeKey} from 'vuex';
import type {RoomIndex, Message, RoomEntry, RoomStreamTracks} from "../scripts/types";
import lodash from "lodash";
import getAvatarList from "../scripts/getAvatarList";

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
        screenshareStream: null, // MediaStream
        webcamActive: false,
        microphoneActive: false, 
        screenshareActive: false,
        peerConnections: {}, // RTCPeerConnections
        streams: {}, // Remote MediaStreams,
        mediaDevices: [],
        webcamDevice: null,
        microphoneDevice: null,
        userVolume: {},
        userDisplayVolume: {},
        emotes: {}
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
        setScreenshareActive(state: any, screenshare: boolean) {
            state.screenshareActive = screenshare;
        },
        setPeerConnection(state: any, payload: {pc: RTCPeerConnection, user: string}) {
            const {user, pc} = payload;
            state.peerConnections[user] = pc;
        },
        removePeerConnection(state: any, uuid: string) {
            delete state.peerConnections[uuid];
        },
        addStream(state: any, stream: MediaStream) {
            state.streams[stream.id] = stream;
            state.streams = {
                ...state.streams
            }
        },
        removeStream(state: any, stream: string) {
            delete state.streams[stream];
        },
        setWebcam(state: any, webcam: MediaStream) {
            state.webcamStream = webcam;
        },
        setMicrophone(state: any, microphone: MediaStream) {
            state.microphoneStream = microphone;
        },
        setScreenshare(state: any, screenshare: MediaStream) {
            state.screenshareStream = screenshare;
        },
        setMediaDevices(state: any, devices: Array<MediaDeviceInfo>) {
            state.mediaDevices = devices;
        },
        setWebcamDevice(state: any, device: MediaDeviceInfo) {
            state.webcamDevice = device;
        },
        setMicrophoneDevice(state: any, device: MediaDeviceInfo) {
            state.microphoneDevice = device;
        },
        setUserVolume(state: any, payload: {user: string, volume: number}) {
            const {user, volume} = payload;
            state.userVolume[user] = volume;
        },
        setUserDisplayVolume(state: any, payload: {user: string, volume: number}) {
            const {user, volume} = payload;
            state.userDisplayVolume[user] = volume;
        },
        setEmotes(state: any, emotes) {
            state.emotes = emotes;
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
        },
        userMediaStreamKeys: (state: any) => (room: string) => {
            const streams: Array<{user: string, stream: string}> = [];
            if (!state.rooms[room]) {
                return streams;
            }
            for (const [key, val] of Object.entries(state.rooms[room].streams)) {
                if ((val as {userMedia: string}).userMedia)
                    streams.push({
                        user: key, 
                        stream: (val as {userMedia: string}).userMedia
                    });
            }
            return streams;
        },
        userDisplayMediaKeys: (state: any) => (room: string) => {
            const streams: Array<{user: string, stream: string}> = [];
            if (!state.rooms[room]) {
                return streams;
            }
            for (const [key, val] of Object.entries(state.rooms[room].streams)) {
                if ((val as {screenshare: string}).screenshare)
                    streams.push({
                        user: key, 
                        stream: (val as {screenshare: string}).screenshare
                    });
            }
            return streams;
        },
        numberOfVideoStreams: (state: any, getters: any) => (room: string) => {
            let nStreams = 0;
            // Get all user media stream keys and filter by whether they have 1+ video tracks.
            nStreams += (getters.userMediaStreamKeys(room) as Array<{user: string, stream: string}>).filter((val) => {
                const stream = (getters.stream(val.stream) as MediaStream);
                if (!stream)
                    return false;
                if (stream.getVideoTracks().length > 0)
                    return true;
                return false;
            }).length;
            // Same shit for the user streams;
            nStreams += (getters.userDisplayMediaKeys(room) as Array<{user: string, stream: string}>).filter((val) => {
                const stream = (getters.stream(val.stream) as MediaStream);
                if (!stream)
                    return false;
                if (stream.getVideoTracks().length > 0)
                    return true;
                return false;
            }).length
            return nStreams;
        },
        peerConnection: (state: any) => (uuid: string) => {
            return state.peerConnections[uuid];
        },
        stream: (state: any) => (uuid: string) => {
            return state.streams[uuid];
        },
        videoDevices: (state: any) => {
            return state.mediaDevices.filter((val: MediaDeviceInfo) => val.kind === "videoinput");
        },
        audioDevices: (state: any) => {
            return state.mediaDevices.filter((val: MediaDeviceInfo) => val.kind === "audioinput");
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
    },
    actions: {
        async getMediaDevices({commit}) {
            // getUserMedia() first to get permission to read devices
            const stream = await navigator.mediaDevices.getUserMedia({video: true, audio: true});
            // Enumerate what devices are available
            const devices = await navigator.mediaDevices.enumerateDevices();
            // kill the stream returned.
            stream.getTracks().forEach((track) => {
                track.stop()
                stream.removeTrack(track);
            });
            commit("setMediaDevices", devices);
        }, 
        async fetchEmotes({commit}) {
            // Get links to all images on our server
            const hrefs = await getAvatarList();
            // Map the links to emote names
            const emotes: {[key: string]: string} = {};
            hrefs.forEach((href) => {
                // First we split the link so we can fetch the filename at the end
                const tokens = href.split("/");
                const filename = tokens[tokens.length-1];
                // Now we can split by . to remove the file extension
                const emoteName = filename.split(".")[0];
                emotes[emoteName] = href;
            })

            commit("setEmotes", emotes);
        }
    },
})