import React, { useState, useEffect } from "react";
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
import DatePick from "../datePicker";
import TagSelect from "../tagSelecter";
import { type LabelData } from "./dialog.type";
import { CurrencySelect } from "../ui/currency-select";

type AddDialogProps = {
  icon?: string;
  title: string;
  trigger: string;
  description?: string;
  labelDatas: LabelData[];
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSubmit: (values: Record<string, any>) => void;
};

const FormField = ({
  labelData,
  value,
  error,
  onChange,
}: {
  labelData: LabelData;
  value: any;
  error?: string;
  onChange: (value: any) => void;
}) => (
  <div className="grid gap-3">
    <Label htmlFor={labelData.title} className="flex items-center gap-1">
      {labelData.title}
      {labelData.require && <span className="text-red-500">*</span>}
    </Label>

    {labelData.type === "date" ? (
      <DatePick
        disabled={labelData.disabled}
        value={value || ""}
        onChange={onChange}
      />
    ) : labelData.type === "tag" ? (
      <TagSelect
        disabled={labelData.disabled}
        value={value || ""}
        onChange={onChange}
      />
    ) : labelData.type === "currency" ? (
      <CurrencySelect
        name="test-currency"
        value={value || ""}
        onValueChange={onChange}
        placeholder="Choose a currency"
        currencies="custom"
      />
    ) : (
      <Input
        id={labelData.title}
        name={labelData.title}
        type={labelData.type === "number" ? "number" : "text"}
        disabled={labelData.disabled}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        className={error ? "border-red-500 focus:ring-red-500" : ""}
        placeholder={`Enter ${labelData.title.toLowerCase()}`}
      />
    )}

    {error && <span className="text-sm text-red-500">{error}</span>}
  </div>
);

function AddDialog({
  icon,
  title,
  description,
  labelDatas,
  open,
  onOpenChange,
  onSubmit,
}: AddDialogProps) {
  const [values, setValues] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const initializeForm = () => {
    const initialValues: Record<string, any> = {};
    labelDatas.forEach((labelData) => {
      initialValues[labelData.title] = labelData.defaultValue || "";
    });
    setValues(initialValues);
    setErrors({});
  };

  useEffect(initializeForm, [labelDatas]);

  const handleValueChange = (title: string, value: any) => {
    setValues((prev) => ({ ...prev, [title]: value }));
    if (errors[title]) {
      setErrors((prev) => ({ ...prev, [title]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    labelDatas.forEach((labelData) => {
      if (labelData.require && !values[labelData.title]) {
        newErrors[labelData.title] = `${labelData.title} is required`;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(values);
      onOpenChange?.(false);
      initializeForm();
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) initializeForm();
    onOpenChange?.(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {icon && <i className={`${icon} text-lg`} />}
              {title}
            </DialogTitle>
            {description && (
              <DialogDescription>{description}</DialogDescription>
            )}
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {labelDatas.map((labelData) => (
              <FormField
                key={labelData.title}
                labelData={labelData}
                value={values[labelData.title]}
                error={errors[labelData.title]}
                onChange={(value) => handleValueChange(labelData.title, value)}
              />
            ))}
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit">Add</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
export default AddDialog;

type HomeAddDialogProps = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSubmit: (values: { category: string; value: string }) => void;
};

export function HomeAddDialog({
  open,
  onOpenChange,
  onSubmit,
}: HomeAddDialogProps) {
  const [category, setCategory] = useState("");
  const [value, setValue] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const resetForm = () => {
    setCategory("");
    setValue("");
    setErrors({});
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!category) newErrors.category = "Category is required";
    if (!value) newErrors.value = "Value is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit({ category, value });
      onOpenChange?.(false);
      resetForm();
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) resetForm();
    onOpenChange?.(open);
  };

  const handleCategoryChange = (newCategory: string) => {
    setCategory(newCategory);
    setValue("");
    setErrors((prev) => ({ ...prev, category: "", value: "" }));
  };

  const handleValueChange = (newValue: string) => {
    setValue(newValue);
    if (errors.value) {
      setErrors((prev) => ({ ...prev, value: "" }));
    }
  };

  const SecondField = () => {
    const hasError = !!errors.value;

    if (!category) return null;

    const isCurrency = category === "Cash" || category === "Deposit";

    return (
      <div className="grid gap-3">
        <Label className="flex items-center gap-1">
          {isCurrency ? "Currency" : "Name"}
          <span className="text-red-500">*</span>
        </Label>
        {isCurrency ? (
          <CurrencySelect
            name="currency"
            value={value}
            onValueChange={handleValueChange}
            placeholder="Select currency"
            currencies="custom"
            valid={!hasError}
          />
        ) : (
          <Input
            id="value"
            name="value"
            type="text"
            value={value}
            onChange={(e) => handleValueChange(e.target.value)}
            className={hasError ? "border-red-500 focus:ring-red-500" : ""}
            placeholder="Enter name"
          />
        )}
        {hasError && (
          <span className="text-sm text-red-500">{errors.value}</span>
        )}
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-blue-400">
              <i className="ri-add-circle-fill text-lg" />
              Add
            </DialogTitle>
            <DialogDescription>Add Secondary Category</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-3">
              <Label className="flex items-center gap-1">
                Category
                <span className="text-red-500">*</span>
              </Label>
              <TagSelect value={category} onChange={handleCategoryChange} />
              {errors.category && (
                <span className="text-sm text-red-500">{errors.category}</span>
              )}
            </div>

            <SecondField />
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              className="bg-blue-400 hover:bg-blue-600 font-bold"
            >
              Add
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
