import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

function DataTableChart() {
  return (
    <Table>
      <TableCaption>The summary of your investments.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[150px]">Investment Type</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Percentage</TableHead>
          <TableHead>Today's Earnings</TableHead>
          <TableHead className="text-right">Total Earnings</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell className="font-medium">Cash</TableCell>
          <TableCell>$2,000</TableCell>
          <TableCell>10%</TableCell>
          <TableCell>—</TableCell>
          <TableCell className="text-right">-</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">Deposit</TableCell>
          <TableCell>$3,000</TableCell>
          <TableCell>15%</TableCell>
          <TableCell>$30</TableCell>
          <TableCell className="text-right">$800</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">Bonds</TableCell>
          <TableCell>$5,000</TableCell>
          <TableCell>25%</TableCell>
          <TableCell>$50</TableCell>
          <TableCell className="text-right">$1,000</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">Stocks</TableCell>
          <TableCell>$10,000</TableCell>
          <TableCell>50%</TableCell>
          <TableCell>$200</TableCell>
          <TableCell className="text-right">$5,000</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">Fund</TableCell>
          <TableCell>$4,000</TableCell>
          <TableCell>20%</TableCell>
          <TableCell>$80</TableCell>
          <TableCell className="text-right">$1,500</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">Others</TableCell>
          <TableCell>$1,000</TableCell>
          <TableCell>5%</TableCell>
          <TableCell>$10</TableCell>
          <TableCell className="text-right">$300</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}
export default DataTableChart;