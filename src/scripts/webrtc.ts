import adapter from "webrtc-adapter";
import store from "../store";
import {webcamTrackSenders, microphoneTrackSenders} from "./streams";

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
    // Because we did the fix on the line below to gather ICE candidates immediately, sometimes our events trigger before our store commits causing a race event between
    // The store saving the peer connection and the candidates gathering. Resulting in null peerconnection
    store.commit("setPeerConnection", {pc, user: remoteUser});

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
    if (store.state.webcamActive && store.state.webcamStream) {
        const stream = (store.state.webcamStream as MediaStream);
        const track = stream.getVideoTracks()[0];
        webcamTrackSenders[remoteUser] = pc.addTrack(track, stream);
    }

    if (store.state.microphoneActive && store.state.microphoneStream) {
        // Same shit as the webcam
        const stream = (store.state.microphoneStream as MediaStream);
        const track = stream.getAudioTracks()[0];
        microphoneTrackSenders[remoteUser] = pc.addTrack(track, stream);
    }


    // Generate an SDP offer of our capabilities
    // Necessary to offer to receive audio/video or else ICE candidates won't be gathered until a track is added.
    // source: https://stackoverflow.com/questions/61325035/no-ice-candidates-gathering-peerconnection-icegatheringstate-returns-complete
    const offer = await pc.createOffer({offerToReceiveAudio: true, offerToReceiveVideo: true});
    // Set it to our local description
    await pc.setLocalDescription(offer); 
    // Save the peer connection so we can access it in other areas of the program.

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
    if (store.state.webcamActive && store.state.webcamStream) {
        const stream = (store.state.webcamStream as MediaStream);
        const track = stream.getVideoTracks()[0];
        webcamTrackSenders[remoteUser] = pc.addTrack(track, stream);
    }

    if (store.state.microphoneActive && store.state.microphoneStream) {
        // Same shit as the webcam
        const stream = (store.state.microphoneStream as MediaStream);
        const track = stream.getAudioTracks()[0];
        microphoneTrackSenders[remoteUser] = pc.addTrack(track, stream);
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
    store.commit("addTrack", event.streams[0]);
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

function handleRemoveTrackEvent() {
    // When the remote removes a track

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