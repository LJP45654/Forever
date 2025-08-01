import DataCard from "../dataCard";
import DataPieChart from "../chart/dataPieChart";
import DataLineChart from "../chart/dataLineChart";
import AppToolbar from "../appToolbar";
import { Badge } from "../ui/badge";
import DataTableChart from "../chart/dataTableChart";
import NumberFlow, { continuous } from "@number-flow/react";

import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
  CardContent,
} from "../ui/card";
import { useState } from "react";
import { useEffect } from "react";
const colors = [
  "#ff6467",
  "#ff8904",
  "#fdc700",
  "#9ae600",
  "#00d492",
  "#00d3f3",
];
function Home() {
  const [totalAssert, setTotalAssert] = useState(0);
  useEffect(() => {
    setTimeout(() => setTotalAssert(54305), 1000);
  }, []);

  return (
    <div id="home" className="p-6 flex flex-col gap-6">
      <div className="grid gap-6">
        <Card
          className="data-card from-primary/2 to-card bg-gradient-to-t shadow-xs py-4 gap-2"
          style={{ fontFamily: "Roboto" }}
        >
          <CardHeader>
            <CardTitle className="text-4xl">
              <NumberFlow
                value={totalAssert}
                format={{
                  style: "currency",
                  currency: "CNY",
                }}
                plugins={[continuous]}
              />
            </CardTitle>
            <CardAction>
              <Badge variant="outline">{11}</Badge>
            </CardAction>
            <CardDescription>Current Asset</CardDescription>
          </CardHeader>
          <CardContent>
            <DataPieChart
              url="http://localhost:3001/api/total"
              colors={colors}
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
          </CardContent>
        </Card>
        <div className="data-card">
          <AppToolbar />
        </div>
        <DataCard title="Card 3"></DataCard>
      </div>
      <DataLineChart
        url="http://localhost:3001/api/cash"
        title="Total Assert"
      />
      <DataCard title="Summary of Investment">
        <DataTableChart tableType="cash" />
      </DataCard>
    </div>
  );
}

export default Home;
