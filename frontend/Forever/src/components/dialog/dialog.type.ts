export type LabelData = {
  title: string;
  defaultValue?: string;
  disabled: boolean;
  type: "tag" | "date" | "string" | "number" | "currency";
  require: boolean;
};
export type dialogProps = {
  icon?: string;
  title: string;
  description?: string;
  labelDatas?: LabelData[];
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSubmit: (values: Record<string, any>) => void;
};