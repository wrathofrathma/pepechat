export default {
    namespaced: true,
    state: {
        streams: {}, // Remote MediaStreams,
        userVolume: {},
        userDisplayVolume: {},
    },
    mutations: {
        addStream(state: any, stream: MediaStream) {
            state.streams[stream.id] = stream;
            state.streams = {
                ...state.streams
            }
        },
        removeStream(state: any, stream: string) {
            delete state.streams[stream];
        },
        setUserVolume(state: any, payload: {user: string, volume: number}) {
            const {user, volume} = payload;
            state.userVolume[user] = volume;
        },
        setUserDisplayVolume(state: any, payload: {user: string, volume: number}) {
            const {user, volume} = payload;
            state.userDisplayVolume[user] = volume;
        },
    },
    getters: {
        userMediaStreamKeys: (state: any, getters: any, rootState: any) => (room: string) => {
            const streams: Array<{user: string, stream: string}> = [];
            if (!rootState.rooms.rooms[room]) {
                return streams;
            }
            for (const [key, val] of Object.entries(rootState.rooms.rooms[room].streams)) {
                if ((val as {userMedia: string}).userMedia)
                    streams.push({
                        user: key, 
                        stream: (val as {userMedia: string}).userMedia
                    });
            }
            return streams;
        },
        userDisplayMediaKeys: (state: any, getters: any, rootState: any) => (room: string) => {
            const streams: Array<{user: string, stream: string}> = [];
            if (!rootState.rooms.rooms[room]) {
                return streams;
            }
            for (const [key, val] of Object.entries(rootState.rooms.rooms[room].streams)) {
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
        stream: (state: any) => (uuid: string) => {
            return state.streams[uuid];
        },
    }
}