import React from "react";
import NodeSelector from "./NodeSelector";
import style from "./nodeSideBar.module.scss";
import NodeEditor from "./NodeEditor";

export default function NodeSidebar({
  selectedNode,
  updateSelectedNode,
  cancelSelection,
}) {
  return (
    <div>
      {selectedNode && selectedNode.type === "text" ? (
        <div className={style.container}>
          <NodeEditor
            cancelSelection={cancelSelection}
            selectedNode={selectedNode}
            updateSelectedNode={updateSelectedNode}
          />
        </div>
      ) : (
        <div className={style.selector}>
          <NodeSelector />
        </div>
      )}
    </div>
  );
}
