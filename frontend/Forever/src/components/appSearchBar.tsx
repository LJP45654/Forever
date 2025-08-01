import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command";
import { useState, useRef, useEffect } from "react";
import { Popover, PopoverAnchor, PopoverContent } from "./ui/popover";

interface SearchBarProps {
  onSelect?: (value: any) => void;
  placeholder?: string;
}

const mockData = {
  Investment: [
    {
      id: 1,
      label: "股票投资 - 苹果公司",
      value: "AAPL-stock",
      parent: "investment",
      Investment_Type: "股票",
      Amount: 50000,
      Total_Earnings: 8500,
      Percentage: 17.0,
    },
    {
      id: 2,
      label: "基金投资 - 标普500指数",
      value: "SP500-fund",
      parent: "investment",
      Investment_Type: "基金",
      Amount: 30000,
      Total_Earnings: 4200,
      Percentage: 14.0,
    },
    {
      id: 3,
      label: "债券投资 - 国债",
      value: "treasury-bond",
      parent: "investment",
      Investment_Type: "债券",
      Amount: 100000,
      Total_Earnings: 3500,
      Percentage: 3.5,
    },
  ],
  Cash: [
    {
      id: 4,
      label: "美元现金",
      value: "usd-cash",
      parent: "cash",
      Currency_Type: "USD",
      Amount: 15000,
      Date: "2024-01-15",
      Note: "应急资金储备",
    },
    {
      id: 5,
      label: "人民币现金",
      value: "cny-cash",
      parent: "cash",
      Currency_Type: "CNY",
      Amount: 50000,
      Date: "2024-02-01",
      Note: "日常开支准备金",
    },
    {
      id: 6,
      label: "欧元现金",
      value: "eur-cash",
      parent: "cash",
      Currency_Type: "EUR",
      Amount: 8000,
      Date: "2024-01-20",
      Note: "欧洲旅行资金",
    },
  ],
  Deposit: [
    {
      id: 7,
      label: "定期存款 - 工商银行",
      value: "icbc-deposit",
      parent: "deposit",
      Currency_Type: "CNY",
      Amount: 200000,
      Rate: 3.25,
      Start_Date: "2024-01-01",
      End_Date: "2025-01-01",
      Expected_Interest: 6500,
    },
    {
      id: 8,
      label: "美元定存 - 花旗银行",
      value: "citi-usd-deposit",
      parent: "deposit",
      Currency_Type: "USD",
      Amount: 50000,
      Rate: 4.5,
      Start_Date: "2024-02-15",
      End_Date: "2025-02-15",
      Expected_Interest: 2250,
    },
    {
      id: 9,
      label: "港币定存 - 汇丰银行",
      value: "hsbc-hkd-deposit",
      parent: "deposit",
      Currency_Type: "HKD",
      Amount: 100000,
      Rate: 3.8,
      Start_Date: "2024-03-01",
      End_Date: "2025-03-01",
      Expected_Interest: 3800,
    },
  ],
  Bond: [
    {
      id: 10,
      label: "国债 - 10年期",
      value: "treasury-10y",
      parent: "bond",
      Bond_Name: "中国国债2034",
      Currency_Type: "CNY",
      Amount: 100000,
      Rate: 3.2,
      Start_Date: "2024-01-10",
      End_Date: "2034-01-10",
      "Expected Interest": 32000,
    },
    {
      id: 11,
      label: "企业债 - 腾讯",
      value: "tencent-bond",
      parent: "bond",
      Bond_Name: "腾讯企业债2029",
      Currency_Type: "CNY",
      Amount: 50000,
      Rate: 4.1,
      Start_Date: "2024-02-01",
      End_Date: "2029-02-01",
      "Expected Interest": 10250,
    },
    {
      id: 12,
      label: "美国国债",
      value: "us-treasury",
      parent: "bond",
      Bond_Name: "US Treasury 2034",
      Currency_Type: "USD",
      Amount: 30000,
      Rate: 4.5,
      Start_Date: "2024-01-15",
      End_Date: "2034-01-15",
      "Expected Interest": 13500,
    },
  ],
  Stock: [
    {
      id: 13,
      label: "苹果股票",
      value: "aapl-stock",
      parent: "stock",
      Stock_Name: "Apple Inc.",
      Currency_Type: "USD",
      Quantity: 100,
      Purchase_price: 150.0,
      Purchase_date: "2024-01-15",
      Current_price: 175.0,
      Profit_loss: 2500,
    },
    {
      id: 14,
      label: "腾讯股票",
      value: "tencent-stock",
      parent: "stock",
      Stock_Name: "腾讯控股",
      Currency_Type: "HKD",
      Quantity: 200,
      Purchase_price: 320.0,
      Purchase_date: "2024-02-01",
      Current_price: 350.0,
      Profit_loss: 6000,
    },
    {
      id: 15,
      label: "茅台股票",
      value: "moutai-stock",
      parent: "stock",
      Stock_Name: "贵州茅台",
      Currency_Type: "CNY",
      Quantity: 50,
      Purchase_price: 1800.0,
      Purchase_date: "2024-01-20",
      Current_price: 1950.0,
      Profit_loss: 7500,
    },
  ],
  Fund: [
    {
      id: 16,
      label: "沪深300指数基金",
      value: "hs300-fund",
      parent: "fund",
      Fund_Name: "华夏沪深300ETF",
      Currency_Type: "CNY",
      Units: 10000,
      Purchase_price: 4.5,
      Purchase_date: "2024-01-10",
      Current_price: 4.8,
      Profit_loss: 3000,
    },
    {
      id: 17,
      label: "纳斯达克基金",
      value: "nasdaq-fund",
      parent: "fund",
      Fund_Name: "QQQ ETF",
      Currency_Type: "USD",
      Units: 500,
      Purchase_price: 350.0,
      Purchase_date: "2024-02-15",
      Current_price: 380.0,
      Profit_loss: 15000,
    },
    {
      id: 18,
      label: "债券基金",
      value: "bond-fund",
      parent: "fund",
      Fund_Name: "易方达纯债基金",
      Currency_Type: "CNY",
      Units: 20000,
      Purchase_price: 1.2,
      Purchase_date: "2024-01-05",
      Current_price: 1.25,
      Profit_loss: 1000,
    },
  ],
  Others: [
    {
      id: 19,
      label: "黄金投资",
      value: "gold-investment",
      parent: "others",
      Others_Name: "实物黄金",
      "Currency Type": "CNY",
      Purchase_price: 450.0,
      Purchase_date: "2024-01-12",
      Current_price: 480.0,
    },
    {
      id: 20,
      label: "比特币",
      value: "bitcoin",
      parent: "others",
      Others_Name: "Bitcoin",
      "Currency Type": "USD",
      Purchase_price: 45000.0,
      Purchase_date: "2024-02-10",
      Current_price: 52000.0,
    },
  ],
};

