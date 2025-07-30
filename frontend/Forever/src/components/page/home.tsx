import { type ChartConfig } from "../ui/chart";
import DataCard from "../dataCard";
import DataPieChart from "../chart/dataPieChart";
import DataLineChart from "../chart/dataLineChart";
import DataTableChart from "../chart/datatableChart";

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

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "#2563eb",
  },
  mobile: {
    label: "Mobile",
    color: "#60a5fa",
  },
} satisfies ChartConfig;

function Home() {
  return (
    <div id="home" className="p-6 flex flex-col gap-6">
      <div className="grid gap-6">
        <DataCard title="$1,250.00" description="Current Asset" badge={10}>
          <DataPieChart
            chartConfig={chartConfig}
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
        <DataCard title="Card 2">
          <div>Content for card 2</div>
        </DataCard>
        <DataCard title="Card 3">
          <div>Content for card 3</div>
        </DataCard>
      </div>
      <DataCard title="Card 4">
        <DataLineChart />
      </DataCard>
      <DataCard title="Summary of Inverstments">
        < DataTableChart/>
      </DataCard>
    </div>
  );
}

export default Home;
