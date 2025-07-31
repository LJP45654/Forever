import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function TagSelect(props: any) {
  return (
    <Select
      disabled={props.disabled}
      value={props.value}
      onValueChange={props.onChange}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue
          placeholder={props.disabled ? "" : "Select a Categories"}
        />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Categories</SelectLabel>
          <SelectItem value="Cash">Cash</SelectItem>
          <SelectItem value="Deposit">Deposit</SelectItem>
          <SelectItem value="Bond">Bond</SelectItem>
          <SelectItem value="Stock">Stock</SelectItem>
          <SelectItem value="Fund">Fund</SelectItem>
          <SelectItem value="Others">Others</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

export default TagSelect;
