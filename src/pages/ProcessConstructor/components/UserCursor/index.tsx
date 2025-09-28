import { useMouse } from "@hooks/useMouse";
import Cursor from "@pages/ProcessConstructor/components/UserCursor/Cursor";
import { socket } from "@store/api/socket";
import { useEffect, useState } from "react";

interface IUserMulticursor {
  processId: string | undefined;
}

interface IUserCursorMove {
  userId: string;
  x: number;
  y: number;
}

interface ICursors {
  [userId: string]: { x: number; y: number };
}

const UserMulticursor = ({ processId }: IUserMulticursor) => {
  const { mousePos } = useMouse();

  const [cursors, setCursors] = useState<ICursors>({});

  useEffect(() => {
    function onUserCursorMove(e: IUserCursorMove) {
      // console.log("onUserCursorMove", e);
      const { userId, x, y } = e;

			setCursors((prevState) => ({
        ...prevState,
        [userId]: {
          x,
          y,
        },
			}))
    }

    socket.on("user-cursor-move", onUserCursorMove);

    return () => {
      socket.off("user-cursor-move", onUserCursorMove);
    };
  }, []);

  useEffect(() => {
    socket.emit("cursor-move", {
      documentId: processId,
      x: mousePos.x,
      y: mousePos.y,
    });
  }, [processId, mousePos]);

  return (
    <>
      {Object.keys(cursors).map((userId, i) => (
        <Cursor key={i} x={cursors[userId].x} y={cursors[userId].y} label={userId}/>
      ))}
    </>
  );
};

export default UserMulticursor;
