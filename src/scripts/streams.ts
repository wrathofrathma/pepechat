import store from "../store";


export function setStreamState() {
    const socket = store.state.socket as WebSocket;
    const room = store.state.route.params.id;
    socket.send(JSON.stringify({
        event: "room/setstreamstate",
        payload: {
            state: {
                webcam: store.state.webcamActive,
                audio: store.state.microphoneActive
            },
            room
        }
    }))
}

export async function startWebcam() {
    store.commit("setWebcamActive", true);
    const stream = await navigator.mediaDevices.getUserMedia({audio: false, video: true});
    store.commit("setUserWebcam", {uuid: store.state.uuid, stream});
    setStreamState();
    return stream;
}

export async function startMicrophone() {
    store.commit("setMicrophoneActive", true);
    const stream = await navigator.mediaDevices.getUserMedia({audio: true, video: false});
    store.commit("setUserAudio", {uuid: store.state.uuid, stream});
    setStreamState();
    return stream;
}

export async function stopWebcam() {
    store.commit("setWebcamActive", false);
    const uuid = store.state.uuid;
    const stream = (store.state.userWebcamStreams[uuid] as MediaStream);
    stream
        .getVideoTracks()
        .forEach((track) => {
            track.stop();            
        });

    store.commit("setUserWebcam", {
        uuid,
        stream: null
    })
    setStreamState();
}

export async function stopMicrophone() {
    store.commit("setMicrophoneActive", false);
    const uuid = store.state.uuid;
    const stream = (store.state.userAudioStreams[uuid] as MediaStream);
    stream
        .getAudioTracks()
        .forEach((track) => {
            track.stop();            
        });

    store.commit("setUserAudio", {
        uuid,
        stream: null
    })
    setStreamState();
}

export async function getUserWebcam() {
    
}