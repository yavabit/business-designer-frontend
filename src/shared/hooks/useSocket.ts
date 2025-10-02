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

	const emitDocumentUpdate = ({ processId, content }: { processId: string; content: string }) => {
		socket.emit("document-update", {
			documentId: processId,
			content,
		});
	}

	const emitDocumentRefresh = ({ processId, content }: { processId: string; content: object }) => {
		socket.emit("document-refresh", {
			documentId: processId,
			content,
		});
	}


	const onSocketConnect = () => {
		console.log("onConnect");
	}

	const onSocketDisconnect = () => {
		console.log("onDisconnect");
	}



	useEffect(() => {

		const onUserJoinDocument = (e: IUser) => {
			setListJoinedUsers(prevState => ({
				...prevState,
				[e.userId]: e
			}))
		}

		const onUserLeftDocument = (e: IUser) => {
			const id = e.userId

			setListJoinedUsers(current => {
				const { [id]: _, ...rest } = current;
				return rest;
			})
		}

		const onDocumentUsers = (e: { users: IUser[] }) => {
			console.log('onUserJoinDocument', e)
			const newItems: IListJoinedUsers = {}
			e.users.forEach(user => {
				newItems[user.userId] = user
			})
			setListJoinedUsers(newItems)
		}

		socket.on("connect", onSocketConnect);
		socket.on("disconnect", onSocketDisconnect);

		socket.on("user-joined", onUserJoinDocument);
		socket.on("user-left", onUserLeftDocument);

		socket.on("users-in-document", onDocumentUsers);

		return () => {
			socket.off("connect", onSocketConnect);
			socket.off("disconnect", onSocketDisconnect);

			socket.off("user-joined", onUserJoinDocument);
			socket.off("user-left", onUserLeftDocument);

			socket.off("users-in-document", onDocumentUsers);
		};
	}, []);

	return {
		listJoinedUsers,
		emitJoinDocument,
		emitLeaveDocument,
		emitDocumentUpdate,
		emitDocumentRefresh
	}
}

export default useSocket