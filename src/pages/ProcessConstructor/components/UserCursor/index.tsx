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
  [userId: string]: IUserCursorMove;
}

const UserMulticursor = ({ processId }: IUserMulticursor) => {
  const { mousePos } = useMouse();

  const [cursors, setCursors] = useState<ICursors>({});
  const { screenToFlowPosition } = useReactFlow();

  function onUserCursorMove(e: IUserCursorMove) {
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

  useEffect(() => {
    socket.on("user-cursor-move", onUserCursorMove);

    return () => {
      socket.off("user-cursor-move", onUserCursorMove);
    };
  }, []);

  useEffect(() => {
    const position = screenToFlowPosition(
      {
        x: mousePos.x,
        y: mousePos.y,
      },
      {
        snapToGrid: false,
      }
    );

    socket.emit("cursor-move", {
      documentId: processId,
      x: position.x,
      y: position.y,
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
