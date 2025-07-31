import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "../ui/chart";
import React from "react";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";
import { Select, SelectContent, SelectItem, SelectValue } from "../ui/select";
import { SelectTrigger } from "@radix-ui/react-select";

const chartData = [
  { date: "2024-04-01", mobile: 150 },
  { date: "2024-04-02", mobile: 180 },
  { date: "2024-04-03", mobile: 120 },
  { date: "2024-04-04", mobile: 260 },
  { date: "2024-04-05", mobile: 290 },
  { date: "2024-04-06", mobile: 340 },
  { date: "2024-04-07", mobile: 180 },
  { date: "2024-04-08", mobile: 320 },
  { date: "2024-04-09", mobile: 110 },
  { date: "2024-04-10", mobile: 190 },
  { date: "2024-04-11", mobile: 350 },
  { date: "2024-04-12", mobile: 210 },
  { date: "2024-04-13", mobile: 380 },
  { date: "2024-04-14", mobile: 220 },
  { date: "2024-04-15", mobile: 170 },
  { date: "2024-04-16", mobile: 190 },
  { date: "2024-04-17", mobile: 360 },
  { date: "2024-04-18", mobile: 410 },
  { date: "2024-04-19", mobile: 180 },
  { date: "2024-04-20", mobile: 150 },
  { date: "2024-04-21", mobile: 200 },
  { date: "2024-04-22", mobile: 170 },
  { date: "2024-04-23", mobile: 230 },
  { date: "2024-04-24", mobile: 290 },
  { date: "2024-04-25", mobile: 250 },
  { date: "2024-04-26", mobile: 130 },
  { date: "2024-04-27", mobile: 420 },
  { date: "2024-04-28", mobile: 180 },
  { date: "2024-04-29", mobile: 240 },
  { date: "2024-04-30", mobile: 380 },
  { date: "2024-05-01", mobile: 220 },
  { date: "2024-05-02", mobile: 310 },
  { date: "2024-05-03", mobile: 190 },
  { date: "2024-05-04", mobile: 420 },
  { date: "2024-05-05", mobile: 390 },
  { date: "2024-05-06", mobile: 520 },
  { date: "2024-05-07", mobile: 300 },
  { date: "2024-05-08", mobile: 210 },
  { date: "2024-05-09", mobile: 180 },
  { date: "2024-05-10", mobile: 330 },
  { date: "2024-05-11", mobile: 270 },
  { date: "2024-05-12", mobile: 240 },
  { date: "2024-05-13", mobile: 160 },
  { date: "2024-05-14", mobile: 490 },
  { date: "2024-05-15", mobile: 380 },
  { date: "2024-05-16", mobile: 400 },
  { date: "2024-05-17", mobile: 420 },
  { date: "2024-05-18", mobile: 350 },
  { date: "2024-05-19", mobile: 180 },
  { date: "2024-05-20", mobile: 230 },
  { date: "2024-05-21", mobile: 140 },
  { date: "2024-05-22", mobile: 120 },
  { date: "2024-05-23", mobile: 290 },
  { date: "2024-05-24", mobile: 220 },
  { date: "2024-05-25", mobile: 250 },
  { date: "2024-05-26", mobile: 170 },
  { date: "2024-05-27", mobile: 460 },
  { date: "2024-05-28", mobile: 190 },
  { date: "2024-05-29", mobile: 130 },
  { date: "2024-05-30", mobile: 280 },
  { date: "2024-05-31", mobile: 230 },
  { date: "2024-06-01", mobile: 200 },
  { date: "2024-06-02", mobile: 410 },
  { date: "2024-06-03", mobile: 160 },
  { date: "2024-06-04", mobile: 380 },
  { date: "2024-06-05", mobile: 140 },
  { date: "2024-06-06", mobile: 250 },
  { date: "2024-06-07", mobile: 370 },
  { date: "2024-06-08", mobile: 320 },
  { date: "2024-06-09", mobile: 480 },
  { date: "2024-06-10", mobile: 200 },
  { date: "2024-06-11", mobile: 150 },
  { date: "2024-06-12", mobile: 420 },
  { date: "2024-06-13", mobile: 130 },
  { date: "2024-06-14", mobile: 380 },
  { date: "2024-06-15", mobile: 350 },
  { date: "2024-06-16", mobile: 310 },
  { date: "2024-06-17", mobile: 520 },
  { date: "2024-06-18", mobile: 170 },
  { date: "2024-06-19", mobile: 290 },
  { date: "2024-06-20", mobile: 450 },
  { date: "2024-06-21", mobile: 210 },
  { date: "2024-06-22", mobile: 270 },
  { date: "2024-06-23", mobile: 530 },
  { date: "2024-06-24", mobile: 180 },
  { date: "2024-06-25", mobile: 190 },
  { date: "2024-06-26", mobile: 380 },
  { date: "2024-06-27", mobile: 490 },
  { date: "2024-06-28", mobile: 200 },
  { date: "2024-06-29", mobile: 160 },
  { date: "2024-06-30", mobile: 400 },
];
const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  mobile: {
    label: "Mobile",
    color: "var(--primary)",
  },
} satisfies ChartConfig;
export function DataLineChart() {
  const [timeRange, setTimeRange] = React.useState("90d");
  // const filteredData = chartData.filter((item) => {
  //   const date = new Date(item.date);
  //   const referenceDate = new Date("2024-06-30");
  //   let daysToSubtract = 90;
  //   if (timeRange === "30d") {
  //     daysToSubtract = 30;
  //   } else if (timeRange === "7d") {
  //     daysToSubtract = 7;
  //   }
  //   const startDate = new Date(referenceDate);
  //   startDate.setDate(startDate.getDate() - daysToSubtract);
  //   return date >= startDate;
  // });
  const [filteredData, setFilteredData] = React.useState(chartData);
  React.useEffect(() => {
    fetch('http://localhost:3002/stock/timeline')
      .then(response => response.json())
      .then(array => {
        console.log(array)
        setFilteredData(array)
      });
  },[]);

  return (
    <Card className="@container/card from-primary/2 to-card bg-gradient-to-t">
      <CardHeader>
        <CardTitle>Total Asserts</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            {`Total for the last ${
              timeRange == "90d"
                ? "3 months"
                : timeRange == "30d"
                ? "30 days"
                : "7 days"
            }`}
          </span>
        </CardDescription>
        <CardAction>
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={setTimeRange}
            variant="outline"
            className="hidden *:data-[slot=toggle-group-item]:!px-4 @[767px]/card:flex"
          >
            <ToggleGroupItem value="90d">Last 3 months</ToggleGroupItem>
            <ToggleGroupItem value="30d">Last 30 days</ToggleGroupItem>
            <ToggleGroupItem value="7d">Last 7 days</ToggleGroupItem>
          </ToggleGroup>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
              aria-label="Select a value"
            >
              <SelectValue placeholder="Last 3 months" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="90d" className="rounded-lg">
                Last 3 months
              </SelectItem>
              <SelectItem value="30d" className="rounded-lg">
                Last 30 days
              </SelectItem>
              <SelectItem value="7d" className="rounded-lg">
                Last 7 days
              </SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6 overflow-clip">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={filteredData} accessibilityLayer>
            <defs>
              <linearGradient id="line-fill" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#ff6467" />
                <stop offset="20%" stopColor="#ff8904" />
                <stop offset="40%" stopColor="#fdc700" />
                <stop offset="60%" stopColor="#9ae600" />
                <stop offset="80%" stopColor="#00d492" />
                <stop offset="100%" stopColor="#00d3f3" />
              </linearGradient>
            </defs>
            <defs>
              {(() => {
                const colors = [
                  "#ff6467",
                  "#ff8904",
                  "#fdc700",
                  "#9ae600",
                  "#00d492",
                  "#00d3f3",
                ];
                return (
                  <>
                    {colors.map((color, index) => (
                      <radialGradient
                        key={`fadeCircleGradient${index + 1}`}
                        id={`fadeCircleGradient${index + 1}`}
                        cx="50%"
                        cy="60%"
                        r="50%"
                        fx="50%"
                        fy="50%"
                      >
                        <stop offset="0%" stopColor={color} stopOpacity={0.5} />
                        <stop
                          offset="100%"
                          stopColor="#ffffff"
                          stopOpacity={0}
                        />
                      </radialGradient>
                    ))}
                    <pattern
                      id="overlappingCirclesPattern"
                      x="0"
                      y="0"
                      width="100%"
                      height="100%"
                      patternUnits="userSpaceOnUse"
                    >
                      {colors.map((_, index) => (
                        <circle
                          key={index}
                          cx={index === 0 ? "0" : `${index * 20}%`}
                          cy="50"
                          r="25%"
                          fill={`url(#fadeCircleGradient${index + 1})`}
                        />
                      ))}
                    </pattern>
                  </>
                );
              })()}
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  year: "2-digit",
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <ChartTooltip
              cursor={true}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    });
                  }}
                  indicator="dot"
                />
              }
            />
            {/* <Line
              dataKey="mobile"
              type="natural"
              fill="#ffffff00"
              stroke="url(#overlappingCirclesPattern)"
              strokeWidth={4}
              strokeLinecap="round"
              dot={false}
              activeDot={{ fill: "#f5f5f5", stroke: "#000000", strokeWidth: 1 }}
            /> */}
            <Area
              dataKey="mobile"
              type="natural"
              fill="url(#overlappingCirclesPattern)"
              stroke="url(#line-fill)"
              strokeWidth={4}
              strokeLinecap="round"
              dot={false}
              activeDot={{ fill: "#f5f5f5", stroke: "#000000", strokeWidth: 1 }}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

export default DataLineChart;
