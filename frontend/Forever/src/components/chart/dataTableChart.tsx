import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";


//import exampleDatahomepage from "@/test/json/investment.json";
//import example_cash from "@/test/json/example_cash.ts";
import { useEffect, useState } from "react";


// fetch('https://jsonplaceholder.typicode.com/todos/1')
//       .then(response => response.json())
//       .then(json => console.log(json))


// 表头字典，所有表头写死
const tableHeadersDictionary: Record<string, { header: string; type: string }[]> = {
  //homepage的表格
  'investment': [
    { header: "Investment_Type", type: "string" },
    { header: "Amount", type: "number" },
    { header: "Total_Earnings", type: "number" },
    { header: "Percentage", type: "number" },
  ],
  //cash的表格
  'cash': [
    { header: "Currency_Type", type: "string" },
    { header: "Amount", type: "number" },
    { header: "Date", type: "string" },
    { header: "Note", type: "string" },
  ],
  //deposit的表格
  'deposit': [
    { header: "Currency_Type", type: "string" },
    { header: "Amount", type: "number" },
    { header: "Rate", type: "number" },
    { header: "Start_Date", type: "string" },
    { header: "End_Date", type: "string" },
    { header: "Expected_Interest", type: "number" },
  ],
  //bond的表格
  'bond': [
    { header: "Bond_Name", type: "string" },
    { header: "Currency_Type", type: "string" },
    { header: "Amount", type: "number" },
    { header: "Rate", type: "number" },
    { header: "Start_Date", type: "string" },
    { header: "End_Date", type: "string" },
    { header: "Expected Interest", type: "number" },
  ],
  //stock的表格
  'stock': [
    { header: "Stock_Name", type: "string" },
    { header: "Currency_Type", type: "string" },
    { header: "Quantity", type: "number" },
    { header: "Purchase_price", type: "number" },
    { header: "Purchase_date", type: "string" },
    { header: "Current_price", type: "number" },
    { header: "Profit_loss", type: "number" },
  ],
  //fund的表格
  'fund': [
    { header: "Fund_Name", type: "string" },
    { header: "Currency_Type", type: "string" },
    { header: "Units", type: "number" },
    { header: "Purchase_price", type: "number" },
    { header: "Purchase_date", type: "string" },
    { header: "Current_price", type: "number" },
    { header: "Profit_loss", type: "number" },
  ],
  //其他投资品表格
  'others': [
    { header: "Others_Name", type: "string" },
    { header: "Currency Type", type: "string" },
    { header: "Purchase_price", type: "number" },
    { header: "Purchase_date", type: "string" },
    { header: "Current_price", type: "number" },
  ]
};

function DataTableChart(props: any) {
  //console.log(tableHeadersDictionary);
  const [data, setData] = useState<any>([]);
  const [example_cash,setCashData]= useState<any>([]);

  useEffect(() => {
    const exampleDatahomepage = fetch('http://localhost:3002/summary')
      .then(response => response.json())
      .then(json => setData(json));
  }, []);
  useEffect(() => {
    fetch('http://localhost:3002/cash')
      .then(response => response.json())
      .then(json => setCashData(json));
  })
  
  // 从字典中选择表头，homepage单独出来（因为要计算百分比）
  if (props.tableType === 'investment') {
    return (
      <Table>
        <TableHeader>
          <TableRow>
            {tableHeadersDictionary[props.tableType]?.map(({ header }) => (
              <TableHead key={header}>{header}</TableHead>
            )) || <TableHead>No headers available</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {Object.entries(data).map(([key, value]) => (
            <TableRow key={key}>
              <TableCell>{key}</TableCell>
              <TableCell>{value.amount}</TableCell>
              <TableCell>
                {"total_earnings" in value ? value.total_earnings.toString() : "-"}
              </TableCell>
              <TableCell>
                {(
                  (parseFloat(value.amount) /
                    Object.values(data).reduce(
                      (sum, asset) => sum + parseFloat(asset.amount),
                      0
                    )) *
                  100
                ).toFixed(2)}%
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  }
  else if (props.tableType === 'cash' || props.tableType === 'deposit' || props.tableType === 'bond' || props.tableType === 'stock' || props.tableType === 'fund' || props.tableType === 'others') {
    return (
      <div
        style={{
          maxHeight: `${350}px`, 
          overflowY: "auto",
        }}
      >
        {tableHeadersDictionary[props.tableType]?.length > 0 && (
          <Table>
            <TableHeader>
              <TableRow>
                {tableHeadersDictionary[props.tableType]?.map(({ header }) => (
                  <TableHead key={header}>{header}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {example_cash.map((item, index) => (
                <TableRow key={index}>
                  {Object.entries(item).map(([key, value]) =>
                    key !== "id" && <TableCell key={key}>{value}</TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    );
  }
  else {
    return <div>No data available for the selected table type.</div>;
  }
}

export default DataTableChart;