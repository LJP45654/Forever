import { useState } from "react";
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
import typeKeysConfig from "@/config/typeKeys.json";
import { ScrollArea } from "../ui/scroll-area";

type DeleteDialogProps = {
  icon?: string;
  title: string;
  description?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onDelete: (data: Record<string, any>) => void;
  onSearch?: (query: string) => Promise<any[]>;
};

type TypeKey = keyof typeof typeKeysConfig;

const ReadOnlyField = ({
  label,
  value,
}: {
  label: string;
  value: any;
  type: string;
}) => (
  <div className="grid gap-3">
    <Label className="text-sm font-medium text-gray-700">
      {label.replace(/_/g, " ")}
    </Label>
    <Input
      value={value || ""}
      disabled
      className="bg-gray-50 cursor-not-allowed"
      placeholder={`No ${label.toLowerCase().replace(/_/g, " ")}`}
    />
  </div>
);

function DeleteDialog({
  icon = "ri-delete-bin-line",
  title = "Delete Item",
  description = "Search for an item to delete. This action cannot be undone.",
  open,
  onOpenChange,
  onDelete,
}: DeleteDialogProps) {
  const [selectedData, setSelectedData] = useState<Record<string, any> | null>(
    null
  );
  const [selectedType, setSelectedType] = useState<TypeKey | null>(null);

  const resetDialog = () => {
    setSelectedData(null);
    setSelectedType(null);
  };

  const handleSearchSelect = (selectedItem: any) => {
    console.log("Selected item:", selectedItem);

    // 如果传入的是字符串，说明是旧的格式，直接返回
    if (typeof selectedItem === "string") {
      return;
    }

    // 如果传入的是完整的数据对象
    if (selectedItem && selectedItem.parent) {
      setSelectedData(selectedItem);
      setSelectedType(selectedItem.parent as TypeKey);
    }
  };

  const handleDelete = () => {
    if (selectedData) {
      onDelete(selectedData);
      onOpenChange?.(false);
      resetDialog();
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) resetDialog();
    onOpenChange?.(open);
  };

  const renderFormFields = () => {
    if (!selectedData || !selectedType) return null;

    const fields = typeKeysConfig[selectedType];
    if (!fields) return null;

    return fields.map((field) => (
      <ReadOnlyField
        key={field.header}
        label={field.header}
        value={selectedData[field.header]}
        type={field.type}
      />
    ));
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-500">
            {icon && <i className={`${icon} text-lg`} />}
            {title}
          </DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>

        <div className="grid mb-4">
          <ScrollArea className="max-h-[60vh]">
            <div className="grid gap-3 mb-6">
              <Label className="text-sm font-medium">Search Item</Label>
              <AppSearchBar
                placeholder="Search and select an item to delete..."
                onSelect={handleSearchSelect}
              />
            </div>
            {selectedData && selectedType && (
              <>
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-700 font-medium">
                <i className="ri-alarm-warning-fill text-xl mr-1"/>
                    Warning: This action cannot be undone
                  </p>
                  <p className="text-xs text-red-700 mt-1">
                    You are about to delete a {selectedType.toUpperCase()} item.
                  </p>
                </div>
                <div className="grid gap-4">{renderFormFields()}</div>
              </>
            )}
          </ScrollArea>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline" className="font-bold">
              Cancel
            </Button>
          </DialogClose>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={!selectedData}
            className="font-bold"
          >
            <i className="ri-delete-bin-line mr-2" />
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default DeleteDialog;
