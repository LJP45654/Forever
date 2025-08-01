import React, { useState, useEffect } from "react";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  Sector,
  type SectorProps,
} from "recharts";
import { ChartContainer, type ChartConfig } from "../ui/chart";
import { useQuery } from "@tanstack/react-query";

interface PieChartProps {
  url: string;
  cx?: number;
  cy?: number;
  colors?: string[];
  innerRadius?: number;
  outerRadius?: number;
  gradientOffset?: number;
  layout?: "horizontal" | "vertical";
  align?: "left" | "center" | "right";
  verticalAlign?: "top" | "middle" | "bottom";
  iconType?:
    | "line"
    | "plainline"
    | "square"
    | "rect"
    | "circle"
    | "cross"
    | "diamond"
    | "star"
    | "triangle"
    | "wye";
  wrapperStyle?: React.CSSProperties;
  legend: Boolean;
}

type PieSectorDataItem = React.SVGProps<SVGPathElement> &
  Partial<SectorProps> & {
    percent?: number;
    name?: string | number;
    midAngle?: number;
    payload?: any;
    gradientOffset?: number;
  };

const createGradient = (
  cx: number,
  cy: number,
  angle: number,
  radius: number,
  percent: number,
  fill: string,
  gradientId: string
) => (
  <radialGradient
    id={gradientId}
    cx={cx + radius * Math.cos((-Math.PI / 180) * angle)}
    cy={cy + radius * Math.sin((-Math.PI / 180) * angle)}
    r={radius}
    gradientUnits="userSpaceOnUse"
  >
    <stop offset="0%" stopColor={fill} stopOpacity={0.8} />
    <stop offset={`${percent * 2}`} stopColor={fill} stopOpacity={0.6} />
    <stop
      offset={`${percent < 0.1 ? 0.5 : percent * 5}`}
      stopColor="#FFFFFF"
      stopOpacity={0.1}
    />
  </radialGradient>
);
const renderActiveShape = (props: PieSectorDataItem) => {
  const {
    cx = 0,
    cy = 0,
    midAngle = 0,
    innerRadius = 0,
    outerRadius = 0,
    startAngle = 0,
    endAngle = 0,
    fill = "#8884d8",
    payload,
    percent = 0,
    gradientOffset = 1.5,
  } = props;

  const RADIAN = Math.PI / 180;
  const angle = midAngle ?? (startAngle + endAngle) / 2;
  const baseRadius = (innerRadius + outerRadius) / 2;
  const gradientRadius = baseRadius * gradientOffset;
  const gradientId = `gradient-active-${angle}-${gradientRadius}`;

  // 标签位置计算
  const cos = Math.cos(-RADIAN * midAngle);
  const sin = Math.sin(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 20) * cos;
  const my = cy + (outerRadius + 20) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? "start" : "end";

  return (
    <g>
      <text
        x={cx}
        y={cy}
        dy={8}
        textAnchor="middle"
        fill={fill}
        className="text-xl font-bold"
      >
        {payload?.name}
      </text>
      <defs>
        {createGradient(
          cx,
          cy,
          angle,
          gradientRadius,
          percent,
          fill,
          gradientId
        )}
      </defs>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={`url(#${gradientId})`}
        cornerRadius={10}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
        cornerRadius={10}
      />
      <path
        d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
        stroke={fill}
        fill="none"
        strokeWidth={2}
      />
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        dy={5}
        textAnchor={textAnchor}
        fill={fill}
        className="text-[16px]"
      >
        {`${(percent * 100).toFixed(2)}%`}
      </text>
    </g>
  );
};
const renderInactiveShape = (props: PieSectorDataItem) => {
  const {
    cx = 0,
    cy = 0,
    midAngle = 0,
    innerRadius = 0,
    outerRadius = 0,
    startAngle = 0,
    endAngle = 0,
    fill = "#8884d8",
    gradientOffset = 1.5,
    percent = 0,
  } = props;

  const angle = midAngle ?? (startAngle + endAngle) / 2;
  const baseRadius = (innerRadius + outerRadius) / 2;
  const gradientRadius = baseRadius * gradientOffset;
  const gradientId = `gradient-inactive-${angle}-${gradientRadius}`;

  return (
    <>
      <defs>
        {createGradient(
          cx,
          cy,
          angle,
          gradientRadius,
          percent,
          fill,
          gradientId
        )}
      </defs>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={`url(#${gradientId})`}
        cornerRadius={10}
      />
    </>
  );
};

function DataPieChart({
  url,
  cx,
  cy,
  colors,
  innerRadius = 60,
  outerRadius = 120,
  gradientOffset = 1.5,
  layout,
  align,
  verticalAlign,
  iconType,
  wrapperStyle,
  legend = true,
}: PieChartProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  //@ts-ignore
  const createShapeRenderer = (isActive: boolean) => (shapeProps: any) => {
    const renderer = isActive ? renderActiveShape : renderInactiveShape;
    return renderer({ ...shapeProps, gradientOffset });
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ["data", url],
    queryFn: async () => {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch assets");
      }
      return response.json();
    },
  });

  const chartConfig = {} satisfies ChartConfig;

  // 数据加载中时显示加载状态
  if (isLoading) {
    return (
      <ChartContainer config={chartConfig}>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="ml-2 text-muted-foreground">
            Loading...
          </span>
        </div>
      </ChartContainer>
    );
  }

  // 数据加载失败时显示错误状态
  if (isError) {
    return (
      <ChartContainer config={chartConfig}>
        <div className="flex items-center justify-center h-64">
          <div className="text-destructive">Failed to load chart data</div>
        </div>
      </ChartContainer>
    );
  }

  // 数据为空时显示空状态
  if (!data || data.length === 0) {
    return (
      <ChartContainer config={chartConfig}>
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">No data available</div>
        </div>
      </ChartContainer>
    );
  }

  // 数据加载完成后渲染图表
  return (
    <ChartContainer config={chartConfig}>
      <PieChart>
        <Pie
          activeIndex={activeIndex}
          activeShape={createShapeRenderer(true)}
          inactiveShape={createShapeRenderer(false)}
          data={data}
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          fill="#8884d8"
          dataKey="value"
          onMouseEnter={(_, index) => setActiveIndex(index)}
        >
          {colors &&
            data.map((entry: any, index: any) => (
              <Cell
                key={`cell-${entry.name}`}
                fill={colors[index % colors.length]}
              />
            ))}
        </Pie>
        {legend && (
          <Legend
            layout={layout}
            align={align}
            verticalAlign={verticalAlign}
            iconType={iconType}
            wrapperStyle={wrapperStyle}
          />
        )}
      </PieChart>
    </ChartContainer>
  );
}

export default DataPieChart;
