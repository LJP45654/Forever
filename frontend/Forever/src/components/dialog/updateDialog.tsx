import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AppSearchBar from "../appSearchBar";
import DatePick from "../datePicker";
import { CurrencySelect } from "../ui/currency-select";
import typeKeysConfig from "@/config/typeKeys.json";
import { ScrollArea } from "../ui/scroll-area";

type UpdateDialogProps = {
  icon?: string;
  title: string;
  description?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onUpdate: (
    originalData: Record<string, any>,
    updatedData: Record<string, any>
  ) => void;
  onSearch?: (query: string) => Promise<any[]>;
};

type TypeKey = keyof typeof typeKeysConfig;
type FieldConfig = {
  header: string;
  type: string;
};

const FormField = ({
  field,
  value,
  error,
  onChange,
}: {
  field: FieldConfig;
  value: any;
  error?: string;
  onChange: (value: any) => void;
}) => {
  const fieldName = field.header.replace(/_/g, " ");
  const isRequired = !field.header.toLowerCase().includes("note");

  return (
    <div className="grid gap-3">
      <Label htmlFor={field.header} className="flex items-center gap-1">
        {fieldName}
        {isRequired && <span className="text-red-500">*</span>}
      </Label>

      {field.header.toLowerCase().includes("date") ? (
        <DatePick value={value || ""} onChange={onChange} />
      ) : field.header.toLowerCase().includes("currency") ? (
        <CurrencySelect
          name={field.header}
          value={value || ""}
          onValueChange={onChange}
          placeholder="Choose a currency"
          currencies="custom"
        />
      ) : field.type === "number" ? (
        <Input
          id={field.header}
          name={field.header}
          type="number"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          className={error ? "border-red-500 focus:ring-red-500" : ""}
          placeholder={`Enter ${fieldName.toLowerCase()}`}
        />
      ) : (
        <Input
          id={field.header}
          name={field.header}
          type="text"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          className={error ? "border-red-500 focus:ring-red-500" : ""}
          placeholder={`Enter ${fieldName.toLowerCase()}`}
        />
      )}

      {error && <span className="text-sm text-red-500">{error}</span>}
    </div>
  );
};

function UpdateDialog({
  icon = "ri-edit-line",
  title = "Update Item",
  description = "Search for an item to update, then modify the fields as needed.",
  open,
  onOpenChange,
  onUpdate,
}: UpdateDialogProps) {
  const [originalData, setOriginalData] = useState<Record<string, any> | null>(
    null
  );
  const [selectedType, setSelectedType] = useState<TypeKey | null>(null);
  const [formValues, setFormValues] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const resetDialog = () => {
    setOriginalData(null);
    setSelectedType(null);
    setFormValues({});
    setErrors({});
  };

  const handleSearchSelect = (selectedItem: any) => {
    console.log("Selected item:", selectedItem);

    // 如果传入的是字符串，说明是旧的格式，直接返回
    if (typeof selectedItem === "string") {
      return;
    }

    // 如果传入的是完整的数据对象
    if (selectedItem && selectedItem.parent) {
      setOriginalData(selectedItem);
      setSelectedType(selectedItem.parent as TypeKey);

      // 将搜索结果填入表单
      const initialValues: Record<string, any> = {};
      const fields = typeKeysConfig[selectedItem.parent as TypeKey];
      if (fields) {
        fields.forEach((field) => {
          initialValues[field.header] = selectedItem[field.header] || "";
        });
      }
      setFormValues(initialValues);
      setErrors({});
    }
  };

  const handleValueChange = (fieldHeader: string, value: any) => {
    setFormValues((prev) => ({ ...prev, [fieldHeader]: value }));
    if (errors[fieldHeader]) {
      setErrors((prev) => ({ ...prev, [fieldHeader]: "" }));
    }
  };

  const validateForm = () => {
    if (!selectedType) return false;

    const newErrors: Record<string, string> = {};
    const fields = typeKeysConfig[selectedType];

    fields.forEach((field) => {
      const isRequired = !field.header.toLowerCase().includes("note");
      if (isRequired && !formValues[field.header]) {
        newErrors[field.header] = `${field.header.replace(
          /_/g,
          " "
        )} is required`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm() && originalData) {
      onUpdate(originalData, formValues);
      onOpenChange?.(false);
      resetDialog();
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) resetDialog();
    onOpenChange?.(open);
  };

  const renderFormFields = () => {
    if (!selectedType) return null;

    const fields = typeKeysConfig[selectedType];
    if (!fields) return null;

    return fields.map((field) => (
      <FormField
        key={field.header}
        field={field}
        value={formValues[field.header]}
        error={errors[field.header]}
        onChange={(value) => handleValueChange(field.header, value)}
      />
    ));
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[500px] p-4">
        <form onSubmit={handleSubmit}>
          <DialogHeader className="px-2 pt-2">
            <DialogTitle className="flex items-center gap-2 text-emerald-400">
              {icon && <i className={`${icon} text-lg`} />}
              {title}
            </DialogTitle>
            {description && (
              <DialogDescription>{description}</DialogDescription>
            )}
          </DialogHeader>

          <div className="grid mb-4">
            <ScrollArea className="max-h-[60vh]">
              <div className="grid gap-3 mb-6 px-2">
                <Label className="text-sm font-medium">Search Item</Label>
                <AppSearchBar
                  placeholder="Search for items to update..."
                  onSelect={handleSearchSelect}
                />
              </div>
              {selectedType && originalData && (
                <div className="grid gap-4 px-2 pb-2">{renderFormFields()}</div>
              )}
            </ScrollArea>
          </div>

          <DialogFooter className="px-2 pb-2">
            <DialogClose asChild>
              <Button type="button" variant="outline" className="font-bold">
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              disabled={!originalData}
              className="bg-emerald-400 hover:text-emerald-600 font-bold"
            >
              <i className="ri-save-line mr-2" />
              Update
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default UpdateDialog;
