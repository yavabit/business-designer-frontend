import { useState, useCallback, useRef, memo, useEffect } from "react";
import {
  ReactFlow,
  BackgroundVariant,
  Background,
  Controls,
  MiniMap,
  type NodeMouseHandler,
  ConnectionMode,
  type ReactFlowInstance,
  useReactFlow,
  type Node,
  type OnNodesChange,
  type OnEdgesChange,
  type Edge,
  type OnConnect,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import style from "./ProcessConstructor.module.scss";
import { NodesPanel } from "./components/NodesPanel/NodesPanel";
import { NodeEditPanel } from "./components/NodeEditPanel/NodeEditPanel";
import { setSelectedNode } from "@store/nodes/nodesSlice";
import { useAppDispatch, useAppSelector } from "@hooks/storeHooks";
import { nodeTypes } from "@components/Nodes";
import { useDnD } from "@hooks/useDnD";
import { nodeList } from "../../shared/data/nodes";
import {
  addNode,
  onConnect,
  onEdgesChange,
  onNodesChange,
} from "@store/processConstructor/processConstructorSlice";

import ContextMenu, { type IContextMenu } from "./components/ContextMenu";

export const ProcessConstructor = memo(() => {
  const selectedNode = useAppSelector((state) => state.nodes.selectedNode);
  const dispatch = useAppDispatch();

  const { nodes, edges, snapGrid, defaultViewport } = useAppSelector(
    (state) => state.processConstructor
  );

  const [rfInstance, setRfInstance] = useState<ReactFlowInstance>();
  useEffect(() => {
    if (rfInstance) {
      console.log(rfInstance.toObject());
    }
    console.log(nodes);
  }, [rfInstance, nodes]);

  // DnD
  const reactFlowWrapper = useRef(null);
  const { screenToFlowPosition } = useReactFlow();
  const { type } = useDnD();

  const onDragOver = useCallback((event: React.DragEvent<HTMLElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent<HTMLElement>) => {
      event.preventDefault();
      if (!type) {
        return;
      }

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });
      const nodeData: INodeItem | undefined = nodeList.find(
        (item) => item.code === type.toString()
      );

      const defaultData = !nodeData
        ? {
            label: "Default Node",
          }
        : nodeData.defaultData;

      dispatch(
        addNode({
          id: "new",
          data: defaultData,
          type: type.toString(),
          position,
        })
      );
    },
    [screenToFlowPosition, type, dispatch]
  );

  // Context Menu.
  const [menu, setMenu] = useState<IContextMenu | null>(null);
  const refReactFlow = useRef<HTMLDivElement | null>(null);

  const onNodeContextMenu = useCallback<NodeMouseHandler<Node>>(
    (event, node) => {
      // Prevent native context menu from showing
      event.preventDefault();

      // Calculate position of the context menu. We want to make sure it
      // doesn't get positioned off-screen.
      if (refReactFlow?.current == null) return;

      const pane = refReactFlow.current.getBoundingClientRect();
      setMenu({
        id: node.id,
        top: event.clientY < pane.height - 200 ? undefined : event.clientY,
        left: event.clientX < pane.width - 200 ? undefined : event.clientX,
        right:
          event.clientX >= pane.width - 200
            ? undefined
            : pane.width - event.clientX,
        bottom:
          event.clientY >= pane.height - 200
            ? undefined
            : pane.height - event.clientY,
      });
    },
    [setMenu]
  );

  const handleNodeClick: NodeMouseHandler = useCallback(
    (_, node) => {
      dispatch(setSelectedNode(node));
    },
    [dispatch]
  );

  const handlePaneClick = useCallback(() => {
    if (selectedNode != null) {
      dispatch(setSelectedNode(null));
    }

    setMenu(null);
  }, [dispatch, selectedNode, setMenu]);

  const handleChangeNode = useCallback<OnNodesChange<Node>>(
    (e) => dispatch(onNodesChange(e)),
    [dispatch]
  );
  const handleChangeEdges = useCallback<OnEdgesChange<Edge>>(
    (e) => dispatch(onEdgesChange(e)),
    [dispatch]
  );
  const handleChangeConnect = useCallback<OnConnect>(
    (e) => dispatch(onConnect(e)),
    [dispatch]
  );

  return (
    <div className={style.dndflow}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          height: "calc(100vh - 76px)",
          width: "100%",
        }}
        className="reactflow-wrapper"
        ref={reactFlowWrapper}
      >
        <ReactFlow
          ref={refReactFlow}
          colorMode="dark"
          connectionMode={ConnectionMode.Strict}
          onInit={setRfInstance}
          nodes={nodes}
          edges={edges}
          onNodesChange={handleChangeNode}
          onEdgesChange={handleChangeEdges}
          onConnect={handleChangeConnect}
          onNodeClick={handleNodeClick}
          nodeTypes={nodeTypes}
          snapToGrid={true}
          snapGrid={snapGrid}
          defaultViewport={defaultViewport}
          attributionPosition="top-right"
          fitView
          style={{
            flex: 1,
          }}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onPaneClick={handlePaneClick}
          onNodeContextMenu={onNodeContextMenu}
        >
          <NodesPanel />
          <NodeEditPanel />
          <Controls />
          <MiniMap />
          <Background color="#ccc" variant={BackgroundVariant.Dots} />
        </ReactFlow>
      </div>
    </div>
  );
});
