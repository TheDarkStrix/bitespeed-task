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

const defaultZoom = 0.9;
function FlowBuilder() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);

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

  console.log("nodes", nodes);

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
          value: `${droppedType} ${newNodeId}`,
          data: {
            value: `${droppedType} ${newNodeId}`,
            onClick: () => onNodeClick(null, { id: nid }),
          },
        },
      };

      // Set the nodes with the new node
      setNodes((currentNodes) => currentNodes.concat(newNode));

      console.log("reactFlowInstance", reactFlowInstance);

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
          alert("Source node is already connected to another node");
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

  return (
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
  );
}

export default FlowBuilder;
