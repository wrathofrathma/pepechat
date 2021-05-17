// Server data models

export type RoomEntry = {
    name: String,
    video: Boolean,
    audio: Boolean,
    screenshare: Boolean,
    locked: Boolean,
    users: Array<String>,
    lastActive: number
};

export type RoomIndex = {[key: string]: RoomEntry};

export type Message = {
    uuid: String
    userId: String,
    contents: String,
    timestamp: Number,
}