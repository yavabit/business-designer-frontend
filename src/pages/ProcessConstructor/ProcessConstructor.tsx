import { useState, useCallback } from "react";
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
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Button } from "antd";
import { AiOutlinePlus } from "react-icons/ai";
import { NodesPanel } from "./NodesPanel/NodesPanel";
import { NodeEditPanel } from "./NodeEditPanel/NodeEditPanel";
import { setSelectedNode } from "@store/nodes/nodesSlice";
import { useAppDispatch, useAppSelector } from "@hooks/storeHooks";

const initialNodes: Node[] = [
  {
    id: "n1",
    position: { x: 0, y: 0 },
    data: { label: "Node 1", text: "Hello", test: 1 },
  },
  { id: "n2", position: { x: 0, y: 100 }, data: { label: "Node 2" } },
];
const initialEdges: Edge[] = [{ id: "n1-n2", source: "n1", target: "n2" }];

const snapGrid: SnapGrid = [20, 20];
const defaultViewport = { x: 0, y: 0, zoom: 1.5 };

export const ProcessConstructor = () => {
  const selectedNode = useAppSelector((state) => state.nodes.selectedNode);
  const dispatch = useAppDispatch()

  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);

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
    const id = "" + nodes.length + 1;
		
    const newNode = {
      id,
      position: { x: -150, y: -100 },
      data: { label: `Node ${id}` },
    };

    setNodes((nds) => nds.concat(newNode));
  };

  const handleNodeClick: NodeMouseHandler = useCallback((_, node) => {
    dispatch(setSelectedNode(node));
  }, [])

  const handlePaneClick = useCallback(() => {
    if (selectedNode != null) {
      dispatch(setSelectedNode(null));
    }
  }, [selectedNode])

  return (
    <div>
      <Button
        size="large"
        type="primary"
        shape="circle"
        icon={<AiOutlinePlus />}
        onClick={handleAddNode}
      />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          height: "1000px",
          width: "100%",
        }}
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={handleNodeClick}
          onPaneClick={handlePaneClick}
          onConnect={onConnect}
          snapToGrid={true}
          snapGrid={snapGrid}
          defaultViewport={defaultViewport}
          attributionPosition="top-right"
          fitView
          style={{
            flex: 1,
          }}
        >
          <NodesPanel/>
          <NodeEditPanel/>
          <Controls />
          <MiniMap />
          <Background color="#ccc" variant={BackgroundVariant.Dots} />
        </ReactFlow>
      </div>
    </div>
  );
};
