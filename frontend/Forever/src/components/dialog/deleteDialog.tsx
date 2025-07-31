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
  const [searchResults, setSearchResults] = useState<any[]>([]);

  const resetDialog = () => {
    setSelectedData(null);
    setSelectedType(null);
    setSearchResults([]);
  };

  const handleSearchSelect = (value: string) => {
    const result = searchResults.find(
      (item, index) =>
        `${item.type}-${index}` === value ||
        Object.values(item).some((v) => String(v).includes(value))
    );

    if (result) {
      setSelectedData(result);
      setSelectedType(result.type as TypeKey);
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
      <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-500">
            {icon && <i className={`${icon} text-lg`} />}
            {title}
          </DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* 搜索栏 */}
          <div className="grid gap-3">
            <Label className="text-sm font-medium">Search Item</Label>
            <AppSearchBar
              placeholder="Search and select an item to delete..."
              onSelect={handleSearchSelect}
            />
          </div>

          {selectedData && selectedType && (
            <>
              <div className="border-t pt-4">
                <Label className="text-sm font-medium text-gray-900 mb-3 block">
                  Selected Item Details ({selectedType.toUpperCase()})
                </Label>
                <div className="grid gap-4">{renderFormFields()}</div>
              </div>
            </>
          )}
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
