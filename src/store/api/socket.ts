
import { io } from "socket.io-client";


const userPersist = localStorage.getItem('persist:user')
let token = ""

if(userPersist) {
	const user = JSON.parse(userPersist)
	token = JSON.parse(user.token)
}



export const socket = io(import.meta.env.VITE_API_HOST, {
	transports: ["websocket"],
	autoConnect: true,
	withCredentials: true,
	auth: {
		token
	}
});