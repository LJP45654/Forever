import React from "react";

import { cn } from "@/lib/utils";

// data
import { currencies as AllCurrencies } from "country-data-list";

// shadcn
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// types
export interface Currency {
  code: string;
  decimals: number;
  name: string;
  number: string;
  symbol?: string;
}

/**
 * New currencies data ISO-4217 from https://en.wikipedia.org/wiki/ISO_4217
 * Used in new <CurrencySelect /> component (Nov 2024)
 * adheres to package country-data-list
 */

// Currencies to exclude from the dropdown
export const allCurrencies = [
  "AXG", // Anguilla
  "BAM", // Bosnia and Herzegovina convertible mark
  "BMD", // Bermudian dollar
  "BOV", // Bolivian Mvdol (funds code)
  "CHE", // WIR Euro (complementary currency)
  "CHW", // WIR Franc (complementary currency)
  "CLF", // Chilean Unidad de Fomento (funds code)
  "COU", // Colombian Unidad de Valor Real (funds code)
  "CUC", // Cuban convertible peso
  "KID", // Kiribati dollar
  "KPW", // North Korean won
  "LAK", // Lao kip
  "MGA", // Malagasy ariary
  "MRO", // Mauritanian ouguiya (pre-2018)
  "MXV", // Mexican Unidad de Inversion (funds code)
  "OMR", // Omani rial
  "PRB", // Transnistrian ruble
  "SSP", // South Sudanese pound
  "STD", // São Tomé and Príncipe dobra (pre-2018)
  "SVC", // Salvadoran colón
  "TJS", // Tajikistani somoni
  "TMT", // Turkmenistan manat
  "TVD", // Tuvaluan dollar
  "USN", // United States dollar (next day) (funds code)
  "UYI", // Uruguay Peso en Unidades Indexadas (funds code)
  "VED", // Venezuelan bolívar digital
  "VES", // Venezuelan bolívar soberano
  "VND", // Vietnamese đồng
  "XAF", // Central African CFA franc
  "XAG", // Silver (troy ounce)
  "XAU", // Gold (troy ounce)
  "XBA", // European Composite Unit (EURCO) (bond market unit)
  "XBB", // European Monetary Unit (E.M.U.-6) (bond market unit)
  "XBC", // European Unit of Account 9 (E.U.A.-9) (bond market unit)
  "XBD", // European Unit of Account 17 (E.U.A.-17) (bond market unit)
  "XDR", // Special Drawing Rights
  "XOF", // West African CFA franc
  "XPD", // Palladium (troy ounce)
  "XPF", // CFP franc
  "XPT", // Platinum (troy ounce)
  "XSU", // Sucre (ALBA regional currency)
  "XTS", // Code reserved for testing purposes
  "XUA", // ADB Unit of Account
  "XUG", // Uganda shilling (pre-1987)
  "XXX", // No currency
  "ZWL", // Zimbabwean dollar (no longer in active use)
];

// Currencies to include in the dropdown
export const customCurrencies = [
  "DKK",
  "SEK",
  "NOK",
  "EUR",
  "USD",
  "CAD",
  "GBP",
  "AUD",
  "NZD",
];

interface CurrencySelectProps {
  value?: string;
  onValueChange?: (value: string) => void;
  onCurrencySelect?: (currency: Currency) => void;
  name: string;
  placeholder?: string;
  currencies?: "custom" | "all";
  variant?: "default" | "small";
  valid?: boolean;
  disabled?: boolean;
  showSymbol?: boolean;
}

