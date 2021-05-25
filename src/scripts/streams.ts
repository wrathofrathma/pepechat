import store from "../store";

// I can't be fucked to write vuex shit for this right now, so we're just gonna store peer connection track stuff here. 
// Why would I use vuex for it anyways? Shit, should I rewrite the webrtc stuff to be stored in webrtc.js? kms

export const webcamTrackSenders: {[key: string]: RTCRtpSender} = {};
export const microphoneTrackSenders: {[key: string]: RTCRtpSender} = {};

export function setStreamState() {
    const socket = store.state.socket as WebSocket;
    const room = store.state.route.params.id;
    const webcam = (store.state.webcamStream as MediaStream);
    const audio = (store.state.microphoneStream as MediaStream);

    socket.send(JSON.stringify({
        event: "room/setstreamstate",
        payload: {
            state: {
                webcam: store.state.webcamActive,
                audio: store.state.microphoneActive
            },
            tracks: {
                webcam: webcam ? webcam.id : "",
                audio: audio ? audio.id : ""
            },
            room
        }
    }))
}

export async function startWebcam() {
    store.commit("setWebcamActive", true);
    const stream = await navigator.mediaDevices.getUserMedia({audio: false, video: true});
    store.commit("addTrack", stream);
    store.commit("setWebcam", stream);
    setStreamState();
    const track = stream.getVideoTracks()[0];
    for (const [key, val] of Object.entries(store.state.peerConnections)) {
        const pc = (val as RTCPeerConnection); 
        webcamTrackSenders[key] = pc.addTrack(track, stream);
    }
    return stream;
}

export async function startMicrophone() {
    store.commit("setMicrophoneActive", true);
    const stream = await navigator.mediaDevices.getUserMedia({audio: true, video: false});
    store.commit("setMicrophone", stream);
    store.commit("addTrack", stream);
    setStreamState();
    const track = stream.getAudioTracks()[0];

    for (const [key, val] of Object.entries(store.state.peerConnections)) {
        const pc = (val as RTCPeerConnection); 
        microphoneTrackSenders[key] = pc.addTrack(track, stream);
    }

    return stream;
}

export async function stopWebcam() {
    store.commit("setWebcamActive", false);
    const uuid = store.state.uuid;
    const stream = (store.state.webcamStream as MediaStream);
    stream
        .getVideoTracks()
        .forEach((track) => {
            track.stop();            
            for (const [key, val] of Object.entries(store.state.peerConnections)) {
                const pc = (val as RTCPeerConnection);
                pc.removeTrack(webcamTrackSenders[key]);
            }
        });

    store.commit("setWebcam", null);
    setStreamState();
}

export async function stopMicrophone() {
    store.commit("setMicrophoneActive", false);
    const uuid = store.state.uuid;

    const stream = (store.state.microphoneStream as MediaStream);
    stream
        .getAudioTracks()
        .forEach((track) => {
            track.stop();            
            for (const [key, val] of Object.entries(store.state.peerConnections)) {
                const pc = (val as RTCPeerConnection);
                pc.removeTrack(microphoneTrackSenders[key]);
            }
        });

    store.commit("setMicrophone", null);
    setStreamState();
}

export async function getUserWebcam() {
    
}