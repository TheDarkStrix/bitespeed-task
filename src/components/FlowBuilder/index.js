import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Background,
  Controls,
  ReactFlow,
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
  Position,
  addEdge,
} from "reactflow";
import "reactflow/dist/style.css";
import style from "./flowBuilder.module.scss";
import { nodeTypes, edgeTypes } from "@/utils/flowBuilderUtils";
import NodeSidebar from "../NodeSideBar";
import { generateUniqueId } from "@/utils/misc";
import Header from "../header";
import toast, { Toaster } from "react-hot-toast";

const defaultZoom = 0.9;
function FlowBuilder() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [dummyAnimation, setDummyAnimation] = useState(false);

  const firstDrop = useRef(true);

  useEffect(() => {
    /**
     * Issue: When the initial textNode is added, the fitView tries to
     * zoom into the element, to it gets zoomed too much.
     * Therefore manually setting the zoom when where there is
     * change in nodes
     */

    if (firstDrop.current) {
      firstDrop.current = false;
      return;
    }

    if (reactFlowInstance) {
      const zoomOptions = {
        duration: 300,
      };
      reactFlowInstance.zoomTo(0.9, zoomOptions);
    }
  }, [nodes, reactFlowInstance]);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      // Check if the dropped element is valid
      const droppedType = event.dataTransfer.getData("application/reactflow");
      if (!droppedType) {
        return;
      }

      // Get mouse position
      const mousePosition = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      // Create a new node and add it to the nodes array
      const newNodeId = generateUniqueId();
      const newNode = {
        id: newNodeId,
        type: droppedType,
        position: mousePosition,
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
        data: {
          value: "",
          data: {
            value: `${droppedType} ${newNodeId}`,
            onClick: () => onNodeClick(null, { id: newNodeId }),
          },
        },
      };

      // Set the nodes with the new node
      setNodes((currentNodes) => currentNodes.concat(newNode));

      // reactFlowInstance.zoomTo(1, {});
    },
    [reactFlowInstance, setNodes]
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onConnect = useCallback(
    (connectionParams) =>
      setEdges((existingEdges) => {
        // Check if a source node is already connected to another node
        const sourceAlreadyConnected = existingEdges.some(
          (edge) => edge.source === connectionParams.source
        );
        if (sourceAlreadyConnected) {
          toast.error("Source node is already connected to another node");
          return existingEdges;
        }

        // Check if the target node is already connected to another node
        const targetAlreadyConnected = existingEdges.some(
          (edge) => edge.target === connectionParams.target
        );
        if (targetAlreadyConnected) {
          return existingEdges;
        }

        // If neither source nor target are connected, add the custom edge
        return addEdge(
          { ...connectionParams, type: "custom-edge" },
          existingEdges
        );
      }),
    []
  );

  const onNodeClick = (_, node) => setSelectedNode(node);

  const updateSelectedNode = (newValue) => {
    if (!selectedNode) {
      return;
    }

    setNodes((prevNodes) =>
      prevNodes.map((node) => {
        if (node.id === selectedNode.id) {
          node.data.value = newValue;
        }
        return node;
      })
    );
  };

  const onValidate = () => {
    const findSourceNodes = new Set();
    const findTargetNodes = new Set();

    // Collect all source and target nodes
    edges.forEach((edge) => {
      findSourceNodes.add(edge.source);
      findTargetNodes.add(edge.target);
    });

    // Check for nodes without source and target connections
    const nodesWithoutSourceAndTarget = nodes.filter(
      (node) => !findSourceNodes.has(node.id) && !findTargetNodes.has(node.id)
    );

    if (nodesWithoutSourceAndTarget.length > 0) {
      toast.error("There are nodes without source and target connections.");
    } else {
      saveFlowToLocalStorage();
    }
  };

  const saveFlowToLocalStorage = () => {
    localStorage.setItem("flowBuilder", JSON.stringify({ nodes, edges }));
    setDummyAnimation(true);
  };

  let timeout;
  useEffect(() => {
    if (dummyAnimation) {
      timeout = setTimeout(() => {
        setDummyAnimation(false);
        toast.success("Data stored to local storage");
      }, 1000);
    }

    return () => clearTimeout(timeout);
  }, [dummyAnimation]);

  useEffect(() => {
    const flowBuilder = localStorage.getItem("flowBuilder");
    if (flowBuilder) {
      const { nodes, edges } = JSON.parse(flowBuilder);
      setNodes(nodes);
      setEdges(edges);
    }
  }, []);

  return (
    <>
      <Header onClick={onValidate} saveTrigger={dummyAnimation} />
      <div className={style.container}>
        <ReactFlowProvider>
          <div className={style.leftWrapper}>
            <ReactFlow
              fitView
              nodes={nodes}
              edges={edges}
              onInit={setReactFlowInstance}
              nodeTypes={nodeTypes}
              edgeTypes={edgeTypes}
              onDrop={onDrop}
              onDragOver={onDragOver}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onNodeClick={onNodeClick}
              onPaneClick={() => setSelectedNode(null)}
              onEdgeClick={() => setSelectedNode(null)}
            >
              <Background />
              <Controls />
            </ReactFlow>
          </div>
          <div className={style.rightWrapper}>
            <NodeSidebar
              selectedNode={selectedNode}
              cancelSelection={() => setSelectedNode(null)}
              updateSelectedNode={(value) => updateSelectedNode(value)}
            />
          </div>
        </ReactFlowProvider>
      </div>
      <Toaster
        toastOptions={{
          success: {
            duration: 5000,
          },
          error: {
            duration: 5000,
          },
        }}
      />
    </>
  );
}

export default FlowBuilder;
