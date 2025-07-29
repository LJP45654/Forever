import { Cell, Legend, Pie, PieChart } from "recharts";
import { ChartContainer, type ChartConfig } from "../ui/chart";
import DataCard from "../dataCard";

const data = [
  { name: 'Group A', value: 400 },
  { name: 'Group B', value: 300 },
  { name: 'Group C', value: 300 },
  { name: 'Group D', value: 200 },
  { name: 'Group D', value: 200 },
  { name: 'Group D', value: 200 },
];
const COLORS = ['#ffa2a2', '#ffb86a', '#ffd230', '#ffdf20'];
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
    <DataCard title='Current Asset'>
      <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
        <PieChart>
          <Pie
            data={data}
            innerRadius={60}
            outerRadius={80}
            fill="#8884d8"
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${entry.name}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Legend
            layout="vertical"
            align="right"
            verticalAlign="middle"
            iconType="square"
            wrapperStyle={{ paddingLeft: '20px', lineHeight: '24px' }}
          />
        </PieChart>
      </ChartContainer>
    </DataCard>
  );
}

export default Home