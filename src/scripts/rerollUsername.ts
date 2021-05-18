import store from "../store";

export default function () {
    store.state.socket.send(JSON.stringify({
        event: "user/username"
    }))
}