import { Commit } from "vuex";

export default {
    namespaced: true,
    state: {
        // Stream states
        webcamActive: false,
        microphoneActive: false, 
        screenshareActive: false,
        // Media streams from the devices
        webcamStream: null, // MediaStream
        microphoneStream: null, // MediaStream
        screenshareStream: null, // MediaStream
        // Enumerated devices
        mediaDevices: [], // MediaDeviceInfo array
        // Preferred devices
        webcamDevice: null, // MediaDeviceInfo
        microphoneDevice: null, // MediaDeviceInfo
    },
    mutations: {
        setMicrophoneActive(state: any, mic: boolean) {
            state.microphoneActive = mic;
        },
        setWebcamActive(state: any, webcam: boolean) {
            state.webcamActive = webcam;
        },
        setScreenshareActive(state: any, screenshare: boolean) {
            state.screenshareActive = screenshare;
        },
        setWebcam(state: any, webcam: MediaStream) {
            state.webcamStream = webcam;
        },
        setMicrophone(state: any, microphone: MediaStream) {
            state.microphoneStream = microphone;
        },
        setScreenshare(state: any, screenshare: MediaStream) {
            state.screenshareStream = screenshare;
        },
        setMediaDevices(state: any, devices: Array<MediaDeviceInfo>) {
            state.mediaDevices = devices;
        },
        setWebcamDevice(state: any, device: MediaDeviceInfo) {
            state.webcamDevice = device;
        },
        setMicrophoneDevice(state: any, device: MediaDeviceInfo) {
            state.microphoneDevice = device;
        },

    },
    getters: {
        videoDevices: (state: any) => {
            return state.mediaDevices.filter((val: MediaDeviceInfo) => val.kind === "videoinput");
        },
        audioDevices: (state: any) => {
            return state.mediaDevices.filter((val: MediaDeviceInfo) => val.kind === "audioinput");
        },
    },
    actions: {
        async getMediaDevices({commit}: {commit: Commit}) {
            // getUserMedia() first to get permission to read devices
            const stream = await navigator.mediaDevices.getUserMedia({video: true, audio: true});
            // Enumerate what devices are available
            const devices = await navigator.mediaDevices.enumerateDevices();
            // kill the stream returned.
            stream.getTracks().forEach((track) => {
                track.stop()
                stream.removeTrack(track);
            });
            commit("setMediaDevices", devices);
        }, 
    }
}