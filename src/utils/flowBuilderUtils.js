import CustomEdge from "@/components/FlowBuilder/Edge";
import Node from "@/components/FlowBuilder/Node";

const nodeTypes = {
  text: Node,
};

const edgeTypes = {
  "custom-edge": CustomEdge,
};

export { nodeTypes, edgeTypes };
