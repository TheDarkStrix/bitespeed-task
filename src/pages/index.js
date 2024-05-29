import FlowBuilder from "@/components/FlowBuilder";
import Header from "@/components/header";
import style from "@/styles/index.module.scss";

export default function Home() {
  return (
    <div className={style.container}>
      <Header />
      <FlowBuilder />
    </div>
  );
}
