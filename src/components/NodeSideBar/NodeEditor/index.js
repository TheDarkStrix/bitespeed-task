import { IoIosArrowRoundBack } from "react-icons/io";
import style from "./nodeEditor.module.scss";

const NodeEditor = ({ selectedNode, updateSelectedNode, cancelSelection }) => {
  return (
    <>
      <div className={style.header}>
        <IoIosArrowRoundBack
          size={28}
          className={style.arrow}
          onClick={cancelSelection}
        />
        <div className={style.text}>Message</div>
        <div />
      </div>

      <div className={style.content}>
        <div>
          <div className={style.heading}>Edit Node Text</div>

          <textarea
            className={style.textarea}
            placeholder="Type your message here..."
            value={selectedNode.data.value}
            onChange={(event) => updateSelectedNode(event.target.value)}
          />
        </div>
      </div>
    </>
  );
};

export default NodeEditor;
