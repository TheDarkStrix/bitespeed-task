import React from "react";
import NodeSelector from "./NodeSelector";
import style from "./nodeSideBar.module.scss";

export default function NodeSidebar() {
  return (
    <div>
      <div className={style.container}>
        <NodeSelector />
      </div>
    </div>
  );
}
