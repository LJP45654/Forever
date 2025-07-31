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
import { Label } from "./ui/label";
import DatePick from "./datePicker";
import TagSelect from "./tagSelecter";
import { Command, CommandInput } from "./ui/command";
import { useEffect, useState } from "react";

export type LabelData = {
  title: string;
  defaultValue?: string;
  disabled: boolean;
  type: "tag" | "date" | "string" | "number";
};

type DataDialogProps = {
  icon?: string;
  title: string;
  description?: string;
  labelDatas?: LabelData[];
  withSearch?: boolean;
  dialogOpen?: boolean;
  buttonDelete: boolean;
  toggleDialogOpen: (open?: boolean) => void;
  onSubmit: (values: any[]) => void;
};

export type DataDialogRef = {
  open: () => void;
};

function DataDialog(props: DataDialogProps) {
  const [values, setValues] = useState<any[]>([]);

  useEffect(() => {
    if (props.labelDatas?.length) {
      const initialValues = new Array(props.labelDatas.length).fill("");
      // 使用默认值填充
      props.labelDatas.forEach((labelData, index) => {
        if (labelData.defaultValue) {
          initialValues[index] = labelData.defaultValue;
        }
      });
      setValues(initialValues);
    }
  }, [props.labelDatas]);

  const handleValueChange = (index: number, value: any) => {
    const newValues = [...values];
    newValues[index] = value;
    setValues(newValues);
  };

  return (
    <Dialog
      open={props.dialogOpen}
      onOpenChange={(open) =>
        props.toggleDialogOpen && props.toggleDialogOpen(open)
      }
    >
      <form>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {props.icon && <i className={`${props.icon} pr-2`} />}
              {props.title}
            </DialogTitle>
            <DialogDescription>{props.description || ""}</DialogDescription>
          </DialogHeader>
          {props.withSearch && (
            <div className="my-4">
              <Command className="rounded-lg border grow">
                <CommandInput placeholder="Type a search..." />
              </Command>
            </div>
          )}
          {props.labelDatas?.length && (
            <div className={`grid gap-4`}>
              {props.labelDatas.map((labelData, index) => (
                <div key={index} className="grid gap-3">
                  <Label htmlFor={labelData.title}>{labelData.title}</Label>
                  {labelData.type === "date" ? (
                    <DatePick
                      disabled={labelData.disabled}
                      value={values[index] || ""}
                      onChange={(value: string) =>
                        handleValueChange(index, value)
                      }
                    />
                  ) : labelData.type === "tag" ? (
                    <TagSelect
                      disabled={labelData.disabled}
                      value={values[index] || ""}
                      onChange={(value: string) =>
                        handleValueChange(index, value)
                      }
                    />
                  ) : (
                    <Input
                      id={labelData.title}
                      name={labelData.title}
                      type={labelData.type === "number" ? "number" : "text"}
                      disabled={labelData.disabled}
                      value={values[index] || ""}
                      onChange={(e) => handleValueChange(index, e.target.value)}
                      required
                    />
                  )}
                </div>
              ))}
            </div>
          )}
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button
              type='submit'
              variant={props.buttonDelete?'destructive':'default'}
              onClick={() => {
                props.toggleDialogOpen(false);
                props.onSubmit(values);
              }}
            >
              {props.buttonDelete?'Delete':'Save changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}

export default DataDialog;
