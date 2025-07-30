import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";

function DataCard({ children, ...props }: any) {
  return (
    <Card
      className="data-card from-primary/2 to-card bg-gradient-to-t shadow-xs py-4 gap-2"
      style={{ fontFamily: "Roboto" }}
    >
      {props?.title && props?.action && (
        <CardHeader>
          <CardTitle className="text-4xl">{props?.title}</CardTitle>
          {props.action && <CardAction>{props.action}</CardAction>}
          <CardDescription>{props?.description}</CardDescription>
          <CardAction>{props?.action}</CardAction>
        </CardHeader>
      )}
      <CardContent>{children}</CardContent>
    </Card>
  );
}

export default DataCard;
