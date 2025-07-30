import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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

// const headname = Object.keys(exampleData.assets.othersSum).join(", ");

function DataTableChart() {
  const totalAmount = Object.values(exampleData.assets).reduce(
    (sum, asset) => sum + parseFloat(asset.amount),
    0
  );

  //动态生成表头
  const tableHeaders = [
    "Investment Type",
    ...new Set(
      Object.values(exampleData.assets).flatMap((asset) =>
        Object.keys(asset)
      )
    ),
    "Percentage",
  ];

  return (
    <Table>
      <TableHeader>
        <TableRow>
          {tableHeaders.map((header) => (
            <TableHead key={header}>{header}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {Object.entries(exampleData.assets).map(([key, value]) => (
          <TableRow key={key}>
            <TableCell>{key}</TableCell>
            <TableCell>{value.amount}</TableCell>
            <TableCell>{value.list_num}</TableCell>
            <TableCell>
              {"total_earnings" in value ? value.total_earnings.toString() : "-"}
            </TableCell>
            <TableCell>
              {((parseFloat(value.amount) / totalAmount) * 100).toFixed(2)}%
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
export default DataTableChart;
