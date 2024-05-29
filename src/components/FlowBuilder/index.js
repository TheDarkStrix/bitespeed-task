import React, { useState } from "react";
import {
  Background,
  Controls,
  ReactFlow,
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
} from "reactflow";
import style from "./flowBuilder.module.scss";
import { nodeTypes, edgeTypes } from "@/utils/flowBuilderUtils";

function FlowBuilder() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);

  const onDrop = () => {};
  const onDragOver = () => {};
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
        <div className={style.rightWrapper}>left</div>
      </ReactFlowProvider>
    </div>
  );
}

export default FlowBuilder;
