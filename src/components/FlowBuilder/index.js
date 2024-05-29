import React, { useCallback, useState } from "react";
import {
  Background,
  Controls,
  ReactFlow,
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
  Position,
} from "reactflow";
import style from "./flowBuilder.module.scss";
import { nodeTypes, edgeTypes } from "@/utils/flowBuilderUtils";
import NodeSidebar from "../NodeSideBar";
import { generateUniqueId } from "@/utils/misc";

function FlowBuilder() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);

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
          onClick: () => {}, // implement later,
        },
      };

      setNodes((currentNodes) => currentNodes.concat(newNode));
    },
    [reactFlowInstance]
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onConnect = () => {};
  const onNodeClick = () => {};

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
          <NodeSidebar />
        </div>
      </ReactFlowProvider>
    </div>
  );
}

export default FlowBuilder;
