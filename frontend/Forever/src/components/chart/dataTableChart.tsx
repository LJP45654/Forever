import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { getdata } from "@/services/getdata";


const url = 'https://example.com/api/homepage';
getdata(url)
  .then(data => console.log(data))
  .catch(error => console.error(error));

// 表头字典，所有表头写死
const tableHeadersDictionary: Record<string, { header: string; type: string }[]> = {
  investment: [
    { header: "Investment Type", type: "string" },
    { header: "Amount", type: "number" },
    { header: "Total Earnings", type: "number" },
    { header: "Percentage", type: "number" },
  ],
  cash: [
    { header: "Asset Type", type: "string" },
    { header: "Value", type: "number" },
    { header: "List Number", type: "number" },
    { header: "Percentage", type: "number" },
  ],
  deposit: [
    { header: "Transaction ID", type: "string" },
    { header: "Date", type: "string" },
    { header: "Amount", type: "number" },
    { header: "Status", type: "string" },
  ],
  bond: [
    { header: "Total", type: "number" },
    { header: "Average", type: "number" },
    { header: "Maximum", type: "number" },
    { header: "Minimum", type: "number" },
  ],
  stock: [
    { header: "Stock Name", type: "string" },
    { header: "Ticker Symbol", type: "string" },
    { header: "Current Price", type: "number" },
    { header: "Change", type: "number" },
  ],
  fund: [
    { header: "Fund Name", type: "string" },
    { header: "NAV", type: "number" },
    { header: "1-Year Return", type: "number" },
    { header: "Expense Ratio", type: "number" },
  ],
  other: [
    { header: "Other Asset Type", type: "string" },
    { header: "Value", type: "number" },
    { header: "List Number", type: "number" },
    { header: "Percentage", type: "number" },
  ],
};

// 示例数据
const exampleData = {
  sum: "6597386.60",
  assets: {
    ticker: {
      amount: "809162.00",
      list_num: 5,
      total_earnings: "824676.00",
    },
    cash: {
      amount: "7389.60",
      list_num: 4,
    },
    deposit: {
      amount: "1050640.00",
      list_num: 3,
    },
    funds: {
      amount: "399355.00",
      list_num: 5,
      total_earnings: "379275.00",
    },
    bonds: {
      amount: "4225000.00",
      list_num: 4,
    },
    othersSum: {
      amount: "105840.00",
      list_num: 5,
      total_earnings: "100800.00",
    },
  },
};

function DataTableChart() {
  // 从字典中选择表头
  const tableHeaders = tableHeadersDictionary["investment"];

  return (
    <Table>
      <TableHeader>
        <TableRow>
        {tableHeaders.map(({header}) => (
            <TableHead key={header}>{header}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {Object.entries(exampleData.assets).map(([key, value]) => (
          <TableRow key={key}>
            <TableCell>{key}</TableCell>
            <TableCell>{value.amount}</TableCell>
            <TableCell>
              {"total_earnings" in value ? value.total_earnings.toString() : "-"}
            </TableCell>
            <TableCell>
              {((parseFloat(value.amount) / 100) * 100).toFixed(2)}%
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default DataTableChart;