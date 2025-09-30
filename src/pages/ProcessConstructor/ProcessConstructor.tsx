import { useState, useCallback, useRef, memo, useEffect, useMemo } from "react";
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
  getViewportForBounds,
  type EdgeMouseHandler,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import style from "./ProcessConstructor.module.scss";
import { NodesPanel } from "./components/NodesPanel/NodesPanel";
import { NodeEditPanel } from "./components/NodeEditPanel/NodeEditPanel";
import { useAppDispatch, useAppSelector } from "@hooks/storeHooks";
import { useDnD } from "@hooks/useDnD";
import {
  onConnect,
  onEdgesChange,
  onNodesChange,
  setProcessId,
  setSelectedEdge,
  setSelectedNode,
} from "@store/processConstructor/processConstructorSlice";

import ContextMenu, { type IContextMenu } from "./components/ContextMenu";
import { useTheme } from "@hooks/useTheme";
import { debounce } from "lodash";
import {
  useGetProcessQuery,
  useUpdateProcessImageMutation,
  useUpdateProcessSchemeMutation,
} from "@store/api/processConstructor/processConstructorApi";
import { toBlob } from "html-to-image";
import { useParams } from "react-router-dom";
import { Flex, Spin } from "antd";
import { Hotkeys } from "@pages/ProcessConstructor/components/Hotkeys";
import { socket } from "@store/api/socket";
import UserMulticursor from "@pages/ProcessConstructor/components/UserCursor";
import { ConstructorHeader } from "./components/ConstructorHeader/ConstructorHeader";

interface IDocumentRefresh {
  content: { nodes: []; edges: []; connects: [], newNode: Node };
}

