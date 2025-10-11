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
  ViewportPortal,
  ConnectionLineType,
  type DefaultEdgeOptions,
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

import { useTheme } from "@hooks/useTheme";
import { debounce } from "lodash";
import {
  useGetProcessQuery,
  useUpdateProcessImageMutation,
} from "@store/api/processConstructor/processConstructorApi";
import { toBlob } from "html-to-image";
import { useParams } from "react-router-dom";
import { Flex, notification, Spin } from "antd";
import { Hotkeys } from "@pages/ProcessConstructor/components/Hotkeys";
import { socket } from "@store/api/socket";
import UserMulticursor from "@pages/ProcessConstructor/components/UserCursor";
import { ConstructorHeader } from "./components/ConstructorHeader/ConstructorHeader";
import useSocket from "@hooks/useSocket";
import ExportButton from "@pages/ProcessConstructor/components/ExportButton";

interface IDocumentRefresh {
  content: { nodes: []; edges: []; connects: []; newNode: Node };
}

const connectionLineStyle = { stroke: "#ffff" };

const defaultEdgeOptions: DefaultEdgeOptions = {
  type: "smoothstep",
  style: {
    fill: "red",
  },
};

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

  const { data: processData, isLoading } = useGetProcessQuery(
    { processId },
    { skip: !processId, refetchOnMountOrArgChange: true }
  );

  const {
    emitDocumentUpdate,
    emitDocumentRefresh,
    emitJoinDocument,
    emitLeaveDocument,
  } = useSocket();

  useEffect(() => {
    dispatch(setProcessId(processId));
  }, [dispatch, processId]);

  const [updateProcessImage] = useUpdateProcessImageMutation();

  const colorModeFlow = useMemo(() => {
    return isDarkMode ? "dark" : "light";
  }, [isDarkMode]);

  const [rfInstance, setRfInstance] = useState<ReactFlowInstance>();
  const refReactFlow = useRef<HTMLDivElement | null>(null);

  // DnD
  const reactFlowWrapper = useRef(null);
  const { screenToFlowPosition, getNodes, getNodesBounds, setNodes } =
    useReactFlow();
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
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [screenToFlowPosition, type, nodeList, setNodes]
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
  }, [dispatch, selectedNode]);

  // Автосохранение.
  const flowAutosave = useMemo(
    () =>
      debounce(() => {
        if (processId && rfInstance) {
          emitDocumentUpdate({
            processId,
            content: JSON.stringify(rfInstance.toObject()),
          });

          const imageWidth = 3840;
          const imageHeight = 2160;

          const nodesBounds = getNodesBounds(getNodes());
          const viewport = getViewportForBounds(
            nodesBounds,
            imageWidth,
            imageHeight,
            0.5,
            2,
            { left: 0.1, top: 0.1, right: 0.1, bottom: 0.1 }
          );

          const view: HTMLElement | null = document.querySelector(
            ".react-flow__viewport"
          );

          if (view == null) return;

          toBlob(view, {
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
      if (!processId) return;

      emitDocumentRefresh({
        processId,
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
      if (!processId) return;

      emitDocumentRefresh({
        processId,
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
      if (!processId) return;

      emitDocumentRefresh({
        processId,
        content: {
          connects: e,
        },
      });

      dispatch(onConnect(e));
    },
    [dispatch, processId]
  );

  useEffect(() => {
    function onDocumentUpdate(e: IDocumentRefresh) {
      const { content } = e;
      const { nodes, edges, connects, newNode } = content;

      if (nodes) dispatch(onNodesChange(nodes));

      if (edges) dispatch(onEdgesChange(edges));

      if (connects) dispatch(onConnect(connects));

      if (newNode) setNodes((nds) => nds.concat(newNode));
    }

    socket.on("document-refresh", onDocumentUpdate);

    return () => {
      socket.off("document-refresh", onDocumentUpdate);
    };
  }, []);

  useEffect(() => {
    emitJoinDocument(processId);

    return () => {
      emitLeaveDocument(processId);
    };
  }, [processId]);

  useEffect(() => {
    const handleExecutedAgent = (e: {success: boolean; documentId: string}) => {
      if (e.documentId !== processId) return;
        
      if (e.success) {
        notification.success({
          message: 'Агент завершён успешно!',
          placement: 'bottomRight',
        });
      } else {
        notification.error({
          message: 'Агент завершился с ошибками.',
          placement: 'bottomRight',
        });
      }
    };

    socket.on("executed-agent", handleExecutedAgent);

    return () => {
      socket.off("executed-agent", handleExecutedAgent);
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
        {processData && (
          <ConstructorHeader
            processData={processData?.data}
            isAgent={processData?.data.category === "agent"}
          />
        )}
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
            connectionLineStyle={connectionLineStyle}
            connectionLineType={ConnectionLineType.Step}
            defaultEdgeOptions={defaultEdgeOptions}
          >
            <NodesPanel />
            <NodeEditPanel />
            <Controls />
            <MiniMap />
            <Background color="#ccc" variant={BackgroundVariant.Dots} />{" "}
            <div
              style={{
                position: "absolute",
                right: 10,
                top: 10,
                zIndex: 999,
              }}
            >
              <ExportButton fileName={processData?.data.name} />
            </div>
          </ReactFlow>
        )}
      </div>
      <ViewportPortal>
        <UserMulticursor processId={processId} />
      </ViewportPortal>
      <Hotkeys />
    </div>
  );
});
