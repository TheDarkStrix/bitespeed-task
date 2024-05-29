import { BiMessageSquareDetail } from "react-icons/bi";
import styles from "./nodeSelector.module.scss";

const nodeData = [
  {
    nodeType: "text",
    label: "Message",
    icon: BiMessageSquareDetail,
    isDisabled: true,
  },
];

export default function NodeSelector({}) {
  const handleDragStart = (event, node) => {
    event.dataTransfer.setData("application/reactflow", node.nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <div>
      <div className={styles.container}>
        {nodeData.map((node) => (
          <div
            key={node.nodeType}
            onDragStart={(event) => handleDragStart(event, node)}
            draggable
            className={styles.node}
          >
            <div className={styles.icon}>
              <node.icon size={24} />
            </div>

            <span className={styles.label}>{node.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
