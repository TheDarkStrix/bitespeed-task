import React from "react";
import style from "./node.module.scss";
import { BiMessageSquareDetail } from "react-icons/bi";
import { IoLogoWhatsapp } from "react-icons/io";
import CustomHandle from "@/components/FlowBuilder/CustomHandle";
import { Position } from "reactflow";

function Node({ data }) {
  return (
    <div className={style.container}>
      <div className={style.head}>
        <div className={style.left}>
          <BiMessageSquareDetail size={16} />

          <p className={style.messageText}>Send Message</p>
        </div>
        <div className={style.right}>
          <div className={style.circleContainer}>
            <IoLogoWhatsapp size={16} className={style.whatsapp} />
          </div>
        </div>
      </div>

      <div className={style.content}>
        {data.value ? (
          <h1 className={style.data} onClick={() => data?.data?.onClick()}>
            {data.value}
          </h1>
        ) : (
          <p className={style.emptyNode}>Click to edit</p>
        )}
      </div>

      <CustomHandle type="target" position={Position.Left} />
      <CustomHandle type="source" position={Position.Right} />
    </div>
  );
}

export default Node;
