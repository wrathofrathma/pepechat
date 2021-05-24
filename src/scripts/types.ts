// Server data models

export type RoomStreamTracks = {
    [key: string]: {
        webcam: string,
        audio: string,
    }
}

export type RoomEntry = {
    name: String,
    video: Boolean,
    audio: Boolean,
    screenshare: Boolean,
    locked: Boolean,
    users: Array<String>,
    lastActive: number,
    streams: RoomStreamTracks,
};

export type RoomIndex = {[key: string]: RoomEntry};

export type Message = {
    uuid: String
    userId: String,
    contents: String,
    timestamp: number,
}

export type User = {
    username: string,
    avatar: string,
    dead: boolean
}