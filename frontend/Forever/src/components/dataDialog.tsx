import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "./ui/label";
import DatePick from "./datePicker";
import TagSelect from "./tagSelecter";

export type LabelData = {
  title: string;
  defaultValue?: string;
  type: "tag" | "date" | "string" | "number";
};

type DataDialogProps = {
  icon?: string;
  title: string;
  trigger: string;
  description?: string;
  labelDatas?: LabelData[];
};

function DataDialog(props: DataDialogProps) {
  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <Button variant="outline" className="h-full">
            {props.icon && <i className={props.icon} />}
            {props.trigger}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {props.icon && <i className={`${props.icon} pr-2`} />}
              {props.title}
            </DialogTitle>
            <DialogDescription>{props.description || ""}</DialogDescription>
          </DialogHeader>
          {props.labelDatas?.length && (
            <div className={`grid gap-4`}>
              {props.labelDatas.map((labelData, index) => (
                <div key={index} className="grid gap-3">
                  <Label htmlFor={labelData.title}>{labelData.title}</Label>
                  {labelData.type === "date" ? (
                    <DatePick />
                  ) : labelData.type === "tag" ? (
                    <TagSelect />
                  ) : (
                    <Input
                      id={labelData.title}
                      name={labelData.title}
                      type={labelData.type === "number" ? "number" : "text"}
                      defaultValue={labelData.defaultValue}
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
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}

export default DataDialog;
