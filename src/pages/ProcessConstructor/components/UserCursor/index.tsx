import { useMouse } from "@hooks/useMouse";
import Cursor from "@pages/ProcessConstructor/components/UserCursor/Cursor";
import { socket } from "@store/api/socket";
import { useReactFlow } from "@xyflow/react";
import { useEffect, useState } from "react";

interface IUserMulticursor {
  processId: string | undefined;
}

interface IUserCursorMove {
  userId: string;
  username: string;
  x: number;
  y: number;
}

interface ICursors {
  [userId: string]: { x: number; y: number; username: string };
}

const UserMulticursor = ({
  processId
}: IUserMulticursor) => {
  const { mousePos } = useMouse();

  const [cursors, setCursors] = useState<ICursors>({});
  const { screenToFlowPosition, flowToScreenPosition } = useReactFlow();

  useEffect(() => {
    function onUserCursorMove(e: IUserCursorMove) {
      const { userId, username, x, y } = e;

      const firstName = username.split(" ")[0];

			const flowPos = flowToScreenPosition({
				x: x,
				y: y
			})

			const headerOffset = 134


      setCursors((prevState) => ({
        ...prevState,
        [userId]: {
          username: firstName,
          x: flowPos.x,
          y: flowPos.y - headerOffset,
        },
      }));
    }

    socket.on("user-cursor-move", onUserCursorMove);

    return () => {
      socket.off("user-cursor-move", onUserCursorMove);
    };
  }, []);

  useEffect(() => {
    const position = screenToFlowPosition({
			x: mousePos.x,
			y: mousePos.y
		}, {
			snapToGrid: false
		});

    socket.emit("cursor-move", {
      documentId: processId,
			x: position.x,
			y: position.y
    });
  }, [screenToFlowPosition, processId, mousePos]);

  return (
    <>
      {Object.keys(cursors).map((userId, i) => (
        <Cursor
          key={i}
          x={cursors[userId].x}
          y={cursors[userId].y}
          label={cursors[userId].username}
        />
      ))}
    </>
  );
};

export default UserMulticursor;
