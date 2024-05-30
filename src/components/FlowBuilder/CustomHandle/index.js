import { Handle } from "reactflow";
import style from "./customHandle.module.scss";

const CustomHandle = ({ type, position }) => {
  return <Handle type={type} position={position} className={style.edge} />;
};

export default CustomHandle;
