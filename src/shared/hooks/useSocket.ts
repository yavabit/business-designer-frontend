import { socket } from "@store/api/socket";
import { useEffect, useState } from "react";

interface IUser {
	userId: string;
	username: string;
	documentId: string;
}

interface IListJoinedUsers {
	[key: string]: IUser
}

const useSocket = () => {

	const [listJoinedUsers, setListJoinedUsers] = useState<IListJoinedUsers>({})

	const emitJoinDocument = (processId: string | undefined) => {
    socket.emit("join-document", processId);
	}

	const emitLeaveDocument = (processId: string | undefined) => {
    socket.emit("leave-document", processId);
	}


	useEffect(() => {
		const onUserJoinDocument = (e: IUser) => {
			setListJoinedUsers(prevState => ({
				...prevState,
				[e.userId]: e
			}))
		}

		const onUserLeftDocument = (e: IUser) => {
			const newItems = { ...listJoinedUsers };
			delete newItems[e.userId];

			setListJoinedUsers(newItems)
		}

		const onDocumentUsers = (e: { users: IUser[] }) => {
			const newItems: IListJoinedUsers = {}
			e.users.forEach(user => {
				newItems[user.userId] = user
			})
			setListJoinedUsers(newItems)
		}

		socket.on("user-joined", onUserJoinDocument);
		socket.on("user-left", onUserLeftDocument);

		socket.on("users-in-document", onDocumentUsers);

		return () => {
			socket.off("user-joined", onUserJoinDocument);
			socket.off("user-left", onUserLeftDocument);

			socket.off("users-in-document", onDocumentUsers);
		};
	}, []);

	return {
		listJoinedUsers,
		emitJoinDocument,
		emitLeaveDocument
	}
}

export default useSocket