// Server data models

export type RoomStreamState = {
    [key: string]: {
        webcam: boolean,
        audio: boolean
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
    streams: RoomStreamState
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