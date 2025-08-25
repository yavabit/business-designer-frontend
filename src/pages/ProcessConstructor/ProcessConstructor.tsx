import { useState, useCallback, useEffect, useRef } from "react";
import {
  ReactFlow,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  type Node,
  type Edge,
  type SnapGrid,
  BackgroundVariant,
  Background,
  Controls,
  MiniMap,
  type OnNodesChange,
  type OnEdgesChange,
  type OnConnect,
  type NodeMouseHandler,
  ConnectionMode,
  type ReactFlowInstance,
  useReactFlow,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import style from "./ProcessConstructor.module.scss";
import { Button } from "antd";
import { AiOutlinePlus } from "react-icons/ai";
import { NodesPanel } from "./components/NodesPanel/NodesPanel";
import { NodeEditPanel } from "./components/NodeEditPanel/NodeEditPanel";
import { setSelectedNode } from "@store/nodes/nodesSlice";
import { useAppDispatch, useAppSelector } from "@hooks/storeHooks";
import { nodeTypes } from "@components/Nodes";
import { useDnD } from "@hooks/useDnD";
import Sidebar from "@pages/ProcessConstructor/Sidebar";
import { nodeList } from "../../shared/data/nodes";

const initialNodes: Node[] = [
  {
    id: "n1",
    position: { x: 0, y: 0 },
    type: "input",
    data: { label: "Node 1", text: "Hello", test: 1 },
  },
  {
    id: "n2",
    type: "process",
    position: { x: 0, y: 100 },
    data: {
      label: "Node 2",
      value: "Текст",
      style: {
        padding: "20px",
        border: "5px solid red",
      },
    },
  },
];
const initialEdges: Edge[] = [{ id: "n1-n2", source: "n1", target: "n2" }];

const snapGrid: SnapGrid = [20, 20];
const defaultViewport = { x: 0, y: 0, zoom: 1.5 };

const getId = (nodes: Node[]) => `n_${nodes.length + 1}`;

export const ProcessConstructor = () => {
  const selectedNode = useAppSelector((state) => state.nodes.selectedNode);
  const dispatch = useAppDispatch();

  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);

  const [rfInstance, setRfInstance] = useState<ReactFlowInstance>();

  useEffect(() => {
    if (rfInstance) {
      console.log(rfInstance.toObject());
    }
  }, [rfInstance]);

  const onNodesChange = useCallback<OnNodesChange>(
    (changes) =>
      setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
    []
  );
  const onEdgesChange = useCallback<OnEdgesChange>(
    (changes) =>
      setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
    []
  );
  const onConnect = useCallback<OnConnect>(
    (params) => setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
    []
  );

  const handleAddNode = () => {
    const id = getId(nodes);

    const newNode = {
      id,
      position: { x: -150, y: -100 },
      data: { label: `Node ${id}` },
    };

    setNodes((nds) => nds.concat(newNode));
  };

  const handleNodeClick: NodeMouseHandler = useCallback((_, node) => {
    dispatch(setSelectedNode(node));
  }, []);

  const handlePaneClick = useCallback(() => {
    if (selectedNode != null) {
      dispatch(setSelectedNode(null));
    }
  }, [selectedNode]);
  // DnD
  const reactFlowWrapper = useRef(null);
  const { screenToFlowPosition } = useReactFlow();
  const [type] = useDnD();

  const onDragOver = useCallback((event: React.DragEvent<HTMLElement>) => {
    console.log("onDragOver");
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent<HTMLElement>) => {
      event.preventDefault();
      console.log("onDrop ", type);
      // check if the dropped element is valid
      if (!type) {
        return;
      }

      // project was renamed to screenToFlowPosition
      // and you don't need to subtract the reactFlowBounds.left/top anymore
      // details: https://reactflow.dev/whats-new/2023-11-10
      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });
      let nodeData = nodeList.find((item) => item.code === type.toString());

      nodeData = !nodeData
        ? {
            label: "Node " + getId(nodes),
          }
        : nodeData.defaultData;


			console.log(nodeData)

      const newNode: Node[] = [
        {
          id: getId(nodes),
          type: type.toString(),
          position,
          data: {
            ...nodeData,
          },
        },
      ];

      setNodes((nds) => nds.concat(newNode));
    },
    [screenToFlowPosition, type, nodes]
  );

  return (
    <div className={style.dndflow}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          height: "1000px",
          width: "100%",
        }}
        className="reactflow-wrapper"
        ref={reactFlowWrapper}
      >
        <ReactFlow
          colorMode="dark"
          connectionMode={ConnectionMode.Loose}
          onInit={setRfInstance}
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={handleNodeClick}
          onPaneClick={handlePaneClick}
          onConnect={onConnect}
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
};
