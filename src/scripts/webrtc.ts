import adapter from "webrtc-adapter";
import store from "../store";
import {webcamTrackSenders, microphoneTrackSenders, userMediaStream, screenshareTrackSenders, screenshareStream} from "./streams";

const ice_config = {
    sdpSemantics: "unified-plan",
    iceServers: [
        {
            urls: ['stun:stun.l.google.com:19302']
        }
    ]
}

/************** WebRTC RTCPeerConnection stuff **************/

/**
 * Generates the initial RTCPeerConnection & offer to connect to another user. 
 * @param remoteUser Target user's UID for who we're trying to connect to.
 * @return {RTCSessionDescriptionInit} Offer / session description
 */
export async function initWebRTC(remoteUser: string): Promise<RTCSessionDescriptionInit> {
    // Create peer connection with the ICE config
    const pc = new RTCPeerConnection(ice_config);
    // Save the peer connection so we can access it in other areas of the program.
    store.commit("setPeerConnection", {pc, user: remoteUser});

    // Because we did the fix on the offer line to gather ICE candidates immediately, sometimes our events trigger before our store commits causing a race event between
    // The store saving the peer connection and the candidates gathering. Resulting in null peerconnection
    const localUser = store.state.uuid;
    // Event handlers
    pc.onicecandidate = handleIceCandidateEvent(localUser, remoteUser);
    pc.oniceconnectionstatechange = handleICEConnectionStateChangeEvent(pc);
    pc.onicegatheringstatechange = handleICEGatheringStateChangeEvent(pc);
    pc.onsignalingstatechange = handleSignalingStateChangeEvent(pc);
    pc.onconnectionstatechange = handleConnectionStateChange(pc);
    pc.ontrack = handleTrackEvent;
    pc.onnegotiationneeded = handleNegotiationNeededEvent(pc, remoteUser);

    // Attach relevant media streams if they exist
    if (store.state.devices.webcamActive && store.state.devices.webcamStream) {
        const stream = (store.state.devices.webcamStream as MediaStream);
        const track = stream.getVideoTracks()[0];
        webcamTrackSenders[remoteUser] = pc.addTrack(track, userMediaStream);
    }

    if (store.state.devices.microphoneActive && store.state.devices.microphoneStream) {
        // Same shit as the webcam
        const stream = (store.state.devices.microphoneStream as MediaStream);
        const track = stream.getAudioTracks()[0];
        microphoneTrackSenders[remoteUser] = pc.addTrack(track, userMediaStream);
    }

    if (store.state.devices.screenshareActive && store.state.devices.screenshareStream) {
        const stream = (store.state.devices.screenshareStream as MediaStream);
        screenshareTrackSenders[remoteUser] = [];
        stream.getTracks().forEach((track) => {
            screenshareTrackSenders[remoteUser].push(pc.addTrack(track, screenshareStream));
        })
    }

    // Generate an SDP offer of our capabilities
    // Necessary to offer to receive audio/video or else ICE candidates won't be gathered until a track is added.
    // source: https://stackoverflow.com/questions/61325035/no-ice-candidates-gathering-peerconnection-icegatheringstate-returns-complete
    const offer = await pc.createOffer({offerToReceiveAudio: true, offerToReceiveVideo: true});
    // Set it to our local description
    await pc.setLocalDescription(offer); 

    return offer;
}

export async function answerOffer(offer: RTCSessionDescriptionInit, remoteUser: string) {
    const pc = new RTCPeerConnection(ice_config);
    store.commit("setPeerConnection", {pc, user: remoteUser});

    const localUser = store.state.uuid;
    // Event handlers - NOTE, these need to come before adding any tracks
    // if not, then the ontrack thing is never triggered and it's never really dealt with for people already streaming when we enter the room
    pc.onicecandidate = handleIceCandidateEvent(localUser, remoteUser);
    pc.oniceconnectionstatechange = handleICEConnectionStateChangeEvent(pc);
    pc.onicegatheringstatechange = handleICEGatheringStateChangeEvent(pc);
    pc.onsignalingstatechange = handleSignalingStateChangeEvent(pc);
    pc.onconnectionstatechange = handleConnectionStateChange(pc);
    pc.ontrack = handleTrackEvent;
    pc.onnegotiationneeded = handleNegotiationNeededEvent(pc, remoteUser);

    // Attach relevant media streams if they exist
    if (store.state.devices.webcamActive && store.state.devices.webcamStream) {
        const stream = (store.state.devices.webcamStream as MediaStream);
        const track = stream.getVideoTracks()[0];
        webcamTrackSenders[remoteUser] = pc.addTrack(track, userMediaStream);
    }

    if (store.state.devices.microphoneActive && store.state.devices.microphoneStream) {
        // Same shit as the webcam
        const stream = (store.state.devices.microphoneStream as MediaStream);
        const track = stream.getAudioTracks()[0];
        microphoneTrackSenders[remoteUser] = pc.addTrack(track, userMediaStream);
    }

    if (store.state.devices.screenshareActive && store.state.devices.screenshareStream) {
        const stream = (store.state.devices.screenshareStream as MediaStream);
        screenshareTrackSenders[remoteUser] = [];
        stream.getTracks().forEach((track) => {
            screenshareTrackSenders[remoteUser].push(pc.addTrack(track, screenshareStream));
        })
    }

    await pc.setRemoteDescription(offer);
    const answer = await pc.createAnswer({offerToReceiveVideo: true, offerToReceiveAudio: true});
    await pc.setLocalDescription(answer);

    return answer;
}

