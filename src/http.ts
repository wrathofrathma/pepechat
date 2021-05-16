import axios from "axios";
import store from "./store";


export default function () {
    return axios.create({
        baseURL: store.state.baseURL,
        timeout: 8000,
        headers: {
            Authorization: store.state.token
        }
    })
}