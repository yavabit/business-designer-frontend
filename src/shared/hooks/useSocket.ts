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

interface IUserCursorMove {
	userId: string;
	username: string;
	x: number;
	y: number;
}

interface ICursors {
	[userId: string]: IUserCursorMove;
}

const useSocket = () => {

	const [listJoinedUsers, setListJoinedUsers] = useState<IListJoinedUsers>({})
  	const [cursors, setCursors] = useState<ICursors>({});
	const [agentLogs, setAgentLogs] = useState<{ id: string; log_text: string; }[]>([]);

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

	const emitDocumentNameUpdated = ({ processId, name }: { processId: string; name: string }) => {
		socket.emit("document-name-update", {
			documentId: processId,
			name
		})
	}

	const emitExecuteAgent = (processId: string) => {
		socket.emit("execute-agent", { documentId: processId });
	}

	const emitGetAgentStatus = (processId: string) => {
		socket.emit("give-agent-status", { documentId: processId });
	}

	const emitSheduleSwitch = (processId: string) => {
		socket.emit("shedule-switch", { documentId: processId });
	}

	const onSocketConnect = () => {
		console.log("onConnect");
	}

	const onSocketDisconnect = () => {
		console.log("onDisconnect");
	}

	const onUserJoinDocument = (e: IUser) => {
		setListJoinedUsers(prevState => ({
			...prevState,
			[e.userId]: e
		}))
	}

	const onUserLeftDocument = (e: IUser) => {
		const id = e.userId

		setListJoinedUsers(prevState => {
			const state = { ...prevState }
			delete state[id]
			return state
		})

		setCursors(prevState => {
			const state = { ...prevState }
			delete state[id]
			return state
		})
	}

	const onDocumentUsers = (e: { users: IUser[] }) => {
		const newItems: IListJoinedUsers = {}
		e.users.forEach(user => {
			newItems[user.userId] = user
		})
		setListJoinedUsers(newItems)
	}

	useEffect(() => {

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

	const emitGetAgentLogs = (processId: string) => {
		socket.emit("get-agent-logs", {
			documentId: processId
		})
	}

	const onAgentLogsUpdate = (e: {agentLogs: {id: string, log_text: string}[]}) => {
		const { agentLogs } = e;
		setAgentLogs(agentLogs);
	}

	const onNewAgentLog = (data: { 
		documentId: string;
		log: { id: string; log_text: string };
		timestamp: string;
	}) => {    
		setAgentLogs(prevLogs => [...prevLogs, data.log]);
	};

	useEffect(() => {
		socket.on("give-agent-logs", onAgentLogsUpdate);
		socket.on("new-agent-log", onNewAgentLog);

		return () => {
			socket.off("give-agent-logs", onAgentLogsUpdate);
			socket.off("new-agent-log", onNewAgentLog);
		}
	}, [])

  const onUserCursorMove = (e: IUserCursorMove) => {
    const { userId, username, x, y } = e;

    const firstName = username?.split(" ")[1];

    setCursors((prevState) => ({
      ...prevState,
      [userId]: {
        userId,
        username: firstName,
        x,
        y,
      },
    }));
  }

	const emitCursorMove = ({ processId, x, y }: { processId: string, x: number, y: number  }) => {
    socket.emit("cursor-move", {
      documentId: processId,
      x,
      y,
    });
	}

  useEffect(() => {
    socket.on("user-cursor-move", onUserCursorMove);

    return () => {
      socket.off("user-cursor-move", onUserCursorMove);
    };
  }, []);

	return {
		listJoinedUsers,
		emitJoinDocument,
		emitLeaveDocument,
		emitDocumentUpdate,
		emitDocumentRefresh,
		emitDocumentNameUpdated,
		emitExecuteAgent,
		emitGetAgentLogs,
		emitGetAgentStatus,
		emitSheduleSwitch,
		cursors,
		agentLogs,
		emitCursorMove
	}
}

export default useSocket