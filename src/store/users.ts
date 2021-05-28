export default {
    namespaced: true,
    state: {
        users: {}
    },
    mutations: {
        setUsers(state: any, users: any) {
            state.users = users;
        },
    },
    getters: {
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
    }
}