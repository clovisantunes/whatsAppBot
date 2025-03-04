import axios from "axios";
export function Api(ctx = undefined) {
    const api = axios.create({
        baseURL: "http://localhost:3000",
    });

    return api;
}