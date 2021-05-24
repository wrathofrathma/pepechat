import store from "../store";

// I can't be fucked to write vuex shit for this right now, so we're just gonna store peer connection track stuff here. 
// Why would I use vuex for it anyways? Shit, should I rewrite the webrtc stuff to be stored in webrtc.js? kms

const webcamTrackSenders: {[key: string]: RTCRtpSender} = {};

export function setStreamState() {
    const socket = store.state.socket as WebSocket;
    const room = store.state.route.params.id;
    const uuid = store.state.uuid;
    const webcamTrack = (store.state.userWebcamStreams[uuid] as MediaStreamTrack);
    const audioTrack = (store.state.userAudioStreams[uuid] as MediaStreamTrack);

    socket.send(JSON.stringify({
        event: "room/setstreamstate",
        payload: {
            state: {
                webcam: store.state.webcamActive,
                audio: store.state.microphoneActive
            },
            tracks: {
                webcam: webcamTrack ? webcamTrack.id : "",
                audio: audioTrack ? audioTrack.id : ""
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
    for (const [key, val] of Object.entries(store.state.peerConnections)) {
        const pc = (val as RTCPeerConnection); 
        stream.getVideoTracks().forEach((track) => {
            console.log("Adding track to peer connection", track, pc);
            webcamTrackSenders[key] = pc.addTrack(track);
            console.log(track);
        })
    }
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
            for (const [key, val] of Object.entries(store.state.peerConnections)) {
                const pc = (val as RTCPeerConnection);
                pc.removeTrack(webcamTrackSenders[key]);
            }
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