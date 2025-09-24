import { useAppDispatch, useAppSelector } from "@hooks/storeHooks";
import { useMouse } from "@hooks/useMouse";
import { MappingKeys } from "@pages/ProcessConstructor/components/Hotkeys/mapping";
import { addNode } from "@store/processConstructor/processConstructorSlice";
import { useReactFlow } from "@xyflow/react";
import {  useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";

export const Hotkeys = () => {
	const { mousePos } = useMouse()

  const { getNode, setNodes, setEdges, screenToFlowPosition } = useReactFlow();
  const dispatch = useAppDispatch();

  const [copyNodeId, setCopyNodeId] = useState("");

  const { selectedNode, selectedEdge } = useAppSelector(
    (state) => state.processConstructor
  );


  useHotkeys(MappingKeys.Copy.key, () => {
    if (!selectedNode) return;

    setCopyNodeId(selectedNode.id);
  });

  useHotkeys(MappingKeys.Paste.key, () => {
    if (!selectedNode) return;

    const node = getNode(copyNodeId);

    if (!node) return;

    const position = screenToFlowPosition(mousePos);

    dispatch(
      addNode({
        ...node,
        selected: false,
        dragging: false,
        position,
      })
    );
  });

  useHotkeys(MappingKeys.Delete.key, () => {
    if (selectedNode) {
      setNodes((nodes) => nodes.filter((node) => node.id !== selectedNode.id));
      setEdges((edges) =>
        edges.filter((edge) => edge.source !== selectedNode.id)
      );
    }

    if (selectedEdge) {
      setEdges((edges) => edges.filter((edge) => edge.id !== selectedEdge.id));
    }
  });

  return <></>;
};
