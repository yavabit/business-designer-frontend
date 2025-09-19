import { memo, useCallback } from "react";
import { useReactFlow } from "@xyflow/react";

import style from "./style.module.scss";
import { useAppDispatch } from "@hooks/storeHooks";
import { addNode } from "@store/processConstructor/processConstructorSlice";
import { Divider } from "antd";
import { useTheme } from "@hooks/useTheme";

export interface IContextMenu {
  id: string;
  top?: number | undefined;
  left?: number | undefined;
  right?: number | undefined;
  bottom?: number | undefined;
  onClick?: () => void;
}

const ContextMenu = ({
  id,
  top,
  left,
  right,
  bottom,
  ...props
}: IContextMenu) => {
  const { token } = useTheme();

  const { getNode, setNodes, setEdges } = useReactFlow();

  const dispatch = useAppDispatch();

  const duplicateNode = useCallback(() => {
    const node = getNode(id);

    if (!node) {
      console.warn(`Node id: '${id}' is undefined`);
      return;
    }

    const position = {
      x: node.position.x + 25,
      y: node.position.y + 25,
    };

    dispatch(
      addNode({
        ...node,
        selected: false,
        dragging: false,
        position,
      })
    );
  }, [dispatch, id, getNode]);

  const handleClickDeleteNode = useCallback(() => {
    setNodes((nodes) => nodes.filter((node) => node.id !== id));
    setEdges((edges) => edges.filter((edge) => edge.source !== id));
  }, [id, setNodes, setEdges]);

  return (
    <div
      style={{
        top,
        left,
        right,
        bottom,
        backgroundColor: token.colorBgContainer,
        color: token.colorText,
      }}
      className={style.contextMenu}
      {...props}
    >
      <div
        className={style.contextMenuButton}
        onClick={handleClickDeleteNode}
        style={{ color: "red" }}
      >
        Удалить
      </div>

      <div className={style.contextMenuButton} onClick={duplicateNode}>
        Дублировать
      </div>
    </div>
  );
};

export default memo(ContextMenu);