const CurrencySelect = React.forwardRef<HTMLButtonElement, CurrencySelectProps>(
  (
    {
      value,
      onValueChange,
      onCurrencySelect,
      name,
      placeholder = "Select currency",
      currencies = "all",
      variant = "default",
      valid = true,
      disabled = false,
      showSymbol = true,
    },
    ref
  ) => {
    const [searchValue, setSearchValue] = React.useState("");
    const [isOpen, setIsOpen] = React.useState(false);
    const scrollAreaRef = React.useRef<HTMLDivElement>(null);
    const triggerRef = React.useRef<HTMLButtonElement>(null);

    const uniqueCurrencies = React.useMemo<Currency[]>(() => {
      const currencyMap = new Map<string, Currency>();

      AllCurrencies.all.forEach((currency: Currency) => {
        if (currency.code && currency.name && currency.symbol) {
          let shouldInclude = false;

          switch (currencies) {
            case "custom":
              shouldInclude = customCurrencies.includes(currency.code);
              break;
            case "all":
              shouldInclude = !allCurrencies.includes(currency.code);
              break;
            default:
              shouldInclude = !allCurrencies.includes(currency.code);
          }

          if (shouldInclude) {
            // Special handling for Euro
            if (currency.code === "EUR") {
              currencyMap.set(currency.code, {
                code: currency.code,
                name: "Euro",
                symbol: currency.symbol,
                decimals: currency.decimals,
                number: currency.number,
              });
            } else {
              currencyMap.set(currency.code, {
                code: currency.code,
                name: currency.name,
                symbol: currency.symbol,
                decimals: currency.decimals,
                number: currency.number,
              });
            }
          }
        }
      });

      return Array.from(currencyMap.values()).sort((a, b) =>
        a.name.localeCompare(b.name)
      );
    }, [currencies]);

    const handleValueChange = (newValue: string) => {
      const fullCurrencyData = uniqueCurrencies.find(
        (curr) => curr.code === newValue
      );
      if (fullCurrencyData) {
        if (onValueChange) {
          onValueChange(newValue);
        }
        if (onCurrencySelect) {
          onCurrencySelect(fullCurrencyData);
        }
        setIsOpen(false);
      }
    };

    // Filter currencies based on search value
    const filteredCurrencies = React.useMemo(() => {
      if (!searchValue) return uniqueCurrencies;

      return uniqueCurrencies.filter(
        (currency) =>
          currency.name.toLowerCase().includes(searchValue.toLowerCase()) ||
          currency.code.toLowerCase().includes(searchValue.toLowerCase())
      );
    }, [uniqueCurrencies, searchValue]);

    // Get selected currency display info - recalculate when value or uniqueCurrencies change
    const selectedCurrencyData = React.useMemo(() => {
      return uniqueCurrencies.find((curr) => curr.code === value);
    }, [uniqueCurrencies, value]);

    return (
      <Popover
        open={isOpen}
        modal
        onOpenChange={(open) => {
          setIsOpen(open);
          if (open) {
            setSearchValue("");
          }
        }}
      >
        <PopoverTrigger asChild>
          <Button
            ref={(node) => {
              triggerRef.current = node;
              if (typeof ref === "function") {
                ref(node);
              } else if (ref) {
                ref.current = node;
              }
            }}
            type="button"
            variant="outline"
            role="combobox"
            aria-expanded={isOpen}
            className={cn(
              "w-full justify-between transition-all duration-200",
              "focus:outline-none",
              "hover:bg-accent hover:text-accent-foreground",
              variant === "small" && "w-fit gap-2",
              isOpen
                ? "ring-2 ring-[#cfcfcf] ring-offset-0"
                : "focus:ring-2 focus:ring-[#cfcfcf] focus:ring-offset-0",
              !valid && "border-red-500 focus:ring-red-500"
            )}
            disabled={disabled}
            data-valid={valid}
          >
            {selectedCurrencyData ? (
              <div className="flex items-center gap-2">
                {variant === "small" ? (
                  <span>{selectedCurrencyData.code}</span>
                ) : (
                  <>
                    <span className="text-sm text-muted-foreground w-8 text-left">
                      {selectedCurrencyData.code}
                    </span>
                    <span>{selectedCurrencyData.name}</span>
                  </>
                )}
              </div>
            ) : (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
            <i className="ri-arrow-down-s-line ml-2 text-sm opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="p-0"
          style={{ width: triggerRef.current?.offsetWidth || 300 }}
        >
          <Command>
            <CommandInput
              value={searchValue}
              onValueChange={(value) => {
                setSearchValue(value);
                setTimeout(() => {
                  if (scrollAreaRef.current) {
                    scrollAreaRef.current.scrollTop = 0;
                  }
                }, 0);
              }}
              placeholder="Search currency..."
            />
            <CommandList>
              <div ref={scrollAreaRef} className="max-h-72 overflow-hidden">
                <CommandEmpty>No currency found.</CommandEmpty>
                <CommandGroup>
                  {filteredCurrencies.map((currency) => (
                    <CommandItem
                      key={currency.code}
                      value={`${currency.code} ${currency.name}`.toLowerCase()}
                      onSelect={() => handleValueChange(currency.code)}
                      className="gap-2"
                    >
                      <div className="flex items-center w-full gap-2">
                        <span className="text-sm text-muted-foreground w-8 text-left">
                          {currency.code}
                        </span>
                        <span className="flex-1">{currency.name}</span>
                        {showSymbol && (
                          <span className="text-sm text-muted-foreground">
                            {currency.symbol}
                          </span>
                        )}
                      </div>
                      <i
                        className={cn(
                          "ri-check-line ml-auto text-sm",
                          value === currency.code ? "opacity-100" : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </div>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    );
  }
);

CurrencySelect.displayName = "CurrencySelect";

export { CurrencySelect };
