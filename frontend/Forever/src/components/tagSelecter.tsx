import * as React from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function TagSelect() {
  return (
    <Select>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select a Categories" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Categories</SelectLabel>
          <SelectItem value="Cash">Cash</SelectItem>
          <SelectItem value="Deposit">Deposit</SelectItem>
          <SelectItem value="Bond">Bond</SelectItem>
          <SelectItem value="Stock">Stock</SelectItem>
          <SelectItem value="Fund">Fund</SelectItem>
          <SelectItem value="Other">Other</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

export default TagSelect
