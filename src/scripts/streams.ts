import store from "../store";

// I can't be fucked to write vuex shit for this right now, so we're just gonna store peer connection track stuff here. 
// Why would I use vuex for it anyways? Shit, should I rewrite the webrtc stuff to be stored in webrtc.js? kms

export const webcamTrackSenders: {[key: string]: RTCRtpSender} = {};
export const microphoneTrackSenders: {[key: string]: RTCRtpSender} = {};

// Separating this from the getUserMedia() creator so we have a consistent ID even if we turn off our webcam / etc.
export const userMediaStream = new MediaStream();
export const screenshareStream = new MediaStream();
store.commit("addStream", userMediaStream);

export function setStreamState() {
    const socket = store.state.socket as WebSocket;
    const room = store.state.route.params.id;

    socket.send(JSON.stringify({
        event: "room/setstreamstate",
        payload: {
            state: {
                webcam: store.state.webcamActive,
                microphone: store.state.microphoneActive,
                screenshare: false
            },
            room
        }
    }));

    socket.send(JSON.stringify({
        event: "room/setstreams",
        payload: {
            room,
            streams: {
                userMedia: userMediaStream.id,
                screenshare: screenshareStream.id
            }
        }
    }));
}

/**
 * Fetches the user's webcam and adds the webcam track to our userMediaStream being transmitted to peers.
 */
export async function startWebcam() {
    // Set the state of our webcam
    store.commit("setWebcamActive", true);
    // Fetch the hardware stream and store it
    const stream = await navigator.mediaDevices.getUserMedia({audio: false, video: true});
    store.commit("setWebcam", stream);
    // Fetch the video tracks in the stream
    const track = stream.getVideoTracks()[0];

    // Add it to our userMediaStream object so we can see our own tile. 
    userMediaStream.addTrack(track)

    // Attach it to every peer connection
    for (const [key, val] of Object.entries(store.state.peerConnections)) {
        const pc = (val as RTCPeerConnection); 
        webcamTrackSenders[key] = pc.addTrack(track, userMediaStream);
    }
    setStreamState();
}

export async function startMicrophone() {
    // Set the state of our microphone
    store.commit("setMicrophoneActive", true);
    // Fetch the actual hardware stream & Add it to our store
    const stream = await navigator.mediaDevices.getUserMedia({audio: true, video: false});
    store.commit("setMicrophone", stream);
    // Fetch the audio track
    const track = stream.getAudioTracks()[0];
    // attach it to every peer connection
    for (const [key, val] of Object.entries(store.state.peerConnections)) {
        const pc = (val as RTCPeerConnection); 
        microphoneTrackSenders[key] = pc.addTrack(track, userMediaStream);
    }
    setStreamState();
}

export async function stopWebcam() {
    // Set the state of our webcam
    store.commit("setWebcamActive", false);
    // Fetch the hardware stream we stored
    const stream = (store.state.webcamStream as MediaStream);
    // If there's no stream active, just return
    if (!stream)
        return;
    // Loop over each video track
    stream
        .getVideoTracks()
        .forEach((track) => {
            // First we will disable the track so that it emits a black screen
            track.enabled = false;
            // Remove the local track
            userMediaStream.removeTrack(track)
            // Stop the track
            track.stop();            
            // Remove it from every peer connection
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
    const stream = (store.state.microphoneStream as MediaStream);

    if (!stream)
        return;
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