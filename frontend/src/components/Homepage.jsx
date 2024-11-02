import Datavisualization from "./views/ModelOverview";
import Table from "./views/Table";
export default function Homepage() {
  return (
    <section>
        <Table />
        <Datavisualization />
    </section>
  );
}
