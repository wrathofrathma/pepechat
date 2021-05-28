import store from "../store";

// I can't be fucked to write vuex shit for this right now, so we're just gonna store peer connection track stuff here. 
// Why would I use vuex for it anyways? Shit, should I rewrite the webrtc stuff to be stored in webrtc.js? kms

export const webcamTrackSenders: {[key: string]: RTCRtpSender} = {};
export const microphoneTrackSenders: {[key: string]: RTCRtpSender} = {};
export const screenshareTrackSenders: {[key: string]: Array<RTCRtpSender>} = {};

// Separating this from the getUserMedia() creator so we have a consistent ID even if we turn off our webcam / etc.
export const userMediaStream = new MediaStream();
export const screenshareStream = new MediaStream();
store.commit("streams/addStream", userMediaStream);
store.commit("streams/addStream", screenshareStream)

export function setStreamState() {
    const socket = store.state.socket as WebSocket;
    const room = store.state.route.params.id;

    socket.send(JSON.stringify({
        event: "room/setstreamstate",
        payload: {
            state: {
                webcam: store.state.devices.webcamActive,
                microphone: store.state.devices.microphoneActive,
                screenshare: store.state.devices.screenshareActive
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
    store.commit("devices/setWebcamActive", true);
    
    // See if we have a preferred deviceID
    const preferredDevice = (store.state.devices.webcamDevice as MediaDeviceInfo);

    let stream;
    // Fetch the hardware stream and store it
    if (preferredDevice)
        stream = await navigator.mediaDevices.getUserMedia({audio: false, video: {
            deviceId: { 
                exact: preferredDevice.deviceId
            }
        }});
    else
        stream = await navigator.mediaDevices.getUserMedia({audio: false, video: true});

    store.commit("devices/setWebcam", stream);
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
    store.commit("devices/setMicrophoneActive", true);

    // See if we have a preferred deviceID
    const preferredDevice = (store.state.devices.microphoneDevice as MediaDeviceInfo);

    let stream;
    // Fetch the hardware stream and store it
    if (preferredDevice)
        stream = await navigator.mediaDevices.getUserMedia({video: false, audio: {
            deviceId: { 
                exact: preferredDevice.deviceId
            }
        }});
    else
        stream = await navigator.mediaDevices.getUserMedia({audio: true, video: false});

    store.commit("devices/setMicrophone", stream);
    // Fetch the audio track
    const track = stream.getAudioTracks()[0];
    // attach it to every peer connection
    for (const [key, val] of Object.entries(store.state.peerConnections)) {
        const pc = (val as RTCPeerConnection); 
        microphoneTrackSenders[key] = pc.addTrack(track, userMediaStream);
    }
    setStreamState();
}

export async function startScreenshare() {
    // Set the state of our stream to streaming
    store.commit("devices/setScreenshareActive", true);
    // Fetch our screenshare stream
    // @ts-ignore
    const stream = (await navigator.mediaDevices.getDisplayMedia({video: true, audio: true}) as MediaStream);
    // Save it in the store.
    store.commit("devices/setScreenshare", stream);
    // Attach the video stream to our local stream
    stream.getVideoTracks().forEach((track) => {
        screenshareStream.addTrack(track);
    });
    // attach it to every peer connection
    for (const [key, val] of Object.entries(store.state.peerConnections)) {
        const pc = (val as RTCPeerConnection); 
        if (!screenshareTrackSenders[key])
            screenshareTrackSenders[key] = [];
        stream.getTracks().forEach((track) => {
            screenshareTrackSenders[key].push(pc.addTrack(track, screenshareStream));
        })
    }
    setStreamState();
}

export async function stopScreenshare() {
    // Set the state of our stream to not streaming
    store.commit("devices/setScreenshareActive", false);
    // Fetch the hardware stream
    const stream = (store.state.devices.screenshareStream as MediaStream);
    // If it doesn't exist, we're probably not streaming, just stop here.
    if (!stream)
        return;
    // Loop over each track
    stream
        .getTracks()
        .forEach((track) => {
            // Disable the track to paint it black / make it silent
            track.enabled = false;
            // Remove the local track
            screenshareStream.removeTrack(track);
            // Stop the track
            track.stop();
        })
    // Remove all the tracks from our peers
    for (const [key, val] of Object.entries(screenshareTrackSenders)) {
        // Key is the uuid of the remoteUser
        // val is the list of RTCRtpSender 
        const pc = (store.state.peerConnections[key] as RTCPeerConnection);
        // If the peer connection doesn't exist, we're not connected. just remove hte senders
        if (!pc) {
            delete screenshareTrackSenders[key];
            continue;
        }
        // Loop through the senders and remove each track
        for (const sender of val) {
            pc.removeTrack(sender);
        }
    }
    store.commit("devices/setScreenshare", null);
    setStreamState();
}

export async function stopWebcam() {
    // Set the state of our webcam
    store.commit("devices/setWebcamActive", false);
    // Fetch the hardware stream we stored
    const stream = (store.state.devices.webcamStream as MediaStream);
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

    store.commit("devices/setWebcam", null);
    setStreamState();
}

export async function stopMicrophone() {
    store.commit("devices/setMicrophoneActive", false);
    const stream = (store.state.devices.microphoneStream as MediaStream);

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

    store.commit("devices/setMicrophone", null);
    setStreamState();
}

export async function selectWebcam(webcam: MediaDeviceInfo) {
    // Commit it
    store.commit("devices/setWebcamDevice", webcam);
    // If we're not currently streaming a webcam, we can stop now
    if (!store.state.devices.webcamActive)
        return;
    // Otherwise, we need to get the video stream and stop all the video tracks and switch over
    // Remove it from the local stream
    userMediaStream.getVideoTracks().forEach((track) => {
        track.stop();
        userMediaStream.removeTrack(track);
    })
    // Get the new stream and store it
    const stream = await navigator.mediaDevices.getUserMedia({audio: false, video: {
        deviceId: {
            exact: webcam.deviceId
        }
    }});
    store.commit("devices/setWebcam", stream);

    // Add the track to our local stream
    const track = stream.getVideoTracks()[0];
    userMediaStream.addTrack(track);

    // Now we need to remove the old from the peer connections and add the new tracks
    for (const [key, val] of Object.entries(store.state.peerConnections)) {
        // key = uuid
        // val = RTCPeerConnection
        const pc = (val as RTCPeerConnection);
        // Remove the track and delete the sender tracker
        pc.removeTrack(webcamTrackSenders[key]);
        delete webcamTrackSenders[key];
        // Add the new track
        webcamTrackSenders[key] = pc.addTrack(track, userMediaStream);
    }
    // I thought about setting the stream state with setStreamState(), but 
    // The state doesn't change since we are only changing tracks. pog
}

export async function selectMicrophone(microphone: MediaDeviceInfo) {
    // Commit it
    store.commit("devices/setMicrophoneDevice", microphone);
    // If we're not currently streaming our mic, we can stop now
    if (!store.state.devices.microphoneActive)
        return;
    // Otherwise, we need to get the audio stream and stop all the audio tracks and switch over
    // Remove it from the local stream
    userMediaStream.getAudioTracks().forEach((track) => {
        track.stop();
        userMediaStream.removeTrack(track);
    })
    // Get the new stream and store it
    const stream = await navigator.mediaDevices.getUserMedia({video: false, audio: {
        deviceId: {
            exact: microphone.deviceId
        }
    }});
    store.commit("devices/setMicrophone", stream);

    // Add the track to our local stream
    const track = stream.getAudioTracks()[0];
    userMediaStream.addTrack(track);

    // Now we need to remove the old from the peer connections and add the new tracks
    for (const [key, val] of Object.entries(store.state.peerConnections)) {
        // key = uuid
        // val = RTCPeerConnection
        const pc = (val as RTCPeerConnection);
        // Remove the track and delete the sender tracker
        pc.removeTrack(microphoneTrackSenders[key]);
        delete microphoneTrackSenders[key];
        // Add the new track
        microphoneTrackSenders[key] = pc.addTrack(track, userMediaStream);
    }
}