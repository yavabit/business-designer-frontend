import { useMouse } from "@hooks/useMouse";
import useSocket from "@hooks/useSocket";
import Cursor from "@pages/ProcessConstructor/components/UserCursor/Cursor";
import { useReactFlow } from "@xyflow/react";
import { useEffect } from "react";

interface IUserMulticursor {
  processId: string | undefined;
}

const UserMulticursor = ({ processId }: IUserMulticursor) => {
  const { mousePos } = useMouse();

  const { cursors, emitCursorMove } = useSocket();

  const { screenToFlowPosition } = useReactFlow();

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

		if(!processId)
			return

    emitCursorMove({
      processId,
      x: position.x,
			y: position.y
    });
  }, [screenToFlowPosition, processId, mousePos]);

  return (
    <>
      {Object.keys(cursors).filter(item => item != undefined).map((userId, i) => (
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
