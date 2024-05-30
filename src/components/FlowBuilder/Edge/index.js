import { BezierEdge, EdgeLabelRenderer } from "reactflow";
import { FaCaretRight } from "react-icons/fa";

const CustomEdge = (props) => {
  const { targetX, targetY } = props;

  return (
    <>
      <BezierEdge {...props} />
      <EdgeLabelRenderer>
        <FaCaretRight
          size={20}
          style={{
            color: "black",
            transform: `translate(-50%, -50%) translate(${targetX}px, ${targetY}px)`,
          }}
        />
      </EdgeLabelRenderer>
    </>
  );
};

export default CustomEdge;
