import { memo, useCallback } from "react";
import { useReactFlow } from "@xyflow/react";

import style from "./style.module.scss";
import { useAppDispatch } from "@hooks/storeHooks";
import { addNode } from "@store/processConstructor/processConstructorSlice";
import type { MenuProps } from "antd";
import { Dropdown, theme } from "antd";

export interface IContextMenu {
  id: string;
  top?: number | undefined;
  left?: number | undefined;
  right?: number | undefined;
  bottom?: number | undefined;
  onClick?: () => void;
}

const items: MenuProps["items"] = [
  {
    label: "1st menu item",
    key: "1",
  },
  {
    label: "2nd menu item",
    key: "2",
  },
  {
    label: "3rd menu item",
    key: "3",
  },
];

const ContextMenu = ({
  id,
  top,
  left,
  right,
  bottom,
  ...props
}: IContextMenu) => {
  const {
    token: { colorBgLayout, colorTextTertiary },
  } = theme.useToken();

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
    // <div
    //   style={{ top, left, right, bottom }}
    //   className={style.contextMenu}
    //   {...props}
    // >
    //   <p style={{ margin: "0.5em" }}></p>
    //   <button className={style.contextMenuButton} onClick={duplicateNode}>
    //     duplicate
    //   </button>
    //   <button
    //     className={style.contextMenuButton}
    //     onClick={handleClickDeleteNode}
    //   >
    //     delete
    //   </button>
    // </div>
    <Dropdown menu={{ items }} trigger={["contextMenu"]}>
      <div
        style={{
          color: colorTextTertiary,
          background: colorBgLayout,
          height: 200,
          textAlign: "center",
          lineHeight: "200px",
        }}
      >
        Right Click on here
      </div>
    </Dropdown>
  );
};

export default memo(ContextMenu);