export async function onAnswer(answer: RTCSessionDescriptionInit, user: string) {
    const pc = (store.state.peerConnections[user] as RTCPeerConnection);
    await pc.setRemoteDescription(answer); 
}

export async function addICECandidate(remoteUser: string, candidate: RTCIceCandidate) {
    const pc = (store.state.peerConnections[remoteUser] as RTCPeerConnection);
    pc.addIceCandidate(candidate);
}

export async function answerRenegotiation(offer: RTCSessionDescriptionInit, remoteUser: string) {
    const pc = (store.state.peerConnections[remoteUser] as RTCPeerConnection);
    await pc.setRemoteDescription(offer);
    const answer = await pc.createAnswer({offerToReceiveVideo: true, offerToReceiveAudio: true});
    await pc.setLocalDescription(answer);
    return answer;
}

// TODO we need to change these names. This shit is too confusing
export async function renegotiationAnswer(answer: RTCSessionDescriptionInit, remoteUser: string) {
    const pc = (store.state.peerConnections[remoteUser] as RTCPeerConnection);
    await pc.setRemoteDescription(answer);
}


export function closeConnection(uuid: string, streams: {userMedia: string, screenshare: string} = {userMedia: "", screenshare: ""}) {
    // Fetch the connection
    const pc = (store.state.peerConnections[uuid] as RTCPeerConnection);
    // Close it and remove it from the store
    pc.close()
    store.commit("removePeerConnection", uuid);
    // Also need to remove stream RTCRtpSenders
    delete webcamTrackSenders[uuid];
    delete microphoneTrackSenders[uuid];
    if (streams.userMedia && store.state.streams.streams[streams.userMedia]) {
        // TODO - Do we need to stop the tracks on the stream?
        store.commit("streams/removeStream", streams.userMedia);
    }
    if (streams.screenshare && store.state.streams.streams[streams.screenshare]) {
        // TODO - Do we need to stop the tracks on the stream?
        store.commit("streams/removeStream", streams.screenshare);
    }
}

export function closeAllConnections() {
    // Close all peer connections
    for (const [key, val] of Object.entries(store.state.peerConnections)) {
        closeConnection(key);
    }    
    // Remove all streams that are not ours
    for (const [key, val] of Object.entries(store.state.streams.streams)) {
        if (key !== userMediaStream.id && key !== screenshareStream.id) {
            store.commit("streams/removeStream", key);
        }
    }
}

/************** WEBRTC EVENT HANDLERS **************/
function handleConnectionStateChange(pc: RTCPeerConnection) {
    return () => {
        console.log("Connection state: ", pc.connectionState);
    }
}

function handleIceCandidateEvent(localUser: string, remoteUser: string) {
    const sock = store.state.socket;

    return (event: RTCPeerConnectionIceEvent) => {
        sock.send(JSON.stringify({
            event: "rtc/icecandidate",
            payload: { 
                target: remoteUser,
                sender: localUser,
                candidate: event.candidate
            }
        }))
    }
}

function handleTrackEvent(event: RTCTrackEvent) {
    // When the remote adds a track
    store.commit("streams/addStream", event.streams[0]);
    console.log("Received a track", event);
}

function handleNegotiationNeededEvent(pc: RTCPeerConnection, remoteUser: string) {
    const sock = store.state.socket;
    const uuid = store.state.uuid;

    return async () => {
        console.log("Negotiation needed")
        const offer = await pc.createOffer({offerToReceiveVideo: true, offerToReceiveAudio: true});
        await pc.setLocalDescription(offer);
        sock.send(JSON.stringify({
            event: "rtc/renegotiation",
            payload: {
                target: remoteUser,
                sender: uuid,
                offer
            }
        }))
    }
}

function handleICEConnectionStateChangeEvent(pc: RTCPeerConnection) {
    // https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/iceGatheringState

    return () => {
        console.log("ICE connection state", pc.iceConnectionState);
    }

}

function handleICEGatheringStateChangeEvent(pc: RTCPeerConnection) {

    return () => {
        console.log("ICE gathering state", pc.iceGatheringState);
    }
}

function handleSignalingStateChangeEvent(pc: RTCPeerConnection) {
    // What step of the connection process are we in?
    // https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/signalingState

    return () => {
        console.log("Signaling state", pc.signalingState);
    }
}