export const ProcessConstructor = memo(() => {
  const { isDarkMode } = useTheme();

  const { nodeList, nodeTypes } = useAppSelector((state) => state.nodes);
  const selectedNode = useAppSelector(
    (state) => state.processConstructor.selectedNode
  );
  const { nodes, edges, snapGrid, defaultViewport } = useAppSelector(
    (state) => state.processConstructor
  );

  const dispatch = useAppDispatch();

  const { processId } = useParams();

  const { data: processData, isLoading } = useGetProcessQuery({ processId });

	useEffect(() => {
		dispatch(setProcessId(processId))
	}, [dispatch, processId])

  const [updateProcessScheme] = useUpdateProcessSchemeMutation();
  const [updateProcessImage] = useUpdateProcessImageMutation();

  const colorModeFlow = useMemo(() => {
    return isDarkMode ? "dark" : "light";
  }, [isDarkMode]);

  const [rfInstance, setRfInstance] = useState<ReactFlowInstance>();

  // DnD
  const reactFlowWrapper = useRef(null);
  const { screenToFlowPosition, getNodes, getNodesBounds, setNodes } = useReactFlow();
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

			const newNode = {
				id: crypto.randomUUID(),
				data: defaultData,
				type: type.toString(),
				position,
			}

      setNodes((nds) => nds.concat(newNode));

			
    },
    [screenToFlowPosition, type, nodeList, setNodes]
  );

  // Context Menu.
  const [menu, setMenu] = useState<IContextMenu | null>(null);
  const refReactFlow = useRef<HTMLDivElement | null>(null);

  const onNodeContextMenu = useCallback<NodeMouseHandler<Node>>(
    (event, node) => {
      event.preventDefault();

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

  const handleEdgeClick: EdgeMouseHandler = useCallback(
    (_, edge) => {
      dispatch(setSelectedEdge(edge));
    },
    [dispatch]
  );

  const handlePaneClick = useCallback(() => {
    if (selectedNode != null) {
      dispatch(setSelectedNode(null));
    }

    setMenu(null);
  }, [dispatch, selectedNode, setMenu]);

  // Автосохранение.
  const flowAutosave = useMemo(
    () =>
      debounce(() => {
        if (processId && rfInstance) {
          socket.emit("document-update", {
            documentId: processId,
            content: JSON.stringify(rfInstance.toObject()),
          });

          const imageWidth = 1920;
          const imageHeight = 1080;

          const nodesBounds = getNodesBounds(getNodes());
          const viewport = getViewportForBounds(
            nodesBounds,
            imageWidth,
            imageHeight,
            0.5,
            2,
            20
          );

          const view: HTMLElement | null = document.querySelector(
            ".react-flow__viewport"
          );

          if ((!view && !refReactFlow) || refReactFlow?.current == null) return;

          if (refReactFlow?.current == null) return;

          toBlob(refReactFlow.current, {
            backgroundColor: "#1a365d",
            width: imageWidth,
            height: imageHeight,
            style: {
              width: imageWidth.toString(),
              height: imageHeight.toString(),
              transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.zoom})`,
            },
          }).then((dataUrl) => {
            const formData = new FormData();

            if (!dataUrl) return;

            const file = new File([dataUrl], "test.png", {
              type: "image/png",
              lastModified: new Date().getTime(),
            });

            formData.append("name", "test.png");
            formData.append("photo", file);

            updateProcessImage({
              id: processId,
              data: formData,
            });
          });
        }
      }, 400),
    [processId, rfInstance, getNodes, getNodesBounds, updateProcessImage]
  );

  const handleChangeNode = useCallback<OnNodesChange<Node>>(
    (e) => {
      socket.emit("document-refresh", {
        documentId: processId,
        content: {
          nodes: e,
        },
      });
      dispatch(onNodesChange(e));
    },
    [dispatch, processId]
  );
  const handleChangeEdges = useCallback<OnEdgesChange<Edge>>(
    (e) => {
      socket.emit("document-refresh", {
        documentId: processId,
        content: {
          edges: e,
        },
      });
      dispatch(onEdgesChange(e));
    },
    [dispatch, processId]
  );
  const handleChangeConnect = useCallback<OnConnect>(
    (e) => {
      socket.emit("document-refresh", {
        documentId: processId,
        content: {
          connects: e,
        },
      });
      dispatch(onConnect(e));
    },
    [dispatch, processId]
  );

  // Сокеты.

  useEffect(() => {
    function onSocketConnect() {
      console.log("onConnect");
    }

    function onSocketDisconnect() {
      console.log("onDisconnect");
    }

    function onDocumentUpdate(e: IDocumentRefresh) {
      console.log("onDocumentUpdate", e);

      const { content } = e;
      const { nodes, edges, connects, newNode } = content;

      if (nodes) dispatch(onNodesChange(nodes));

      if (edges) dispatch(onEdgesChange(edges));

      if (connects) dispatch(onConnect(connects));

			if (newNode)
				setNodes((nds) => nds.concat(newNode));
    }

    socket.on("connect", onSocketConnect);
    socket.on("disconnect", onSocketDisconnect);
    socket.on("document-refresh", onDocumentUpdate);

    return () => {
      socket.off("connect", onSocketConnect);
      socket.off("disconnect", onSocketDisconnect);
      socket.off("document-refresh", onDocumentUpdate);
    };
  }, []);

  useEffect(() => {
    socket.emit("join-document", processId);

    return () => {
      socket.emit("leave-document", processId);
    };
  }, [processId]);

  return (
    <div className={style.dndflow}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          height: "calc(100vh - 76px)",
          width: "100%",
        }}
        className="reactflow-wrapper"
        ref={reactFlowWrapper}
      >
        <ConstructorHeader
          processName={processData?.data.name}
          isAgent={processData?.data.category === "agent"}
        />
        {isLoading && (
          <Flex justify="center" style={{ padding: "20px" }}>
            <Spin size="large" />
          </Flex>
        )}
        {!isLoading && (
          <ReactFlow
            ref={refReactFlow}
            colorMode={colorModeFlow}
            connectionMode={ConnectionMode.Loose}
            onInit={setRfInstance}
            nodes={nodes}
            edges={edges}
            onNodesChange={(e) => {
              handleChangeNode(e);
              flowAutosave();
            }}
            onEdgesChange={(e) => {
              handleChangeEdges(e);
              flowAutosave();
            }}
            onConnect={(e) => {
              handleChangeConnect(e);
              flowAutosave();
            }}
            onNodeClick={handleNodeClick}
            onEdgeClick={handleEdgeClick}
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
            <Background color="#ccc" variant={BackgroundVariant.Dots} />{" "}
            {menu && <ContextMenu onClick={handlePaneClick} {...menu} />}
          </ReactFlow>
        )}
      </div>
      <UserMulticursor processId={processId} />
      <Hotkeys />
    </div>
  );
});
