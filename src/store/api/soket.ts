
import { io } from "socket.io-client";

export const socket = io("http://localhost:8081", {
		transports: ["websocket"],
		autoConnect: true,
		withCredentials: true,
});

