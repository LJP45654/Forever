import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
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
import { useQuery } from "@tanstack/react-query";

const chartConfig = {} satisfies ChartConfig;

export function DataLineChart(props: {url: string, title: string}) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["data"],
    queryFn: async () => {
      const response = await fetch(props.url);
      if (!response.ok) {
        throw new Error("Failed to fetch assets");
      }
      return response.json();
    },
  });

  const [timeRange, setTimeRange] = React.useState("90d");
  
  // 数据加载中时显示加载状态
  if (isLoading) {
    return (
      <Card className="@container/card from-primary/2 to-card bg-gradient-to-t">
        <CardHeader>
          <CardTitle>{props.title}</CardTitle>
          <CardDescription>Loading chart data...</CardDescription>
        </CardHeader>
        <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
          <div className="flex items-center justify-center h-[250px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-2 text-muted-foreground">Loading...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  // 数据加载失败时显示错误状态
  if (isError) {
    return (
      <Card className="@container/card from-primary/2 to-card bg-gradient-to-t">
        <CardHeader>
          <CardTitle>{props.title}</CardTitle>
          <CardDescription>Failed to load data</CardDescription>
        </CardHeader>
        <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
          <div className="flex items-center justify-center h-[250px]">
            <div className="text-destructive">Failed to load chart data</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // 数据为空时显示空状态
  if (!data || data.length === 0) {
    return (
      <Card className="@container/card from-primary/2 to-card bg-gradient-to-t">
        <CardHeader>
          <CardTitle>{props.title}</CardTitle>
          <CardDescription>No data available</CardDescription>
        </CardHeader>
        <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
          <div className="flex items-center justify-center h-[250px]">
            <div className="text-muted-foreground">No data available</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const filteredData = data.filter((item: any) => {
    const date = new Date(item.date);
    const referenceDate = new Date("2025-07-30");
    let daysToSubtract = 90;
    if (timeRange === "30d") {
      daysToSubtract = 30;
    } else if (timeRange === "7d") {
      daysToSubtract = 7;
    }
    const startDate = new Date(referenceDate);
    startDate.setDate(startDate.getDate() - daysToSubtract);
    return date >= startDate;
  });

  return (
    <Card className="@container/card from-primary/2 to-card bg-gradient-to-t">
      <CardHeader>
        <CardTitle>{props.title}</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            {`Data for the last ${
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
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart
            data={filteredData}
            accessibilityLayer
            margin={{
              top: 20,
              right: 20,
              bottom: 20,
              left: 20,
            }}
          >
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
            <YAxis hide type="number" domain={[-1200,3790]}/>
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
                  indicator="line"
                />
              }
            />
            <Area
              dataKey="amount"
              type="natural"
              fill="url(#overlappingCirclesPattern)"
              stroke="url(#line-fill)"
              strokeWidth={4}
              strokeLinecap="round"
              dot={false}
              activeDot={{
                fill: "#f5f5f5",
                stroke: "#000000",
                strokeWidth: 1,
              }}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

export default DataLineChart;