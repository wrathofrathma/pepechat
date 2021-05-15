import {createStore} from 'vuex';

export default createStore({
    strict: true,
    state: {
        username: "Some username",
        avatar: "",
        baseURL: "http://localhost:3000",
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
    },
    actions: {
        
    }
})