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
  type OnConnect
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import style from "./ProcessConstructor.module.scss";
import { NodesPanel } from "./components/NodesPanel/NodesPanel";
import { NodeEditPanel } from "./components/NodeEditPanel/NodeEditPanel";
import { useAppDispatch, useAppSelector } from "@hooks/storeHooks";
import { nodeTypes } from "@components/Nodes";
import { useDnD } from "@hooks/useDnD";
import { nodeList } from "../../shared/data/nodes";
import {
  addNode,
  onConnect,
  onEdgesChange,
  onNodesChange,
  setSelectedNode,
} from "@store/processConstructor/processConstructorSlice";

import ContextMenu, { type IContextMenu } from "./components/ContextMenu";
import { useTheme } from "@hooks/useTheme";
import { debounce } from "lodash";
import {
  useLazyGetProcessQuery,
  useUpdateProcessSchemeMutation,
} from "@store/api/processConstructor/processConstructorApi";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Flex, Spin } from "antd";
import { BsChevronLeft, BsFillPencilFill } from "react-icons/bs";

export const ProcessConstructor = memo(() => {
  const { isDarkMode } = useTheme();

  const { processId } = useParams();

  const navigate = useNavigate();

  const [getProcess, { data: processData, isLoading }] = useLazyGetProcessQuery();

  const [updateProcessScheme] = useUpdateProcessSchemeMutation();

  useEffect(() => {
    getProcess({
      processId,
    });
  }, [getProcess, processId]);

  const colorModeFlow = useMemo(() => {
    return isDarkMode ? "dark" : "light";
  }, [isDarkMode]);

  const selectedNode = useAppSelector(
    (state) => state.processConstructor.selectedNode
  );
  const dispatch = useAppDispatch();

  const { nodes, edges, snapGrid, defaultViewport } = useAppSelector(
    (state) => state.processConstructor
  );

  const [rfInstance, setRfInstance] = useState<ReactFlowInstance>();

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
          updateProcessScheme({
            id: processId,
            content: JSON.stringify(rfInstance.toObject()),
          });

          // const imageWidth = 250;
          // const imageHeight = 250;

          // const nodesBounds = getNodesBounds(getNodes());
          // const viewport = getViewportForBounds(
          //   nodesBounds,
          //   imageWidth,
          //   imageHeight,
          //   0.5,
          //   2,
          //   20
          // );

          // const view: HTMLElement | null = document.querySelector(
          //   ".react-flow__viewport"
          // );

          // if (!view && !refReactFlow) return;

          // toBlob(refReactFlow.current, {
          //   backgroundColor: "#1a365d",
          //   width: imageWidth,
          //   height: imageHeight,
          //   style: {
          //     width: imageWidth.toString(),
          //     height: imageHeight.toString(),
          //     transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.zoom})`,
          //   },
          // }).then((dataUrl) => {
          //   const formData = new FormData();

          //   let file = new File([dataUrl], "img.png", {
          //     type: "image/png",
          //     lastModified: new Date().getTime(),
          //   });
          //   formData.append("photo", file);

          //   updateProcessImage({
          //     id: processId,
          //     data: file,
          //   });
          // });
        }
      }, 400),
    [processId, rfInstance, updateProcessScheme]
  );

  const handleChangeNode = useCallback<OnNodesChange<Node>>(
    (e) => {
      dispatch(onNodesChange(e));
    },
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
          height: "calc(100vh - 76px)",
          width: "100%",
        }}
        className="reactflow-wrapper"
        ref={reactFlowWrapper}
      >
        <Flex 
          justify="space-between" 
          align="center" 
          className={`${style['process-bar']} ${isDarkMode ? style['bar-dark'] : ''}`}
        >
          <Flex align="center" gap={16}>
            <Button onClick={() => navigate(-1)}>
              <BsChevronLeft />
            </Button>
            <p>{processData?.data.name}</p>
          </Flex>
          <Button>
            <BsFillPencilFill />
          </Button>
        </Flex>
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
    </div>
  );
});
