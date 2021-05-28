import {Commit, createStore} from 'vuex';
import getAvatarList from "../scripts/getAvatarList";
import devices from "./devices";
import rooms from "./rooms";
import streams from "./streams";
import users from './users';

export default createStore({
    strict: true,
    state: {
        username: "Some username",
        avatar: "",
        uuid: "",
        socket: null,
        // baseURL: "http://localhost:3000",
        baseURL: "https://pepeserver.herokuapp.com",
        token: "",
        windowTitle: "PepeChat",
        peerConnections: {}, // RTCPeerConnections
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
        setToken(state: any, token: string) {
            state.token = token;
        },
        setWindowTitle(state: any, title: string) {
            state.windowTitle = title;
        },
        setPeerConnection(state: any, payload: {pc: RTCPeerConnection, user: string}) {
            const {user, pc} = payload;
            state.peerConnections[user] = pc;
        },
        removePeerConnection(state: any, uuid: string) {
            delete state.peerConnections[uuid];
        },
        setEmotes(state: any, emotes) {
            state.emotes = emotes;
        }
    },
    getters: {
        peerConnection: (state: any) => (uuid: string) => {
            return state.peerConnections[uuid];
        },
    },
    actions: {
        async fetchEmotes({commit}: {commit: Commit}) {
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
    modules: {
        devices: devices,
        rooms: rooms,
        streams: streams,
        users: users
    }
})