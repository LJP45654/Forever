import DataCard from "../dataCard";
import DataPieChart from "../chart/dataPieChart";
import DataLineChart from "../chart/dataLineChart";
import AppToolbar from "../appToolbar";
import { Badge } from "../ui/badge";
import DataTableChart from "../chart/dataTableChart";

const data = [
  { name: "Cash", value: 400 },
  { name: "Deposit", value: 300 },
  { name: "Bonds", value: 300 },
  { name: "Stock", value: 200 },
  { name: "Fund", value: 200 },
  { name: "other", value: 50 },
];
const colors = [
  "#ff6467",
  "#ff8904",
  "#fdc700",
  "#9ae600",
  "#00d492",
  "#00d3f3",
];
function Home() {
  return (
    <div id="home" className="p-6 flex flex-col gap-6">
      <div className="grid gap-6">
        <DataCard
          title="$1,250.00"
          description="Current Asset"
          action={<Badge variant="outline">{11}</Badge>}
        >
          <DataPieChart
            colors={colors}
            data={data}
            innerRadius={10}
            outerRadius={100}
            cx={200}
            cy={120}
            gradientOffset={1.4}
            layout="vertical"
            align="left"
            verticalAlign="top"
            iconType="square"
            wrapperStyle={{
              lineHeight: "40px",
              fontSize: "14px",
            }}
            legend={true}
          />
        </DataCard>
        <div className="data-card">
          <AppToolbar />
        </div>
        <DataCard title="Card 3"></DataCard>
      </div>
      <DataCard title="Card 4">
        <DataLineChart />
      </DataCard>
      <DataCard title="Summary of Investment">
        
        <DataTableChart tableType="cash" />
      </DataCard>
    </div>
  );
}

export default Home;
