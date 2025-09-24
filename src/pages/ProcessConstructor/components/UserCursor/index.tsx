import { useMouse } from "@hooks/useMouse";
import { socket } from "@store/api/socket";
import { useEffect, useState } from "react";
import { FcCursor } from "react-icons/fc";

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
        <span
          key={i}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            transform: `translate(${cursors[userId].x}px, ${cursors[userId].y}px)`,
            transition: "transform 120ms linear",
            color: "red",
          }}
        >
          <FcCursor size={25} />
          <span>{userId}</span>
        </span>
      ))}
    </>
  );
};

export default UserMulticursor;
