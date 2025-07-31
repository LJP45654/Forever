import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { useEffect, useState } from "react";

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
    { header: "Date", type: "string" },
    { header: "Currency_Type", type: "string" },
    { header: "Amount", type: "number" },
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
  'bonds': [
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
  'funds': [
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
  const [total_data, setData] = useState<any>([]);
  const [cash_data, setCashData] = useState<any>([]);
  const [deposit_data, setDepositData] = useState<any>([]);
  const [bonds_data, setBondsData] = useState<any>([]);
  const [stock_data, setStockData] = useState<any>([]);
  const [funds_data, setFundsData] = useState<any>([]);
  const [others_data, setOthersData] = useState<any>([]);


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
  useEffect(() => {
    fetch('http://localhost:3002/deposit')
      .then(response => response.json())
      .then(json => setDepositData(json));
  }, []);
  useEffect(() => {
    fetch('http://localhost:3002/bonds')
      .then(response => response.json())
      .then(json => setBondsData(json));
  }, []);
  useEffect(() => {
    fetch('http://localhost:3002/stock')
      .then(response => response.json())
      .then(json => setStockData(json));
  }, []);
  useEffect(() => {
    fetch('http://localhost:3002/funds')
      .then(response => response.json())
      .then(json => setFundsData(json));
  }, []);
  useEffect(() => {
    fetch('http://localhost:3002/others')
      .then(response => response.json())
      .then(json => setOthersData(json));
  }, []);


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
          {Object.entries(total_data).map(([key, value]) => (
            <TableRow key={key}>
              <TableCell>{key}</TableCell>
              <TableCell>{value.amount}</TableCell>
              <TableCell>
                {"total_earnings" in value ? value.total_earnings.toString() : "-"}
              </TableCell>
              <TableCell>
                {(
                  (parseFloat(value.amount) /
                    Object.values(total_data).reduce(
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
  else if (props.tableType === 'cash' || props.tableType === 'deposit' || props.tableType === 'bonds' || props.tableType === 'stock' || props.tableType === 'funds' || props.tableType === 'others') {

    const dataDictionary = {
      cash: cash_data,
      deposit: deposit_data,
      bond: bonds_data,
      stock: stock_data,
      funds: funds_data,
      others: others_data,
    };

    const currentTableData = dataDictionary[props.tableType] || [];

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
              {currentTableData.map((item, index) => (
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