import {
  Table,
  TableBody,
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

// 示例数据
const exampleDatahomepage = {
  stock: {
    amount: "809162.00",
    list_num: 5,
    total_earnings: "824676.00",
  },
  cash: {
    amount: "7389.60",
    list_num: 4,
    total_earnings: "0",
  },
  deposit: {
    amount: "1050640.00",
    list_num: 3,
    total_earnings: "0",
  },
  funds: {
    amount: "399355.00",
    list_num: 5,
    total_earnings: "379275.00",
  },
  bonds: {
    amount: "4225000.00",
    list_num: 4,
    total_earnings: "0",
  },
  othersSum: {
    amount: "105840.00",
    list_num: 5,
    total_earnings: "0",
  },
};

const exampleDatacash = [
  {
    "id": 21,
    "timestamp": "2025-03-01",
    "currency": "CNY",
    "amount": 1000.0,
    "note": "初始余额"
  },
  {
    "id": 22,
    "timestamp": "2025-03-05",
    "currency": "CNY",
    "amount": 1200.0,
    "note": "工资 +200"
  },
  {
    "id": 23,
    "timestamp": "2025-03-10",
    "currency": "CNY",
    "amount": 1100.0,
    "note": "支出 -100"
  },
  {
    "id": 24,
    "timestamp": "2025-03-15",
    "currency": "CNY",
    "amount": 1250.0,
    "note": "转账收入 +150"
  },
  {
    "id": 25,
    "timestamp": "2025-03-20",
    "currency": "CNY",
    "amount": 1170.0,
    "note": "购物 -80"
  },
  {
    "id": 26,
    "timestamp": "2025-03-25",
    "currency": "CNY",
    "amount": 1700.0,
    "note": "奖金 +530"
  },
  {
    "id": 27,
    "timestamp": "2025-03-30",
    "currency": "CNY",
    "amount": 1650.0,
    "note": "请客吃饭 -50"
  },
  {
    "id": 28,
    "timestamp": "2025-04-01",
    "currency": "USD",
    "amount": 300.0,
    "note": "初始余额"
  },
  {
    "id": 29,
    "timestamp": "2025-04-05",
    "currency": "USD",
    "amount": 450.0,
    "note": "收入 +150"
  },
  {
    "id": 30,
    "timestamp": "2025-04-10",
    "currency": "USD",
    "amount": 420.0,
    "note": "订阅支出 -30"
  },
  {
    "id": 31,
    "timestamp": "2025-04-15",
    "currency": "USD",
    "amount": 620.0,
    "note": "项目款 +200"
  },
  {
    "id": 32,
    "timestamp": "2025-04-20",
    "currency": "USD",
    "amount": 590.0,
    "note": "餐费 -30"
  },
  {
    "id": 33,
    "timestamp": "2025-04-25",
    "currency": "JPY",
    "amount": 100000.0,
    "note": "初始余额"
  },
  {
    "id": 34,
    "timestamp": "2025-04-28",
    "currency": "JPY",
    "amount": 98000.0,
    "note": "车票 -2000"
  },
  {
    "id": 35,
    "timestamp": "2025-05-01",
    "currency": "JPY",
    "amount": 102000.0,
    "note": "退款 +4000"
  },
  {
    "id": 36,
    "timestamp": "2025-05-05",
    "currency": "JPY",
    "amount": 101000.0,
    "note": "咖啡 -1000"
  },
  {
    "id": 37,
    "timestamp": "2025-05-10",
    "currency": "JPY",
    "amount": 106000.0,
    "note": "项目款 +5000"
  },
  {
    "id": 38,
    "timestamp": "2025-05-15",
    "currency": "JPY",
    "amount": 105000.0,
    "note": "便利店 -1000"
  },
  {
    "id": 39,
    "timestamp": "2025-05-20",
    "currency": "CNY",
    "amount": 1800.0,
    "note": "工资 +150"
  },
  {
    "id": 40,
    "timestamp": "2025-05-25",
    "currency": "CNY",
    "amount": 1700.0,
    "note": "房租 -100"
  },
  {
    "id": 41,
    "timestamp": "2025-05-30",
    "currency": "CNY",
    "amount": 2100.0,
    "note": "自由职业 +400"
  },
  {
    "id": 42,
    "timestamp": "2025-06-05",
    "currency": "CNY",
    "amount": 2050.0,
    "note": "出差 -50"
  },
  {
    "id": 43,
    "timestamp": "2025-06-10",
    "currency": "USD",
    "amount": 650.0,
    "note": "奖励 +60"
  },
  {
    "id": 44,
    "timestamp": "2025-06-15",
    "currency": "USD",
    "amount": 620.0,
    "note": "平台扣费 -30"
  },
  {
    "id": 45,
    "timestamp": "2025-06-20",
    "currency": "USD",
    "amount": 670.0,
    "note": "项目入账 +50"
  },
  {
    "id": 46,
    "timestamp": "2025-06-25",
    "currency": "JPY",
    "amount": 108000.0,
    "note": "补贴 +3000"
  },
  {
    "id": 47,
    "timestamp": "2025-06-30",
    "currency": "JPY",
    "amount": 107000.0,
    "note": "便利店 -1000"
  },
  {
    "id": 48,
    "timestamp": "2025-07-05",
    "currency": "JPY",
    "amount": 110000.0,
    "note": "稿费 +3000"
  },
  {
    "id": 49,
    "timestamp": "2025-07-10",
    "currency": "CNY",
    "amount": 2000.0,
    "note": "周转支出 -100"
  },
  {
    "id": 50,
    "timestamp": "2025-07-15",
    "currency": "CNY",
    "amount": 2600.0,
    "note": "大额入账 +600"
  }
]

function DataTableChart(props: any) {
  //console.log(tableHeadersDictionary);
  
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
          {Object.entries(exampleDatahomepage).map(([key, value]) => (
            <TableRow key={key}>
              <TableCell>{key}</TableCell>
              <TableCell>{value.amount}</TableCell>
              <TableCell>
                {"total_earnings" in value ? value.total_earnings.toString() : "-"}
              </TableCell>
              <TableCell>
                {(
                  (parseFloat(value.amount) /
                    Object.values(exampleDatahomepage).reduce(
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
              {exampleDatacash.map((item, index) => (
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
  };
}

export default DataTableChart;