function AppSearchBar({
  onSelect,
  placeholder = "Type to search...",
}: SearchBarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null); // 引用 CommandInput 内部的 input 元素

  const handleSelect = (value: string) => {
    if (onSelect) {
      // 找到完整的数据对象并传递给父组件
      const allItems = Object.values(mockData).flat();
      const selectedItem = allItems.find(item => item.value === value);
      onSelect(selectedItem || value);
    }
    setIsOpen(false);
  };

  const handleInputFocus = () => {
    // 仅在输入框获得焦点时打开 Popover
    setIsOpen(true);
  };

  // 点击外部区域关闭弹窗
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;

      // 检查是否点击了滚动条
      if (target && target.closest("[data-radix-scroll-area-viewport]")) {
        return; // 如果点击的是滚动区域，不关闭弹窗
      }

      // 检查是否点击了 CommandList 或其子元素
      if (target && target.closest("[cmdk-list]")) {
        return; // 如果点击的是命令列表区域，不关闭弹窗
      }

      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // 当 Popover 打开时，延迟聚焦输入框
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (isOpen && inputRef.current) {
      // 使用 setTimeout 延迟聚焦
      timeoutId = setTimeout(() => {
        inputRef.current?.focus();
      }, 50); // 尝试一个短时间延迟，例如 50ms
    }
    return () => {
      // 清理定时器以避免内存泄漏或在组件卸载后尝试聚焦
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [isOpen]);

  return (
    <div ref={containerRef}>
      <Popover open={isOpen}>
        <Command className="rounded-lg border shadow-xs">
          <PopoverAnchor>
            <CommandInput
              ref={inputRef}
              placeholder={placeholder}
              onFocus={handleInputFocus}
              onMouseDown={() => {
                if (!isOpen) {
                  setIsOpen(true);
                }
                inputRef.current?.focus();
              }}
            />
          </PopoverAnchor>
          <PopoverContent
            className="pl-1 pr-0 py-0 overflow-clip rounded-lg"
            style={{ width: "var(--radix-popover-trigger-width)" }}
          >
            <CommandList>
              <CommandEmpty>未找到相关结果</CommandEmpty>
              {Object.entries(mockData).map(([groupName, items]) => (
                <CommandGroup key={groupName} heading={groupName}>
                  {items.map((item) => (
                    <CommandItem
                      key={item.id}
                      value={`${item.label} ${item.value}`}
                      onSelect={() => handleSelect(item.value)}
                      className="cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{item.label}</span>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              ))}
            </CommandList>
          </PopoverContent>
        </Command>
      </Popover>
    </div>
  );
}
export default AppSearchBar;
